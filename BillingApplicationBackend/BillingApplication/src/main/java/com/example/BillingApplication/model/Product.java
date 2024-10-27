package com.example.BillingApplication.model;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "products")
public class Product {
    @Id
    private Long id;

    private String name;
    private String description;
    private Double price;
    private String image;

    // Getters and Setters
}

