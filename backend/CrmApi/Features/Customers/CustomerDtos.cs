namespace CrmApi.Features.Customers;

public record CustomerDto(
    int Id,
    string Name,
    string Email,
    string? Phone,
    string? Address,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);

public record CreateCustomerDto(
    string Name,
    string Email,
    string? Phone,
    string? Address
);

public record UpdateCustomerDto(
    string Name,
    string Email,
    string? Phone,
    string? Address
);
