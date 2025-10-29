using Microsoft.EntityFrameworkCore;
using CrmApi.Data;

namespace CrmApi.Features.Orders;

public static class OrderEndpoints
{
    public static void MapOrderEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/orders").WithTags("Orders");

        group.MapGet("/", GetAllOrders);
        group.MapGet("/{id}", GetOrderById);
        group.MapGet("/customer/{customerId}", GetOrdersByCustomer);
        group.MapPost("/", CreateOrder);
        group.MapPut("/{id}", UpdateOrder);
        group.MapDelete("/{id}", DeleteOrder);
    }

    private static async Task<IResult> GetAllOrders(CrmDbContext db)
    {
        var orders = await db.Orders
            .Include(o => o.Customer)
            .OrderByDescending(o => o.OrderDate)
            .Select(o => new OrderDto(
                o.Id,
                o.CustomerId,
                o.Customer.Name,
                o.OrderNumber,
                o.OrderDate,
                o.TotalAmount,
                o.Status,
                o.Notes,
                o.CreatedAt,
                o.UpdatedAt
            ))
            .ToListAsync();

        return Results.Ok(orders);
    }

    private static async Task<IResult> GetOrderById(int id, CrmDbContext db)
    {
        var order = await db.Orders
            .Include(o => o.Customer)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
            return Results.NotFound(new { message = "Order not found" });

        var dto = new OrderDto(
            order.Id,
            order.CustomerId,
            order.Customer.Name,
            order.OrderNumber,
            order.OrderDate,
            order.TotalAmount,
            order.Status,
            order.Notes,
            order.CreatedAt,
            order.UpdatedAt
        );

        return Results.Ok(dto);
    }

    private static async Task<IResult> GetOrdersByCustomer(int customerId, CrmDbContext db)
    {
        var orders = await db.Orders
            .Include(o => o.Customer)
            .Where(o => o.CustomerId == customerId)
            .OrderByDescending(o => o.OrderDate)
            .Select(o => new OrderDto(
                o.Id,
                o.CustomerId,
                o.Customer.Name,
                o.OrderNumber,
                o.OrderDate,
                o.TotalAmount,
                o.Status,
                o.Notes,
                o.CreatedAt,
                o.UpdatedAt
            ))
            .ToListAsync();

        return Results.Ok(orders);
    }

    private static async Task<IResult> CreateOrder(CreateOrderDto dto, CrmDbContext db)
    {
        // Check if customer exists
        var customerExists = await db.Customers.AnyAsync(c => c.Id == dto.CustomerId);
        if (!customerExists)
            return Results.BadRequest(new { message = "Customer not found" });

        // Generate order number
        var orderNumber = $"ORD-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..8].ToUpper()}";

        var order = new Order
        {
            CustomerId = dto.CustomerId,
            OrderNumber = orderNumber,
            OrderDate = dto.OrderDate,
            TotalAmount = dto.TotalAmount,
            Status = dto.Status,
            Notes = dto.Notes,
            CreatedAt = DateTime.UtcNow
        };

        db.Orders.Add(order);
        await db.SaveChangesAsync();

        // Reload with customer info
        await db.Entry(order).Reference(o => o.Customer).LoadAsync();

        var result = new OrderDto(
            order.Id,
            order.CustomerId,
            order.Customer.Name,
            order.OrderNumber,
            order.OrderDate,
            order.TotalAmount,
            order.Status,
            order.Notes,
            order.CreatedAt,
            order.UpdatedAt
        );

        return Results.Created($"/api/orders/{order.Id}", result);
    }

    private static async Task<IResult> UpdateOrder(int id, UpdateOrderDto dto, CrmDbContext db)
    {
        var order = await db.Orders.Include(o => o.Customer).FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
            return Results.NotFound(new { message = "Order not found" });

        order.OrderDate = dto.OrderDate;
        order.TotalAmount = dto.TotalAmount;
        order.Status = dto.Status;
        order.Notes = dto.Notes;
        order.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();

        var result = new OrderDto(
            order.Id,
            order.CustomerId,
            order.Customer.Name,
            order.OrderNumber,
            order.OrderDate,
            order.TotalAmount,
            order.Status,
            order.Notes,
            order.CreatedAt,
            order.UpdatedAt
        );

        return Results.Ok(result);
    }

    private static async Task<IResult> DeleteOrder(int id, CrmDbContext db)
    {
        var order = await db.Orders.FindAsync(id);

        if (order == null)
            return Results.NotFound(new { message = "Order not found" });

        db.Orders.Remove(order);
        await db.SaveChangesAsync();

        return Results.NoContent();
    }
}
