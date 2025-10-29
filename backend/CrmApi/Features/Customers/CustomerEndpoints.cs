using Microsoft.EntityFrameworkCore;
using CrmApi.Data;

namespace CrmApi.Features.Customers;

public static class CustomerEndpoints
{
    public static void MapCustomerEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/customers").WithTags("Customers");

        group.MapGet("/", GetAllCustomers);
        group.MapGet("/{id}", GetCustomerById);
        group.MapPost("/", CreateCustomer);
        group.MapPut("/{id}", UpdateCustomer);
        group.MapDelete("/{id}", DeleteCustomer);
    }

    private static async Task<IResult> GetAllCustomers(CrmDbContext db)
    {
        var customers = await db.Customers
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new CustomerDto(
                c.Id,
                c.Name,
                c.Email,
                c.Phone,
                c.Address,
                c.CreatedAt,
                c.UpdatedAt
            ))
            .ToListAsync();

        return Results.Ok(customers);
    }

    private static async Task<IResult> GetCustomerById(int id, CrmDbContext db)
    {
        var customer = await db.Customers.FindAsync(id);

        if (customer == null)
            return Results.NotFound(new { message = "Customer not found" });

        var dto = new CustomerDto(
            customer.Id,
            customer.Name,
            customer.Email,
            customer.Phone,
            customer.Address,
            customer.CreatedAt,
            customer.UpdatedAt
        );

        return Results.Ok(dto);
    }

    private static async Task<IResult> CreateCustomer(CreateCustomerDto dto, CrmDbContext db)
    {
        // Check if email already exists
        if (await db.Customers.AnyAsync(c => c.Email == dto.Email))
            return Results.BadRequest(new { message = "A customer with this email already exists" });

        var customer = new Customer
        {
            Name = dto.Name,
            Email = dto.Email,
            Phone = dto.Phone,
            Address = dto.Address,
            CreatedAt = DateTime.UtcNow
        };

        db.Customers.Add(customer);
        await db.SaveChangesAsync();

        var result = new CustomerDto(
            customer.Id,
            customer.Name,
            customer.Email,
            customer.Phone,
            customer.Address,
            customer.CreatedAt,
            customer.UpdatedAt
        );

        return Results.Created($"/api/customers/{customer.Id}", result);
    }

    private static async Task<IResult> UpdateCustomer(int id, UpdateCustomerDto dto, CrmDbContext db)
    {
        var customer = await db.Customers.FindAsync(id);

        if (customer == null)
            return Results.NotFound(new { message = "Customer not found" });

        // Check if email already exists for another customer
        if (await db.Customers.AnyAsync(c => c.Email == dto.Email && c.Id != id))
            return Results.BadRequest(new { message = "A customer with this email already exists" });

        customer.Name = dto.Name;
        customer.Email = dto.Email;
        customer.Phone = dto.Phone;
        customer.Address = dto.Address;
        customer.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();

        var result = new CustomerDto(
            customer.Id,
            customer.Name,
            customer.Email,
            customer.Phone,
            customer.Address,
            customer.CreatedAt,
            customer.UpdatedAt
        );

        return Results.Ok(result);
    }

    private static async Task<IResult> DeleteCustomer(int id, CrmDbContext db)
    {
        var customer = await db.Customers.Include(c => c.Orders).FirstOrDefaultAsync(c => c.Id == id);

        if (customer == null)
            return Results.NotFound(new { message = "Customer not found" });

        // Check if customer has orders
        if (customer.Orders.Any())
            return Results.BadRequest(new { message = "Cannot delete customer with existing orders" });

        db.Customers.Remove(customer);
        await db.SaveChangesAsync();

        return Results.NoContent();
    }
}
