package com.smartbank.controller;

import com.smartbank.dto.AccountResponse;
import com.smartbank.dto.AdminDashboardStats;
import com.smartbank.dto.TransactionResponse;
import com.smartbank.entity.User;
import com.smartbank.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardStats> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/accounts")
    public ResponseEntity<List<AccountResponse>> getAllAccounts() {
        return ResponseEntity.ok(adminService.getAllAccounts());
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<TransactionResponse>> getAllTransactions() {
        return ResponseEntity.ok(adminService.getAllTransactions());
    }

    @PatchMapping("/accounts/{accountId}/freeze")
    public ResponseEntity<AccountResponse> freezeAccount(@PathVariable Long accountId) {
        return ResponseEntity.ok(adminService.freezeAccount(accountId));
    }

    @PatchMapping("/accounts/{accountId}/unfreeze")
    public ResponseEntity<AccountResponse> unfreezeAccount(@PathVariable Long accountId) {
        return ResponseEntity.ok(adminService.unfreezeAccount(accountId));
    }

    @PatchMapping("/users/{userId}/activate")
    public ResponseEntity<User> activateUser(@PathVariable Long userId) {
        return ResponseEntity.ok(adminService.activateUser(userId));
    }

    @PatchMapping("/users/{userId}/deactivate")
    public ResponseEntity<User> deactivateUser(@PathVariable Long userId) {
        return ResponseEntity.ok(adminService.deactivateUser(userId));
    }
}
