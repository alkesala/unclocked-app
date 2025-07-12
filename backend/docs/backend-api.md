# Unclocked App Backend API Documentation

## Overview

The Unclocked App Backend API provides a RESTful interface for time tracking, project management, and reporting functionality. This API is built with Node.js, Express, TypeScript, and MongoDB.

**Base URL:** `http://localhost:3000/api/v1` (development)  
**Content-Type:** `application/json`  
**Authentication:** OAuth-based (currently using fake OAuth middleware for development)

## Table of Contents

- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Pagination](#pagination)
- [Status Endpoints](#status-endpoints)
- [Project Endpoints](#project-endpoints)
- [Time Entry Endpoints](#time-entry-endpoints)
- [Report Endpoints](#report-endpoints)
- [Data Models](#data-models)

## Authentication

All API endpoints require authentication. The current implementation uses a fake OAuth middleware that injects user information into the request object.

**Headers Required:**
```
Authorization: Bearer <token>
```

**Request Object Properties (injected by middleware):**
- `req.accountId`: The authenticated user's account ID
- `req.user`: User object containing user information

## Error Handling

The API uses standard HTTP status codes and returns error responses in the following format:

```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## Pagination

Most list endpoints support pagination with the following query parameters:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number (minimum: 1) |
| `limit` | number | 20 | Items per page (minimum: 1, maximum: 100) |
| `sortby` | string | - | Field to sort by |
| `orderby` | string | - | Sort order: `asc` or `desc` |

**Example:**
```
GET /api/v1/project?page=1&limit=10&sortby=name&orderby=asc
```

## Status Endpoints

### Get API Status

Check the health and status of the API.

**Endpoint:** `GET /status`

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

### Test Authentication

Test the authentication middleware and get current user information.

**Endpoint:** `GET /test-account`

**Response:**
```json
{
  "accountId": "507f1f77bcf86cd799439011",
  "user": {
    "id": "507f1f77bcf86cd799439012",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

## Project Endpoints

### Get All Projects

Retrieve a paginated list of projects with optional filtering.

**Endpoint:** `GET /project`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | number | No | Page number (default: 1) |
| `limit` | number | No | Items per page (default: 20, max: 100) |
| `sortby` | string | No | Field to sort by |
| `orderby` | string | No | Sort order: `asc` or `desc` |
| `isActive` | string | No | Filter by active status: `true` or `false` |

**Response:**
```json
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Project Alpha",
      "description": "A sample project",
      "isActive": true,
      "hourlyRate": 50,
      "accountId": "507f1f77bcf86cd799439012",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "pages": 1
  }
}
```

### Create Project

Create a new project.

**Endpoint:** `POST /project`

**Request Body:**
```json
{
  "name": "Project Alpha",
  "description": "A sample project description",
  "isActive": true,
  "hourlyRate": 50
}
```

**Request Body Schema:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Project name (minimum 1 character) |
| `description` | string | Yes | Project description (minimum 1 character) |
| `isActive` | boolean | No | Project active status (default: true) |
| `hourlyRate` | number | No | Hourly rate for the project |

**Response:**
```json
{
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Project Alpha",
    "description": "A sample project description",
    "isActive": true,
    "hourlyRate": 50,
    "accountId": "507f1f77bcf86cd799439012",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

## Time Entry Endpoints

### Create Time Entry

Create a new time entry.

**Endpoint:** `POST /time`

**Request Body:**
```json
{
  "startedAt": "2024-01-15T10:00:00.000Z",
  "endedAt": "2024-01-15T12:00:00.000Z",
  "project": "507f1f77bcf86cd799439011",
  "note": "Working on feature implementation",
  "hourlyRate": 50
}
```

**Request Body Schema:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `startedAt` | string | Yes | Start time (ISO 8601 date string) |
| `endedAt` | string | No | End time (ISO 8601 date string) |
| `project` | string | Yes | Project ID (24-character MongoDB ObjectId) |
| `note` | string | No | Optional note about the time entry |
| `hourlyRate` | number | No | Hourly rate for this entry |

**Response:**
```json
{
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "startedAt": "2024-01-15T10:00:00.000Z",
    "endedAt": "2024-01-15T12:00:00.000Z",
    "project": "507f1f77bcf86cd799439011",
    "note": "Working on feature implementation",
    "hourlyRate": 50,
    "accountId": "507f1f77bcf86cd799439012",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Get All Time Entries

Retrieve a paginated list of time entries with optional filtering.

**Endpoint:** `GET /time`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | number | No | Page number (default: 1) |
| `limit` | number | No | Items per page (default: 20, max: 100) |
| `sortby` | string | No | Field to sort by |
| `orderby` | string | No | Sort order: `asc` or `desc` |
| `project` | string | No | Filter by project ID |

**Response:**
```json
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "startedAt": "2024-01-15T10:00:00.000Z",
      "endedAt": "2024-01-15T12:00:00.000Z",
      "project": "507f1f77bcf86cd799439011",
      "note": "Working on feature implementation",
      "hourlyRate": 50,
      "accountId": "507f1f77bcf86cd799439012",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "pages": 1
  }
}
```

### Delete Time Entry

Delete a time entry by ID.

**Endpoint:** `DELETE /time/:id`

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Time entry ID (24-character MongoDB ObjectId) |

**Response:**
```json
{
  "message": "Time entry deleted successfully"
}
```

### End Time Entry

End an ongoing time entry by setting the end time.

**Endpoint:** `PATCH /time/end/:id`

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Time entry ID (24-character MongoDB ObjectId) |

**Request Body:**
```json
{
  "endedAt": "2024-01-15T12:00:00.000Z"
}
```

**Request Body Schema:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `endedAt` | string | Yes | End time (ISO 8601 date string) |

**Response:**
```json
{
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "startedAt": "2024-01-15T10:00:00.000Z",
    "endedAt": "2024-01-15T12:00:00.000Z",
    "project": "507f1f77bcf86cd799439011",
    "note": "Working on feature implementation",
    "hourlyRate": 50,
    "accountId": "507f1f77bcf86cd799439012",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T12:00:00.000Z"
  }
}
```

## Report Endpoints

### Get All Reports

Retrieve a paginated list of reports with optional filtering.

**Endpoint:** `GET /reports`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | number | No | Page number (default: 1) |
| `limit` | number | No | Items per page (default: 20, max: 100) |
| `sortby` | string | No | Field to sort by |
| `orderby` | string | No | Sort order: `asc` or `desc` |
| `project` | string | No | Filter by project ID |

**Response:**
```json
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "project": "507f1f77bcf86cd799439011",
      "rangeStart": "2024-01-01T00:00:00.000Z",
      "rangeEnd": "2024-01-31T23:59:59.999Z",
      "name": "January 2024 Report",
      "totalHours": 160,
      "totalEarnings": 8000,
      "accountId": "507f1f77bcf86cd799439012",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "pages": 1
  }
}
```

### Create Report

Create a new report for a specific time range and project.

**Endpoint:** `POST /reports`

**Request Body:**
```json
{
  "project": "507f1f77bcf86cd799439011",
  "rangeStart": "2024-01-01T00:00:00.000Z",
  "rangeEnd": "2024-01-31T23:59:59.999Z",
  "name": "January 2024 Report"
}
```

**Request Body Schema:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `project` | string | Yes | Project ID (24-character MongoDB ObjectId) |
| `rangeStart` | string | Yes | Start date of report range (ISO 8601 date string) |
| `rangeEnd` | string | Yes | End date of report range (ISO 8601 date string) |
| `name` | string | Yes | Report name (minimum 1 character) |

**Response:**
```json
{
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "project": "507f1f77bcf86cd799439011",
    "rangeStart": "2024-01-01T00:00:00.000Z",
    "rangeEnd": "2024-01-31T23:59:59.999Z",
    "name": "January 2024 Report",
    "totalHours": 160,
    "totalEarnings": 8000,
    "accountId": "507f1f77bcf86cd799439012",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Delete Report

Delete a report by ID.

**Endpoint:** `DELETE /reports/:id`

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Report ID (minimum 1 character) |

**Response:**
```json
{
  "message": "Report deleted successfully"
}
```

## Data Models

### Project Model

```typescript
interface Project {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  hourlyRate?: number;
  accountId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Time Entry Model

```typescript
interface TimeEntry {
  _id: string;
  startedAt: Date;
  endedAt?: Date;
  project: string; // Project ID
  note?: string;
  hourlyRate?: number;
  accountId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Report Model

```typescript
interface Report {
  _id: string;
  project: string; // Project ID
  rangeStart: Date;
  rangeEnd: Date;
  name: string;
  totalHours: number; // Computed field
  totalEarnings: number; // Computed field
  accountId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Testing

The API includes comprehensive validation using Zod schemas for all endpoints. Each request is validated against predefined schemas before processing.

### Validation Examples

**Invalid Project Creation:**
```json
{
  "name": "",
  "description": ""
}
```
**Response:**
```json
{
  "error": {
    "message": "Validation failed",
    "details": {
      "body": {
        "name": "Project name is required",
        "description": "Project description is required"
      }
    }
  }
}
```

## Rate Limiting

Currently, the API does not implement rate limiting. Consider implementing rate limiting for production use.

## Security Considerations

1. **Authentication**: Implement proper OAuth 2.0 or JWT authentication for production
2. **CORS**: Configure CORS policies for your frontend domain
3. **Input Validation**: All inputs are validated using Zod schemas
4. **Database Security**: Use MongoDB authentication and network security
5. **HTTPS**: Use HTTPS in production environments

## Support

For API support and questions, please refer to the project documentation or contact the development team.

---

**Version:** 1.0.0  
**Last Updated:** June 2025  
**Maintainer:** Aleksi Kesala 