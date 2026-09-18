package com.smartbank.controller;

import com.smartbank.dto.DepositRequest;
import com.smartbank.dto.TransactionResponse;
import com.smartbank.dto.WithdrawRequest;
import com.smartbank.security.UserPrincipal;
import com.smartbank.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts/{accountId}")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping("/deposit")
    public ResponseEntity<TransactionResponse> deposit(@AuthenticationPrincipal UserPrincipal currentUser,
                                                       @PathVariable Long accountId,
                                                       @Valid @RequestBody DepositRequest request) {
        TransactionResponse response = transactionService.deposit(currentUser, accountId, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/withdraw")
    public ResponseEntity<TransactionResponse> withdraw(@AuthenticationPrincipal UserPrincipal currentUser,
                                                        @PathVariable Long accountId,
                                                        @Valid @RequestBody WithdrawRequest request) {
        TransactionResponse response = transactionService.withdraw(currentUser, accountId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<TransactionResponse>> getTransactions(@AuthenticationPrincipal UserPrincipal currentUser,
                                                                     @PathVariable Long accountId) {
        List<TransactionResponse> response = transactionService.getAccountTransactions(currentUser, accountId);
        return ResponseEntity.ok(response);
    }
}
