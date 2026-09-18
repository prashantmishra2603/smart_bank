import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Clock, ArrowDownLeft, ArrowUpRight, Send, Filter } from 'lucide-react';

const txnIcon = (type) => {
  if (type === 'DEPOSIT') return <ArrowDownLeft size={16} color="var(--green)" />;
  if (type === 'WITHDRAWAL') return <ArrowUpRight size={16} color="var(--red)" />;
  return <Send size={16} color="var(--purple)" />;
};

const txnColor = (type) => {
  if (type === 'DEPOSIT') return { amount: 'var(--green)', sign: '+' };
  if (type === 'WITHDRAWAL') return { amount: 'var(--red)', sign: '-' };
  return { amount: 'var(--purple)', sign: '↔' };
};

const TransactionsPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [accountId, setAccountId] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    API.get('/accounts').then(r => {
      setAccounts(r.data);
      if (r.data.length > 0) {
        setAccountId(r.data[0].id);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (accountId) fetchTransactions(accountId);
  }, [accountId]);

  const fetchTransactions = async (id) => {
    setLoading(true);
    try {
      const res = await API.get(`/accounts/${id}/transactions`);
      setTransactions(res.data);
    } catch (err) {
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = filter === 'ALL'
    ? transactions
    : transactions.filter(t => t.transactionType === filter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.5px' }}>Transaction History</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>View all transactions for your accounts</p>
      </div>

      {/* Controls */}
      <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1', minWidth: '200px' }}>
          <Filter size={16} color="var(--text-muted)" />
          <select
            className="glass-input"
            style={{ flex: 1 }}
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
          >
            {accounts.map(acc => (
              <option key={acc.id} value={acc.id}>
                {acc.accountType} — {acc.accountNumber}
              </option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['ALL', 'DEPOSIT', 'WITHDRAWAL', 'TRANSFER'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '6px 14px', fontSize: '12px', fontWeight: '600',
                borderRadius: '20px', border: 'none', cursor: 'pointer',
                transition: 'all 0.15s',
                background: filter === f ? 'var(--brand)' : 'var(--bg)',
                color: filter === f ? 'white' : 'var(--text-secondary)'
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading transactions...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <Clock size={48} color="var(--border-strong)" style={{ marginBottom: '12px' }} />
            <div style={{ fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>No transactions found</div>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Make a deposit, withdrawal, or transfer to see activity</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                {['Type', 'Reference', 'Amount', 'Balance Before', 'Balance After', 'Date'].map(h => (
                  <th key={h} style={{
                    padding: '12px 16px', textAlign: 'left', fontSize: '11px',
                    fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px',
                    color: 'var(--text-muted)'
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((txn, i) => {
                const { amount: col, sign } = txnColor(txn.transactionType);
                return (
                  <tr key={txn.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background 0.1s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '32px', height: '32px', borderRadius: '50%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: txn.transactionType === 'DEPOSIT' ? '#d1fae5'
                            : txn.transactionType === 'WITHDRAWAL' ? '#fee2e2' : '#ede9fe',
                          flexShrink: 0
                        }}>
                          {txnIcon(txn.transactionType)}
                        </div>
                        <span style={{ fontWeight: '600', fontSize: '13px' }}>{txn.transactionType}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {txn.transactionReference}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: '700', color: col }}>
                      {sign}₹{Number(txn.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                      ₹{Number(txn.balanceBefore).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                      ₹{Number(txn.balanceAfter).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: '13px' }}>
                      {txn.createdAt ? new Date(txn.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {!loading && filtered.length > 0 && (
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'right' }}>
          Showing {filtered.length} transaction{filtered.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default TransactionsPage;
