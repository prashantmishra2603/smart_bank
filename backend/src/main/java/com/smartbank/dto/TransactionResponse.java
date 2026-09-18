package com.smartbank.dto;

import com.smartbank.enums.TransactionStatus;
import com.smartbank.enums.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TransactionResponse {
    private Long id;
    private String transactionReference;
    private Long accountId;
    private String accountNumber;
    private TransactionType transactionType;
    private BigDecimal amount;
    private BigDecimal balanceBefore;
    private BigDecimal balanceAfter;
    private Long relatedAccountId;
    private String relatedAccountNumber;
    private String description;
    private TransactionStatus status;
    private String idempotencyKey;
    private LocalDateTime createdAt;

    public TransactionResponse() {}

    public TransactionResponse(Long id, String transactionReference, Long accountId, String accountNumber, TransactionType transactionType, BigDecimal amount, BigDecimal balanceBefore, BigDecimal balanceAfter, Long relatedAccountId, String relatedAccountNumber, String description, TransactionStatus status, String idempotencyKey, LocalDateTime createdAt) {
        this.id = id;
        this.transactionReference = transactionReference;
        this.accountId = accountId;
        this.accountNumber = accountNumber;
        this.transactionType = transactionType;
        this.amount = amount;
        this.balanceBefore = balanceBefore;
        this.balanceAfter = balanceAfter;
        this.relatedAccountId = relatedAccountId;
        this.relatedAccountNumber = relatedAccountNumber;
        this.description = description;
        this.status = status;
        this.idempotencyKey = idempotencyKey;
        this.createdAt = createdAt;
    }

    public static TransactionResponseBuilder builder() {
        return new TransactionResponseBuilder();
    }

    public static class TransactionResponseBuilder {
        private Long id;
        private String transactionReference;
        private Long accountId;
        private String accountNumber;
        private TransactionType transactionType;
        private BigDecimal amount;
        private BigDecimal balanceBefore;
        private BigDecimal balanceAfter;
        private Long relatedAccountId;
        private String relatedAccountNumber;
        private String description;
        private TransactionStatus status;
        private String idempotencyKey;
        private LocalDateTime createdAt;

        public TransactionResponseBuilder id(Long id) { this.id = id; return this; }
        public TransactionResponseBuilder transactionReference(String transactionReference) { this.transactionReference = transactionReference; return this; }
        public TransactionResponseBuilder accountId(Long accountId) { this.accountId = accountId; return this; }
        public TransactionResponseBuilder accountNumber(String accountNumber) { this.accountNumber = accountNumber; return this; }
        public TransactionResponseBuilder transactionType(TransactionType transactionType) { this.transactionType = transactionType; return this; }
        public TransactionResponseBuilder amount(BigDecimal amount) { this.amount = amount; return this; }
        public TransactionResponseBuilder balanceBefore(BigDecimal balanceBefore) { this.balanceBefore = balanceBefore; return this; }
        public TransactionResponseBuilder balanceAfter(BigDecimal balanceAfter) { this.balanceAfter = balanceAfter; return this; }
        public TransactionResponseBuilder relatedAccountId(Long relatedAccountId) { this.relatedAccountId = relatedAccountId; return this; }
        public TransactionResponseBuilder relatedAccountNumber(String relatedAccountNumber) { this.relatedAccountNumber = relatedAccountNumber; return this; }
        public TransactionResponseBuilder description(String description) { this.description = description; return this; }
        public TransactionResponseBuilder status(TransactionStatus status) { this.status = status; return this; }
        public TransactionResponseBuilder idempotencyKey(String idempotencyKey) { this.idempotencyKey = idempotencyKey; return this; }
        public TransactionResponseBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public TransactionResponse build() {
            return new TransactionResponse(id, transactionReference, accountId, accountNumber, transactionType, amount, balanceBefore, balanceAfter, relatedAccountId, relatedAccountNumber, description, status, idempotencyKey, createdAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTransactionReference() { return transactionReference; }
    public void setTransactionReference(String transactionReference) { this.transactionReference = transactionReference; }

    public Long getAccountId() { return accountId; }
    public void setAccountId(Long accountId) { this.accountId = accountId; }

    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }

    public TransactionType getTransactionType() { return transactionType; }
    public void setTransactionType(TransactionType transactionType) { this.transactionType = transactionType; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public BigDecimal getBalanceBefore() { return balanceBefore; }
    public void setBalanceBefore(BigDecimal balanceBefore) { this.balanceBefore = balanceBefore; }

    public BigDecimal getBalanceAfter() { return balanceAfter; }
    public void setBalanceAfter(BigDecimal balanceAfter) { this.balanceAfter = balanceAfter; }

    public Long getRelatedAccountId() { return relatedAccountId; }
    public void setRelatedAccountId(Long relatedAccountId) { this.relatedAccountId = relatedAccountId; }

    public String getRelatedAccountNumber() { return relatedAccountNumber; }
    public void setRelatedAccountNumber(String relatedAccountNumber) { this.relatedAccountNumber = relatedAccountNumber; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public TransactionStatus getStatus() { return status; }
    public void setStatus(TransactionStatus status) { this.status = status; }

    public String getIdempotencyKey() { return idempotencyKey; }
    public void setIdempotencyKey(String idempotencyKey) { this.idempotencyKey = idempotencyKey; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
