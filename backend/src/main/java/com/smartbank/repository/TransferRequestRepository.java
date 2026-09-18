package com.smartbank.repository;

import com.smartbank.entity.TransferRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TransferRequestRepository extends JpaRepository<TransferRequest, Long> {
    Optional<TransferRequest> findByIdempotencyKey(String idempotencyKey);
    Optional<TransferRequest> findByTransactionReference(String transactionReference);
}
