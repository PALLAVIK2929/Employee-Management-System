import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AttendanceContext = createContext();

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};

// Generate mock attendance for current month and previous 2 months
const generateMockAttendance = () => {
  const attendance = {};
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();
  
  // Load actual employee IDs from localStorage
  const savedEmployees = localStorage.getItem('employees');
  let employeeIds = [1, 2, 3]; // fallback
  
  if (savedEmployees) {
    try {
      const employees = JSON.parse(savedEmployees);
      employeeIds = employees.map(emp => emp.id);
    } catch (e) {
      console.error('Failed to parse employees', e);
    }
  }
  
  // Public holidays (mock 2 holidays per month)
  const holidays = [5, 15]; // 5th and 15th of each month
  
  // Generate attendance for last 3 months
  for (let monthOffset = 2; monthOffset >= 0; monthOffset--) {
    const targetDate = new Date(currentYear, currentMonth - monthOffset, 1);
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // For current month, only generate up to today
    const maxDay = monthOffset === 0 ? currentDay : daysInMonth;
    
    for (let day = 1; day <= maxDay; day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay();
      const dateStr = date.toISOString().split('T')[0];
      
      attendance[dateStr] = {};
      
      employeeIds.forEach(empId => {
        // Weekend
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          attendance[dateStr][empId] = 'Weekend';
        }
        // Holiday
        else if (holidays.includes(day)) {
          attendance[dateStr][empId] = 'Holiday';
        }
        // Random attendance (90% present rate)
        else {
          const rand = Math.random();
          if (rand < 0.90) {
            attendance[dateStr][empId] = 'Present';
          } else if (rand < 0.95) {
            attendance[dateStr][empId] = 'On Leave';
          } else {
            attendance[dateStr][empId] = 'Absent';
          }
        }
      });
    }
  }
  
  return attendance;
};

export const AttendanceProvider = ({ children }) => {
  const [attendance, setAttendance] = useState({});

  // Load attendance from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('attendance');
    const todayStr = new Date().toISOString().split('T')[0];
    
    if (saved) {
      try {
        const parsedAttendance = JSON.parse(saved);
        
        // Check if today's data exists
        if (!parsedAttendance[todayStr]) {
          // Generate fresh data that includes today
          const mockData = generateMockAttendance();
          setAttendance(mockData);
        } else {
          setAttendance(parsedAttendance);
        }
      } catch (e) {
        console.error('Failed to parse attendance', e);
        const mockData = generateMockAttendance();
        setAttendance(mockData);
      }
    } else {
      const mockData = generateMockAttendance();
      setAttendance(mockData);
    }
  }, []);

  // Save attendance to localStorage
  useEffect(() => {
    if (Object.keys(attendance).length > 0) {
      localStorage.setItem('attendance', JSON.stringify(attendance));
    }
  }, [attendance]);

  const markAttendance = useCallback((date, employeeId, status) => {
    setAttendance(prev => ({
      ...prev,
      [date]: {
        ...prev[date],
        [employeeId]: status
      }
    }));
  }, []);

  const markBulkHoliday = useCallback((date) => {
    // Load actual employee IDs from localStorage
    const savedEmployees = localStorage.getItem('employees');
    let employeeIds = [1, 2, 3]; // fallback
    
    if (savedEmployees) {
      try {
        const employees = JSON.parse(savedEmployees);
        employeeIds = employees.map(emp => emp.id);
      } catch (e) {
        console.error('Failed to parse employees', e);
      }
    }
    
    setAttendance(prev => ({
      ...prev,
      [date]: employeeIds.reduce((acc, empId) => ({
        ...acc,
        [empId]: 'Holiday'
      }), {})
    }));
  }, []);

  const getAttendanceForDate = useCallback((date) => {
    return attendance[date] || {};
  }, [attendance]);

  const getEmployeeAttendance = useCallback((employeeId, year, month) => {
    const result = {};
    Object.keys(attendance).forEach(date => {
      const d = new Date(date);
      if (d.getFullYear() === year && d.getMonth() === month) {
        result[date] = attendance[date][employeeId];
      }
    });
    return result;
  }, [attendance]);

  const getEmployeeStats = useCallback((employeeId, year, month) => {
    const empAttendance = getEmployeeAttendance(employeeId, year, month);
    const stats = {
      present: 0,
      absent: 0,
      onLeave: 0,
      weekend: 0,
      holiday: 0,
      total: 0
    };

    Object.values(empAttendance).forEach(status => {
      stats.total++;
      if (status === 'Present') stats.present++;
      else if (status === 'Absent') stats.absent++;
      else if (status === 'On Leave') stats.onLeave++;
      else if (status === 'Weekend') stats.weekend++;
      else if (status === 'Holiday') stats.holiday++;
    });

    const workingDays = stats.total - stats.weekend - stats.holiday;
    stats.percentage = workingDays > 0 ? ((stats.present / workingDays) * 100).toFixed(1) : 0;
    
    return stats;
  }, [attendance, getEmployeeAttendance]);

  const getAttendanceStreak = useCallback((employeeId) => {
    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);

    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const status = attendance[dateStr]?.[employeeId];
      
      if (status === 'Present') {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (status === 'Weekend' || status === 'Holiday') {
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }, [attendance]);

  const getDailySummary = useCallback((date) => {
    const dayAttendance = attendance[date] || {};
    const summary = {
      present: 0,
      absent: 0,
      onLeave: 0,
      total: 0
    };

    Object.values(dayAttendance).forEach(status => {
      summary.total++;
      if (status === 'Present') summary.present++;
      else if (status === 'Absent') summary.absent++;
      else if (status === 'On Leave') summary.onLeave++;
    });

    return summary;
  }, [attendance]);

  return (
    <AttendanceContext.Provider value={{
      attendance,
      markAttendance,
      markBulkHoliday,
      getAttendanceForDate,
      getEmployeeAttendance,
      getEmployeeStats,
      getAttendanceStreak,
      getDailySummary
    }}>
      {children}
    </AttendanceContext.Provider>
  );
};
