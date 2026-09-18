package com.smartbank.dto;

import com.smartbank.enums.AccountType;
import jakarta.validation.constraints.NotNull;

public class CreateAccountRequest {

    @NotNull(message = "Account type is required")
    private AccountType accountType;

    private String currency = "INR";

    public CreateAccountRequest() {}

    public CreateAccountRequest(AccountType accountType, String currency) {
        this.accountType = accountType;
        this.currency = currency;
    }

    public AccountType getAccountType() { return accountType; }
    public void setAccountType(AccountType accountType) { this.accountType = accountType; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
}
