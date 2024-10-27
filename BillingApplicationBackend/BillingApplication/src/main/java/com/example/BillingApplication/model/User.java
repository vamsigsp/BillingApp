package com.example.BillingApplication.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String password; // Make sure to store hashed passwords
    private String email;
    private String mobileNumber;
    private String role; // e.g., 'CUSTOMER', 'ADMIN'

    // Getters and Setters
}
