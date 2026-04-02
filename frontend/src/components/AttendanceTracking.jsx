import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Users, 
  CheckCircle, XCircle, Clock, Home, Download, Search, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAttendance } from '../context/AttendanceContext';
import { useToast } from '../App';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Avatar from './Avatar';

const AttendanceTracking = () => {
  const { user, role } = useAuth();
  const { 
    attendance, 
    markAttendance, 
    markBulkHoliday, 
    getAttendanceForDate, 
    getEmployeeAttendance,
    getEmployeeStats,
    getAttendanceStreak,
    getDailySummary
  } = useAttendance();
  const { showToast } = useToast();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [employees, setEmployees] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadEmployees();
  }, []);

  // ESC key to close side panel
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && sidePanelOpen) {
        setSidePanelOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [sidePanelOpen]);

  const loadEmployees = () => {
    const saved = localStorage.getItem('employees');
    if (saved) {
      setEmployees(JSON.parse(saved));
    } else {
      setEmployees([
        { id: 1, first_name: 'Admin', last_name: 'User', email: 'admin@company.com' },
        { id: 2, first_name: 'John', last_name: 'Doe', email: 'john@company.com' },
        { id: 3, first_name: 'Jane', last_name: 'Smith', email: 'jane@company.com' }
      ]);
    }
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();

  const getDaysInMonth = () => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDayClick = (day) => {
    if (!day) return;
    const date = new Date(year, month, day);
    const dateStr = date.toISOString().split('T')[0];
    setSelectedDate(dateStr);
    setSidePanelOpen(true);
  };

  const handleStatusChange = (employeeId, status) => {
    if (selectedDate) {
      markAttendance(selectedDate, employeeId, status);
      showToast('Attendance updated', 'success');
    }
  };

  const handleMarkHoliday = () => {
    if (selectedDate) {
      markBulkHoliday(selectedDate);
      showToast('Marked as holiday for all employees', 'success');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Present': 'bg-green-500',
      'Absent': 'bg-red-500',
      'On Leave': 'bg-amber-500',
      'Weekend': 'bg-gray-500',
      'Holiday': 'bg-blue-500'
    };
    return colors[status] || 'bg-gray-300';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Present': <CheckCircle size={16} />,
      'Absent': <XCircle size={16} />,
      'On Leave': <Clock size={16} />,
      'Weekend': <Home size={16} />,
      'Holiday': <CalendarIcon size={16} />
    };
    return icons[status] || null;
  };

  const handleExportMonthlyReport = () => {
    showToast('Exporting...', 'info');

    const exportData = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    employees.forEach(emp => {
      const row = {
        'Employee': `${emp.first_name} ${emp.last_name}`,
        'Email': emp.email
      };

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateStr = date.toISOString().split('T')[0];
        const status = attendance[dateStr]?.[emp.id] || 'N/A';
        row[`Day ${day}`] = status;
      }

      const stats = getEmployeeStats(emp.id, year, month);
      row['Present'] = stats.present;
      row['Absent'] = stats.absent;
      row['On Leave'] = stats.onLeave;
      row['Attendance %'] = stats.percentage + '%';

      exportData.push(row);
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
    
    const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    XLSX.writeFile(wb, `Attendance_${monthName.replace(' ', '_')}.xlsx`);

    showToast('Export complete ✅', 'success');
  };

  const handleExportEmployeeReport = () => {
    const employeeId = user?.id || 2;
    const emp = employees.find(e => e.id === employeeId);
    if (!emp) return;

    showToast('Generating PDF...', 'info');

    const doc = new jsPDF();
    const stats = getEmployeeStats(employeeId, year, month);
    const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    // Header
    doc.setFontSize(20);
    doc.setTextColor(30, 27, 75);
    doc.text('EMS - Employee Management System', 105, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text('Attendance Report', 105, 30, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 38, { align: 'center' });

    // Employee Info
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Employee: ${emp.first_name} ${emp.last_name}`, 20, 50);
    doc.text(`Email: ${emp.email}`, 20, 58);
    doc.text(`Period: ${monthName}`, 20, 66);

    // Stats
    doc.setFontSize(14);
    doc.setTextColor(30, 27, 75);
    doc.text('Attendance Summary', 20, 80);

    const summaryData = [
      ['Days Present', stats.present],
      ['Days Absent', stats.absent],
      ['Days On Leave', stats.onLeave],
      ['Weekends', stats.weekend],
      ['Holidays', stats.holiday],
      ['Attendance %', stats.percentage + '%']
    ];

    doc.autoTable({
      startY: 85,
      head: [['Metric', 'Value']],
      body: summaryData,
      theme: 'grid',
      headStyles: { fillColor: [30, 27, 75] },
      margin: { left: 20, right: 20 }
    });

    doc.save(`Attendance_Report_${monthName.replace(' ', '_')}.pdf`);
    showToast('Export complete ✅', 'success');
  };

  // Calculate today's summary
  const todayStr = today.toISOString().split('T')[0];
  const todaySummary = getDailySummary(todayStr);

  // Employee view
  if (role === 'employee') {
    const employeeId = user?.id || 2;
    const empAttendance = getEmployeeAttendance(employeeId, year, month);
    const stats = getEmployeeStats(employeeId, year, month);
    const streak = getAttendanceStreak(employeeId);

    // Last 3 months data for chart
    const chartData = [];
    for (let i = 2; i >= 0; i--) {
      const d = new Date(year, month - i, 1);
      const monthStats = getEmployeeStats(employeeId, d.getFullYear(), d.getMonth());
      chartData.push({
        month: d.toLocaleDateString('en-US', { month: 'short' }),
        present: monthStats.present,
        absent: monthStats.absent
      });
    }

    return (
      <div className="max-w-6xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">My Attendance</h1>
            <p className="text-[var(--text-secondary)]">Track your attendance and view reports</p>
          </div>
          {isAdmin && (
            <button
              onClick={handleExportEmployeeReport}
              className="px-4 py-2 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all flex items-center gap-2"
            >
              <Download size={18} />
              Export PDF
            </button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={`bg-white dark:bg-[var(--bg-card)] rounded-xl p-6 border-l-4 border-green-500 shadow-sm animate-fade-in-up opacity-0 stagger-1`} style={{ animationFillMode: 'forwards' }}>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <CheckCircle size={24} className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-[var(--text-secondary)] font-medium mb-1">Days Present</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.present}</p>
              </div>
            </div>
          </div>

          <div className={`bg-white dark:bg-[var(--bg-card)] rounded-xl p-6 border-l-4 border-red-500 shadow-sm animate-fade-in-up opacity-0 stagger-2`} style={{ animationFillMode: 'forwards' }}>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                <XCircle size={24} className="text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-[var(--text-secondary)] font-medium mb-1">Days Absent</p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.absent}</p>
              </div>
            </div>
          </div>

          <div className={`bg-white dark:bg-[var(--bg-card)] rounded-xl p-6 border-l-4 border-amber-500 shadow-sm animate-fade-in-up opacity-0 stagger-3`} style={{ animationFillMode: 'forwards' }}>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                <Clock size={24} className="text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-[var(--text-secondary)] font-medium mb-1">Leave Days</p>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.onLeave}</p>
              </div>
            </div>
          </div>

          <div className={`bg-white dark:bg-[var(--bg-card)] rounded-xl p-6 border-l-4 border-blue-500 shadow-sm animate-fade-in-up opacity-0 stagger-4`} style={{ animationFillMode: 'forwards' }}>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <CalendarIcon size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-[var(--text-secondary)] font-medium mb-1">Attendance</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.percentage}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Streak */}
        {streak > 0 && (
          <div className={`bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg mb-8 animate-fade-in-up opacity-0 stagger-5`} style={{ animationFillMode: 'forwards' }}>
            <div className="flex items-center gap-4">
              <span className="text-5xl">🔥</span>
              <div>
                <p className="text-sm opacity-80 mb-1">Current Streak</p>
                <p className="text-3xl font-bold">
                  You've been present for <span className="animate-pulse">{streak}</span> consecutive days!
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className={`bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] shadow-sm p-6 animate-fade-in-up opacity-0 stagger-6`} style={{ animationFillMode: 'forwards' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                  {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={handlePrevMonth}
                    className="p-2 hover:bg-[var(--input-bg)] rounded-lg transition-colors"
                  >
                    <ChevronLeft size={20} className="text-[var(--text-primary)]" />
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="p-2 hover:bg-[var(--input-bg)] rounded-lg transition-colors"
                  >
                    <ChevronRight size={20} className="text-[var(--text-primary)]" />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-xs font-bold text-[var(--text-secondary)] uppercase py-2">
                    {day}
                  </div>
                ))}
                
                {getDaysInMonth().map((day, index) => {
                  if (!day) {
                    return <div key={`empty-${index}`} className="aspect-square" />;
                  }

                  const date = new Date(year, month, day);
                  const dateStr = date.toISOString().split('T')[0];
                  const status = empAttendance[dateStr];
                  const isToday = dateStr === todayStr;
                  const isFuture = date > today;

                  return (
                    <div
                      key={day}
                      className={`aspect-square flex flex-col items-center justify-center rounded-lg border-2 transition-all ${
                        isToday ? 'border-[var(--accent-color)] ring-2 ring-[var(--accent-color)]/20' : 'border-transparent'
                      } ${isFuture ? 'opacity-40' : ''} animate-fade-in-up opacity-0`}
                      style={{ 
                        animationDelay: `${0.02 * index}s`, 
                        animationFillMode: 'forwards',
                        backgroundColor: status ? `var(--${getStatusColor(status).replace('bg-', '')}-100)` : 'var(--input-bg)'
                      }}
                    >
                      <span className={`text-sm font-bold ${status ? 'text-white' : 'text-[var(--text-primary)]'}`}>
                        {day}
                      </span>
                      {status && (
                        <div className={`mt-1 w-6 h-6 rounded-full ${getStatusColor(status)} flex items-center justify-center text-white`}>
                          {getStatusIcon(status)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-6 pt-6 border-t border-[var(--border-color)] flex flex-wrap gap-4">
                {[
                  { label: 'Present', color: 'bg-green-500' },
                  { label: 'Absent', color: 'bg-red-500' },
                  { label: 'On Leave', color: 'bg-amber-500' },
                  { label: 'Weekend', color: 'bg-gray-500' },
                  { label: 'Holiday', color: 'bg-blue-500' }
                ].map(({ label, color }) => (
                  <div key={label} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded ${color}`} />
                    <span className="text-xs text-[var(--text-secondary)]">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trend Chart */}
          <div className={`bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] shadow-sm p-6 animate-fade-in-up opacity-0 stagger-7`} style={{ animationFillMode: 'forwards' }}>
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">Last 3 Months Trend</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="month" stroke="var(--text-secondary)" />
                <YAxis 
                  stroke="var(--text-secondary)"
                  label={{ value: 'Days', angle: -90, position: 'insideLeft', style: { fill: 'var(--text-secondary)' } }}
                  domain={[0, 'auto']}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="present" fill="#10B981" radius={[8, 8, 0, 0]} name="Present" />
                <Bar dataKey="absent" fill="#EF4444" radius={[8, 8, 0, 0]} name="Absent" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }

  // Admin view - macOS Calendar Style
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  const handleTodayClick = () => {
    setCurrentDate(new Date());
  };

  const getDaysInMonthWithPrevNext = () => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    
    const days = [];
    
    // Add previous month's trailing days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        isPrevMonth: true,
        date: new Date(year, month - 1, prevMonthLastDay - i)
      });
    }
    
    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        isPrevMonth: false,
        date: new Date(year, month, day)
      });
    }
    
    // Add next month's leading days to fill the grid
    const remainingCells = 42 - days.length; // 6 rows * 7 days
    for (let day = 1; day <= remainingCells; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        isPrevMonth: false,
        date: new Date(year, month + 1, day)
      });
    }
    
    return days;
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Attendance Tracking</h1>
            <p className="text-[var(--text-secondary)]">Monitor and manage employee attendance</p>
          </div>
          {isAdmin && (
            <button
              onClick={handleExportMonthlyReport}
              className="px-4 py-2 bg-[var(--accent-color)] text-white font-semibold rounded-xl hover:opacity-90 transition-all flex items-center gap-2 shadow-lg"
            >
              <Download size={18} />
              Export to Excel
            </button>
          )}
        </div>

        {/* Stat Cards - Lighter Style */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-[var(--bg-card)] rounded-xl p-6 border-l-4 border-green-500 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <CheckCircle size={24} className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-[var(--text-secondary)] font-medium mb-1">Present Today</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{todaySummary.present}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[var(--bg-card)] rounded-xl p-6 border-l-4 border-red-500 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                <XCircle size={24} className="text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-[var(--text-secondary)] font-medium mb-1">Absent Today</p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">{todaySummary.absent}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[var(--bg-card)] rounded-xl p-6 border-l-4 border-amber-500 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                <Clock size={24} className="text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-[var(--text-secondary)] font-medium mb-1">On Leave</p>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{todaySummary.onLeave}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[var(--bg-card)] rounded-xl p-6 border-l-4 border-blue-500 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <Users size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-[var(--text-secondary)] font-medium mb-1">Total Workforce</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{employees.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Header - macOS Style */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-[var(--text-primary)]">
            {monthNames[month]} {year}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleTodayClick}
              className="px-4 py-2 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--input-bg)] rounded-lg transition-colors"
            >
              Today
            </button>
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-[var(--input-bg)] rounded-lg transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft size={20} className="text-[var(--text-primary)]" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-[var(--input-bg)] rounded-lg transition-colors"
              aria-label="Next month"
            >
              <ChevronRight size={20} className="text-[var(--text-primary)]" />
            </button>
          </div>
        </div>

        {/* Calendar Grid - macOS Style */}
        <div className="bg-transparent">
          {/* Day Headers */}
          <div className="grid grid-cols-7 mb-2">
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
              <div key={day} className="text-center py-2">
                <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                  {day}
                </span>
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-[1px] bg-[#e5e7eb] dark:bg-[#2e2e42]">
            {getDaysInMonthWithPrevNext().map((dayObj, index) => {
              const dateStr = dayObj.date.toISOString().split('T')[0];
              const summary = getDailySummary(dateStr);
              const isToday = dateStr === todayStr;
              const isFuture = dayObj.date > today;
              const dayOfWeek = dayObj.date.getDay();
              const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

              return (
                <div
                  key={`${dayObj.date.getTime()}-${index}`}
                  onClick={() => dayObj.isCurrentMonth && !isFuture && handleDayClick(dayObj.day)}
                  className={`min-h-[120px] p-2 ${
                    dayObj.isCurrentMonth && !isFuture ? 'cursor-pointer' : 'cursor-default'
                  } transition-colors`}
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    ...(dayObj.isCurrentMonth && !isFuture && {
                      ':hover': {
                        backgroundColor: '#f9fafb'
                      }
                    })
                  }}
                  onMouseEnter={(e) => {
                    if (dayObj.isCurrentMonth && !isFuture) {
                      e.currentTarget.style.backgroundColor = '#f9fafb';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-card)';
                  }}
                >
                  {/* Date Number */}
                  <div className="flex justify-start mb-2">
                    {isToday ? (
                      <div className="w-7 h-7 rounded-full bg-[#1e1b4b] dark:bg-[var(--accent-color)] flex items-center justify-center">
                        <span className="text-sm font-semibold text-white">
                          {dayObj.day}
                        </span>
                      </div>
                    ) : (
                      <span className={`text-sm font-medium ${
                        dayObj.isCurrentMonth 
                          ? 'text-[#111827] dark:text-[var(--text-primary)]' 
                          : 'text-[#9ca3af] dark:text-gray-600'
                      }`}>
                        {dayObj.day}
                      </span>
                    )}
                  </div>

                  {/* Event Pills - macOS Style */}
                  {dayObj.isCurrentMonth && !isFuture && (
                    <div className="space-y-1">
                      {/* Weekend Pill */}
                      {isWeekend && (
                        <div className="px-2 py-1 rounded-md bg-gray-500 text-white text-xs font-medium truncate">
                          Weekend
                        </div>
                      )}
                      
                      {/* Holiday Pill */}
                      {!isWeekend && summary.total > 0 && getAttendanceForDate(dateStr)[employees[0]?.id] === 'Holiday' && (
                        <div className="px-2 py-1 rounded-md bg-blue-500 text-white text-xs font-medium truncate">
                          🔵 Holiday
                        </div>
                      )}
                      
                      {/* Present Pill */}
                      {!isWeekend && summary.present > 0 && getAttendanceForDate(dateStr)[employees[0]?.id] !== 'Holiday' && (
                        <div className="px-2 py-1 rounded-md bg-green-500 text-white text-xs font-medium truncate">
                          🟢 {summary.present} Present
                        </div>
                      )}
                      
                      {/* Absent Pill */}
                      {!isWeekend && summary.absent > 0 && (
                        <div className="px-2 py-1 rounded-md bg-red-500 text-white text-xs font-medium truncate">
                          🔴 {summary.absent} Absent
                        </div>
                      )}
                      
                      {/* On Leave Pill */}
                      {!isWeekend && summary.onLeave > 0 && (
                        <div className="px-2 py-1 rounded-md bg-amber-500 text-white text-xs font-medium truncate">
                          🟡 {summary.onLeave} On Leave
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Side Panel */}
      {sidePanelOpen && selectedDate && (
        <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="attendance-panel-title">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidePanelOpen(false)} aria-label="Close panel" />
          
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-2xl bg-[var(--bg-card)] shadow-2xl overflow-y-auto animate-slide-in-right">
            <div className="sticky top-0 bg-gradient-to-r from-[#1E1B4B] to-[#3D3B8E] p-6 flex items-center justify-between z-10">
              <div>
                <h2 id="attendance-panel-title" className="text-xl font-bold text-white">Attendance Details</h2>
                <p className="text-sm text-white/70 mt-1">
                  {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <button
                onClick={() => setSidePanelOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Close panel"
              >
                <X size={24} className="text-white" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Actions */}
              {isAdmin && (
                <div className="flex gap-3">
                  <button
                    onClick={handleMarkHoliday}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all"
                  >
                    Mark as Holiday
                  </button>
                </div>
              )}

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]" size={20} />
                <input
                  type="text"
                  placeholder="Search employee..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                />
              </div>

              {/* Employee List */}
              <div className="space-y-3">
                {employees
                  .filter(emp => 
                    `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map(emp => {
                    const status = getAttendanceForDate(selectedDate)[emp.id] || 'Present';
                    
                    return (
                      <div key={emp.id} className="p-4 bg-[var(--input-bg)] rounded-xl border border-[var(--border-color)]">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Avatar 
                              initials={`${emp.first_name[0]}${emp.last_name[0]}`}
                              size="md"
                            />
                            <div>
                              <p className="text-sm font-semibold text-[var(--text-primary)]">
                                {emp.first_name} {emp.last_name}
                              </p>
                              <p className="text-xs text-[var(--text-secondary)]">{emp.email}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getStatusColor(status)}`}>
                            {status}
                          </span>
                        </div>

                        {isAdmin && (
                          <div className="grid grid-cols-5 gap-2">
                            {['Present', 'Absent', 'On Leave', 'Weekend', 'Holiday'].map(s => (
                              <button
                                key={s}
                                onClick={() => handleStatusChange(emp.id, s)}
                                className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                  status === s
                                    ? `${getStatusColor(s)} text-white`
                                    : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--input-bg)]'
                                }`}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AttendanceTracking;
