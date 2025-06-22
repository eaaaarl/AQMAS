# AQMAS Backend - Refactored Architecture

This is a refactored version of the AQMAS backend application implementing Clean Architecture principles and best practices while maintaining full API compatibility.

## 🏗️ Architecture Overview

The application follows **Clean Architecture** principles with the following layers:

### Core Layer
- **Interfaces**: Define contracts for repositories, services, and controllers
- **Base Classes**: Provide common functionality for CRUD operations
- **Configuration**: Centralized configuration management

### Infrastructure Layer
- **Database**: Knex.js database connection and configuration
- **Express Server**: HTTP server setup with middleware
- **Middleware**: Security, logging, and error handling

### Application Layer
- **Controllers**: Handle HTTP requests and responses
- **Services**: Business logic implementation
- **Repositories**: Data access layer

## 📁 Project Structure

```
src/
├── core/                          # Core application layer
│   ├── base/                      # Base classes for common functionality
│   │   ├── base.controller.ts
│   │   ├── base.repository.ts
│   │   └── base.service.ts
│   ├── config/                    # Configuration management
│   │   └── app.config.ts
│   ├── container/                 # Dependency injection
│   │   └── dependency.container.ts
│   └── interfaces/                # Interface definitions
│       ├── controller.interface.ts
│       ├── repository.interface.ts
│       └── service.interface.ts
├── infrastructure/                # Infrastructure layer
│   ├── database/                  # Database configuration
│   ├── express-server/            # HTTP server setup
│   └── middleware/                # Express middleware
├── libs/                          # Shared utilities
├── service/                       # Service module
├── config/                        # Config module
├── queue/                         # Queue module
├── customer/                      # Customer module
└── index.ts                       # Application entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MySQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=aqmas
   DB_USER=root
   DB_PASSWORD=your_password
   DB_CONNECTION_LIMIT=10

   # Server Configuration
   PORT=3005
   HOST=0.0.0.0
   NODE_ENV=development
   CORS_ORIGIN=*
   ```

4. **Database Setup**
   Ensure your MySQL database is running and the `aqmas` database exists.

5. **Run the application**
   ```bash
   # Development mode
   npm run dev

   # Production build
   npm run build
   npm start
   ```

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the application for production
- `npm start` - Start the production server

## 📡 API Endpoints

All existing API endpoints remain unchanged to maintain compatibility:

### Service Module
- `GET /service` - Get all services

### Config Module
- `GET /config` - Get all configurations

### Queue Module
- `POST /queue` - Create a new queue
- `POST /queue/detail` - Create queue details
- `GET /queue/count` - Count queues by date and type
- `GET /queue/allservicecount` - Count all service queues
- `GET /queue/byservicecount/:service_id` - Count queues by service

### Customer Module
- `GET /customer/alltype` - Get all customer types

### Health Check
- `GET /health` - Application health status

## 🛡️ Security Features

- **Helmet.js**: Security headers
- **CORS**: Configurable cross-origin resource sharing
- **Input Validation**: Zod schema validation
- **Error Handling**: Centralized error management
- **Request Logging**: Comprehensive request/response logging

## 🔄 Dependency Injection

The application uses a singleton dependency injection container to manage all dependencies:

```typescript
import { container } from './core/container/dependency.container';

// Get a controller
const serviceController = container.getController('service');

// Get a service
const queueService = container.getService('queue');

// Get a repository
const customerRepository = container.getRepository('customer');
```

## 🧪 Testing

The refactored architecture makes testing easier with:

- **Interface-based design** for easy mocking
- **Dependency injection** for test isolation
- **Base classes** for common test scenarios
- **Separation of concerns** for unit testing

## 📊 Monitoring

- **Health Check Endpoint**: `/health`
- **Request Logging**: All requests are logged in development
- **Error Tracking**: Centralized error handling with detailed logging
- **Performance Monitoring**: Request duration tracking

## 🔧 Configuration

All configuration is centralized in `src/core/config/app.config.ts`:

```typescript
export const appConfig: AppConfig = {
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    // ... other database config
  },
  server: {
    port: parseInt(process.env.PORT || '3005'),
    host: process.env.HOST || '0.0.0.0',
    // ... other server config
  },
};
```

## 🚨 Error Handling

The application uses a centralized error handling system:

- **Custom Error Classes**: Specific error types for different scenarios
- **Global Error Handler**: Catches all unhandled errors
- **Validation Errors**: Proper handling of input validation errors
- **Database Errors**: Specific handling of database-related errors

## 📈 Performance

- **Connection Pooling**: Database connection pooling for better performance
- **Request Logging**: Performance monitoring through request duration tracking
- **Error Boundaries**: Graceful error handling to prevent crashes
- **Memory Management**: Proper cleanup and resource management

## 🔄 Migration from Old Architecture

The refactored architecture maintains **100% API compatibility** with the original implementation:

- ✅ Same endpoint URLs
- ✅ Same request/response formats
- ✅ Same database queries
- ✅ Same business logic

### What Changed
- **Architecture**: Clean Architecture implementation
- **Code Organization**: Better separation of concerns
- **Error Handling**: Improved error management
- **Security**: Enhanced security measures
- **Maintainability**: More maintainable and testable code

### What Stayed the Same
- **API Endpoints**: All endpoints remain unchanged
- **Response Format**: All responses maintain the same structure
- **Database Schema**: No database changes required
- **Business Logic**: Core business logic remains the same

## 🤝 Contributing

1. Follow the established architecture patterns
2. Use the base classes for new modules
3. Implement interfaces for new functionality
4. Add proper error handling
5. Include tests for new features
6. Update documentation as needed

## 📝 License

This project is licensed under the ISC License. 