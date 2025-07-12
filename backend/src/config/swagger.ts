import swaggerJsdoc from "swagger-jsdoc"

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Unclocked App API",
            version: "1.0.0",
            description:
                "RESTful API for time tracking, project management, and reporting functionality",
            contact: {
                name: "Aleksi Kesala",
                email: "support@unclocked-app.com",
            },
            license: {
                name: "MIT",
                url: "https://opensource.org/licenses/MIT",
            },
        },
        servers: [
            {
                url: "http://localhost:3001/api/v1",
                description: "Development server",
            },
            {
                url: "https://api.unclocked-app.com/api/v1",
                description: "Production server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "JWT token for authentication",
                },
            },
            schemas: {
                Error: {
                    type: "object",
                    properties: {
                        error: {
                            type: "object",
                            properties: {
                                message: {
                                    type: "string",
                                    description: "Error description",
                                },
                                code: {
                                    type: "string",
                                    description: "Error code",
                                },
                                details: {
                                    type: "object",
                                    description: "Additional error details",
                                },
                            },
                        },
                    },
                },
                Pagination: {
                    type: "object",
                    properties: {
                        page: {
                            type: "integer",
                            description: "Current page number",
                            example: 1,
                        },
                        limit: {
                            type: "integer",
                            description: "Items per page",
                            example: 20,
                        },
                        total: {
                            type: "integer",
                            description: "Total number of items",
                            example: 100,
                        },
                        pages: {
                            type: "integer",
                            description: "Total number of pages",
                            example: 5,
                        },
                    },
                },
                Project: {
                    type: "object",
                    properties: {
                        _id: {
                            type: "string",
                            description: "Project ID",
                            example: "507f1f77bcf86cd799439011",
                        },
                        name: {
                            type: "string",
                            description: "Project name",
                            example: "Project Alpha",
                        },
                        description: {
                            type: "string",
                            description: "Project description",
                            example: "A sample project description",
                        },
                        isActive: {
                            type: "boolean",
                            description: "Project active status",
                            example: true,
                        },
                        hourlyRate: {
                            type: "number",
                            description: "Hourly rate for the project",
                            example: 50,
                        },
                        accountId: {
                            type: "string",
                            description: "Account ID",
                            example: "507f1f77bcf86cd799439012",
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                            description: "Creation timestamp",
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                            description: "Last update timestamp",
                        },
                    },
                    required: ["name", "description", "isActive", "accountId"],
                },
                CreateProjectRequest: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                            description: "Project name (minimum 1 character)",
                            example: "Project Alpha",
                        },
                        description: {
                            type: "string",
                            description:
                                "Project description (minimum 1 character)",
                            example: "A sample project description",
                        },
                        isActive: {
                            type: "boolean",
                            description: "Project active status",
                            example: true,
                        },
                        hourlyRate: {
                            type: "number",
                            description: "Hourly rate for the project",
                            example: 50,
                        },
                    },
                    required: ["name", "description"],
                },
                TimeEntry: {
                    type: "object",
                    properties: {
                        _id: {
                            type: "string",
                            description: "Time entry ID",
                            example: "507f1f77bcf86cd799439013",
                        },
                        startedAt: {
                            type: "string",
                            format: "date-time",
                            description: "Start time",
                            example: "2024-01-15T10:00:00.000Z",
                        },
                        endedAt: {
                            type: "string",
                            format: "date-time",
                            description: "End time",
                            example: "2024-01-15T12:00:00.000Z",
                        },
                        project: {
                            type: "string",
                            description: "Project ID",
                            example: "507f1f77bcf86cd799439011",
                        },
                        note: {
                            type: "string",
                            description: "Optional note about the time entry",
                            example: "Working on feature implementation",
                        },
                        hourlyRate: {
                            type: "number",
                            description: "Hourly rate for this entry",
                            example: 50,
                        },
                        accountId: {
                            type: "string",
                            description: "Account ID",
                            example: "507f1f77bcf86cd799439012",
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                            description: "Creation timestamp",
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                            description: "Last update timestamp",
                        },
                    },
                    required: ["startedAt", "project", "accountId"],
                },
                CreateTimeEntryRequest: {
                    type: "object",
                    properties: {
                        startedAt: {
                            type: "string",
                            format: "date-time",
                            description: "Start time (ISO 8601 date string)",
                            example: "2024-01-15T10:00:00.000Z",
                        },
                        endedAt: {
                            type: "string",
                            format: "date-time",
                            description: "End time (ISO 8601 date string)",
                            example: "2024-01-15T12:00:00.000Z",
                        },
                        project: {
                            type: "string",
                            description:
                                "Project ID (24-character MongoDB ObjectId)",
                            example: "507f1f77bcf86cd799439011",
                        },
                        note: {
                            type: "string",
                            description: "Optional note about the time entry",
                            example: "Working on feature implementation",
                        },
                        hourlyRate: {
                            type: "number",
                            description: "Hourly rate for this entry",
                            example: 50,
                        },
                    },
                    required: ["startedAt", "project"],
                },
                StartTimeEntryRequest: {
                    type: "object",
                    properties: {
                        project: {
                            type: "string",
                            description:
                                "Project ID (24-character MongoDB ObjectId)",
                            example: "507f1f77bcf86cd799439011",
                        },
                        note: {
                            type: "string",
                            description: "Optional note about the time entry",
                            example: "Working on feature implementation",
                        },
                        hourlyRate: {
                            type: "number",
                            description: "Optional hourly rate override",
                            example: 50,
                        },
                    },
                    required: ["project"],
                },
                EndTimeEntryRequest: {
                    type: "object",
                    properties: {
                        endedAt: {
                            type: "string",
                            format: "date-time",
                            description: "End time (ISO 8601 date string)",
                            example: "2024-01-15T12:00:00.000Z",
                        },
                    },
                    required: ["endedAt"],
                },
                Report: {
                    type: "object",
                    properties: {
                        _id: {
                            type: "string",
                            description: "Report ID",
                            example: "507f1f77bcf86cd799439014",
                        },
                        project: {
                            type: "string",
                            description: "Project ID",
                            example: "507f1f77bcf86cd799439011",
                        },
                        rangeStart: {
                            type: "string",
                            format: "date-time",
                            description: "Start date of report range",
                            example: "2024-01-01T00:00:00.000Z",
                        },
                        rangeEnd: {
                            type: "string",
                            format: "date-time",
                            description: "End date of report range",
                            example: "2024-01-31T23:59:59.999Z",
                        },
                        name: {
                            type: "string",
                            description: "Report name",
                            example: "January 2024 Report",
                        },
                        totalHours: {
                            type: "number",
                            description: "Total hours (computed field)",
                            example: 160,
                        },
                        totalEarnings: {
                            type: "number",
                            description: "Total earnings (computed field)",
                            example: 8000,
                        },
                        accountId: {
                            type: "string",
                            description: "Account ID",
                            example: "507f1f77bcf86cd799439012",
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                            description: "Creation timestamp",
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                            description: "Last update timestamp",
                        },
                    },
                    required: [
                        "project",
                        "rangeStart",
                        "rangeEnd",
                        "name",
                        "accountId",
                    ],
                },
                CreateReportRequest: {
                    type: "object",
                    properties: {
                        project: {
                            type: "string",
                            description:
                                "Project ID (24-character MongoDB ObjectId)",
                            example: "507f1f77bcf86cd799439011",
                        },
                        rangeStart: {
                            type: "string",
                            format: "date-time",
                            description:
                                "Start date of report range (ISO 8601 date string)",
                            example: "2024-01-01T00:00:00.000Z",
                        },
                        rangeEnd: {
                            type: "string",
                            format: "date-time",
                            description:
                                "End date of report range (ISO 8601 date string)",
                            example: "2024-01-31T23:59:59.999Z",
                        },
                        name: {
                            type: "string",
                            description: "Report name (minimum 1 character)",
                            example: "January 2024 Report",
                        },
                    },
                    required: ["project", "rangeStart", "rangeEnd", "name"],
                },
                StatusResponse: {
                    type: "object",
                    properties: {
                        status: {
                            type: "string",
                            description: "API status",
                            example: "ok",
                        },
                        timestamp: {
                            type: "string",
                            format: "date-time",
                            description: "Current timestamp",
                            example: "2024-01-15T10:30:00.000Z",
                        },
                        version: {
                            type: "string",
                            description: "API version",
                            example: "1.0.0",
                        },
                    },
                },
                TestAccountResponse: {
                    type: "object",
                    properties: {
                        accountId: {
                            type: "string",
                            description: "Account ID",
                            example: "507f1f77bcf86cd799439011",
                        },
                        user: {
                            type: "object",
                            properties: {
                                id: {
                                    type: "string",
                                    description: "User ID",
                                    example: "507f1f77bcf86cd799439012",
                                },
                                email: {
                                    type: "string",
                                    description: "User email",
                                    example: "user@example.com",
                                },
                                name: {
                                    type: "string",
                                    description: "User name",
                                    example: "John Doe",
                                },
                            },
                        },
                    },
                },
            },
            parameters: {
                page: {
                    name: "page",
                    in: "query",
                    description: "Page number",
                    required: false,
                    schema: {
                        type: "integer",
                        minimum: 1,
                        default: 1,
                    },
                },
                limit: {
                    name: "limit",
                    in: "query",
                    description: "Items per page",
                    required: false,
                    schema: {
                        type: "integer",
                        minimum: 1,
                        maximum: 100,
                        default: 20,
                    },
                },
                sortby: {
                    name: "sortby",
                    in: "query",
                    description: "Field to sort by",
                    required: false,
                    schema: {
                        type: "string",
                    },
                },
                orderby: {
                    name: "orderby",
                    in: "query",
                    description: "Sort order",
                    required: false,
                    schema: {
                        type: "string",
                        enum: ["asc", "desc"],
                    },
                },
                projectId: {
                    name: "project",
                    in: "query",
                    description: "Filter by project ID",
                    required: false,
                    schema: {
                        type: "string",
                        pattern: "^[0-9a-fA-F]{24}$",
                    },
                },
                isActive: {
                    name: "isActive",
                    in: "query",
                    description: "Filter by active status",
                    required: false,
                    schema: {
                        type: "string",
                        enum: ["true", "false"],
                    },
                },
                timeEntryId: {
                    name: "id",
                    in: "path",
                    description: "Time entry ID",
                    required: true,
                    schema: {
                        type: "string",
                        pattern: "^[0-9a-fA-F]{24}$",
                    },
                },
                reportId: {
                    name: "id",
                    in: "path",
                    description: "Report ID",
                    required: true,
                    schema: {
                        type: "string",
                        minLength: 1,
                    },
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./src/modules/**/*.route.ts", "./src/modules/**/*.controller.ts"],
}

export const specs = swaggerJsdoc(options)
