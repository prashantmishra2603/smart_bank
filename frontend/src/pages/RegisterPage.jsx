import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, AlertCircle } from 'lucide-react';

const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(fullName, email, phone, password);
      navigate('/login', { state: { message: 'Registration successful! Please log in.' } });
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '32px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: '700', marginBottom: '8px', textAlign: 'center' }}>Create Account</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px', textAlign: 'center' }}>Join SmartBank simulated digital banking</p>

        {error && (
          <div style={{
            background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.3)',
            color: 'var(--accent-rose)', padding: '12px', borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px'
          }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Full Name</label>
            <input type="text" className="glass-input" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" required />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Email Address</label>
            <input type="email" className="glass-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" required />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Phone Number</label>
            <input type="tel" className="glass-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+919876543210" required />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Password (min 8 chars)</label>
            <input type="password" className="glass-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" minLength={8} required />
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: '8px' }}>
            <UserPlus size={18} /> {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: '600' }}>Log in here</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
