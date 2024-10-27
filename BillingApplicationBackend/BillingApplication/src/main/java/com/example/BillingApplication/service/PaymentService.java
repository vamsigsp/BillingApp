package com.example.BillingApplication.service;

import com.example.BillingApplication.model.Payment;
import com.example.BillingApplication.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
public class PaymentService {
    @Autowired
    private PaymentRepository paymentRepository;
    public Long generateUniquePaymentId() {
        Long newId;
        do {
            newId = generateRandomId();
        } while (paymentRepository.existsById(newId)); // Check for uniqueness
        return newId;
    }

    private Long generateRandomId() {
        Random random = new Random();
        return (long) (100000 + random.nextInt(900000)); // Generate a number between 100000 and 999999
    }

    public List<Payment> getPayments() {
        return paymentRepository.findAll();
    }

    public Payment recordPayment(Payment payment) {
        payment.setId(generateUniquePaymentId());
        return paymentRepository.save(payment);
    }
}

