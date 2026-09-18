import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { ArrowUpRight, CheckCircle, AlertCircle } from 'lucide-react';

const WithdrawPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [accountId, setAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [lastTxn, setLastTxn] = useState(null);

  useEffect(() => {
    API.get('/accounts').then(r => {
      const active = r.data.filter(a => a.status === 'ACTIVE');
      setAccounts(active);
      if (active.length > 0) setAccountId(active[0].id);
    }).catch(() => {});
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!accountId || !amount || Number(amount) <= 0) {
      showToast('Please select an account and enter a valid amount', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await API.post(`/accounts/${accountId}/withdraw`, { amount: Number(amount) });
      setLastTxn(res.data);
      setAmount('');
      showToast('Withdrawal successful!');
      const r = await API.get('/accounts');
      setAccounts(r.data.filter(a => a.status === 'ACTIVE'));
    } catch (err) {
      showToast(err.response?.data?.error || err.response?.data?.message || 'Withdrawal failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const selectedAccount = accounts.find(a => String(a.id) === String(accountId));
  const quickAmounts = [500, 1000, 2000, 5000, 10000, 20000];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '680px' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.5px' }}>Withdraw Funds</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Withdraw cash from your bank account</p>
      </div>

      {selectedAccount && (
        <div style={{
          background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
          borderRadius: 'var(--radius-xl)', padding: '24px', color: 'white',
          position: 'relative', overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute', top: '-20px', right: '-20px',
            width: '120px', height: '120px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)'
          }} />
          <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>Selected Account</div>
          <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: '700', marginBottom: '12px', letterSpacing: '1px' }}>
            {selectedAccount.accountNumber}
          </div>
          <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>Available Balance</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800' }}>
            ₹{Number(selectedAccount.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
        </div>
      )}

      <div className="glass-card" style={{ padding: '28px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Select Account
            </label>
            <select
              className="glass-input"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              required
            >
              {accounts.length === 0 && <option value="">No active accounts</option>}
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>
                  {acc.accountType} — {acc.accountNumber} (₹{Number(acc.balance).toLocaleString('en-IN')})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Amount (₹)
            </label>
            <input
              type="number"
              className="glass-input"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              step="0.01"
              required
              style={{ fontSize: '1.1rem', fontWeight: '600' }}
            />
            {selectedAccount && Number(amount) > Number(selectedAccount.balance) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', color: 'var(--red)', fontSize: '13px' }}>
                <AlertCircle size={14} /> Amount exceeds available balance
              </div>
            )}
          </div>

          <div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Quick Select
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {quickAmounts.map(q => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setAmount(q)}
                  style={{
                    padding: '6px 14px', borderRadius: 'var(--radius-sm)',
                    border: `1.5px solid ${String(amount) === String(q) ? 'var(--red)' : 'var(--border)'}`,
                    background: String(amount) === String(q) ? '#fee2e2' : 'white',
                    color: String(amount) === String(q) ? 'var(--red)' : 'var(--text-secondary)',
                    fontWeight: '600', fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s'
                  }}
                >
                  ₹{q.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || accounts.length === 0 || (selectedAccount && Number(amount) > Number(selectedAccount.balance))}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              padding: '12px 28px', fontSize: '15px', fontWeight: '600',
              borderRadius: 'var(--radius-sm)', border: 'none',
              background: 'var(--red)', color: 'white',
              cursor: 'pointer', opacity: (loading || accounts.length === 0) ? 0.6 : 1,
              transition: 'all 0.18s'
            }}
          >
            <ArrowUpRight size={18} />
            {loading ? 'Processing...' : 'Withdraw Funds'}
          </button>
        </form>
      </div>

      {lastTxn && (
        <div className="glass-card" style={{ padding: '20px', border: '1px solid #fca5a5' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <CheckCircle size={20} color="var(--green)" />
            <span style={{ fontWeight: '700', color: 'var(--green)' }}>Withdrawal Successful</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Reference</div>
              <div style={{ fontFamily: 'monospace', fontWeight: '600' }}>{lastTxn.transactionReference}</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Amount</div>
              <div style={{ fontWeight: '700', color: 'var(--red)' }}>-₹{Number(lastTxn.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Balance Before</div>
              <div style={{ fontWeight: '600' }}>₹{Number(lastTxn.balanceBefore).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Balance After</div>
              <div style={{ fontWeight: '600' }}>₹{Number(lastTxn.balanceAfter).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
            </div>
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
          {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
          {toast.msg}
        </div>
      )}
    </div>
  );
};

export default WithdrawPage;
