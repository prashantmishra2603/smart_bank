package com.smartbank.dto;

import com.smartbank.enums.AccountStatus;
import com.smartbank.enums.AccountType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class AccountResponse {
    private Long id;
    private String accountNumber;
    private Long userId;
    private AccountType accountType;
    private BigDecimal balance;
    private String currency;
    private AccountStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public AccountResponse() {}

    public AccountResponse(Long id, String accountNumber, Long userId, AccountType accountType, BigDecimal balance, String currency, AccountStatus status, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.accountNumber = accountNumber;
        this.userId = userId;
        this.accountType = accountType;
        this.balance = balance;
        this.currency = currency;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static AccountResponseBuilder builder() {
        return new AccountResponseBuilder();
    }

    public static class AccountResponseBuilder {
        private Long id;
        private String accountNumber;
        private Long userId;
        private AccountType accountType;
        private BigDecimal balance;
        private String currency;
        private AccountStatus status;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public AccountResponseBuilder id(Long id) { this.id = id; return this; }
        public AccountResponseBuilder accountNumber(String accountNumber) { this.accountNumber = accountNumber; return this; }
        public AccountResponseBuilder userId(Long userId) { this.userId = userId; return this; }
        public AccountResponseBuilder accountType(AccountType accountType) { this.accountType = accountType; return this; }
        public AccountResponseBuilder balance(BigDecimal balance) { this.balance = balance; return this; }
        public AccountResponseBuilder currency(String currency) { this.currency = currency; return this; }
        public AccountResponseBuilder status(AccountStatus status) { this.status = status; return this; }
        public AccountResponseBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public AccountResponseBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public AccountResponse build() {
            return new AccountResponse(id, accountNumber, userId, accountType, balance, currency, status, createdAt, updatedAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public AccountType getAccountType() { return accountType; }
    public void setAccountType(AccountType accountType) { this.accountType = accountType; }

    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public AccountStatus getStatus() { return status; }
    public void setStatus(AccountStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
