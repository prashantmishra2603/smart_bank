import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AccountsPage from './pages/AccountsPage';
import DepositPage from './pages/DepositPage';
import WithdrawPage from './pages/WithdrawPage';
import TransferPage from './pages/TransferPage';
import TransactionsPage from './pages/TransactionsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminAccountsPage from './pages/AdminAccountsPage';
import AdminTransactionsPage from './pages/AdminTransactionsPage';

const AppShell = ({ children }) => (
  <div className="app-shell">
    <Sidebar />
    <div className="main-area">
      <Navbar />
      <main className="page-content">{children}</main>
    </div>
  </div>
);

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Customer */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <AppShell><DashboardPage /></AppShell>
            </ProtectedRoute>
          } />
          <Route path="/accounts" element={
            <ProtectedRoute>
              <AppShell><AccountsPage /></AppShell>
            </ProtectedRoute>
          } />
          <Route path="/deposit" element={
            <ProtectedRoute>
              <AppShell><DepositPage /></AppShell>
            </ProtectedRoute>
          } />
          <Route path="/withdraw" element={
            <ProtectedRoute>
              <AppShell><WithdrawPage /></AppShell>
            </ProtectedRoute>
          } />
          <Route path="/transfer" element={
            <ProtectedRoute>
              <AppShell><TransferPage /></AppShell>
            </ProtectedRoute>
          } />
          <Route path="/transactions" element={
            <ProtectedRoute>
              <AppShell><TransactionsPage /></AppShell>
            </ProtectedRoute>
          } />

          {/* Admin */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <AppShell><AdminDashboardPage /></AppShell>
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute adminOnly>
              <AppShell><AdminUsersPage /></AppShell>
            </ProtectedRoute>
          } />
          <Route path="/admin/accounts" element={
            <ProtectedRoute adminOnly>
              <AppShell><AdminAccountsPage /></AppShell>
            </ProtectedRoute>
          } />
          <Route path="/admin/transactions" element={
            <ProtectedRoute adminOnly>
              <AppShell><AdminTransactionsPage /></AppShell>
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
