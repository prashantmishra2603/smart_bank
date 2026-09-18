import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { CreditCard, Wallet, ArrowDownRight, ArrowUpRight, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await API.get('/accounts');
      setAccounts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2>Customer Dashboard</h2>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Combined Balance</span>
            <Wallet color="#3b82f6" size={24} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800' }}>
            ₹{totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Active Accounts</span>
            <CreditCard color="#10b981" size={24} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800' }}>
            {accounts.length}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Link to="/deposit" className="btn-primary" style={{ textDecoration: 'none' }}>
            <ArrowDownRight size={18} /> Deposit Funds
          </Link>
          <Link to="/withdraw" className="btn-secondary" style={{ textDecoration: 'none' }}>
            <ArrowUpRight size={18} /> Withdraw
          </Link>
          <Link to="/transfer" className="btn-secondary" style={{ textDecoration: 'none' }}>
            <Send size={18} /> Transfer Money
          </Link>
        </div>
      </div>

      {/* Accounts Overview */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3>My Accounts</h3>
          <Link to="/accounts" style={{ color: 'var(--accent-blue)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}>Manage All</Link>
        </div>

        {loading ? (
          <p>Loading accounts...</p>
        ) : accounts.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No bank accounts found. Create one to start banking!</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {accounts.map((acc) => (
              <div key={acc.id} style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)', padding: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="badge badge-active">{acc.accountType}</span>
                  <span className={`badge badge-${acc.status.toLowerCase()}`}>{acc.status}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Account Number</div>
                <div style={{ fontFamily: 'monospace', fontWeight: '700', fontSize: '1.1rem', marginBottom: '12px' }}>{acc.accountNumber}</div>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent-emerald)' }}>
                  ₹{Number(acc.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
