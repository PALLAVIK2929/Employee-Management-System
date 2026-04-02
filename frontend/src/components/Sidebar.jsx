import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, Users, Building2, BrainCircuit, FileUp, 
  LayoutDashboard, BookOpen, Terminal, User,
  LogOut, Settings, Calendar, CreditCard, CheckSquare,
  BarChart3, Award, Clock, Menu, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const { role, logout, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!isAuthenticated) return null;

  const sections = [
    {
      title: 'PEOPLE',
      items: [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/home' },
        { icon: Users, label: 'Employees', path: '/employees', adminOnly: true },
        { icon: Building2, label: 'Departments', path: '/departments' },
        { icon: Calendar, label: 'Leaves', path: '/leaves' },
        { icon: Award, label: 'Performance', path: '/performance' },
        { icon: Clock, label: 'Attendance', path: '/attendance' },
      ]
    },
    {
      title: 'WORKFORCE',
      items: [
        { icon: BrainCircuit, label: 'Onboarding', path: '/onboarding', adminOnly: true },
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
        { icon: BarChart3, label: 'Analytics', path: '/analytics', adminOnly: true },
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
      if (item.adminOnly && role !== 'admin') return false;
      if (item.employeeOnly && role === 'admin') return false;
      return true;
    })
  })).filter(section => section.items.length > 0);

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-[60] p-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg shadow-lg"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X size={24} className="text-[var(--text-primary)]" /> : <Menu size={24} className="text-[var(--text-primary)]" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`sidebar-container ${isMobileMenuOpen ? 'sidebar-mobile-open' : ''}`}
        style={{
          width: '215px',
          height: '100vh',
          backgroundColor: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--sidebar-border)',
          position: 'fixed',
          left: 0,
          top: 0,
          display: 'flex',
          flexDirection: 'column',
          zIndex: 50,
          fontFamily: "'Inter', sans-serif",
          transition: 'all 0.3s ease'
        }}>
      <div style={{
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 1.5rem',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
          onClick={() => navigate('/home')}
        >
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: 'var(--accent-color)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 'bold'
          }}>
            E
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>EMS</span>
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
              color: 'var(--text-secondary)',
              letterSpacing: '0.1em'
            }}>
              {section.title}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="sidebar-item"
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.625rem 1.25rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    borderLeft: `3px solid ${isActive ? 'var(--accent-color)' : 'transparent'}`,
                    backgroundColor: isActive ? 'var(--bg-primary)' : 'transparent',
                    color: isActive ? 'var(--accent-color)' : 'var(--text-secondary)'
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

      <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
        <button 
          onClick={logout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            width: '100%',
            padding: '0.625rem 0.75rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#EF4444',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>

    <style>{`
      @media (max-width: 768px) {
        .sidebar-container {
          transform: translateX(-100%);
        }
        
        .sidebar-container.sidebar-mobile-open {
          transform: translateX(0);
        }
      }
    `}</style>
    </>
  );
};

export default Sidebar;
