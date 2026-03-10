package com.bluepal.dto;


import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CreateTicketCategoryRequest {
    @NotBlank(message = "Category name is required")
    private String name;

    private String description;

    @NotNull
    @Min(0)
    private Double price;

    @NotNull
    @Min(1)
    private Integer quantityTotal;
}
