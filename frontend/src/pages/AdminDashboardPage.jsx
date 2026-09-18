import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Users, CreditCard, ArrowUpDown, DollarSign, TrendingUp, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const StatCard = ({ label, value, icon: Icon, color, bg }) => (
  <div className="glass-card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
    <div style={{
      position: 'absolute', top: '-16px', right: '-16px',
      width: '80px', height: '80px', borderRadius: '50%',
      background: bg, opacity: 0.2
    }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
      <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={18} color={color} />
      </div>
    </div>
    <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-1px' }}>{value}</div>
  </div>
);

const PIE_COLORS = ['#4f46e5', '#dc2626', '#7c3aed'];

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/dashboard')
      .then(r => setStats(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading dashboard...</div>
  );
  if (!stats) return (
    <div style={{ padding: '60px', textAlign: 'center', color: 'var(--red)' }}>Failed to load dashboard stats.</div>
  );

  const depVol = Number(stats.totalDepositsVolume || 0);
  const wdVol = Number(stats.totalWithdrawalsVolume || 0);
  const trVol = Number(stats.totalTransfersVolume || 0);
  const totalVolume = depVol + wdVol + trVol;

  const volumeData = [
    { name: 'Deposits', amount: depVol },
    { name: 'Withdrawals', amount: wdVol },
    { name: 'Transfers', amount: trVol },
  ];

  // Use actual counts when available, otherwise show volumes as proxy indicator
  const txnBreakdown = volumeData.filter(d => d.amount > 0).map(d => ({ name: d.name, value: d.amount }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.5px' }}>Admin Dashboard</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Platform-wide overview and statistics</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        <StatCard label="Total Users" value={stats.totalUsers} icon={Users} color="#4f46e5" bg="#ede9fe" />
        <StatCard label="Total Accounts" value={stats.totalAccounts} icon={CreditCard} color="#059669" bg="#d1fae5" />
        <StatCard label="Transactions" value={stats.totalTransactions} icon={ArrowUpDown} color="#2563eb" bg="#dbeafe" />
        <StatCard
          label="Total Volume"
          value={`₹${totalVolume.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
          icon={DollarSign} color="#d97706" bg="#fef3c7"
        />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} color="var(--brand)" /> Transaction Volume (₹)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={volumeData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                formatter={(v) => [`₹${Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 'Volume']}
                contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', fontSize: '13px' }}
              />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                {volumeData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} color="var(--green)" /> Volume Breakdown
          </h3>
          {txnBreakdown.length === 0 ? (
            <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
              No transaction data yet
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <ResponsiveContainer width="50%" height={160}>
                <PieChart>
                  <Pie data={txnBreakdown} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" paddingAngle={3}>
                    {txnBreakdown.map((_, index) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => [`₹${Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`]}
                    contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', fontSize: '13px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {txnBreakdown.map((d, i) => (
                  <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: PIE_COLORS[i], flexShrink: 0 }} />
                    <span style={{ color: 'var(--text-secondary)', flex: 1 }}>{d.name}</span>
                    <span style={{ fontWeight: '700', fontSize: '12px' }}>₹{Number(d.value).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Second row stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {[
          { label: 'Active Accounts', value: stats.totalAccounts - stats.frozenAccountsCount, color: 'var(--green)' },
          { label: 'Frozen Accounts', value: stats.frozenAccountsCount, color: 'var(--red)' },
          { label: 'Deposit Volume', value: `₹${depVol.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, color: 'var(--green)' },
          { label: 'Transfer Volume', value: `₹${trVol.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, color: 'var(--purple)' },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass-card" style={{ padding: '16px 20px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
