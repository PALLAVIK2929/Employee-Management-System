import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, Search, Check, Trash2, 
  UserPlus, Calendar, AlertCircle,
  Clock, Sun, Moon, CheckCircle, XCircle, DollarSign
} from 'lucide-react';
import { useTheme } from '../App';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationsContext';
import Avatar from './Avatar';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { getUserNotifications, getUnreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const notificationRef = useRef(null);
  
  const userName = user?.name || 'Admin User';
  const userRole = user?.role === 'admin' ? 'Administrator' : 'Standard Employee';
  const userInitials = user?.initials || (userName.split(' ').map(n => n[0]).join('').toUpperCase());
  const userId = user?.id || 1;

  // Get notifications
  const userNotifications = getUserNotifications(userId);
  const unreadCount = getUnreadCount(userId);

  // Map notification types to icons and colors
  const getNotificationIcon = (type) => {
    const iconMap = {
      leave_approved: { icon: CheckCircle, color: '#10B981' },
      leave_rejected: { icon: XCircle, color: '#EF4444' },
      new_leave_request: { icon: Calendar, color: '#6366F1' },
      new_employee: { icon: UserPlus, color: '#F59E0B' },
      payroll_processed: { icon: DollarSign, color: '#10B981' },
      default: { icon: AlertCircle, color: '#3D3B8E' }
    };
    return iconMap[type] || iconMap.default;
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    if (notification.link) {
      navigate(notification.link);
      setShowNotifications(false);
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead(userId);
  };

  const handleClearAll = () => {
    clearAll(userId);
    setShowNotifications(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target))
        setShowNotifications(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header style={{
      height: '64px',
      backgroundColor: 'var(--header-bg)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      fontFamily: "'Inter', sans-serif",
      transition: 'background-color 0.3s ease, border-color 0.3s ease'
    }}>
      {/* Search Bar */}
      <div style={{ position: 'relative', width: '400px' }}>
        <div style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--text-secondary)'
        }}>
          <Search size={18} />
        </div>
        <input 
          type="text"
          placeholder="Search employees, documents, tools..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px 10px 40px',
            backgroundColor: 'var(--input-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.2s',
            color: 'var(--text-primary)'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--accent-color)';
            e.target.style.backgroundColor = 'var(--bg-card)';
            e.target.style.boxShadow = '0 0 0 4px rgba(61, 59, 142, 0.05)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--border-color)';
            e.target.style.backgroundColor = 'var(--input-bg)';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>

      {/* Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: theme === 'dark' ? 'rotate(180deg) scale(1)' : 'rotate(0deg) scale(1)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bg-primary)';
            e.currentTarget.style.color = 'var(--accent-color)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {/* Notification Bell */}
        <div style={{ position: 'relative' }} ref={notificationRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: showNotifications ? 'rgba(61, 59, 142, 0.1)' : 'transparent',
              border: 'none',
              color: showNotifications ? 'var(--accent-color)' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              position: 'relative'
            }}
            onMouseOver={(e) => {
              if (!showNotifications) e.currentTarget.style.backgroundColor = 'var(--bg-primary)';
            }}
            onMouseOut={(e) => {
              if (!showNotifications) e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span 
                className="ripple-badge"
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  width: '10px',
                  height: '10px',
                  backgroundColor: '#EF4444',
                  borderRadius: '50%',
                  border: '2px solid var(--header-bg)'
                }} 
              />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div style={{
              position: 'absolute', 
              top: '52px', 
              right: '0', 
              width: '360px', 
              backgroundColor: 'var(--bg-card)', 
              borderRadius: '20px', 
              boxShadow: 'var(--card-shadow)', 
              border: '1px solid var(--border-color)', 
              overflow: 'hidden', 
              animation: 'slideDown 0.2s ease-out'
            }}>
              <style>{`
                @keyframes slideDown {
                  from { opacity: 0; transform: translateY(-10px); }
                  to { opacity: 1; transform: translateY(0); }
                }
              `}</style>
              
              <div style={{
                padding: '20px 24px',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>Notifications</h3>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {unreadCount > 0 && (
                    <button 
                      onClick={handleMarkAllAsRead}
                      style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600' }}
                    >
                      <Check size={14} /> Mark all read
                    </button>
                  )}
                  <button 
                    onClick={handleClearAll}
                    style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600' }}
                  >
                    <Trash2 size={14} /> Clear
                  </button>
                </div>
              </div>

              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {userNotifications.length === 0 ? (
                  <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                    <div style={{ color: 'var(--border-color)', marginBottom: '12px' }}><Bell size={40} style={{ margin: '0 auto' }} /></div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>No new notifications</p>
                  </div>
                ) : (
                  userNotifications.map((notification) => {
                    const { icon: Icon, color } = getNotificationIcon(notification.type);
                    return (
                      <div 
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        style={{
                          padding: '16px 24px',
                          borderBottom: '1px solid var(--border-color)',
                          display: 'flex',
                          gap: '16px',
                          cursor: 'pointer',
                          backgroundColor: notification.read ? 'transparent' : 'var(--bg-primary)',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-primary)'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = notification.read ? 'transparent' : 'var(--bg-primary)'}
                      >
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '12px',
                          backgroundColor: `${color}15`,
                          color: color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <Icon size={20} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', lineHeight: '1.4' }}>{notification.message}</span>
                            {!notification.read && <div style={{ width: '6px', height: '6px', backgroundColor: 'var(--accent-color)', borderRadius: '50%', marginTop: '6px', flexShrink: 0, marginLeft: '8px' }} />}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', fontSize: '11px' }}>
                            <Clock size={12} /> {formatTimestamp(notification.timestamp)}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div style={{ padding: '16px', textAlign: 'center', backgroundColor: 'var(--bg-primary)' }}>
                <button style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--accent-color)', 
                  fontSize: '13px', 
                  fontWeight: '700', 
                  cursor: 'pointer' 
                }}>View all activity</button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '6px 6px 6px 12px',
          backgroundColor: 'var(--bg-primary)',
          borderRadius: '14px',
          border: '1px solid var(--border-color)',
          cursor: 'pointer'
        }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>{userName}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '500' }}>{userRole}</div>
          </div>
          <Avatar initials={userInitials} size="sm" />
        </div>
      </div>
    </header>
  );
};

export default Header;
