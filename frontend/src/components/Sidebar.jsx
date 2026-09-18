import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, CreditCard, ArrowDownLeft, ArrowUpRight,
  Send, Clock, Shield, Users, List, ChevronRight
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const customerLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/accounts', label: 'My Accounts', icon: CreditCard },
    { to: '/deposit', label: 'Deposit', icon: ArrowDownLeft },
    { to: '/withdraw', label: 'Withdraw', icon: ArrowUpRight },
    { to: '/transfer', label: 'Transfer', icon: Send },
    { to: '/transactions', label: 'Transactions', icon: Clock },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Admin Dashboard', icon: Shield },
    { to: '/admin/users', label: 'Manage Users', icon: Users },
    { to: '/admin/accounts', label: 'All Accounts', icon: CreditCard },
    { to: '/admin/transactions', label: 'All Transactions', icon: List },
  ];

  const links = isAdmin ? adminLinks : customerLinks;

  return (
    <nav className="sidebar">
      <div className="sidebar-section-label">Menu</div>
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/admin' || to === '/dashboard'}
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <span className="icon-wrap">
            <Icon size={15} color={undefined} />
          </span>
          {label}
        </NavLink>
      ))}
    </nav>
  );
};

export default Sidebar;
