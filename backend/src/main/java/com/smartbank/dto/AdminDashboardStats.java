package com.smartbank.dto;

import java.math.BigDecimal;

public class AdminDashboardStats {
    private long totalUsers;
    private long totalAccounts;
    private long totalTransactions;
    private BigDecimal totalDepositsVolume;
    private BigDecimal totalWithdrawalsVolume;
    private BigDecimal totalTransfersVolume;
    private long frozenAccountsCount;

    public AdminDashboardStats() {}

    public AdminDashboardStats(long totalUsers, long totalAccounts, long totalTransactions, BigDecimal totalDepositsVolume, BigDecimal totalWithdrawalsVolume, BigDecimal totalTransfersVolume, long frozenAccountsCount) {
        this.totalUsers = totalUsers;
        this.totalAccounts = totalAccounts;
        this.totalTransactions = totalTransactions;
        this.totalDepositsVolume = totalDepositsVolume;
        this.totalWithdrawalsVolume = totalWithdrawalsVolume;
        this.totalTransfersVolume = totalTransfersVolume;
        this.frozenAccountsCount = frozenAccountsCount;
    }

    public static AdminDashboardStatsBuilder builder() {
        return new AdminDashboardStatsBuilder();
    }

    public static class AdminDashboardStatsBuilder {
        private long totalUsers;
        private long totalAccounts;
        private long totalTransactions;
        private BigDecimal totalDepositsVolume;
        private BigDecimal totalWithdrawalsVolume;
        private BigDecimal totalTransfersVolume;
        private long frozenAccountsCount;

        public AdminDashboardStatsBuilder totalUsers(long totalUsers) { this.totalUsers = totalUsers; return this; }
        public AdminDashboardStatsBuilder totalAccounts(long totalAccounts) { this.totalAccounts = totalAccounts; return this; }
        public AdminDashboardStatsBuilder totalTransactions(long totalTransactions) { this.totalTransactions = totalTransactions; return this; }
        public AdminDashboardStatsBuilder totalDepositsVolume(BigDecimal totalDepositsVolume) { this.totalDepositsVolume = totalDepositsVolume; return this; }
        public AdminDashboardStatsBuilder totalWithdrawalsVolume(BigDecimal totalWithdrawalsVolume) { this.totalWithdrawalsVolume = totalWithdrawalsVolume; return this; }
        public AdminDashboardStatsBuilder totalTransfersVolume(BigDecimal totalTransfersVolume) { this.totalTransfersVolume = totalTransfersVolume; return this; }
        public AdminDashboardStatsBuilder frozenAccountsCount(long frozenAccountsCount) { this.frozenAccountsCount = frozenAccountsCount; return this; }

        public AdminDashboardStats build() {
            return new AdminDashboardStats(totalUsers, totalAccounts, totalTransactions, totalDepositsVolume, totalWithdrawalsVolume, totalTransfersVolume, frozenAccountsCount);
        }
    }

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getTotalAccounts() { return totalAccounts; }
    public void setTotalAccounts(long totalAccounts) { this.totalAccounts = totalAccounts; }

    public long getTotalTransactions() { return totalTransactions; }
    public void setTotalTransactions(long totalTransactions) { this.totalTransactions = totalTransactions; }

    public BigDecimal getTotalDepositsVolume() { return totalDepositsVolume; }
    public void setTotalDepositsVolume(BigDecimal totalDepositsVolume) { this.totalDepositsVolume = totalDepositsVolume; }

    public BigDecimal getTotalWithdrawalsVolume() { return totalWithdrawalsVolume; }
    public void setTotalWithdrawalsVolume(BigDecimal totalWithdrawalsVolume) { this.totalWithdrawalsVolume = totalWithdrawalsVolume; }

    public BigDecimal getTotalTransfersVolume() { return totalTransfersVolume; }
    public void setTotalTransfersVolume(BigDecimal totalTransfersVolume) { this.totalTransfersVolume = totalTransfersVolume; }

    public long getFrozenAccountsCount() { return frozenAccountsCount; }
    public void setFrozenAccountsCount(long frozenAccountsCount) { this.frozenAccountsCount = frozenAccountsCount; }
}
