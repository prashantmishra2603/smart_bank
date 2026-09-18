package com.smartbank.controller;

import com.smartbank.dto.TransactionResponse;
import com.smartbank.dto.TransferRequestDto;
import com.smartbank.security.UserPrincipal;
import com.smartbank.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transfers")
public class TransferController {

    private final TransactionService transactionService;

    public TransferController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping
    public ResponseEntity<TransactionResponse> transfer(@AuthenticationPrincipal UserPrincipal currentUser,
                                                        @Valid @RequestBody TransferRequestDto request) {
        TransactionResponse response = transactionService.transfer(currentUser, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{reference}")
    public ResponseEntity<TransactionResponse> getTransferByReference(@AuthenticationPrincipal UserPrincipal currentUser,
                                                                       @PathVariable String reference) {
        TransactionResponse response = transactionService.getTransactionByReference(currentUser, reference);
        return ResponseEntity.ok(response);
    }
}
