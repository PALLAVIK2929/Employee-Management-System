import React, { useState } from 'react';
import { Calendar, Plus, X, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLeave } from '../context/LeaveContext';
import { useToast } from '../App';
import { useNavigate } from 'react-router-dom';

const MyLeaves = () => {
  const { user } = useAuth();
  const { leaves, getEmployeeBalance, cancelLeave } = useLeave();
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const employeeId = user?.id || 2;
  const balance = getEmployeeBalance(employeeId);
  const myLeaves = leaves.filter(l => l.employeeId === employeeId);

  const handleCancelLeave = (leaveId) => {
    if (window.confirm('Are you sure you want to cancel this leave request?')) {
      cancelLeave(leaveId);
      showToast('Leave request cancelled successfully', 'success');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      approved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    };

    const icons = {
      pending: <Clock size={14} />,
      approved: <CheckCircle size={14} />,
      rejected: <XCircle size={14} />
    };

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${styles[status]}`}>
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">My Leaves</h1>
        <p className="text-[var(--text-secondary)]">View and manage your leave requests</p>
      </div>

      {/* Leave Balance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-[var(--bg-card)] rounded-xl p-6 border-l-4 border-blue-500 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <Calendar size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)] font-medium mb-1">Leave Balance</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{balance.annual}</p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">days available</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[var(--bg-card)] rounded-xl p-6 border-l-4 border-purple-500 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <CheckCircle size={24} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)] font-medium mb-1">Used</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{balance.used}</p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">days taken</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[var(--bg-card)] rounded-xl p-6 border-l-4 border-amber-500 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
              <Clock size={24} className="text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)] font-medium mb-1">Pending Requests</p>
              <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{myLeaves.filter(l => l.status === 'pending').length}</p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">awaiting approval</p>
            </div>
          </div>
        </div>
      </div>

      {/* Apply for Leave Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/leaves/apply')}
          className="px-6 py-3 bg-gradient-to-r from-[#1E1B4B] to-[#3D3B8E] text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg flex items-center gap-2"
        >
          <Plus size={20} />
          Apply for Leave
        </button>
      </div>

      {/* Leave Requests Table */}
      <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[var(--border-color)]">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">My Leave Requests</h2>
        </div>

        {myLeaves.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <Calendar size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No leave requests yet</h3>
            <p className="text-[var(--text-secondary)] mb-6">Start by applying for your first leave</p>
            <button
              onClick={() => navigate('/leaves/apply')}
              className="px-6 py-2 bg-[var(--accent-color)] text-white font-semibold rounded-lg hover:opacity-90 transition-all"
            >
              Apply Now
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--input-bg)]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    Leave Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    From
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    To
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    Days
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    Applied On
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {myLeaves.map((leave) => (
                  <tr key={leave.id} className="hover:bg-[var(--input-bg)] transition-colors">
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        {leave.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)] font-medium">
                      {formatDate(leave.from)}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)] font-medium">
                      {formatDate(leave.to)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-[var(--text-primary)]">{leave.days}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)] max-w-xs truncate">
                      {leave.reason}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(leave.status)}
                      {leave.status === 'rejected' && leave.rejectionReason && (
                        <div className="mt-2 flex items-start gap-1 text-xs text-red-600 dark:text-red-400">
                          <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
                          <span>{leave.rejectionReason}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                      {formatDate(leave.appliedOn)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {leave.status === 'pending' && (
                        <button
                          onClick={() => handleCancelLeave(leave.id)}
                          className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <X size={14} />
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLeaves;
