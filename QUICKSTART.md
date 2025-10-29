# Quick Start Guide

## Get the CRM Application Running in 3 Steps

### Step 1: Start the Database
```bash
docker-compose up -d
```
Wait about 10 seconds for SQL Server to fully start.

### Step 2: Start the Backend API
```bash
cd backend/CrmApi
dotnet ef database update
dotnet run
```
The API will be available at: **https://localhost:7163**

### Step 3: Start the Frontend
Open a new terminal:
```bash
cd frontend/crm-app
npm install
npm start
```
The application will open at: **http://localhost:4200**

## Using the Application

### Add Your First Customer
1. Click **"Customers"** in the top menu
2. Click **"ADD CUSTOMER"**
3. Fill in the form:
   - Name: John Doe
   - Email: john.doe@example.com
   - Phone: +1 234-567-8900
   - Address: 123 Main St, City, State
4. Click **"CREATE"**

### Create an Order
1. Click **"Orders"** in the top menu
2. Click **"ADD ORDER"**
3. Select a customer from the dropdown
4. Choose an order date
5. Enter total amount (e.g., 299.99)
6. Select status (Pending, Processing, Completed, Cancelled)
7. Add notes (optional)
8. Click **"CREATE"**

## Features to Try

- ✅ View all customers in a table
- ✅ Edit customer information
- ✅ Delete customers (note: customers with orders cannot be deleted)
- ✅ View all orders with customer names
- ✅ Edit order details
- ✅ Delete orders
- ✅ Filter orders by customer

## Troubleshooting

### Backend won't start
- Make sure SQL Server is running: `docker ps`
- Check the connection string in `backend/CrmApi/appsettings.json`

### Frontend won't build
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

### Database connection error
- Verify SQL Server container is healthy: `docker-compose ps`
- Wait a bit longer for SQL Server to fully initialize

## Stopping the Application

1. Stop frontend: `Ctrl+C` in the frontend terminal
2. Stop backend: `Ctrl+C` in the backend terminal
3. Stop database: `docker-compose down`

## API Documentation

Once the backend is running, visit:
- OpenAPI/Swagger: **https://localhost:7163/openapi/v1.json**

All API endpoints are documented there!
