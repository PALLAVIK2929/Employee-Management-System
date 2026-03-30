import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, Users, Building2, BrainCircuit, FileUp, 
  LayoutDashboard, BookOpen, Terminal, User,
  LogOut, Settings, Calendar, CreditCard, CheckSquare,
  BarChart3
} from 'lucide-react';
import { api } from '../api';

const NavSection = ({ title, items }) => (
  <div className="mb-6">
    <h3 className="px-4 mb-2 text-xs font-semibold text-muted uppercase tracking-wider">
      {title}
    </h3>
    <div className="space-y-1">
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors border-l-4 ${
              isActive 
                ? 'bg-accent-light text-accent border-accent' 
                : 'text-muted border-transparent hover:bg-gray-50 hover:text-primary'
            }`
          }
        >
          <item.icon size={18} />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </div>
  </div>
);

const Sidebar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  let user = {};
  try {
    user = JSON.parse(userStr || '{}');
  } catch (e) {
    user = {};
  }
  const role = user.role || 'admin'; // Default to admin for existing sessions

  if (!token) return null;

  const colors = {
    white: '#fff',
    primary: '#1E1B4B',
    accent: '#3D3B8E',
    hover: '#EEF2FF',
    muted: '#6B7280',
    border: '#E5E7EB',
    red: '#EF4444'
  };

  const sections = [
    {
      title: 'PEOPLE',
      items: [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/home' },
        { icon: Users, label: 'Employees', path: '/employees', adminOnly: true },
        { icon: Building2, label: 'Departments', path: '/departments', adminOnly: true },
        { icon: Calendar, label: 'Leaves', path: '/leaves' },
      ]
    },
    {
      title: 'WORKFORCE',
      items: [
        { icon: BrainCircuit, label: 'Onboarding', path: '/onboarding' },
        { icon: CheckSquare, label: 'Tasks', path: '/tasks', employeeOnly: true },
        { icon: FileUp, label: 'Bulk Upload', path: '/bulk-upload', adminOnly: true },
      ]
    },
    {
      title: 'FINANCE',
      items: [
        { icon: CreditCard, label: 'Payroll', path: '/payroll', employeeOnly: true },
      ]
    },
    {
      title: 'INSIGHTS',
      items: [
        { icon: BarChart3, label: 'Analytics', path: '/analytics' },
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { icon: BookOpen, label: 'Handbook Chat', path: '/handbook' },
        { icon: Terminal, label: 'Platform Tools', path: '/tools', adminOnly: true },
        { icon: User, label: 'Profile', path: '/profile' },
      ]
    }
  ];

  const filteredSections = sections.map(section => ({
    ...section,
    items: section.items.filter(item => {
      const isAdmin = role === 'admin';
      if (item.adminOnly && !isAdmin) return false;
      if (item.employeeOnly && isAdmin) return false;
      return true;
    })
  })).filter(section => section.items.length > 0);

  return (
    <div style={{
      width: '215px',
      height: '100vh',
      backgroundColor: colors.white,
      borderRight: `1px solid ${colors.border}`,
      position: 'fixed',
      left: 0,
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      zIndex: 50,
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 1.5rem',
        borderBottom: `1px solid #F3F4F6`
      }}>
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
          onClick={() => navigate('/home')}
        >
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: colors.primary,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.white,
            fontWeight: 'bold'
          }}>
            E
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: colors.primary }}>EMS</span>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '1.5rem 0', overflowY: 'auto' }}>
        {filteredSections.map((section) => (
          <div key={section.title} style={{ marginBottom: '1.5rem' }}>
            <h3 style={{
              padding: '0 1.25rem',
              marginBottom: '0.5rem',
              fontSize: '0.65rem',
              fontWeight: '800',
              color: colors.muted,
              letterSpacing: '0.1em'
            }}>
              {section.title}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.625rem 1.25rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    borderLeft: `3px solid ${isActive ? colors.accent : 'transparent'}`,
                    backgroundColor: isActive ? colors.hover : 'transparent',
                    color: isActive ? colors.accent : colors.muted
                  })}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div style={{ padding: '1rem', borderTop: `1px solid #F3F4F6` }}>
        <button 
          onClick={api.logout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.625rem 1rem',
            width: '100%',
            fontSize: '0.875rem',
            fontWeight: '700',
            color: colors.red,
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
