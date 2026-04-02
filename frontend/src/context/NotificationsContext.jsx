import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const NotificationsContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};

export const NotificationsProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  // Load notifications from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('notifications');
    if (saved) {
      try {
        setNotifications(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse notifications', e);
      }
    }
  }, []);

  // Save notifications to localStorage
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now(),
      read: false,
      timestamp: new Date().toISOString(),
      ...notification
    };
    setNotifications(prev => [newNotification, ...prev]);
    return newNotification;
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  }, []);

  const markAllAsRead = useCallback((userId) => {
    setNotifications(prev => prev.map(n => 
      n.userId === userId ? { ...n, read: true } : n
    ));
  }, []);

  const clearAll = useCallback((userId) => {
    setNotifications(prev => prev.filter(n => n.userId !== userId));
  }, []);

  const getUserNotifications = useCallback((userId) => {
    return notifications.filter(n => n.userId === userId);
  }, [notifications]);

  const getUnreadCount = useCallback((userId) => {
    return notifications.filter(n => n.userId === userId && !n.read).length;
  }, [notifications]);

  // Notification triggers
  const notifyLeaveApproved = useCallback((employeeId, employeeName, dates) => {
    addNotification({
      userId: employeeId,
      type: 'leave_approved',
      message: `Your leave request for ${dates} has been approved ✅`,
      link: '/my-leaves'
    });
  }, [addNotification]);

  const notifyLeaveRejected = useCallback((employeeId, employeeName, dates, reason) => {
    addNotification({
      userId: employeeId,
      type: 'leave_rejected',
      message: `Your leave request for ${dates} has been rejected ❌ — Reason: ${reason}`,
      link: '/my-leaves'
    });
  }, [addNotification]);

  const notifyNewLeaveRequest = useCallback((adminId, employeeName, dates) => {
    addNotification({
      userId: adminId,
      type: 'new_leave_request',
      message: `${employeeName} submitted a leave request for ${dates}`,
      link: '/leaves'
    });
  }, [addNotification]);

  const notifyNewEmployee = useCallback((adminId, employeeName) => {
    addNotification({
      userId: adminId,
      type: 'new_employee',
      message: `New employee ${employeeName} has been added`,
      link: '/employees'
    });
  }, [addNotification]);

  const notifyPayrollProcessed = useCallback((employeeId, month) => {
    addNotification({
      userId: employeeId,
      type: 'payroll_processed',
      message: `Your salary for ${month} has been processed and will be credited soon 💰`,
      link: '/payroll'
    });
  }, [addNotification]);

  return (
    <NotificationsContext.Provider value={{
      notifications,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearAll,
      getUserNotifications,
      getUnreadCount,
      notifyLeaveApproved,
      notifyLeaveRejected,
      notifyNewLeaveRequest,
      notifyNewEmployee,
      notifyPayrollProcessed
    }}>
      {children}
    </NotificationsContext.Provider>
  );
};
