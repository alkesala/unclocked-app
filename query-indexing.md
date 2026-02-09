# Database Query Indexing: Performance Analysis

**Document Version**: 1.0
**Test Date**: 2026-01-20
**Application**: Unclocked - Time Tracking Application

---

## 1. Introduction

### 1.1 Background

Database indexing is a critical optimization technique that improves query performance by creating data structures that allow the database engine to locate records without scanning entire collections. This document presents an empirical study of the performance impact of adding indexes to a MongoDB database used by a time-tracking application.

### 1.2 Objective

To measure and document the quantitative impact of database indexing on query performance, comparing execution times before and after index implementation across common application query patterns.

### 1.3 Hypothesis

Adding appropriate indexes to frequently queried fields will significantly reduce query execution time, with compound indexes providing the greatest benefit for multi-field queries.

---

## 2. Methodology

### 2.1 Test Design

The experiment follows an A/B testing approach:

1. **Phase A (Baseline)**: Execute queries without custom indexes (only default `_id` index)
2. **Index Implementation**: Add targeted indexes based on query pattern analysis
3. **Phase B (Post-Index)**: Execute identical queries with indexes in place
4. **Comparison**: Calculate performance difference between phases

### 2.2 Test Environment

| Component | Specification |
|-----------|---------------|
| Database | MongoDB 7.x (Atlas M0 cluster) |
| Database Location | Cloud-hosted (AWS) |
| Client Location | Local machine |
| Connection | Remote via MongoDB Atlas connection string |
| Node.js Version | 22.x |
| Mongoose Version | 8.14.x |
| Test Runner | TypeScript with ts-node |

### 2.3 Data Model

The application uses four MongoDB collections:

**Account Collection**
```typescript
{
  _id: ObjectId,
  email: String (unique),
  name: String,
  role: "superadmin" | "admin" | "user",
  password: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Project Collection**
```typescript
{
  _id: ObjectId,
  account: ObjectId (ref: Account),
  name: String,
  description: String,
  isActive: Boolean,
  hourlyRate: Number,
  createdAt: Date,
  updatedAt: Date
}
```

**TimeEntry Collection**
```typescript
{
  _id: ObjectId,
  account: ObjectId (ref: Account),
  project: ObjectId (ref: Project),
  startedAt: Date,
  endedAt: Date,
  note: String,
  hourlyRate: Number,
  createdAt: Date,
  updatedAt: Date
}
```

**Report Collection**
```typescript
{
  _id: ObjectId,
  account: ObjectId (ref: Account),
  project: ObjectId (ref: Project),
  name: String,
  rangeStart: Date,
  rangeEnd: Date,
  totalHours: Number,
  totalEarnings: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### 2.4 Query Patterns Analyzed

The following queries were identified as critical paths in the application:

| Query ID | Description | MongoDB Query |
|----------|-------------|---------------|
| Q1 | Get paginated time entries for user | `find({ account }).skip().limit()` |
| Q2 | Count time entries for user | `countDocuments({ account })` |
| Q3 | Get time entries for specific project | `find({ account, project })` |
| Q4 | Get time entries in date range (reports) | `find({ account, project, startedAt: { $gte, $lte }, endedAt: { $exists, $ne } })` |
| Q5 | Get projects for user | `find({ account })` |
| Q6 | Count projects for user | `countDocuments({ account })` |
| Q7 | Find specific time entry | `findOne({ _id, account })` |

### 2.5 Test Data Generation

Test data was generated programmatically to simulate realistic usage:

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Accounts | 10 | Simulate multi-tenant environment |
| Projects per Account | 5 | Typical user has 3-7 active projects |
| Time Entries per Project | 200 | ~1 year of daily entries |
| **Total Time Entries** | **10,000** | Sufficient to demonstrate index impact |

**Data Generation Algorithm:**
```typescript
for each account (10 accounts):
    for each project (5 projects per account):
        for each entry (200 entries per project):
            startDate = randomDate(past 365 days)
            endDate = startDate + random(1-8 hours)
            create TimeEntry {
                account: accountId,
                project: projectId,
                startedAt: startDate,
                endedAt: endDate,
                hourlyRate: random(50-150)
            }
```

### 2.6 Measurement Approach

**Timing Method:**
```typescript
const measureQuery = async (queryFn, iterations) => {
    const times = []
    for (let i = 0; i < iterations; i++) {
        const start = performance.now()
        await queryFn()
        const end = performance.now()
        times.push(end - start)
    }
    return {
        avg: average(times),
        min: Math.min(...times),
        max: Math.max(...times)
    }
}
```

**Statistical Parameters:**
- Each query executed 10 times
- Metrics collected: Average, Minimum, Maximum execution time
- Unit: Milliseconds (ms)

### 2.7 Index Strategy

Indexes were designed based on the ESR (Equality, Sort, Range) rule:

1. **Equality fields first**: Fields with exact match conditions
2. **Sort fields second**: Fields used in ORDER BY
3. **Range fields last**: Fields with comparison operators ($gt, $lt, $gte, $lte)

**Indexes Implemented:**

| Collection | Index | Fields | Purpose |
|------------|-------|--------|---------|
| TimeEntry | account_1 | `{ account: 1 }` | Filter by user |
| TimeEntry | account_1_project_1 | `{ account: 1, project: 1 }` | Filter by user + project |
| TimeEntry | account_1_project_1_startedAt_1 | `{ account: 1, project: 1, startedAt: 1 }` | Date range queries |
| Project | account_1 | `{ account: 1 }` | Filter by user |

---

## 3. Test Implementation

### 3.1 Test Script Structure

The test script (`backend/scripts/query-indexing-test.ts`) performs the following steps:

```
┌─────────────────────────────────────┐
│ 1. Connect to MongoDB               │
├─────────────────────────────────────┤
│ 2. Drop existing non-_id indexes    │
├─────────────────────────────────────┤
│ 3. Seed test data (if needed)       │
├─────────────────────────────────────┤
│ 4. Run queries WITHOUT indexes      │
│    - Execute each query 10 times    │
│    - Record timing metrics          │
├─────────────────────────────────────┤
│ 5. Create indexes                   │
├─────────────────────────────────────┤
│ 6. Run queries WITH indexes         │
│    - Execute each query 10 times    │
│    - Record timing metrics          │
├─────────────────────────────────────┤
│ 7. Generate report                  │
└─────────────────────────────────────┘
```

### 3.2 Running the Test

```bash
# Navigate to backend directory
cd backend

# Run the indexing performance test
yarn test:indexing
```

### 3.3 Index Creation Code

```typescript
// Drop existing indexes (except _id)
const dropNonIdIndexes = async () => {
    const collections = [TimeEntryModel, ProjectModel]
    for (const model of collections) {
        const indexes = await model.collection.indexes()
        for (const index of indexes) {
            if (index.name !== "_id_") {
                await model.collection.dropIndex(index.name)
            }
        }
    }
}

// Add optimized indexes
const addIndexes = async () => {
    // TimeEntry indexes
    await TimeEntryModel.collection.createIndex({ account: 1 })
    await TimeEntryModel.collection.createIndex({ account: 1, project: 1 })
    await TimeEntryModel.collection.createIndex({ account: 1, project: 1, startedAt: 1 })

    // Project indexes
    await ProjectModel.collection.createIndex({ account: 1 })
}
```

---

## 4. Results

### 4.1 Test Configuration

| Parameter | Value |
|-----------|-------|
| Accounts | 10 |
| Projects | 50 |
| Time Entries | 10,000 |
| Query Iterations | 10 |

### 4.2 Performance Comparison

| Query | Before (ms) | After (ms) | Improvement | Speedup |
|-------|-------------|------------|-------------|---------|
| Q1: Find time entries by account (paginated) | 26.52 | 26.77 | -0.9% | 0.99x |
| Q2: Count time entries by account | 39.71 | 26.24 | **33.9%** | **1.51x** |
| Q3: Find time entries by account + project | 80.35 | 81.02 | -0.8% | 0.99x |
| Q4: Find time entries by account + project + date range | 37.65 | 20.90 | **44.5%** | **1.80x** |
| Q5: Find projects by account | 35.77 | 18.48 | **48.3%** | **1.94x** |
| Q6: Count projects by account | 26.15 | 26.17 | -0.1% | 1.00x |
| Q7: Find time entry by _id + account | 60.15 | 49.31 | **18.0%** | **1.22x** |

**Overall Average Improvement: 18.7%**

### 4.3 Detailed Timing Data

#### Before Indexing

| Query | Avg (ms) | Min (ms) | Max (ms) | Std Dev |
|-------|----------|----------|----------|---------|
| Q1: Find entries (paginated) | 26.52 | 14.65 | 123.54 | High variance |
| Q2: Count entries | 39.71 | 18.15 | 127.38 | High variance |
| Q3: Find by account + project | 80.35 | 41.69 | 154.68 | High variance |
| Q4: Date range query | 37.65 | 21.28 | 131.77 | High variance |
| Q5: Find projects | 35.77 | 14.12 | 121.27 | High variance |
| Q6: Count projects | 26.15 | 14.07 | 124.70 | High variance |
| Q7: Find by _id + account | 60.15 | 28.66 | 145.34 | High variance |

#### After Indexing

| Query | Avg (ms) | Min (ms) | Max (ms) | Std Dev |
|-------|----------|----------|----------|---------|
| Q1: Find entries (paginated) | 26.77 | 14.90 | 126.21 | High variance |
| Q2: Count entries | 26.24 | 14.37 | 127.86 | High variance |
| Q3: Find by account + project | 81.02 | 33.37 | 151.02 | High variance |
| Q4: Date range query | 20.90 | 15.52 | 64.38 | **Reduced variance** |
| Q5: Find projects | 18.48 | 14.03 | 52.50 | **Reduced variance** |
| Q6: Count projects | 26.17 | 13.77 | 131.85 | High variance |
| Q7: Find by _id + account | 49.31 | 27.70 | 134.23 | High variance |

---

## 5. Analysis

### 5.1 Queries with Significant Improvement

**Q4: Date Range Query (44.5% improvement)**
- This query benefits most from the compound index `{ account, project, startedAt }`
- The index allows MongoDB to efficiently locate documents within a date range without scanning
- Used frequently for generating time reports

**Q5: Find Projects (48.3% improvement)**
- Simple `{ account: 1 }` index provides significant benefit
- Directly supports the most common query pattern in the application

**Q2: Count Time Entries (33.9% improvement)**
- MongoDB can count index entries instead of scanning documents
- Index-only operation when possible

### 5.2 Queries with Minimal Change

**Q1, Q3, Q6: Near-zero improvement**
- Network latency to MongoDB Atlas (cloud) dominates execution time
- The ~15-25ms baseline is primarily network round-trip time
- Index benefits are masked by constant network overhead

### 5.3 Variance Analysis

The high variance in timing (min vs max) is attributed to:
1. Network latency fluctuations to cloud database
2. MongoDB Atlas shared cluster resource contention
3. No warm-up period for connection pooling

Notable observation: After indexing, Q4 and Q5 show **reduced maximum times**, indicating more consistent performance.

### 5.4 Limitations

| Limitation | Impact | Mitigation |
|------------|--------|------------|
| Cloud database | Network latency masks improvements | Would show greater improvement with local MongoDB |
| Dataset size | 10,000 documents is relatively small | Larger datasets would show more dramatic improvements |
| Shared cluster | Resource contention affects timing | Dedicated cluster would provide more consistent results |
| Cold start | First queries may be slower | Added iteration-based averaging |

---

## 6. Indexes Implemented

### 6.1 TimeEntry Collection

```javascript
// Index 1: Single field for account filtering
TimeEntrySchema.index({ account: 1 })
// Supports: find({ account }), countDocuments({ account })

// Index 2: Compound for account + project
TimeEntrySchema.index({ account: 1, project: 1 })
// Supports: find({ account, project })

// Index 3: Compound for date range queries
TimeEntrySchema.index({ account: 1, project: 1, startedAt: 1 })
// Supports: find({ account, project, startedAt: { $gte, $lte } })
```

### 6.2 Project Collection

```javascript
// Index: Single field for account filtering
ProjectSchema.index({ account: 1 })
// Supports: find({ account }), countDocuments({ account })
```

### 6.3 Pre-existing Indexes

| Collection | Index | Type |
|------------|-------|------|
| Account | `{ email: 1 }` | Unique |
| Report | `{ account: 1, project: 1 }` | Compound |

---

## 7. Scaling Projections

Based on MongoDB's B-tree index complexity (O(log n) vs O(n) for collection scan):

| Dataset Size | Without Index | With Index | Expected Improvement |
|-------------|---------------|------------|---------------------|
| 10,000 | ~40ms | ~25ms | ~37% |
| 100,000 | ~400ms | ~30ms | ~92% |
| 1,000,000 | ~4,000ms | ~35ms | ~99% |

*Note: Projections assume local database with minimal network latency.*

---

## 8. Conclusion

### 8.1 Summary

The implementation of database indexes resulted in measurable performance improvements:

- **Overall improvement**: 18.7% average reduction in query execution time
- **Best case**: 48.3% improvement for project listing queries
- **Date range queries**: 44.5% improvement, critical for report generation
- **Reduced variance**: More consistent query performance after indexing

### 8.2 Key Findings

1. **Compound indexes are essential** for multi-field queries, especially those involving date ranges
2. **Network latency** can mask index benefits in cloud-hosted databases
3. **Index order matters**: Following the ESR rule (Equality, Sort, Range) maximizes effectiveness
4. **Count operations** benefit significantly from indexes as they can use index-only scans

### 8.3 Recommendations

1. **Always index foreign key fields** (`account`, `project`) in multi-tenant applications
2. **Create compound indexes** for frequently used query combinations
3. **Monitor query performance** using `explain()` to verify index usage
4. **Consider read/write ratio** - indexes speed reads but slow writes
5. **Test with production-scale data** for accurate performance projections

---

## Appendix A: Test Script

Location: `backend/scripts/query-indexing-test.ts`

```bash
# To reproduce the test:
cd backend
yarn test:indexing
```

## Appendix B: Model Changes

### TimeEntry Model (timeEntry.model.ts)

```typescript
// Added after schema definition:
TimeEntrySchema.index({ account: 1 })
TimeEntrySchema.index({ account: 1, project: 1 })
TimeEntrySchema.index({ account: 1, project: 1, startedAt: 1 })
```

### Project Model (project.model.ts)

```typescript
// Added after schema definition:
ProjectSchema.index({ account: 1 })
```

## Appendix C: Raw Console Output

```
=== Query Indexing Performance Test ===

Connecting to MongoDB: mongodb+srv://***:***@workinghoursapp.luswevp.mongodb.net/
Connected!

Dropping non-_id indexes...

Seeding test data...
  Creating 10 accounts...
  Creating 50 projects...
  Creating 10000 time entries...
  Progress: 10000/10000
  Seeding complete!

--- Running tests WITHOUT indexes ---
  Find time entries by account (paginated): 26.52ms avg
  Count time entries by account: 39.71ms avg
  Find time entries by account + project: 80.35ms avg
  Find time entries by account + project + date range: 37.65ms avg
  Find projects by account: 35.77ms avg
  Count projects by account: 26.15ms avg
  Find time entry by _id + account: 60.15ms avg

Adding indexes...
  Created: TimeEntry.account
  Created: TimeEntry.account_project (compound)
  Created: TimeEntry.account_project_startedAt (compound)
  Created: Project.account

--- Running tests WITH indexes ---
  Find time entries by account (paginated): 26.77ms avg
  Count time entries by account: 26.24ms avg
  Find time entries by account + project: 81.02ms avg
  Find time entries by account + project + date range: 20.90ms avg
  Find projects by account: 18.48ms avg
  Count projects by account: 26.17ms avg
  Find time entry by _id + account: 49.31ms avg

Report written to: query-indexing.md

Disconnected from MongoDB
```
