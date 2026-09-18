import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Send, CheckCircle, AlertCircle, Info } from 'lucide-react';

const generateIdempotencyKey = () =>
  'txn-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9);

const TransferPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [senderAccountId, setSenderAccountId] = useState('');
  const [receiverAccountNumber, setReceiverAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [lastTxn, setLastTxn] = useState(null);
  const [idempotencyKey] = useState(generateIdempotencyKey);

  useEffect(() => {
    API.get('/accounts').then(r => {
      const active = r.data.filter(a => a.status === 'ACTIVE');
      setAccounts(active);
      if (active.length > 0) setSenderAccountId(active[0].id);
    }).catch(() => {});
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!senderAccountId || !receiverAccountNumber.trim() || !amount || Number(amount) <= 0) {
      showToast('Please fill all required fields', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await API.post('/transfers', {
        senderAccountId: Number(senderAccountId),
        receiverAccountNumber: receiverAccountNumber.trim(),
        amount: Number(amount),
        description: description || undefined,
        idempotencyKey,
      });
      setLastTxn(res.data);
      setAmount('');
      setReceiverAccountNumber('');
      setDescription('');
      showToast('Transfer completed successfully!');
      const r = await API.get('/accounts');
      setAccounts(r.data.filter(a => a.status === 'ACTIVE'));
    } catch (err) {
      showToast(err.response?.data?.error || err.response?.data?.message || 'Transfer failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const selectedAccount = accounts.find(a => String(a.id) === String(senderAccountId));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '680px' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.5px' }}>Transfer Money</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Send money to any SmartBank account instantly</p>
      </div>

      {/* Idempotency Info */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px 16px',
        background: 'var(--blue-light)', border: '1px solid #93c5fd',
        borderRadius: 'var(--radius-sm)', fontSize: '13px', color: 'var(--blue)'
      }}>
        <Info size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
        <span>This transfer is protected with idempotency key <strong style={{ fontFamily: 'monospace' }}>{idempotencyKey}</strong> — safe to retry on network failure.</span>
      </div>

      {selectedAccount && (
        <div style={{
          background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
          borderRadius: 'var(--radius-xl)', padding: '24px', color: 'white',
          position: 'relative', overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute', top: '-20px', right: '-20px',
            width: '120px', height: '120px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)'
          }} />
          <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>Sending From</div>
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
              From Account
            </label>
            <select
              className="glass-input"
              value={senderAccountId}
              onChange={(e) => setSenderAccountId(e.target.value)}
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
              Receiver Account Number
            </label>
            <input
              type="text"
              className="glass-input"
              placeholder="e.g. ACC000000002"
              value={receiverAccountNumber}
              onChange={(e) => setReceiverAccountNumber(e.target.value)}
              required
              style={{ fontFamily: 'monospace', letterSpacing: '1px' }}
            />
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
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Description <span style={{ fontWeight: '400', color: 'var(--text-muted)' }}>(optional)</span>
            </label>
            <input
              type="text"
              className="glass-input"
              placeholder="e.g. Rent payment, Loan repayment..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading || accounts.length === 0}
            style={{ padding: '12px 28px', fontSize: '15px' }}
          >
            <Send size={18} />
            {loading ? 'Processing Transfer...' : 'Send Money'}
          </button>
        </form>
      </div>

      {lastTxn && (
        <div className="glass-card" style={{ padding: '20px', border: '1px solid #6ee7b7' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <CheckCircle size={20} color="var(--green)" />
            <span style={{ fontWeight: '700', color: 'var(--green)' }}>Transfer Completed</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Reference</div>
              <div style={{ fontFamily: 'monospace', fontWeight: '600', fontSize: '13px' }}>{lastTxn.transactionReference}</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Amount Sent</div>
              <div style={{ fontWeight: '700', color: 'var(--purple)' }}>₹{Number(lastTxn.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
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

export default TransferPage;
