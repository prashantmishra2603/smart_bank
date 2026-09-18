import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Users, UserCheck, UserX, Search } from 'lucide-react';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      showToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleUser = async (userId, currentlyActive) => {
    setActionLoading(userId);
    try {
      const endpoint = currentlyActive
        ? `/admin/users/${userId}/deactivate`
        : `/admin/users/${userId}/activate`;
      await API.patch(endpoint);
      await fetchUsers();
      showToast(`User ${currentlyActive ? 'deactivated' : 'activated'} successfully`);
    } catch (err) {
      showToast(err.response?.data?.error || 'Action failed', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = users.filter(u =>
    u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.5px' }}>Manage Users</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            {users.length} total users registered
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ background: '#d1fae5', color: '#059669', padding: '8px 16px', borderRadius: 'var(--radius-sm)', fontSize: '13px', fontWeight: '700' }}>
            {users.filter(u => u.active !== false && u.status !== 'INACTIVE').length} Active
          </div>
          <div style={{ background: '#fee2e2', color: '#dc2626', padding: '8px 16px', borderRadius: 'var(--radius-sm)', fontSize: '13px', fontWeight: '700' }}>
            {users.filter(u => u.active === false || u.status === 'INACTIVE').length} Inactive
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="glass-card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Search size={16} color="var(--text-muted)" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: '14px', color: 'var(--text-primary)' }}
        />
      </div>

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading users...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <Users size={48} color="var(--border-strong)" style={{ marginBottom: '12px' }} />
            <div style={{ color: 'var(--text-muted)' }}>No users found</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                {['User', 'Email', 'Phone', 'Role', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{
                    padding: '12px 16px', textAlign: 'left', fontSize: '11px',
                    fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px',
                    color: 'var(--text-muted)'
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, i) => {
                const isActive = user.active !== false && user.status !== 'INACTIVE';
                const isAdmin = user.role === 'ADMIN';
                const initials = user.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';
                return (
                  <tr key={user.id}
                    style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background 0.1s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '50%',
                          background: 'var(--brand-light)', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                          fontWeight: '700', fontSize: '13px', color: 'var(--brand)', flexShrink: 0
                        }}>{initials}</div>
                        <div>
                          <div style={{ fontWeight: '600' }}>{user.fullName}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{user.email}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{user.phone || '—'}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700',
                        background: isAdmin ? '#ede9fe' : '#dbeafe',
                        color: isAdmin ? '#7c3aed' : '#2563eb'
                      }}>{user.role}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                        background: isActive ? '#d1fae5' : '#fee2e2',
                        color: isActive ? '#059669' : '#dc2626'
                      }}>{isActive ? 'Active' : 'Inactive'}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {isAdmin ? (
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Protected</span>
                      ) : (
                        <button
                          onClick={() => toggleUser(user.id, isActive)}
                          disabled={actionLoading === user.id}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            padding: '6px 14px', fontSize: '12px', fontWeight: '600',
                            borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer',
                            background: isActive ? '#fee2e2' : '#d1fae5',
                            color: isActive ? '#dc2626' : '#059669',
                            opacity: actionLoading === user.id ? 0.6 : 1,
                            transition: 'all 0.15s'
                          }}
                        >
                          {isActive ? <UserX size={13} /> : <UserCheck size={13} />}
                          {actionLoading === user.id ? '...' : (isActive ? 'Deactivate' : 'Activate')}
                        </button>
                      )}
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

export default AdminUsersPage;
