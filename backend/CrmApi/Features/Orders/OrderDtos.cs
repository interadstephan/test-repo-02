namespace CrmApi.Features.Orders;

public record OrderDto(
    int Id,
    int CustomerId,
    string CustomerName,
    string OrderNumber,
    DateTime OrderDate,
    decimal TotalAmount,
    string Status,
    string? Notes,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);

public record CreateOrderDto(
    int CustomerId,
    DateTime OrderDate,
    decimal TotalAmount,
    string Status,
    string? Notes
);

public record UpdateOrderDto(
    DateTime OrderDate,
    decimal TotalAmount,
    string Status,
    string? Notes
);
