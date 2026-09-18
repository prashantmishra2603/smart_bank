package com.smartbank.service;

import com.smartbank.dto.DepositRequest;
import com.smartbank.dto.TransactionResponse;
import com.smartbank.dto.TransferRequestDto;
import com.smartbank.dto.WithdrawRequest;
import com.smartbank.entity.Account;
import com.smartbank.entity.Transaction;
import com.smartbank.entity.TransferRequest;
import com.smartbank.enums.AccountStatus;
import com.smartbank.enums.TransactionStatus;
import com.smartbank.enums.TransactionType;
import com.smartbank.exception.*;
import com.smartbank.repository.AccountRepository;
import com.smartbank.repository.TransactionRepository;
import com.smartbank.repository.TransferRequestRepository;
import com.smartbank.security.UserPrincipal;
import com.smartbank.util.TransactionReferenceGenerator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final TransferRequestRepository transferRequestRepository;

    public TransactionService(AccountRepository accountRepository, TransactionRepository transactionRepository, TransferRequestRepository transferRequestRepository) {
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
        this.transferRequestRepository = transferRequestRepository;
    }

    @Transactional
    public TransactionResponse deposit(UserPrincipal currentUser, Long accountId, DepositRequest request) {
        Account account = accountRepository.findWithLockById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with ID: " + accountId));

        validateAccountOwnership(currentUser, account);
        validateAccountActive(account);

        BigDecimal balanceBefore = account.getBalance();
        BigDecimal balanceAfter = balanceBefore.add(request.getAmount());

        account.setBalance(balanceAfter);
        accountRepository.save(account);

        String reference = TransactionReferenceGenerator.generateReference();

        Transaction transaction = Transaction.builder()
                .transactionReference(reference)
                .account(account)
                .transactionType(TransactionType.DEPOSIT)
                .amount(request.getAmount())
                .balanceBefore(balanceBefore)
                .balanceAfter(balanceAfter)
                .description("Demo Deposit")
                .status(TransactionStatus.SUCCESS)
                .build();

        Transaction savedTxn = transactionRepository.save(transaction);
        return mapToTransactionResponse(savedTxn);
    }

    @Transactional
    public TransactionResponse withdraw(UserPrincipal currentUser, Long accountId, WithdrawRequest request) {
        Account account = accountRepository.findWithLockById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with ID: " + accountId));

        validateAccountOwnership(currentUser, account);
        validateAccountActive(account);

        if (account.getBalance().compareTo(request.getAmount()) < 0) {
            throw new InsufficientBalanceException("Insufficient balance in account. Current balance: ₹" + account.getBalance());
        }

        BigDecimal balanceBefore = account.getBalance();
        BigDecimal balanceAfter = balanceBefore.subtract(request.getAmount());

        account.setBalance(balanceAfter);
        accountRepository.save(account);

        String reference = TransactionReferenceGenerator.generateReference();

        Transaction transaction = Transaction.builder()
                .transactionReference(reference)
                .account(account)
                .transactionType(TransactionType.WITHDRAWAL)
                .amount(request.getAmount())
                .balanceBefore(balanceBefore)
                .balanceAfter(balanceAfter)
                .description("Demo Withdrawal")
                .status(TransactionStatus.SUCCESS)
                .build();

        Transaction savedTxn = transactionRepository.save(transaction);
        return mapToTransactionResponse(savedTxn);
    }

    @Transactional
    public TransactionResponse transfer(UserPrincipal currentUser, TransferRequestDto request) {
        // 1. Idempotency Check
        Optional<TransferRequest> existingTransfer = transferRequestRepository.findByIdempotencyKey(request.getIdempotencyKey());
        if (existingTransfer.isPresent()) {
            TransferRequest tr = existingTransfer.get();
            if (tr.getSenderAccount().getId().equals(request.getSenderAccountId()) &&
                tr.getAmount().compareTo(request.getAmount()) == 0) {
                // Return original transaction if identical key used
                Transaction txn = transactionRepository.findByTransactionReference(tr.getTransactionReference())
                        .orElseThrow(() -> new ResourceNotFoundException("Original transaction not found"));
                return mapToTransactionResponse(txn);
            } else {
                throw new DuplicateIdempotencyException("Idempotency key reused with different parameters.");
            }
        }

        // 2. Fetch Receiver Account
        Account receiverAccountMeta = accountRepository.findByAccountNumber(request.getReceiverAccountNumber())
                .orElseThrow(() -> new ResourceNotFoundException("Receiver account not found: " + request.getReceiverAccountNumber()));

        if (request.getSenderAccountId().equals(receiverAccountMeta.getId())) {
            throw new IllegalArgumentException("Self-transfer is not permitted.");
        }

        // 3. Acquire Pessimistic Locks in Order to Prevent Deadlocks
        Long firstLockId = Math.min(request.getSenderAccountId(), receiverAccountMeta.getId());
        Long secondLockId = Math.max(request.getSenderAccountId(), receiverAccountMeta.getId());

        Account firstAccount = accountRepository.findWithLockById(firstLockId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found: " + firstLockId));
        Account secondAccount = accountRepository.findWithLockById(secondLockId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found: " + secondLockId));

        Account senderAccount = firstAccount.getId().equals(request.getSenderAccountId()) ? firstAccount : secondAccount;
        Account receiverAccount = firstAccount.getId().equals(receiverAccountMeta.getId()) ? firstAccount : secondAccount;

        // 4. Validation
        validateAccountOwnership(currentUser, senderAccount);
        validateAccountActive(senderAccount);
        validateAccountActive(receiverAccount);

        if (senderAccount.getBalance().compareTo(request.getAmount()) < 0) {
            throw new InsufficientBalanceException("Insufficient balance for transfer. Available: ₹" + senderAccount.getBalance());
        }

        // 5. Update Balances
        BigDecimal senderBalanceBefore = senderAccount.getBalance();
        BigDecimal senderBalanceAfter = senderBalanceBefore.subtract(request.getAmount());
        senderAccount.setBalance(senderBalanceAfter);

        BigDecimal receiverBalanceBefore = receiverAccount.getBalance();
        BigDecimal receiverBalanceAfter = receiverBalanceBefore.add(request.getAmount());
        receiverAccount.setBalance(receiverBalanceAfter);

        accountRepository.save(senderAccount);
        accountRepository.save(receiverAccount);

        // 6. Record Ledger Entries
        String reference = TransactionReferenceGenerator.generateReference();
        String description = request.getDescription() != null ? request.getDescription() : "Transfer to " + receiverAccount.getAccountNumber();

        // Debit entry for sender
        Transaction debitTxn = Transaction.builder()
                .transactionReference(reference)
                .account(senderAccount)
                .transactionType(TransactionType.TRANSFER)
                .amount(request.getAmount())
                .balanceBefore(senderBalanceBefore)
                .balanceAfter(senderBalanceAfter)
                .relatedAccount(receiverAccount)
                .description(description)
                .status(TransactionStatus.SUCCESS)
                .idempotencyKey(request.getIdempotencyKey())
                .build();

        Transaction savedDebitTxn = transactionRepository.save(debitTxn);

        // Credit entry for receiver
        Transaction creditTxn = Transaction.builder()
                .transactionReference(reference + "-CR")
                .account(receiverAccount)
                .transactionType(TransactionType.TRANSFER)
                .amount(request.getAmount())
                .balanceBefore(receiverBalanceBefore)
                .balanceAfter(receiverBalanceAfter)
                .relatedAccount(senderAccount)
                .description("Transfer from " + senderAccount.getAccountNumber())
                .status(TransactionStatus.SUCCESS)
                .build();

        transactionRepository.save(creditTxn);

        // 7. Save Transfer Record
        TransferRequest transferRecord = TransferRequest.builder()
                .idempotencyKey(request.getIdempotencyKey())
                .senderAccount(senderAccount)
                .receiverAccount(receiverAccount)
                .amount(request.getAmount())
                .status(TransactionStatus.SUCCESS)
                .transactionReference(reference)
                .build();

        transferRequestRepository.save(transferRecord);

        return mapToTransactionResponse(savedDebitTxn);
    }

    @Transactional(readOnly = true)
    public List<TransactionResponse> getAccountTransactions(UserPrincipal currentUser, Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with ID: " + accountId));

        validateAccountOwnership(currentUser, account);

        return transactionRepository.findByAccountIdOrderByCreatedAtDesc(accountId).stream()
                .map(this::mapToTransactionResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TransactionResponse getTransactionByReference(UserPrincipal currentUser, String reference) {
        Transaction transaction = transactionRepository.findByTransactionReference(reference)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found: " + reference));

        validateAccountOwnership(currentUser, transaction.getAccount());

        return mapToTransactionResponse(transaction);
    }

    private void validateAccountOwnership(UserPrincipal currentUser, Account account) {
        boolean isAdmin = currentUser.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin && !account.getUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedAccessException("Unauthorized access to account");
        }
    }

    private void validateAccountActive(Account account) {
        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new AccountFrozenException("Account is currently " + account.getStatus() + " and cannot process transactions.");
        }
    }

    private TransactionResponse mapToTransactionResponse(Transaction txn) {
        return TransactionResponse.builder()
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
                .build();
    }
}
