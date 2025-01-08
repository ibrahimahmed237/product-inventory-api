# Product Inventory API

## Overview
This API allows you to manage products in an inventory. It includes features for user authentication, product management, and database query optimization.

## Features
- User Authentication
  - Login
  - Signup
- Product Management
  - Create Product
  - Get Products
  - Get Product by ID
  - Update Product
  - Delete Product
- Database Query Optimization

## Endpoints

### Authentication
- **POST /auth/login**: Login with email and password.
- **POST /auth/signup**: Signup with email, password, and role.

### Products
- **POST /products**: Create a new product (only admins). 
- **GET /products**: Get a list of products with pagination.
- **GET /products/:id**: Get a product by ID.
- **PUT /products/:id**: Update a product by ID (only admins).
- **DELETE /products/:id**: Delete a product by ID (only admins).

## Database Query Optimization
Database query optimization strategies can be found in the `utils/queryOptimization.js` file. This includes:
- Indexing strategies
- Caching implementation
- Query optimization techniques
- High traffic handling
- Performance monitoring

## Setup
1. Clone the repository.
2. Install dependencies: `npm install`
3. Set up environment variables.
4. Start the server: `npm start`

## Environment Variables
- `MONGO_URI`: MongoDB connection string.
- `JWT_SECRET`: Secret key for JWT.
- `REDIS_URL`: Redis connection string.

## Testing
To test the API, you can import the `Product Inventory API.postman_collection.json` file into Postman. This collection includes all the API endpoints for easy testing.


