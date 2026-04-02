import React, { useState, useEffect } from 'react';
import { 
  Calendar, CheckCircle, XCircle, Clock, Search, Filter, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLeave } from '../context/LeaveContext';
import { useNotifications } from '../context/NotificationsContext';
import { useToast } from '../App';
import MyLeaves from './MyLeaves';
import EmptyState from './EmptyState';
import Avatar from './Avatar';

const LeaveManagement = () => {
  const { role } = useAuth();
  const { leaves, approveLeave, rejectLeave } = useLeave();
  const { notifyLeaveApproved, notifyLeaveRejected } = useNotifications();
  const { showToast } = useToast();

  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [rejectModal, setRejectModal] = useState({ isOpen: false, leaveId: null });
  const [rejectionReason, setRejectionReason] = useState('');

  // ESC key to close modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && rejectModal.isOpen) {
        setRejectModal({ isOpen: false, leaveId: null });
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [rejectModal.isOpen]);

  // If employee, show their personal leave page
  if (role === 'employee') {
    return <MyLeaves />;
  }

  // Filter leaves
  const filteredLeaves = leaves.filter(leave => {
    const matchesStatus = statusFilter === 'All' || leave.status === statusFilter.toLowerCase();
    const matchesType = typeFilter === 'All' || leave.type === typeFilter;
    const matchesSearch = searchQuery === '' || 
      leave.employeeName.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesType && matchesSearch;
  });

  const handleApprove = (leaveId) => {
    const leave = leaves.find(l => l.id === leaveId);
    approveLeave(leaveId);
    
    // Trigger notification
    const dates = `${leave.from} to ${leave.to}`;
    notifyLeaveApproved(leave.employeeId, leave.employeeName, dates);
    
    showToast(`Leave approved for ${leave.employeeName}`, 'success');
  };

  const handleRejectClick = (leaveId) => {
    setRejectModal({ isOpen: true, leaveId });
    setRejectionReason('');
  };

  const handleRejectConfirm = () => {
    if (!rejectionReason.trim()) {
      showToast('Please provide a rejection reason', 'error');
      return;
    }

    const leave = leaves.find(l => l.id === rejectModal.leaveId);
    rejectLeave(rejectModal.leaveId, rejectionReason);
    
    // Trigger notification
    const dates = `${leave.from} to ${leave.to}`;
    notifyLeaveRejected(leave.employeeId, leave.employeeName, dates, rejectionReason);
    
    showToast(`Leave rejected for ${leave.employeeName}`, 'success');
    setRejectModal({ isOpen: false, leaveId: null });
    setRejectionReason('');
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

  const pendingCount = leaves.filter(l => l.status === 'pending').length;
  const approvedCount = leaves.filter(l => l.status === 'approved').length;
  const rejectedCount = leaves.filter(l => l.status === 'rejected').length;

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Leave Management</h1>
        <p className="text-[var(--text-secondary)]">Review and manage employee leave requests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-[var(--bg-card)] rounded-xl p-6 border-l-4 border-[#F59E0B] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
              <Clock size={24} className="text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)] font-medium mb-1">Pending Requests</p>
              <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{pendingCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[var(--bg-card)] rounded-xl p-6 border-l-4 border-[#1D9E75] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <CheckCircle size={24} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)] font-medium mb-1">Approved</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{approvedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[var(--bg-card)] rounded-xl p-6 border-l-4 border-[#E24B4A] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
              <XCircle size={24} className="text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)] font-medium mb-1">Rejected</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">{rejectedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]" size={20} />
            <input
              type="text"
              placeholder="Search by employee name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent transition-all"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent transition-all"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent transition-all"
            >
              <option value="All">All Types</option>
              <option value="Annual">Annual</option>
              <option value="Sick">Sick</option>
              <option value="Casual">Casual</option>
              <option value="Maternity/Paternity">Maternity/Paternity</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[var(--border-color)]">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            All Leave Requests ({filteredLeaves.length})
          </h2>
        </div>

        {filteredLeaves.length === 0 ? (
          <EmptyState
            illustration="leaves"
            title="No leave requests found"
            description={leaves.length === 0 ? "Employees haven't submitted any leave requests yet" : "Try adjusting your filters to see more results"}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--input-bg)]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    Employee Name
                  </th>
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
                  <th className="px-6 py-4 text-right text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {filteredLeaves.map((leave) => (
                  <tr key={leave.id} className="hover:bg-[var(--input-bg)] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar 
                          initials={leave.employeeName.split(' ').map(n => n[0]).join('')}
                          size="md"
                        />
                        <div>
                          <p className="text-sm font-semibold text-[var(--text-primary)]">{leave.employeeName}</p>
                          <p className="text-xs text-[var(--text-secondary)]">Applied {formatDate(leave.appliedOn)}</p>
                        </div>
                      </div>
                    </td>
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
                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)] max-w-xs">
                      <div className="truncate" title={leave.reason}>{leave.reason}</div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(leave.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {leave.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleApprove(leave.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-green-700 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 rounded-lg transition-colors"
                          >
                            <CheckCircle size={14} />
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectClick(leave.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                          >
                            <XCircle size={14} />
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-[var(--text-secondary)]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      {rejectModal.isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setRejectModal({ isOpen: false, leaveId: null })}
          role="dialog"
          aria-modal="true"
          aria-labelledby="reject-modal-title"
        >
          <div 
            className="bg-[var(--bg-card)] rounded-2xl shadow-2xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 id="reject-modal-title" className="text-xl font-bold text-[var(--text-primary)]">Reject Leave Request</h3>
              <button
                onClick={() => setRejectModal({ isOpen: false, leaveId: null })}
                className="p-2 hover:bg-[var(--input-bg)] rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <X size={20} className="text-[var(--text-secondary)]" />
              </button>
            </div>
            
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              Please provide a reason for rejecting this leave request:
            </p>
            
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent transition-all resize-none mb-4"
            />
            
            <div className="flex gap-3">
              <button
                onClick={() => setRejectModal({ isOpen: false, leaveId: null })}
                className="flex-1 px-4 py-2 rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] font-semibold hover:bg-[var(--input-bg)] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-all"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveManagement;
