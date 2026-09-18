import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const initials = user?.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <div className="brand-logo">SB</div>
        <span className="brand-name">SmartBank</span>
        <span className="demo-badge">Sandbox</span>
      </div>

      {user && (
        <div className="navbar-right">
          <div className="user-pill">
            <div className="user-avatar">{initials}</div>
            <div className="user-info">
              <div className="user-name">{user.fullName}</div>
              <div className="user-role">{user.role}</div>
            </div>
          </div>
          <button
            onClick={logout}
            className="btn btn-ghost btn-sm"
            title="Logout"
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
