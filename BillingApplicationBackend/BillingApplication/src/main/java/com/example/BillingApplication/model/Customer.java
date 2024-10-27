package com.example.BillingApplication.model;

import jakarta.persistence.*;
import lombok.Data;


@Entity
@Data
@Table(name = "customers")
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String mobileNumber;

    // Getters and Setters
}
