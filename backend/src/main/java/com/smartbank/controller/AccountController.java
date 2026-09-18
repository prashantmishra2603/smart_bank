package com.smartbank.controller;

import com.smartbank.dto.AccountResponse;
import com.smartbank.dto.CreateAccountRequest;
import com.smartbank.security.UserPrincipal;
import com.smartbank.service.AccountService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @PostMapping
    public ResponseEntity<AccountResponse> createAccount(@AuthenticationPrincipal UserPrincipal currentUser,
                                                         @Valid @RequestBody CreateAccountRequest request) {
        AccountResponse response = accountService.createAccount(currentUser, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<AccountResponse>> getUserAccounts(@AuthenticationPrincipal UserPrincipal currentUser) {
        List<AccountResponse> accounts = accountService.getUserAccounts(currentUser);
        return ResponseEntity.ok(accounts);
    }

    @GetMapping("/{accountId}")
    public ResponseEntity<AccountResponse> getAccountById(@AuthenticationPrincipal UserPrincipal currentUser,
                                                          @PathVariable Long accountId) {
        AccountResponse response = accountService.getAccountById(currentUser, accountId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{accountId}/balance")
    public ResponseEntity<Map<String, Object>> getAccountBalance(@AuthenticationPrincipal UserPrincipal currentUser,
                                                                 @PathVariable Long accountId) {
        BigDecimal balance = accountService.getAccountBalance(currentUser, accountId);
        return ResponseEntity.ok(Map.of(
                "accountId", accountId,
                "balance", balance,
                "currency", "INR"
        ));
    }
}
