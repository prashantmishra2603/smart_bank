import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Lock, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: '800', color: '#fff'
          }}>SB</div>
          <span style={{ fontSize: '1.4rem', fontWeight: '800' }}>SmartBank</span>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Link to="/login" className="btn-secondary">Log In</Link>
          <Link to="/register" className="btn-primary">Get Started</Link>
        </div>
      </nav>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px' }}>
        <div className="badge badge-success" style={{ marginBottom: '16px', padding: '6px 14px' }}>
          PORTFOLIO & LEARNING APPLICATION
        </div>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', maxWidth: '800px', lineHeight: 1.15, marginBottom: '20px' }}>
          Secure Digital Banking. <br />
          <span style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Simple Transactions.
          </span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', marginBottom: '36px', lineHeight: 1.5 }}>
          Experience a full-stack digital bank engineered with Spring Boot, PostgreSQL, JPA Pessimistic Concurrency Locking, and React 19.
        </p>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '64px' }}>
          <Link to="/register" className="btn-primary" style={{ padding: '14px 32px', fontSize: '1.05rem' }}>
            Create Demo Account <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn-secondary" style={{ padding: '14px 32px', fontSize: '1.05rem' }}>
            Demo Admin Login
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', maxWidth: '900px', width: '100%' }}>
          <div className="glass-card" style={{ padding: '24px', textAlign: 'left' }}>
            <Lock color="#3b82f6" size={28} style={{ marginBottom: '12px' }} />
            <h3 style={{ marginBottom: '8px' }}>Idempotency Protection</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Prevents duplicate money transfers even when retried under poor network conditions.</p>
          </div>
          <div className="glass-card" style={{ padding: '24px', textAlign: 'left' }}>
            <Zap color="#06b6d4" size={28} style={{ marginBottom: '12px' }} />
            <h3 style={{ marginBottom: '8px' }}>Concurrency Safe</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Utilizes JPA `@Lock(PESSIMISTIC_WRITE)` to guarantee thread safety during parallel transfers.</p>
          </div>
          <div className="glass-card" style={{ padding: '24px', textAlign: 'left' }}>
            <ShieldCheck color="#10b981" size={28} style={{ marginBottom: '12px' }} />
            <h3 style={{ marginBottom: '8px' }}>JWT & Role Security</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>BCrypt hashed credentials with stateless JWT token authentication and role authorization.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
