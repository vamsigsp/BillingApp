package com.example.BillingApplication.service;

import com.example.BillingApplication.model.Invoice;
import com.example.BillingApplication.model.InvoiceItem;
import com.example.BillingApplication.repository.InvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
public class InvoiceService {
    @Autowired
    private InvoiceRepository invoiceRepository;

    public Long generateUniqueInvoiceId() {
        Long newId;
        do {
            newId = generateRandomId();
        } while (invoiceRepository.existsById(newId));
        return newId;
    }

    private Long generateRandomId() {
        Random random = new Random();
        return (long) (100000 + random.nextInt(900000)); // Generates a random ID between 100000 and 999999
    }

    public Invoice createInvoice(Invoice invoice) {
        System.out.println("Received invoice: " + invoice);

        // Validate the invoice and its items
        if (invoice.getProducts() == null || invoice.getProducts().isEmpty()) {
            throw new IllegalArgumentException("Invoice must have at least one product.");
        }

        // Check if customer is set
        if (invoice.getCustomer() == null || invoice.getCustomer().getId() == null) {
            throw new IllegalArgumentException("Invoice must be associated with a valid customer.");
        }

        // Set the invoice reference for each item and validate product ID
        for (InvoiceItem item : invoice.getProducts()) {
            if (item.getProductId() == null) {
                throw new IllegalArgumentException("Each InvoiceItem must have a valid product ID.");
            }
            item.setInvoice(invoice); // Set the reference to the invoice
        }

        // Generate a unique invoice ID
        invoice.setId(generateUniqueInvoiceId());

        // Set status to "Pending" by default
        invoice.setStatus("Paid");

        // Calculate the total amount for the invoice
        invoice.calculateTotalAmount();

        // Save the invoice and return
        return invoiceRepository.save(invoice);
    }

    public Invoice getInvoiceById(Long id) {
        return invoiceRepository.findById(id).orElse(null);
    }

    public void deleteInvoice(Long id) {
        invoiceRepository.deleteById(id);
    }

    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }
}
