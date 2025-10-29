# CRM Application

A simple Customer Relationship Management (CRM) tool built with ASP.NET Core 9 backend and Angular 19 frontend.

## Features

- **Customer Management**: Create, read, update, and delete customer records
- **Order Management**: Track orders with customer associations
- **Modern UI**: Built with Angular Material (MUI)
- **Vertical Slicing**: Backend organized by features for better maintainability
- **EF Core**: Entity Framework Core as ORM with SQL Server

## Tech Stack

### Backend
- ASP.NET Core 9 Web API
- Entity Framework Core 9
- SQL Server
- Vertical Slice Architecture

### Frontend
- Angular 19
- Angular Material (Material UI)
- Reactive Forms
- HttpClient for API communication

## Prerequisites

- .NET 9 SDK
- Node.js 20+
- Docker (for SQL Server)

## Getting Started

### 1. Start SQL Server

```bash
docker-compose up -d
```

This will start a SQL Server container on port 1433.

### 2. Run Backend

```bash
cd backend/CrmApi

# Apply migrations
dotnet ef database update

# Run the API
dotnet run
```

The API will be available at https://localhost:7163

### 3. Run Frontend

```bash
cd frontend/crm-app

# Install dependencies
npm install

# Start development server
npm start
```

The application will be available at http://localhost:4200

## Project Structure

```
.
├── backend/
│   └── CrmApi/
│       ├── Features/
│       │   ├── Customers/
│       │   │   ├── Customer.cs (Entity)
│       │   │   ├── CustomerDtos.cs (DTOs)
│       │   │   └── CustomerEndpoints.cs (API Endpoints)
│       │   └── Orders/
│       │       ├── Order.cs (Entity)
│       │       ├── OrderDtos.cs (DTOs)
│       │       └── OrderEndpoints.cs (API Endpoints)
│       ├── Data/
│       │   └── CrmDbContext.cs (EF Core DbContext)
│       └── Program.cs
├── frontend/
│   └── crm-app/
│       └── src/
│           └── app/
│               ├── components/
│               │   ├── customers/
│               │   └── orders/
│               ├── models/
│               ├── services/
│               └── app.routes.ts
└── docker-compose.yml
```

## API Endpoints

### Customers
- GET /api/customers - Get all customers
- GET /api/customers/{id} - Get customer by ID
- POST /api/customers - Create customer
- PUT /api/customers/{id} - Update customer
- DELETE /api/customers/{id} - Delete customer

### Orders
- GET /api/orders - Get all orders
- GET /api/orders/{id} - Get order by ID
- GET /api/orders/customer/{customerId} - Get orders by customer
- POST /api/orders - Create order
- PUT /api/orders/{id} - Update order
- DELETE /api/orders/{id} - Delete order

## Database Schema

### Customers Table
- Id (int, PK)
- Name (string, required)
- Email (string, required, unique)
- Phone (string, optional)
- Address (string, optional)
- CreatedAt (datetime)
- UpdatedAt (datetime, nullable)

### Orders Table
- Id (int, PK)
- CustomerId (int, FK)
- OrderNumber (string, unique)
- OrderDate (datetime)
- TotalAmount (decimal)
- Status (string: Pending, Processing, Completed, Cancelled)
- Notes (string, optional)
- CreatedAt (datetime)
- UpdatedAt (datetime, nullable)

## Default Credentials

SQL Server:
- Server: localhost,1433
- Database: CrmDb
- User: sa
- Password: YourStrong@Passw0rd

## License

MIT
