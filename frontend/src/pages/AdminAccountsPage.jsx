import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { CreditCard, Lock, Unlock, Search } from 'lucide-react';

const AdminAccountsPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => { fetchAccounts(); }, []);

  const fetchAccounts = async () => {
    try {
      const res = await API.get('/admin/accounts');
      setAccounts(res.data);
    } catch {
      showToast('Failed to load accounts', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleFreeze = async (accountId, currentStatus) => {
    setActionLoading(accountId);
    try {
      const isFrozen = currentStatus === 'FROZEN';
      const endpoint = isFrozen
        ? `/admin/accounts/${accountId}/unfreeze`
        : `/admin/accounts/${accountId}/freeze`;
      await API.patch(endpoint);
      await fetchAccounts();
      showToast(`Account ${isFrozen ? 'unfrozen' : 'frozen'} successfully`);
    } catch (err) {
      showToast(err.response?.data?.error || 'Action failed', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = accounts.filter(a =>
    a.accountNumber?.toLowerCase().includes(search.toLowerCase()) ||
    a.accountType?.toLowerCase().includes(search.toLowerCase())
  );

  const typeColors = {
    SAVINGS: { bg: '#ede9fe', color: '#7c3aed' },
    CURRENT: { bg: '#dbeafe', color: '#2563eb' },
    FIXED_DEPOSIT: { bg: '#d1fae5', color: '#059669' },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.5px' }}>All Accounts</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            {accounts.length} total accounts across all users
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ background: '#d1fae5', color: '#059669', padding: '8px 16px', borderRadius: 'var(--radius-sm)', fontSize: '13px', fontWeight: '700' }}>
            {accounts.filter(a => a.status === 'ACTIVE').length} Active
          </div>
          <div style={{ background: '#fee2e2', color: '#dc2626', padding: '8px 16px', borderRadius: 'var(--radius-sm)', fontSize: '13px', fontWeight: '700' }}>
            {accounts.filter(a => a.status === 'FROZEN').length} Frozen
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="glass-card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Search size={16} color="var(--text-muted)" />
        <input
          type="text"
          placeholder="Search by account number or type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: '14px', color: 'var(--text-primary)' }}
        />
      </div>

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading accounts...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <CreditCard size={48} color="var(--border-strong)" style={{ marginBottom: '12px' }} />
            <div style={{ color: 'var(--text-muted)' }}>No accounts found</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                {['Account Number', 'Type', 'User', 'Balance', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{
                    padding: '12px 16px', textAlign: 'left', fontSize: '11px',
                    fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px',
                    color: 'var(--text-muted)'
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((acc, i) => {
                const colors = typeColors[acc.accountType] || typeColors.SAVINGS;
                const isFrozen = acc.status === 'FROZEN';
                return (
                  <tr key={acc.id}
                    style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background 0.1s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontWeight: '700', letterSpacing: '0.5px' }}>
                      {acc.accountNumber}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ background: colors.bg, color: colors.color, padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>
                        {acc.accountType}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                      {acc.userName || acc.userId || '—'}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--accent-emerald)' }}>
                      ₹{Number(acc.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                        background: isFrozen ? '#fee2e2' : '#d1fae5',
                        color: isFrozen ? '#dc2626' : '#059669'
                      }}>{acc.status}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <button
                        onClick={() => toggleFreeze(acc.id, acc.status)}
                        disabled={actionLoading === acc.id}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '6px',
                          padding: '6px 14px', fontSize: '12px', fontWeight: '600',
                          borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer',
                          background: isFrozen ? '#d1fae5' : '#fee2e2',
                          color: isFrozen ? '#059669' : '#dc2626',
                          opacity: actionLoading === acc.id ? 0.6 : 1,
                          transition: 'all 0.15s'
                        }}
                      >
                        {isFrozen ? <Unlock size={13} /> : <Lock size={13} />}
                        {actionLoading === acc.id ? '...' : (isFrozen ? 'Unfreeze' : 'Freeze')}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {toast && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px',
          background: toast.type === 'error' ? 'var(--red)' : 'var(--green)',
          color: 'white', padding: '14px 20px', borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)', fontSize: '14px', fontWeight: '500',
          display: 'flex', alignItems: 'center', gap: '8px', zIndex: 9999
        }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
};

export default AdminAccountsPage;
