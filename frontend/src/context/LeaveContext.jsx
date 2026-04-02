import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const LeaveContext = createContext();

export const useLeave = () => {
  const context = useContext(LeaveContext);
  if (!context) {
    throw new Error('useLeave must be used within a LeaveProvider');
  }
  return context;
};

// Mock leave data as requested
const INITIAL_LEAVES = [
  { 
    id: 1, 
    employeeId: 2, 
    employeeName: "John Doe", 
    type: "Annual", 
    from: "2025-04-10", 
    to: "2025-04-12", 
    days: 3, 
    reason: "Family vacation", 
    status: "pending", 
    appliedOn: "2025-04-01" 
  },
  { 
    id: 2, 
    employeeId: 2, 
    employeeName: "John Doe", 
    type: "Sick", 
    from: "2025-03-20", 
    to: "2025-03-21", 
    days: 2, 
    reason: "Fever and cold", 
    status: "approved", 
    appliedOn: "2025-03-19" 
  },
  { 
    id: 3, 
    employeeId: 2, 
    employeeName: "John Doe", 
    type: "Casual", 
    from: "2025-03-05", 
    to: "2025-03-05", 
    days: 1, 
    reason: "Personal errand", 
    status: "rejected", 
    appliedOn: "2025-03-04",
    rejectionReason: "Insufficient notice period"
  },
  { 
    id: 4, 
    employeeId: 3, 
    employeeName: "Jane Smith", 
    type: "Maternity/Paternity", 
    from: "2025-05-01", 
    to: "2025-06-30", 
    days: 60, 
    reason: "Maternity leave", 
    status: "pending", 
    appliedOn: "2025-03-25" 
  }
];

// Initial leave balances per employee
const INITIAL_BALANCES = {
  2: { annual: 12, sick: 10, casual: 8, maternity: 90, unpaid: 0, used: 3, pending: 3 },
  3: { annual: 12, sick: 10, casual: 8, maternity: 90, unpaid: 0, used: 0, pending: 60 }
};

export const LeaveProvider = ({ children }) => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [leaveBalances, setLeaveBalances] = useState({});
  const [notifications, setNotifications] = useState([]);

  // Initialize data from localStorage or use defaults
  useEffect(() => {
    const savedLeaves = localStorage.getItem('leaves');
    const savedBalances = localStorage.getItem('leaveBalances');
    const savedNotifications = localStorage.getItem('leaveNotifications');

    if (savedLeaves) {
      setLeaves(JSON.parse(savedLeaves));
    } else {
      setLeaves(INITIAL_LEAVES);
      localStorage.setItem('leaves', JSON.stringify(INITIAL_LEAVES));
    }

    if (savedBalances) {
      setLeaveBalances(JSON.parse(savedBalances));
    } else {
      setLeaveBalances(INITIAL_BALANCES);
      localStorage.setItem('leaveBalances', JSON.stringify(INITIAL_BALANCES));
    }

    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (leaves.length > 0) {
      localStorage.setItem('leaves', JSON.stringify(leaves));
    }
  }, [leaves]);

  useEffect(() => {
    if (Object.keys(leaveBalances).length > 0) {
      localStorage.setItem('leaveBalances', JSON.stringify(leaveBalances));
    }
  }, [leaveBalances]);

  useEffect(() => {
    localStorage.setItem('leaveNotifications', JSON.stringify(notifications));
  }, [notifications]);

  const getEmployeeBalance = useCallback((employeeId) => {
    return leaveBalances[employeeId] || { 
      annual: 12, 
      sick: 10, 
      casual: 8, 
      maternity: 90, 
      unpaid: 0, 
      used: 0, 
      pending: 0 
    };
  }, [leaveBalances]);

  const applyLeave = useCallback((leaveData) => {
    const newLeave = {
      ...leaveData,
      id: Date.now(),
      status: 'pending',
      appliedOn: new Date().toISOString().split('T')[0]
    };

    setLeaves(prev => [newLeave, ...prev]);

    // Update pending count
    const balance = leaveBalances[leaveData.employeeId] || { 
      annual: 12, sick: 10, casual: 8, maternity: 90, unpaid: 0, used: 0, pending: 0 
    };
    setLeaveBalances(prev => ({
      ...prev,
      [leaveData.employeeId]: {
        ...balance,
        pending: balance.pending + leaveData.days
      }
    }));

    return newLeave;
  }, [leaveBalances]);

  const approveLeave = useCallback((leaveId) => {
    const leave = leaves.find(l => l.id === leaveId);
    if (!leave) return;

    setLeaves(prev => prev.map(l => 
      l.id === leaveId ? { ...l, status: 'approved' } : l
    ));

    // Update balance: deduct from available, move from pending to used
    const balance = leaveBalances[leave.employeeId] || { 
      annual: 12, sick: 10, casual: 8, maternity: 90, unpaid: 0, used: 0, pending: 0 
    };
    const leaveType = leave.type.toLowerCase().replace('/', '');
    
    setLeaveBalances(prev => ({
      ...prev,
      [leave.employeeId]: {
        ...balance,
        [leaveType]: Math.max(0, (balance[leaveType] || 0) - leave.days),
        used: balance.used + leave.days,
        pending: Math.max(0, balance.pending - leave.days)
      }
    }));

    // Add notification for employee
    addNotification(leave.employeeId, {
      id: Date.now(),
      message: `Your leave request for ${leave.from} to ${leave.to} has been approved`,
      type: 'approved',
      leaveId: leaveId,
      read: false,
      timestamp: new Date().toISOString()
    });
  }, [leaves, leaveBalances]);

  const rejectLeave = useCallback((leaveId, rejectionReason) => {
    const leave = leaves.find(l => l.id === leaveId);
    if (!leave) return;

    setLeaves(prev => prev.map(l => 
      l.id === leaveId ? { ...l, status: 'rejected', rejectionReason } : l
    ));

    // Update balance: restore pending count
    const balance = leaveBalances[leave.employeeId] || { 
      annual: 12, sick: 10, casual: 8, maternity: 90, unpaid: 0, used: 0, pending: 0 
    };
    setLeaveBalances(prev => ({
      ...prev,
      [leave.employeeId]: {
        ...balance,
        pending: Math.max(0, balance.pending - leave.days)
      }
    }));

    // Add notification for employee
    addNotification(leave.employeeId, {
      id: Date.now(),
      message: `Your leave request for ${leave.from} to ${leave.to} has been rejected`,
      type: 'rejected',
      leaveId: leaveId,
      reason: rejectionReason,
      read: false,
      timestamp: new Date().toISOString()
    });
  }, [leaves, leaveBalances]);

  const cancelLeave = useCallback((leaveId) => {
    const leave = leaves.find(l => l.id === leaveId);
    if (!leave || leave.status !== 'pending') return;

    setLeaves(prev => prev.filter(l => l.id !== leaveId));

    // Restore pending balance
    const balance = leaveBalances[leave.employeeId] || { 
      annual: 12, sick: 10, casual: 8, maternity: 90, unpaid: 0, used: 0, pending: 0 
    };
    setLeaveBalances(prev => ({
      ...prev,
      [leave.employeeId]: {
        ...balance,
        pending: Math.max(0, balance.pending - leave.days)
      }
    }));
  }, [leaves, leaveBalances]);

  const addNotification = useCallback((employeeId, notification) => {
    setNotifications(prev => [...prev, { ...notification, employeeId }]);
  }, []);

  const markNotificationAsRead = useCallback((notificationId) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
  }, []);

  const getEmployeeNotifications = useCallback((employeeId) => {
    return notifications.filter(n => n.employeeId === employeeId);
  }, [notifications]);

  const getUnreadCount = useCallback((employeeId) => {
    return notifications.filter(n => n.employeeId === employeeId && !n.read).length;
  }, [notifications]);

  return (
    <LeaveContext.Provider value={{
      leaves,
      leaveBalances,
      getEmployeeBalance,
      applyLeave,
      approveLeave,
      rejectLeave,
      cancelLeave,
      getEmployeeNotifications,
      getUnreadCount,
      markNotificationAsRead
    }}>
      {children}
    </LeaveContext.Provider>
  );
};
