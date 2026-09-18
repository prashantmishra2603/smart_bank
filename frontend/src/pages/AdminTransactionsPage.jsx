import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { ArrowDownLeft, ArrowUpRight, Send, Search, Filter } from 'lucide-react';

const txnIcon = (type) => {
  if (type === 'DEPOSIT') return <ArrowDownLeft size={14} color="#059669" />;
  if (type === 'WITHDRAWAL') return <ArrowUpRight size={14} color="#dc2626" />;
  return <Send size={14} color="#7c3aed" />;
};

const AdminTransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    API.get('/admin/transactions').then(r => setTransactions(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = transactions
    .filter(t => filter === 'ALL' || t.transactionType === filter)
    .filter(t =>
      !search ||
      t.transactionReference?.toLowerCase().includes(search.toLowerCase()) ||
      t.accountNumber?.toLowerCase().includes(search.toLowerCase())
    );

  const totalVolume = transactions.reduce((sum, t) => sum + Number(t.amount || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.5px' }}>All Transactions</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            {transactions.length} total transactions · ₹{totalVolume.toLocaleString('en-IN', { minimumFractionDigits: 2 })} volume
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['DEPOSIT', 'WITHDRAWAL', 'TRANSFER'].map(type => {
            const count = transactions.filter(t => t.transactionType === type).length;
            const colors = { DEPOSIT: { bg: '#d1fae5', color: '#059669' }, WITHDRAWAL: { bg: '#fee2e2', color: '#dc2626' }, TRANSFER: { bg: '#ede9fe', color: '#7c3aed' } };
            return (
              <div key={type} style={{ background: colors[type].bg, color: colors[type].color, padding: '8px 16px', borderRadius: 'var(--radius-sm)', fontSize: '13px', fontWeight: '700' }}>
                {count} {type.charAt(0) + type.slice(1).toLowerCase()}s
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="glass-card" style={{ padding: '12px 16px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '200px' }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search reference or account number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: '14px', color: 'var(--text-primary)' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <Filter size={14} color="var(--text-muted)" />
          {['ALL', 'DEPOSIT', 'WITHDRAWAL', 'TRANSFER'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '5px 12px', fontSize: '12px', fontWeight: '600',
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

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading transactions...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>No transactions found</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                {['Type', 'Reference', 'Account', 'Amount', 'Status', 'Description', 'Date'].map(h => (
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
                const amtColor = txn.transactionType === 'DEPOSIT' ? '#059669' : txn.transactionType === 'WITHDRAWAL' ? '#dc2626' : '#7c3aed';
                const amtSign = txn.transactionType === 'DEPOSIT' ? '+' : txn.transactionType === 'WITHDRAWAL' ? '-' : '↔';
                return (
                  <tr key={txn.id}
                    style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background 0.1s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{
                          width: '28px', height: '28px', borderRadius: '50%', display: 'flex',
                          alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                          background: txn.transactionType === 'DEPOSIT' ? '#d1fae5'
                            : txn.transactionType === 'WITHDRAWAL' ? '#fee2e2' : '#ede9fe'
                        }}>
                          {txnIcon(txn.transactionType)}
                        </div>
                        <span style={{ fontWeight: '600', fontSize: '12px' }}>{txn.transactionType}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {txn.transactionReference}
                    </td>
                    <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: '12px' }}>
                      {txn.accountNumber || `#${txn.accountId}`}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: '700', color: amtColor }}>
                      {amtSign}₹{Number(txn.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600',
                        background: txn.status === 'SUCCESS' ? '#d1fae5' : '#fee2e2',
                        color: txn.status === 'SUCCESS' ? '#059669' : '#dc2626'
                      }}>{txn.status}</span>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '13px', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {txn.description || '—'}
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: '12px', whiteSpace: 'nowrap' }}>
                      {txn.createdAt ? new Date(txn.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {!loading && (
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'right' }}>
          Showing {filtered.length} of {transactions.length} transactions
        </div>
      )}
    </div>
  );
};

export default AdminTransactionsPage;
