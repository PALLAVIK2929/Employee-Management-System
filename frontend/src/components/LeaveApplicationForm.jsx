import React, { useState, useEffect } from 'react';
import { X, Calendar, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLeave } from '../context/LeaveContext';
import { useNotifications } from '../context/NotificationsContext';
import { useToast } from '../App';

const LeaveApplicationForm = ({ onClose }) => {
  const { user } = useAuth();
  const { applyLeave, getEmployeeBalance } = useLeave();
  const { notifyNewLeaveRequest } = useNotifications();
  const { showToast } = useToast();
  
  const [form, setForm] = useState({
    type: 'Annual',
    from: '',
    to: '',
    reason: ''
  });
  
  const [errors, setErrors] = useState({});
  const [days, setDays] = useState(0);
  const [mounted, setMounted] = useState(false);

  const balance = getEmployeeBalance(user?.id || 2);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (form.from && form.to) {
      const calculated = calculateDays(form.from, form.to);
      setDays(calculated);
    } else {
      setDays(0);
    }
  }, [form.from, form.to]);

  const calculateDays = (from, to) => {
    if (!from || !to) return 0;
    const start = new Date(from);
    const end = new Date(to);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 0;
  };

  const validateForm = () => {
    const newErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const fromDate = new Date(form.from);
    const toDate = new Date(form.to);

    // From date validation
    if (!form.from) {
      newErrors.from = 'From date is required';
    } else if (fromDate < today) {
      newErrors.from = "From date can't be in the past";
    }

    // To date validation
    if (!form.to) {
      newErrors.to = 'To date is required';
    } else if (toDate < fromDate) {
      newErrors.to = "To date can't be before From date";
    }

    // Reason validation
    if (!form.reason.trim()) {
      newErrors.reason = 'Reason is required';
    } else if (form.reason.trim().length < 10) {
      newErrors.reason = 'Reason must be at least 10 characters';
    }

    // Balance validation
    const leaveType = form.type.toLowerCase().replace('/', '');
    const availableBalance = balance[leaveType] || 0;
    
    if (availableBalance === 0 && form.type !== 'Unpaid') {
      newErrors.balance = `You have no ${form.type} leave balance remaining`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('Please fix the errors in the form', 'error');
      return;
    }

    const leaveData = {
      employeeId: user?.id || 2,
      employeeName: user?.name || 'John Doe',
      type: form.type,
      from: form.from,
      to: form.to,
      days: days,
      reason: form.reason.trim()
    };

    applyLeave(leaveData);
    
    // Notify admin (assuming admin ID is 1)
    const dates = `${form.from} to ${form.to}`;
    notifyNewLeaveRequest(1, leaveData.employeeName, dates);
    
    showToast('Leave request submitted successfully', 'success');
    onClose();
  };

  const leaveTypes = [
    { value: 'Annual', label: 'Annual Leave', balance: balance.annual },
    { value: 'Sick', label: 'Sick Leave', balance: balance.sick },
    { value: 'Casual', label: 'Casual Leave', balance: balance.casual },
    { value: 'Maternity/Paternity', label: 'Maternity/Paternity', balance: balance.maternity },
    { value: 'Unpaid', label: 'Unpaid Leave', balance: balance.unpaid }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div 
        className={`bg-[var(--bg-card)] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden transition-all duration-500 ${
          mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1E1B4B] to-[#3D3B8E] p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Calendar size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Apply for Leave</h2>
              <p className="text-sm text-white/70">Submit your leave request</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={24} className="text-white" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          {/* Leave Type */}
          <div className={`animate-fade-in-up opacity-0 stagger-1`} style={{ animationFillMode: 'forwards' }}>
            <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
              Leave Type <span className="text-red-500">*</span>
            </label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent transition-all"
            >
              {leaveTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label} (Balance: {type.balance} days)
                </option>
              ))}
            </select>
            {errors.balance && (
              <div className="mt-2 flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle size={16} />
                <span>{errors.balance}</span>
              </div>
            )}
          </div>

          {/* Date Range */}
          <div className={`grid grid-cols-2 gap-4 animate-fade-in-up opacity-0 stagger-2`} style={{ animationFillMode: 'forwards' }}>
            <div>
              <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                From Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={form.from}
                onChange={(e) => setForm({ ...form, from: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.from ? 'border-red-500' : 'border-[var(--border-color)]'
                } bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent transition-all`}
              />
              {errors.from && (
                <div className="mt-1 flex items-center gap-1 text-red-500 text-xs">
                  <AlertCircle size={14} />
                  <span>{errors.from}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                To Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={form.to}
                onChange={(e) => setForm({ ...form, to: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.to ? 'border-red-500' : 'border-[var(--border-color)]'
                } bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent transition-all`}
              />
              {errors.to && (
                <div className="mt-1 flex items-center gap-1 text-red-500 text-xs">
                  <AlertCircle size={14} />
                  <span>{errors.to}</span>
                </div>
              )}
            </div>
          </div>

          {/* Days Calculation */}
          {days > 0 && (
            <div className={`bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 animate-fade-in-up opacity-0 stagger-3`} style={{ animationFillMode: 'forwards' }}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">Total Days</span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{days}</span>
              </div>
            </div>
          )}

          {/* Reason */}
          <div className={`animate-fade-in-up opacity-0 stagger-4`} style={{ animationFillMode: 'forwards' }}>
            <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
              Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              placeholder="Please provide a detailed reason for your leave (minimum 10 characters)"
              rows={4}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.reason ? 'border-red-500' : 'border-[var(--border-color)]'
              } bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent transition-all resize-none`}
            />
            <div className="mt-1 flex items-center justify-between">
              {errors.reason ? (
                <div className="flex items-center gap-1 text-red-500 text-xs">
                  <AlertCircle size={14} />
                  <span>{errors.reason}</span>
                </div>
              ) : (
                <span className="text-xs text-[var(--text-secondary)]">
                  {form.reason.length}/10 characters minimum
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className={`flex gap-3 pt-4 animate-fade-in-up opacity-0 stagger-5`} style={{ animationFillMode: 'forwards' }}>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] font-semibold hover:bg-[var(--input-bg)] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-[#1E1B4B] to-[#3D3B8E] text-white font-bold hover:opacity-90 transition-all shadow-lg"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveApplicationForm;
