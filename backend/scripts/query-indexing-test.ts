/**
 * Query Indexing Performance Test
 *
 * This script measures query performance before and after adding indexes
 * to demonstrate the impact of proper database indexing.
 */

import mongoose, { Types } from "mongoose"
import dotenv from "dotenv"

dotenv.config()

// Models
const TimeEntrySchema = new mongoose.Schema({
    account: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true },
    startedAt: { type: Date, required: true },
    endedAt: { type: Date },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    note: { type: String },
    hourlyRate: { type: Number },
}, { timestamps: true })

const ProjectSchema = new mongoose.Schema({
    account: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    isActive: { type: Boolean, required: true },
    hourlyRate: { type: Number, required: true, default: 0 },
}, { timestamps: true })

const AccountSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: { type: String, enum: ["superadmin", "admin", "user"], default: "user" },
    password: { type: String, select: false },
}, { timestamps: true })

const TimeEntryModel = mongoose.model("TimeEntry", TimeEntrySchema)
const ProjectModel = mongoose.model("Project", ProjectSchema)
const AccountModel = mongoose.model("Account", AccountSchema)

// Configuration
const TEST_CONFIG = {
    NUM_ACCOUNTS: 10,
    PROJECTS_PER_ACCOUNT: 5,
    TIME_ENTRIES_PER_PROJECT: 200, // Total: 10 * 5 * 200 = 10,000 time entries
    QUERY_ITERATIONS: 10,
}

interface QueryResult {
    name: string
    avgTimeMs: number
    minTimeMs: number
    maxTimeMs: number
    iterations: number
}

interface TestResults {
    beforeIndexing: QueryResult[]
    afterIndexing: QueryResult[]
    dataStats: {
        accounts: number
        projects: number
        timeEntries: number
    }
}

// Utility functions
const measureQuery = async (
    name: string,
    queryFn: () => Promise<unknown>,
    iterations: number
): Promise<QueryResult> => {
    const times: number[] = []

    for (let i = 0; i < iterations; i++) {
        const start = performance.now()
        await queryFn()
        const end = performance.now()
        times.push(end - start)
    }

    return {
        name,
        avgTimeMs: times.reduce((a, b) => a + b, 0) / times.length,
        minTimeMs: Math.min(...times),
        maxTimeMs: Math.max(...times),
        iterations,
    }
}

const dropNonIdIndexes = async () => {
    console.log("Dropping non-_id indexes...")

    const collections = [TimeEntryModel, ProjectModel]

    for (const model of collections) {
        try {
            const indexes = await model.collection.indexes()
            for (const index of indexes) {
                if (index.name !== "_id_") {
                    await model.collection.dropIndex(index.name!)
                    console.log(`  Dropped index: ${model.modelName}.${index.name}`)
                }
            }
        } catch (err) {
            // Collection might not exist yet
        }
    }
}

const seedTestData = async () => {
    console.log("\nSeeding test data...")

    const existingCount = await TimeEntryModel.countDocuments()
    if (existingCount >= TEST_CONFIG.NUM_ACCOUNTS * TEST_CONFIG.PROJECTS_PER_ACCOUNT * TEST_CONFIG.TIME_ENTRIES_PER_PROJECT * 0.9) {
        console.log(`  Sufficient test data exists (${existingCount} time entries). Skipping seed.`)
        return
    }

    // Clear existing test data
    await TimeEntryModel.deleteMany({})
    await ProjectModel.deleteMany({})
    await AccountModel.deleteMany({ email: /^testuser/ })

    const accounts: Types.ObjectId[] = []
    const projects: Types.ObjectId[] = []

    // Create accounts
    console.log(`  Creating ${TEST_CONFIG.NUM_ACCOUNTS} accounts...`)
    for (let i = 0; i < TEST_CONFIG.NUM_ACCOUNTS; i++) {
        const account = await AccountModel.create({
            email: `testuser${i}@example.com`,
            name: `Test User ${i}`,
            role: "user",
            password: "hashedpassword",
        })
        accounts.push(account._id as Types.ObjectId)
    }

    // Create projects
    console.log(`  Creating ${TEST_CONFIG.NUM_ACCOUNTS * TEST_CONFIG.PROJECTS_PER_ACCOUNT} projects...`)
    for (const accountId of accounts) {
        for (let j = 0; j < TEST_CONFIG.PROJECTS_PER_ACCOUNT; j++) {
            const project = await ProjectModel.create({
                account: accountId,
                name: `Project ${j}`,
                description: `Test project ${j}`,
                isActive: true,
                hourlyRate: 50 + Math.random() * 100,
            })
            projects.push(project._id as Types.ObjectId)
        }
    }

    // Create time entries in batches
    const totalEntries = TEST_CONFIG.NUM_ACCOUNTS * TEST_CONFIG.PROJECTS_PER_ACCOUNT * TEST_CONFIG.TIME_ENTRIES_PER_PROJECT
    console.log(`  Creating ${totalEntries} time entries...`)

    const batchSize = 1000
    let created = 0
    const timeEntries: Array<{
        account: Types.ObjectId
        project: Types.ObjectId
        startedAt: Date
        endedAt: Date
        note: string
        hourlyRate: number
    }> = []

    for (let accountIdx = 0; accountIdx < accounts.length; accountIdx++) {
        const accountId = accounts[accountIdx]!
        const accountProjects = projects.slice(
            accountIdx * TEST_CONFIG.PROJECTS_PER_ACCOUNT,
            (accountIdx + 1) * TEST_CONFIG.PROJECTS_PER_ACCOUNT
        )

        for (const projectId of accountProjects) {
            for (let k = 0; k < TEST_CONFIG.TIME_ENTRIES_PER_PROJECT; k++) {
                const startDate = new Date()
                startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 365))
                startDate.setHours(Math.floor(Math.random() * 24))

                const endDate = new Date(startDate)
                endDate.setHours(endDate.getHours() + 1 + Math.floor(Math.random() * 8))

                timeEntries.push({
                    account: accountId,
                    project: projectId,
                    startedAt: startDate,
                    endedAt: endDate,
                    note: `Work session ${k}`,
                    hourlyRate: 50 + Math.random() * 100,
                })

                if (timeEntries.length >= batchSize) {
                    await TimeEntryModel.insertMany(timeEntries)
                    created += timeEntries.length
                    process.stdout.write(`\r  Progress: ${created}/${totalEntries}`)
                    timeEntries.length = 0
                }
            }
        }
    }

    if (timeEntries.length > 0) {
        await TimeEntryModel.insertMany(timeEntries)
        created += timeEntries.length
    }

    console.log(`\n  Seeding complete!`)
}

const runQueryTests = async (testAccountId: Types.ObjectId, testProjectId: Types.ObjectId): Promise<QueryResult[]> => {
    const results: QueryResult[] = []
    const iterations = TEST_CONFIG.QUERY_ITERATIONS

    // Query 1: Get all time entries for an account (paginated)
    results.push(await measureQuery(
        "Find time entries by account (paginated)",
        async () => {
            await TimeEntryModel.find({ account: testAccountId })
                .skip(0)
                .limit(20)
                .exec()
        },
        iterations
    ))

    // Query 2: Count time entries for an account
    results.push(await measureQuery(
        "Count time entries by account",
        async () => {
            await TimeEntryModel.countDocuments({ account: testAccountId })
        },
        iterations
    ))

    // Query 3: Get time entries for account + project
    results.push(await measureQuery(
        "Find time entries by account + project",
        async () => {
            await TimeEntryModel.find({
                account: testAccountId,
                project: testProjectId,
            }).exec()
        },
        iterations
    ))

    // Query 4: Date range query for reports
    const rangeStart = new Date()
    rangeStart.setMonth(rangeStart.getMonth() - 3)
    const rangeEnd = new Date()

    results.push(await measureQuery(
        "Find time entries by account + project + date range",
        async () => {
            await TimeEntryModel.find({
                account: testAccountId,
                project: testProjectId,
                startedAt: { $gte: rangeStart, $lte: rangeEnd },
                endedAt: { $exists: true, $ne: null },
            }).exec()
        },
        iterations
    ))

    // Query 5: Get all projects for an account
    results.push(await measureQuery(
        "Find projects by account",
        async () => {
            await ProjectModel.find({ account: testAccountId }).exec()
        },
        iterations
    ))

    // Query 6: Count projects for an account
    results.push(await measureQuery(
        "Count projects by account",
        async () => {
            await ProjectModel.countDocuments({ account: testAccountId })
        },
        iterations
    ))

    // Query 7: Find and update time entry
    results.push(await measureQuery(
        "Find time entry by _id + account",
        async () => {
            const entry = await TimeEntryModel.findOne({ account: testAccountId }).exec()
            if (entry) {
                await TimeEntryModel.findOne({
                    _id: entry._id,
                    account: testAccountId,
                }).exec()
            }
        },
        iterations
    ))

    return results
}

const addIndexes = async () => {
    console.log("\nAdding indexes...")

    // TimeEntry indexes
    await TimeEntryModel.collection.createIndex({ account: 1 })
    console.log("  Created: TimeEntry.account")

    await TimeEntryModel.collection.createIndex({ account: 1, project: 1 })
    console.log("  Created: TimeEntry.account_project (compound)")

    await TimeEntryModel.collection.createIndex({ account: 1, project: 1, startedAt: 1 })
    console.log("  Created: TimeEntry.account_project_startedAt (compound)")

    // Project indexes
    await ProjectModel.collection.createIndex({ account: 1 })
    console.log("  Created: Project.account")
}

const formatResults = (results: TestResults): string => {
    let output = "# Query Indexing Performance Test Results\n\n"
    output += `Generated: ${new Date().toISOString()}\n\n`

    output += "## Test Configuration\n\n"
    output += "| Parameter | Value |\n"
    output += "|-----------|-------|\n"
    output += `| Accounts | ${results.dataStats.accounts} |\n`
    output += `| Projects | ${results.dataStats.projects} |\n`
    output += `| Time Entries | ${results.dataStats.timeEntries} |\n`
    output += `| Query Iterations | ${TEST_CONFIG.QUERY_ITERATIONS} |\n\n`

    output += "## Results Summary\n\n"
    output += "| Query | Before (ms) | After (ms) | Improvement |\n"
    output += "|-------|-------------|------------|-------------|\n"

    for (let i = 0; i < results.beforeIndexing.length; i++) {
        const before = results.beforeIndexing[i]!
        const after = results.afterIndexing[i]!
        const improvement = ((before.avgTimeMs - after.avgTimeMs) / before.avgTimeMs * 100).toFixed(1)
        const speedup = (before.avgTimeMs / after.avgTimeMs).toFixed(2)

        output += `| ${before.name} | ${before.avgTimeMs.toFixed(2)} | ${after.avgTimeMs.toFixed(2)} | ${improvement}% (${speedup}x faster) |\n`
    }

    output += "\n## Detailed Results\n\n"

    output += "### Before Indexing\n\n"
    output += "| Query | Avg (ms) | Min (ms) | Max (ms) |\n"
    output += "|-------|----------|----------|----------|\n"
    for (const result of results.beforeIndexing) {
        output += `| ${result.name} | ${result.avgTimeMs.toFixed(2)} | ${result.minTimeMs.toFixed(2)} | ${result.maxTimeMs.toFixed(2)} |\n`
    }

    output += "\n### After Indexing\n\n"
    output += "| Query | Avg (ms) | Min (ms) | Max (ms) |\n"
    output += "|-------|----------|----------|----------|\n"
    for (const result of results.afterIndexing) {
        output += `| ${result.name} | ${result.avgTimeMs.toFixed(2)} | ${result.minTimeMs.toFixed(2)} | ${result.maxTimeMs.toFixed(2)} |\n`
    }

    output += "\n## Indexes Added\n\n"
    output += "```javascript\n"
    output += "// TimeEntry collection\n"
    output += "TimeEntrySchema.index({ account: 1 })\n"
    output += "TimeEntrySchema.index({ account: 1, project: 1 })\n"
    output += "TimeEntrySchema.index({ account: 1, project: 1, startedAt: 1 })\n\n"
    output += "// Project collection\n"
    output += "ProjectSchema.index({ account: 1 })\n"
    output += "```\n\n"

    output += "## Conclusion\n\n"

    const totalBeforeAvg = results.beforeIndexing.reduce((sum, r) => sum + r.avgTimeMs, 0)
    const totalAfterAvg = results.afterIndexing.reduce((sum, r) => sum + r.avgTimeMs, 0)
    const overallImprovement = ((totalBeforeAvg - totalAfterAvg) / totalBeforeAvg * 100).toFixed(1)

    output += `Adding proper indexes resulted in an overall **${overallImprovement}% improvement** in query performance.\n\n`
    output += "Key takeaways:\n"
    output += "- Queries filtering by `account` benefit significantly from the `{ account: 1 }` index\n"
    output += "- Compound indexes like `{ account: 1, project: 1, startedAt: 1 }` optimize report queries\n"
    output += "- Index order matters: put equality conditions first, then range conditions\n"

    return output
}

const main = async () => {
    console.log("=== Query Indexing Performance Test ===\n")

    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/unclocked-test"
    console.log(`Connecting to MongoDB: ${mongoUri.replace(/\/\/[^:]+:[^@]+@/, "//***:***@")}`)

    await mongoose.connect(mongoUri)
    console.log("Connected!\n")

    try {
        // Step 1: Drop existing indexes
        await dropNonIdIndexes()

        // Step 2: Seed test data
        await seedTestData()

        // Get test account and project for queries
        const testAccount = await AccountModel.findOne({ email: /^testuser/ })
        const testProject = await ProjectModel.findOne({ account: testAccount?._id })

        if (!testAccount || !testProject) {
            throw new Error("Test data not found")
        }

        const testAccountId = testAccount._id as Types.ObjectId
        const testProjectId = testProject._id as Types.ObjectId

        // Step 3: Run tests WITHOUT indexes
        console.log("\n--- Running tests WITHOUT indexes ---")
        const beforeResults = await runQueryTests(testAccountId, testProjectId)

        for (const result of beforeResults) {
            console.log(`  ${result.name}: ${result.avgTimeMs.toFixed(2)}ms avg`)
        }

        // Step 4: Add indexes
        await addIndexes()

        // Step 5: Run tests WITH indexes
        console.log("\n--- Running tests WITH indexes ---")
        const afterResults = await runQueryTests(testAccountId, testProjectId)

        for (const result of afterResults) {
            console.log(`  ${result.name}: ${result.avgTimeMs.toFixed(2)}ms avg`)
        }

        // Step 6: Generate report
        const dataStats = {
            accounts: await AccountModel.countDocuments({ email: /^testuser/ }),
            projects: await ProjectModel.countDocuments(),
            timeEntries: await TimeEntryModel.countDocuments(),
        }

        const results: TestResults = {
            beforeIndexing: beforeResults,
            afterIndexing: afterResults,
            dataStats,
        }

        const report = formatResults(results)

        // Write report to file
        const fs = await import("fs/promises")
        const path = await import("path")
        const reportPath = path.join(__dirname, "../../query-indexing.md")
        await fs.writeFile(reportPath, report)

        console.log(`\n✅ Report written to: ${reportPath}`)

        // Also print summary
        console.log("\n=== Summary ===")
        console.log("\n| Query | Before | After | Improvement |")
        console.log("|-------|--------|-------|-------------|")
        for (let i = 0; i < beforeResults.length; i++) {
            const before = beforeResults[i]!
            const after = afterResults[i]!
            const improvement = ((before.avgTimeMs - after.avgTimeMs) / before.avgTimeMs * 100).toFixed(1)
            console.log(`| ${before.name} | ${before.avgTimeMs.toFixed(2)}ms | ${after.avgTimeMs.toFixed(2)}ms | ${improvement}% |`)
        }

    } finally {
        await mongoose.disconnect()
        console.log("\nDisconnected from MongoDB")
    }
}

main().catch(console.error)
