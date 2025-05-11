# Blog Application Backend

A RESTful API backend for a blog application built with Node.js, Express, and MongoDB.

## Features

- User authentication (JWT)
- OAuth 2.0 with GitHub
- Blog post CRUD operations
- Token refresh mechanism
- Swagger API documentation
- Protected routes with middleware

## Tech Stack

- Node.js
- Express.js
- MongoDB
- JWT (JSON Web Tokens)
- Swagger/OpenAPI
- Bcrypt for password hashing

## API Documentation

Access the API documentation at: `http://localhost:4500/api-docs`

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Git

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd Blog_Client_Backend
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PORT=4500
URL="mongodb://127.0.0.1:27017/blogAppdb"
jwtSecretKey="your-secret-key"
REF_SECRET="your-refresh-secret"
CLIENT_ID="your-github-client-id"
CLIENT_SECRET="your-github-client-secret"
```

4. Start the server
```bash
npm start
```

## API Endpoints

### Users
- POST `/user/register` - Register new user
- POST `/user/login` - User login
- POST `/user/logout` - User logout
- POST `/user/refresh` - Refresh access token
- GET `/user/auth/github` - GitHub OAuth login

### Blogs
- GET `/blog` - Get all blogs
- POST `/blog/create` - Create new blog
- PATCH `/blog/update/:blogID` - Update blog
- DELETE `/blog/delete/:blogID` - Delete blog

## Authentication

The API uses JWT for authentication. Protected routes require a valid Bearer token:

```http
Authorization: <your-jwt-token>
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License