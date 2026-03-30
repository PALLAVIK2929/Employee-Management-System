import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, Search, Check, Trash2, 
  UserPlus, Calendar, AlertCircle,
  Clock
} from 'lucide-react';

const Header = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const notificationRef = useRef(null);
  
  const userStr = localStorage.getItem('user');
  let user = {};
  try {
    user = JSON.parse(userStr || '{}');
  } catch (e) {
    user = {};
  }
  const userName = user.name || 'Admin User';
  const userRole = user.role === 'admin' ? 'Administrator' : 'Standard Employee';
  const userInitials = user.initials || 'AD';

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Salary Credited",
      desc: "Your salary for March 2026 has been credited to your bank account.",
      time: "Just now",
      type: "salary",
      icon: Clock,
      color: "#10B981",
      isRead: false
    },
    {
      id: 2,
      title: "New Task Assigned",
      desc: "You have been assigned: 'Quarterly Performance Review'.",
      time: "10 mins ago",
      type: "task",
      icon: AlertCircle,
      color: "#3D3B8E",
      isRead: false
    },
    {
      id: 3,
      title: "Leave Approved",
      desc: "Your vacation request for next week has been approved by Admin.",
      time: "1 hour ago",
      type: "leave",
      icon: Calendar,
      color: "#4F46E5",
      isRead: false
    },
    {
      id: 4,
      title: "New Employee Joined",
      desc: "Sarah Wilson has completed her onboarding.",
      time: "2 hours ago",
      type: "onboarding",
      icon: UserPlus,
      color: "#F59E0B",
      isRead: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const clearAll = () => {
    setNotifications([]);
    setShowNotifications(false);
  };

  return (
    <header style={{
      height: '64px',
      backgroundColor: '#fff',
      borderBottom: '1px solid #E5E7EB',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Search Bar */}
      <div style={{ position: 'relative', width: '400px' }}>
        <div style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#9CA3AF'
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
            backgroundColor: '#F9FAFB',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.2s',
            color: '#1E1B4B'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#3D3B8E';
            e.target.style.backgroundColor = '#fff';
            e.target.style.boxShadow = '0 0 0 4px rgba(61, 59, 142, 0.05)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#E5E7EB';
            e.target.style.backgroundColor = '#F9FAFB';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>

      {/* Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Notification Bell */}
        <div style={{ position: 'relative' }} ref={notificationRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: showNotifications ? '#EEF2FF' : 'transparent',
              border: 'none',
              color: showNotifications ? '#3D3B8E' : '#6B7280',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              position: 'relative'
            }}
            onMouseOver={(e) => {
              if (!showNotifications) e.currentTarget.style.backgroundColor = '#F3F4F6';
            }}
            onMouseOut={(e) => {
              if (!showNotifications) e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <div style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: '10px',
                height: '10px',
                backgroundColor: '#EF4444',
                borderRadius: '50%',
                border: '2px solid #fff'
              }} />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div style={{
              position: 'absolute',
              top: '52px',
              right: '0',
              width: '360px',
              backgroundColor: '#fff',
              borderRadius: '20px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              border: '1px solid #E5E7EB',
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
                borderBottom: '1px solid #F3F4F6',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>Notifications</h3>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={clearAll}
                    style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600' }}
                  >
                    <Trash2 size={14} /> Clear
                  </button>
                </div>
              </div>

              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                    <div style={{ color: '#E5E7EB', marginBottom: '12px' }}><Bell size={40} style={{ margin: '0 auto' }} /></div>
                    <p style={{ color: '#9CA3AF', fontSize: '14px', margin: 0 }}>No new notifications</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div 
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      style={{
                        padding: '16px 24px',
                        borderBottom: '1px solid #F9FAFB',
                        display: 'flex',
                        gap: '16px',
                        cursor: 'pointer',
                        backgroundColor: n.isRead ? 'transparent' : '#F9FAFB',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = n.isRead ? 'transparent' : '#F9FAFB'}
                    >
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        backgroundColor: `${n.color}10`,
                        color: n.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <n.icon size={20} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                          <span style={{ fontSize: '14px', fontWeight: '700', color: '#1E1B4B' }}>{n.title}</span>
                          {!n.isRead && <div style={{ width: '6px', height: '6px', backgroundColor: '#3D3B8E', borderRadius: '50%', marginTop: '6px' }} />}
                        </div>
                        <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 8px 0', lineHeight: '1.4' }}>{n.desc}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#9CA3AF', fontSize: '11px' }}>
                          <Clock size={12} /> {n.time}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div style={{ padding: '16px', textAlign: 'center', backgroundColor: '#F9FAFB' }}>
                <button style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#3D3B8E', 
                  fontSize: '13px', 
                  fontWeight: '700', 
                  cursor: 'pointer' 
                }}>View all activity</button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Summary */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '20px', borderLeft: '1px solid #E5E7EB' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#1E1B4B' }}>{userName}</div>
            <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: '600' }}>{userRole}</div>
          </div>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '12px', 
            backgroundColor: '#1E1B4B',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800',
            fontSize: '14px'
          }}>
            {userInitials}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
