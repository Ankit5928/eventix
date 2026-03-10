package com.bluepal.modal;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {
    @Id
    private UUID id = UUID.randomUUID();

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    private UUID ticketCategoryId;
    private Integer quantity;
    private Double pricePaid;
    private Double subtotal;
}