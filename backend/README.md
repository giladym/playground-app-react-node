# Backend API

A RESTful API built with Express.js, TypeScript, and MongoDB.

## Features

- Authentication with JWT
- Role-based access control
- CRUD operations for profiles, organizations, and features
- Input validation with Zod
- Error handling middleware
- TypeScript for type safety
- MongoDB with Mongoose for data persistence

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4 or higher)
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/playground-app
   JWT_SECRET=your-secret-key
   JWT_EXPIRES_IN=1d
   NODE_ENV=development
   ```

## Development

Start the development server:
```bash
npm run dev
```

## Build

Build the project:
```bash
npm run build
```

## Production

Start the production server:
```bash
npm start
```

## API Documentation

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user's profile

### Profiles

- `GET /api/profiles` - Get all profiles
- `GET /api/profiles/:id` - Get a specific profile
- `GET /api/profiles/user/:userId` - Get profile by user ID
- `GET /api/profiles/organization/:organizationId` - Get profiles by organization
- `POST /api/profiles` - Create a new profile
- `PUT /api/profiles/:id` - Update a profile
- `PATCH /api/profiles/:id/image` - Update profile image
- `PATCH /api/profiles/:id/phone` - Update profile phone
- `PATCH /api/profiles/:id/organization` - Update profile organization

### Organizations

- `GET /api/organizations` - Get all organizations
- `GET /api/organizations/:id` - Get a specific organization
- `GET /api/organizations/active` - Get active organizations
- `GET /api/organizations/:id/members` - Get organization members
- `POST /api/organizations` - Create a new organization (admin only)
- `PUT /api/organizations/:id` - Update an organization (admin only)
- `PATCH /api/organizations/:id/status` - Update organization status (admin only)
- `POST /api/organizations/:id/members` - Add member to organization (admin only)
- `DELETE /api/organizations/:id/members/:userId` - Remove member from organization (admin only)

### Features

- `GET /api/features` - Get all features
- `GET /api/features/:id` - Get a specific feature
- `GET /api/features/active` - Get active features
- `GET /api/features/type/:type` - Get features by type
- `POST /api/features` - Create a new feature (admin only)
- `PUT /api/features/:id` - Update a feature (admin only)
- `PATCH /api/features/:id/status` - Update feature status (admin only)
- `PATCH /api/features/:id/config` - Update feature config (admin only)

## Error Handling

The API uses standard HTTP status codes and returns error messages in the following format:

```json
{
  "message": "Error message",
  "errors": [] // Optional validation errors
}
```

Common status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error 