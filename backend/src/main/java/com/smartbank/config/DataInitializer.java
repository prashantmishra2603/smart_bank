package com.smartbank.config;

import com.smartbank.entity.Account;
import com.smartbank.entity.User;
import com.smartbank.enums.AccountStatus;
import com.smartbank.enums.AccountType;
import com.smartbank.enums.Role;
import com.smartbank.repository.AccountRepository;
import com.smartbank.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, AccountRepository accountRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Create Default Admin if not present
        if (!userRepository.existsByEmail("admin@smartbank.com")) {
            User admin = User.builder()
                    .fullName("Bank Administrator")
                    .email("admin@smartbank.com")
                    .phone("+919999999999")
                    .passwordHash(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .status("ACTIVE")
                    .build();
            userRepository.save(admin);
            log.info("Default admin created: admin@smartbank.com / admin123");
        }

        // Create Demo Customer if not present
        if (!userRepository.existsByEmail("demo@smartbank.com")) {
            User demoUser = User.builder()
                    .fullName("Rahul Sharma")
                    .email("demo@smartbank.com")
                    .phone("+919876543210")
                    .passwordHash(passwordEncoder.encode("demo123"))
                    .role(Role.CUSTOMER)
                    .status("ACTIVE")
                    .build();
            demoUser = userRepository.save(demoUser);

            if (accountRepository.findByUserId(demoUser.getId()).isEmpty()) {
                Account demoAccount = Account.builder()
                        .accountNumber("SB1000000001")
                        .user(demoUser)
                        .accountType(AccountType.SAVINGS)
                        .balance(new BigDecimal("50000.00"))
                        .currency("INR")
                        .status(AccountStatus.ACTIVE)
                        .build();
                accountRepository.save(demoAccount);
                log.info("Demo user account created: SB1000000001 with balance 50,000 INR");
            }
            log.info("Demo user created: demo@smartbank.com / demo123");
        }
    }
}
