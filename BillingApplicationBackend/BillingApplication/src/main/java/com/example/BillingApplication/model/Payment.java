package com.example.BillingApplication.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "payments")
public class Payment {
    @Id
    private Long id;

    @ManyToOne
    @JoinColumn(name = "invoice_id")
    private Invoice invoice;

    private Double amount;
    private String status; // e.g., PENDING, COMPLETED

    // Getters and Setters
}

