package com.smartbank.service;

import com.smartbank.dto.AuthRequest;
import com.smartbank.dto.AuthResponse;
import com.smartbank.dto.RegisterRequest;
import com.smartbank.entity.Account;
import com.smartbank.entity.User;
import com.smartbank.enums.AccountStatus;
import com.smartbank.enums.AccountType;
import com.smartbank.enums.Role;
import com.smartbank.repository.AccountRepository;
import com.smartbank.repository.UserRepository;
import com.smartbank.security.JwtTokenProvider;
import com.smartbank.security.UserPrincipal;
import com.smartbank.util.AccountNumberGenerator;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(AuthenticationManager authenticationManager, UserRepository userRepository, AccountRepository accountRepository, PasswordEncoder passwordEncoder, JwtTokenProvider tokenProvider) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public User registerUser(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        User user = User.builder()
                .fullName(registerRequest.getFullName())
                .email(registerRequest.getEmail())
                .phone(registerRequest.getPhone())
                .passwordHash(passwordEncoder.encode(registerRequest.getPassword()))
                .role(Role.CUSTOMER)
                .status("ACTIVE")
                .build();

        User savedUser = userRepository.save(user);

        // Auto-create default primary savings account
        String accountNumber;
        do {
            accountNumber = AccountNumberGenerator.generateAccountNumber();
        } while (accountRepository.existsByAccountNumber(accountNumber));

        Account defaultAccount = Account.builder()
                .accountNumber(accountNumber)
                .user(savedUser)
                .accountType(AccountType.SAVINGS)
                .balance(new BigDecimal("10000.00"))
                .currency("INR")
                .status(AccountStatus.ACTIVE)
                .build();

        accountRepository.save(defaultAccount);

        return savedUser;
    }

    public AuthResponse authenticateUser(AuthRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);
        UserPrincipal userDetails = (UserPrincipal) authentication.getPrincipal();

        return new AuthResponse(
                jwt,
                userDetails.getId(),
                userDetails.getEmail(),
                userDetails.getAuthorities().iterator().next().getAuthority().replace("ROLE_", ""),
                userRepository.findByEmail(userDetails.getEmail()).get().getFullName()
        );
    }
}
