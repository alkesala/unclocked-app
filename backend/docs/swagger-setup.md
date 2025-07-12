# Swagger API Documentation

## Overview

The Unclocked App Backend includes comprehensive Swagger/OpenAPI documentation that provides an interactive interface for exploring and testing the API endpoints.

## Accessing the Documentation

### Development Environment

Once the backend server is running, you can access the Swagger documentation at:

```
http://localhost:3000/api-docs
```

### Production Environment

The Swagger documentation will be available at:

```
https://your-domain.com/api-docs
```

## Features

### Interactive API Explorer

- **Try it out**: Test API endpoints directly from the browser
- **Request/Response examples**: See real examples of requests and responses
- **Authentication**: Configure Bearer token authentication
- **Schema validation**: Automatic validation of request bodies
- **Response codes**: Detailed information about all possible response codes

### Organized by Tags

The API endpoints are organized into the following categories:

- **Status**: Health check and authentication test endpoints
- **Projects**: Project management endpoints (GET, POST)
- **Time Entries**: Time tracking endpoints (GET, POST, DELETE, PATCH)
- **Reports**: Reporting endpoints (GET, POST, DELETE)

### Authentication

To test authenticated endpoints:

1. Click the "Authorize" button at the top of the page
2. Enter your Bearer token in the format: `Bearer <your-token>`
3. Click "Authorize"
4. All subsequent requests will include the authentication header

### Request Examples

Each endpoint includes:
- **Request body schemas** with field descriptions and validation rules
- **Query parameters** for filtering and pagination
- **Path parameters** for resource identification
- **Response schemas** showing the exact structure of responses

### Response Codes

The documentation includes detailed information about all possible HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## Development

### Adding New Endpoints

To add Swagger documentation for new endpoints:

1. Add JSDoc comments above your route definitions
2. Use the `@swagger` annotation
3. Reference existing schemas from `src/config/swagger.ts`
4. Define new schemas in the swagger configuration if needed

### Example JSDoc Comment

```typescript
/**
 * @swagger
 * /your-endpoint:
 *   get:
 *     summary: Brief description
 *     description: Detailed description
 *     tags: [Your Tag]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/yourParameter'
 *     responses:
 *       200:
 *         description: Success response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/YourResponse'
 */
```

### Updating Schemas

To add new data models or update existing ones:

1. Edit `src/config/swagger.ts`
2. Add new schemas to the `components.schemas` section
3. Reference them in your JSDoc comments using `$ref: '#/components/schemas/SchemaName'`

## Benefits

### For Developers

- **Self-documenting API**: Documentation is always in sync with the code
- **Interactive testing**: No need for external tools like Postman
- **Schema validation**: Automatic validation of request/response formats
- **Code generation**: Can generate client SDKs from the OpenAPI spec

### For API Consumers

- **Clear documentation**: Easy to understand what each endpoint does
- **Try before integrate**: Test endpoints before implementing
- **Example data**: See exactly what data to send and receive
- **Error handling**: Understand all possible error scenarios

## Exporting OpenAPI Specification

You can also access the raw OpenAPI specification at:

```
http://localhost:3000/api-docs/swagger.json
```

This can be used to:
- Generate client libraries
- Import into other API documentation tools
- Share with external developers
- Version control the API specification

## Customization

The Swagger UI can be customized by modifying the setup options in `src/index.ts`:

```typescript
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Unclocked App API Documentation",
  // Add more customization options here
}))
```

## Security Note

In production environments, consider:
- Disabling Swagger UI in production
- Adding authentication to the documentation endpoint
- Limiting access to the API specification
- Using environment-specific configurations

---

**Note**: The Swagger documentation is automatically generated from JSDoc comments in your route files. Keep the documentation up to date by maintaining these comments as you add or modify endpoints. 