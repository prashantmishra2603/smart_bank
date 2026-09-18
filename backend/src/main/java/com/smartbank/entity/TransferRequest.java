package com.smartbank.entity;

import com.smartbank.enums.TransactionStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transfer_requests")
public class TransferRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "idempotency_key", nullable = false, unique = true, length = 100)
    private String idempotencyKey;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_account_id", nullable = false)
    private Account senderAccount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_account_id", nullable = false)
    private Account receiverAccount;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private TransactionStatus status;

    @Column(name = "transaction_reference", length = 100)
    private String transactionReference;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public TransferRequest() {}

    public TransferRequest(Long id, String idempotencyKey, Account senderAccount, Account receiverAccount, BigDecimal amount, TransactionStatus status, String transactionReference, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.idempotencyKey = idempotencyKey;
        this.senderAccount = senderAccount;
        this.receiverAccount = receiverAccount;
        this.amount = amount;
        this.status = status;
        this.transactionReference = transactionReference;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static TransferRequestBuilder builder() {
        return new TransferRequestBuilder();
    }

    public static class TransferRequestBuilder {
        private Long id;
        private String idempotencyKey;
        private Account senderAccount;
        private Account receiverAccount;
        private BigDecimal amount;
        private TransactionStatus status;
        private String transactionReference;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public TransferRequestBuilder id(Long id) { this.id = id; return this; }
        public TransferRequestBuilder idempotencyKey(String idempotencyKey) { this.idempotencyKey = idempotencyKey; return this; }
        public TransferRequestBuilder senderAccount(Account senderAccount) { this.senderAccount = senderAccount; return this; }
        public TransferRequestBuilder receiverAccount(Account receiverAccount) { this.receiverAccount = receiverAccount; return this; }
        public TransferRequestBuilder amount(BigDecimal amount) { this.amount = amount; return this; }
        public TransferRequestBuilder status(TransactionStatus status) { this.status = status; return this; }
        public TransferRequestBuilder transactionReference(String transactionReference) { this.transactionReference = transactionReference; return this; }
        public TransferRequestBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public TransferRequestBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public TransferRequest build() {
            return new TransferRequest(id, idempotencyKey, senderAccount, receiverAccount, amount, status, transactionReference, createdAt, updatedAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getIdempotencyKey() { return idempotencyKey; }
    public void setIdempotencyKey(String idempotencyKey) { this.idempotencyKey = idempotencyKey; }

    public Account getSenderAccount() { return senderAccount; }
    public void setSenderAccount(Account senderAccount) { this.senderAccount = senderAccount; }

    public Account getReceiverAccount() { return receiverAccount; }
    public void setReceiverAccount(Account receiverAccount) { this.receiverAccount = receiverAccount; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public TransactionStatus getStatus() { return status; }
    public void setStatus(TransactionStatus status) { this.status = status; }

    public String getTransactionReference() { return transactionReference; }
    public void setTransactionReference(String transactionReference) { this.transactionReference = transactionReference; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
