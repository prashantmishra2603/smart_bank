import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { CreditCard, Plus, X, CheckCircle } from 'lucide-react';

const AccountsPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [accountType, setAccountType] = useState('SAVINGS');
  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => { fetchAccounts(); }, []);

  const fetchAccounts = async () => {
    try {
      const res = await API.get('/accounts');
      setAccounts(res.data);
    } catch (err) {
      showToast('Failed to load accounts', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await API.post('/accounts', { accountType });
      setShowModal(false);
      await fetchAccounts();
      showToast('Account created successfully!');
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to create account', 'error');
    } finally {
      setCreating(false);
    }
  };

  const typeColors = {
    SAVINGS: { bg: '#ede9fe', color: '#7c3aed' },
    CURRENT: { bg: '#dbeafe', color: '#2563eb' },
    FIXED_DEPOSIT: { bg: '#d1fae5', color: '#059669' },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.5px' }}>My Accounts</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Manage all your bank accounts</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={16} /> New Account
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>Loading accounts...</div>
      ) : accounts.length === 0 ? (
        <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
          <CreditCard size={48} color="var(--border-strong)" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '8px' }}>No Accounts Yet</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>Create your first bank account to start banking</p>
          <button onClick={() => setShowModal(true)} className="btn-primary">Create Account</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {accounts.map((acc) => {
            const colors = typeColors[acc.accountType] || typeColors.SAVINGS;
            return (
              <div key={acc.id} className="glass-card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
                <div style={{
                  position: 'absolute', top: 0, right: 0, width: '120px', height: '120px',
                  borderRadius: '50%', background: colors.bg, opacity: 0.5,
                  transform: 'translate(30px, -30px)'
                }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', position: 'relative' }}>
                  <span style={{ background: colors.bg, color: colors.color, padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>
                    {acc.accountType}
                  </span>
                  <span style={{
                    background: acc.status === 'ACTIVE' ? '#d1fae5' : '#fee2e2',
                    color: acc.status === 'ACTIVE' ? '#059669' : '#dc2626',
                    padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600'
                  }}>
                    {acc.status}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Account Number</div>
                <div style={{ fontFamily: 'monospace', fontWeight: '700', fontSize: '1rem', marginBottom: '16px', letterSpacing: '1px' }}>
                  {acc.accountNumber}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Balance</div>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--accent-emerald)' }}>
                  ₹{Number(acc.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Account Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '20px'
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '420px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Open New Account</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Account Type
                </label>
                <select className="glass-input" value={accountType} onChange={(e) => setAccountType(e.target.value)}>
                  <option value="SAVINGS">Savings Account</option>
                  <option value="CURRENT">Current Account</option>
                  <option value="FIXED_DEPOSIT">Fixed Deposit</option>
                </select>
              </div>
              <button type="submit" className="btn-primary" disabled={creating} style={{ marginTop: '8px' }}>
                {creating ? 'Creating...' : 'Create Account'}
              </button>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px',
          background: toast.type === 'error' ? 'var(--red)' : 'var(--green)',
          color: 'white', padding: '14px 20px', borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)', fontSize: '14px', fontWeight: '500',
          display: 'flex', alignItems: 'center', gap: '8px', zIndex: 9999
        }}>
          <CheckCircle size={16} /> {toast.msg}
        </div>
      )}
    </div>
  );
};

export default AccountsPage;
