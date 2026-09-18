package com.smartbank.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class TransferRequestDto {

    @NotNull(message = "Sender account ID is required")
    private Long senderAccountId;

    @NotBlank(message = "Receiver account number is required")
    private String receiverAccountNumber;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "1.00", message = "Minimum transfer amount is ₹1.00")
    private BigDecimal amount;

    private String description;

    @NotBlank(message = "Idempotency key is required")
    private String idempotencyKey;

    public TransferRequestDto() {}

    public TransferRequestDto(Long senderAccountId, String receiverAccountNumber, BigDecimal amount, String description, String idempotencyKey) {
        this.senderAccountId = senderAccountId;
        this.receiverAccountNumber = receiverAccountNumber;
        this.amount = amount;
        this.description = description;
        this.idempotencyKey = idempotencyKey;
    }

    public Long getSenderAccountId() { return senderAccountId; }
    public void setSenderAccountId(Long senderAccountId) { this.senderAccountId = senderAccountId; }

    public String getReceiverAccountNumber() { return receiverAccountNumber; }
    public void setReceiverAccountNumber(String receiverAccountNumber) { this.receiverAccountNumber = receiverAccountNumber; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getIdempotencyKey() { return idempotencyKey; }
    public void setIdempotencyKey(String idempotencyKey) { this.idempotencyKey = idempotencyKey; }
}
