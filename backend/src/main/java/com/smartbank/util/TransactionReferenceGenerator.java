package com.smartbank.util;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

public class TransactionReferenceGenerator {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

    public static String generateReference() {
        String timestamp = LocalDateTime.now().format(FORMATTER);
        String uuidSegment = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        return "TXN" + timestamp + uuidSegment;
    }
}
