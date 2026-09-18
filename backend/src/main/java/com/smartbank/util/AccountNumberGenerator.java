package com.smartbank.util;

import java.security.SecureRandom;

public class AccountNumberGenerator {

    private static final SecureRandom random = new SecureRandom();
    private static final String PREFIX = "100";

    public static String generateAccountNumber() {
        StringBuilder sb = new StringBuilder(PREFIX);
        for (int i = 0; i < 9; i++) {
            sb.append(random.nextInt(10));
        }
        return sb.toString();
    }
}
