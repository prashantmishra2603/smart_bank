package com.smartbank.service;

import com.smartbank.dto.AccountResponse;
import com.smartbank.dto.AdminDashboardStats;
import com.smartbank.dto.TransactionResponse;
import com.smartbank.entity.Account;
import com.smartbank.entity.Transaction;
import com.smartbank.entity.User;
import com.smartbank.enums.AccountStatus;
import com.smartbank.enums.TransactionType;
import com.smartbank.exception.ResourceNotFoundException;
import com.smartbank.repository.AccountRepository;
import com.smartbank.repository.TransactionRepository;
import com.smartbank.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final AccountService accountService;

    public AdminService(UserRepository userRepository, AccountRepository accountRepository, TransactionRepository transactionRepository, AccountService accountService) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
        this.accountService = accountService;
    }

    @Transactional(readOnly = true)
    public AdminDashboardStats getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalAccounts = accountRepository.count();
        long totalTransactions = transactionRepository.count();

        List<Transaction> transactions = transactionRepository.findAll();

        BigDecimal depositsVolume = transactions.stream()
                .filter(t -> t.getTransactionType() == TransactionType.DEPOSIT)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal withdrawalsVolume = transactions.stream()
                .filter(t -> t.getTransactionType() == TransactionType.WITHDRAWAL)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal transfersVolume = transactions.stream()
                .filter(t -> t.getTransactionType() == TransactionType.TRANSFER)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long frozenAccounts = accountRepository.findAll().stream()
                .filter(a -> a.getStatus() == AccountStatus.FROZEN)
                .count();

        return AdminDashboardStats.builder()
                .totalUsers(totalUsers)
                .totalAccounts(totalAccounts)
                .totalTransactions(totalTransactions)
                .totalDepositsVolume(depositsVolume)
                .totalWithdrawalsVolume(withdrawalsVolume)
                .totalTransfersVolume(transfersVolume)
                .frozenAccountsCount(frozenAccounts)
                .build();
    }

    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<AccountResponse> getAllAccounts() {
        return accountRepository.findAll().stream()
                .map(accountService::mapToAccountResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TransactionResponse> getAllTransactions() {
        return transactionRepository.findAll().stream()
                .map(txn -> TransactionResponse.builder()
                        .id(txn.getId())
                        .transactionReference(txn.getTransactionReference())
                        .accountId(txn.getAccount().getId())
                        .accountNumber(txn.getAccount().getAccountNumber())
                        .transactionType(txn.getTransactionType())
                        .amount(txn.getAmount())
                        .balanceBefore(txn.getBalanceBefore())
                        .balanceAfter(txn.getBalanceAfter())
                        .relatedAccountId(txn.getRelatedAccount() != null ? txn.getRelatedAccount().getId() : null)
                        .relatedAccountNumber(txn.getRelatedAccount() != null ? txn.getRelatedAccount().getAccountNumber() : null)
                        .description(txn.getDescription())
                        .status(txn.getStatus())
                        .idempotencyKey(txn.getIdempotencyKey())
                        .createdAt(txn.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public AccountResponse freezeAccount(Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with ID: " + accountId));
        account.setStatus(AccountStatus.FROZEN);
        Account updated = accountRepository.save(account);
        return accountService.mapToAccountResponse(updated);
    }

    @Transactional
    public AccountResponse unfreezeAccount(Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with ID: " + accountId));
        account.setStatus(AccountStatus.ACTIVE);
        Account updated = accountRepository.save(account);
        return accountService.mapToAccountResponse(updated);
    }

    @Transactional
    public User activateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        user.setStatus("ACTIVE");
        return userRepository.save(user);
    }

    @Transactional
    public User deactivateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        user.setStatus("INACTIVE");
        return userRepository.save(user);
    }
}
