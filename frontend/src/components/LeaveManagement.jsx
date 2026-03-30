import React, { useState } from 'react';
import { 
  Calendar, Plus, X, 
  CheckCircle, XCircle, Clock,
  ArrowRight, Download, Filter
} from 'lucide-react';

const LeaveManagement = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role || 'admin';

  // Initial leaves state as requested
  const [leaves, setLeaves] = useState([
    { id: 1, employee: 'Dianne Russell', type: 'Casual', from: '2024-04-10', to: '2024-04-12', days: 2, reason: 'Family function', status: 'Pending' },
    { id: 2, employee: 'Standard Employee', type: 'Sick', from: '2024-04-05', to: '2024-04-05', days: 1, reason: 'Fever', status: 'Approved' },
    { id: 3, employee: 'Eleanor Pena', type: 'Earned', from: '2024-03-20', to: '2024-03-25', days: 5, reason: 'Annual vacation', status: 'Rejected' },
    { id: 4, employee: 'Standard Employee', type: 'WFH', from: '2024-04-15', to: '2024-04-15', days: 1, reason: 'Home delivery', status: 'Pending' },
  ]);

  const [filter, setFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    employee: '',
    type: 'Casual',
    from: '',
    to: '',
    reason: ''
  });

  // Design Tokens
  const colors = {
    white: '#fff',
    pageBg: '#F3F4F6',
    primary: '#1E1B4B',
    accent: '#3D3B8E',
    muted: '#6B7280',
    border: '#E5E7EB',
    casual: '#4F46E5',
    sick: '#E11D48',
    earned: '#059669',
    wfh: '#0284C7',
    pending: '#F59E0B',
    approved: '#10B981',
    rejected: '#EF4444'
  };

  const balances = [
    { type: 'Casual Leave', color: colors.casual, total: 8, used: 4 },
    { type: 'Sick Leave', color: colors.sick, total: 6, used: 2 },
    { type: 'Earned Leave', color: colors.earned, total: 15, used: 3 },
    { type: 'Work From Home', color: colors.wfh, total: 12, used: 7 }
  ];

  // Helper functions
  const calculateDays = (from, to) => {
    if (!from || !to) return 0;
    const start = new Date(from);
    const end = new Date(to);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newLeave = {
      id: Date.now(),
      employee: role === 'admin' ? (form.employee || 'Admin User') : (user.name || 'Standard Employee'),
      type: form.type,
      from: form.from,
      to: form.to,
      days: calculateDays(form.from, form.to),
      reason: form.reason,
      status: 'Pending'
    };
    setLeaves([newLeave, ...leaves]);
    setIsModalOpen(false);
    setForm({ employee: '', type: 'Casual', from: '', to: '', reason: '' });
  };

  const updateStatus = (id, newStatus) => {
    setLeaves(leaves.map(l => l.id === id ? { ...l, status: newStatus } : l));
  };

  const filteredLeaves = filter === 'All' ? leaves : leaves.filter(l => l.status === filter);
  const displayLeaves = role === 'admin' ? filteredLeaves : filteredLeaves.filter(l => l.employee === (user.name || 'Standard Employee'));

  // Inline Styles
  const styles = {
    container: {
      padding: '2rem',
      backgroundColor: colors.pageBg,
      minHeight: '100vh',
      fontFamily: "'Inter', sans-serif"
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2.5rem'
    },
    title: {
      fontSize: '1.875rem',
      fontWeight: '800',
      color: colors.primary,
      margin: 0
    },
    subtitle: {
      fontSize: '0.875rem',
      color: colors.muted,
      marginTop: '0.5rem'
    },
    applyBtn: {
      backgroundColor: colors.primary,
      color: colors.white,
      padding: '0.75rem 1.5rem',
      borderRadius: '10px',
      border: 'none',
      fontWeight: '700',
      fontSize: '0.875rem',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'opacity 0.2s'
    },
    balanceGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '1.5rem',
      marginBottom: '2.5rem'
    },
    balanceCard: (color) => ({
      backgroundColor: colors.white,
      borderRadius: '14px',
      padding: '1.5rem',
      borderTop: `4px solid ${color}`,
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    }),
    progressBg: {
      width: '100%',
      height: '8px',
      backgroundColor: '#F3F4F6',
      borderRadius: '4px',
      margin: '1rem 0 0.5rem 0',
      overflow: 'hidden'
    },
    progressFill: (percent, color) => ({
      width: `${percent}%`,
      height: '100%',
      backgroundColor: color,
      borderRadius: '4px',
      transition: 'width 0.5s ease-out'
    }),
    tableCard: {
      backgroundColor: colors.white,
      borderRadius: '14px',
      border: `1px solid ${colors.border}`,
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      overflow: 'hidden'
    },
    tabs: {
      display: 'flex',
      padding: '1rem 1.5rem',
      borderBottom: `1px solid ${colors.border}`,
      gap: '2rem'
    },
    tab: (active) => ({
      padding: '0.5rem 0',
      fontSize: '0.875rem',
      fontWeight: active ? '700' : '500',
      color: active ? colors.primary : colors.muted,
      borderBottom: `2px solid ${active ? colors.primary : 'transparent'}`,
      cursor: 'pointer',
      transition: 'all 0.2s'
    }),
    badge: (type, status = false) => {
      let color = colors.muted;
      if (status) {
        if (type === 'Approved') color = colors.approved;
        if (type === 'Rejected') color = colors.rejected;
        if (type === 'Pending') color = colors.pending;
      } else {
        if (type === 'Casual') color = colors.casual;
        if (type === 'Sick') color = colors.sick;
        if (type === 'Earned') color = colors.earned;
        if (type === 'WFH') color = colors.wfh;
      }
      return {
        padding: '0.25rem 0.75rem',
        borderRadius: '999px',
        fontSize: '0.75rem',
        fontWeight: '700',
        backgroundColor: `${color}15`,
        color: color,
        display: 'inline-block'
      };
    },
    actionBtn: (approved) => ({
      padding: '0.4rem 0.8rem',
      borderRadius: '6px',
      border: 'none',
      fontSize: '0.75rem',
      fontWeight: '700',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      backgroundColor: approved ? `${colors.approved}15` : `${colors.rejected}15`,
      color: approved ? colors.approved : colors.rejected,
      transition: 'opacity 0.2s'
    }),
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(4px)'
    },
    modal: {
      backgroundColor: colors.white,
      width: '500px',
      borderRadius: '14px',
      overflow: 'hidden',
      boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
    },
    modalHeader: {
      backgroundColor: colors.primary,
      padding: '1.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: colors.white
    },
    form: {
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    },
    label: {
      fontSize: '0.75rem',
      fontWeight: '700',
      color: colors.primary,
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    },
    input: {
      padding: '0.75rem 1rem',
      borderRadius: '8px',
      border: `1px solid ${colors.border}`,
      fontSize: '0.875rem',
      outline: 'none',
      backgroundColor: '#FAFAFA'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Leave Management</h1>
          <p style={styles.subtitle}>Apply, approve and track employee leaves</p>
        </div>
        <button style={styles.applyBtn} onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          Apply for Leave
        </button>
      </header>

      {/* Balance Cards */}
      <div style={styles.balanceGrid}>
        {balances.map((b, i) => (
          <div key={i} style={styles.balanceCard(b.color)}>
            <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '600', color: colors.muted }}>{b.type}</p>
            <h2 style={{ margin: '0.5rem 0', fontSize: '2rem', fontWeight: '800', color: colors.primary }}>{b.total}</h2>
            <div style={styles.progressBg}>
              <div style={styles.progressFill((b.used / b.total) * 100, b.color)} />
            </div>
            <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '600', color: colors.muted }}>
              {b.used} used · {b.total - b.used} remaining
            </p>
          </div>
        ))}
      </div>

      {/* Requests Table */}
      <div style={styles.tableCard}>
        <div style={styles.tabs}>
          {['All', 'Pending', 'Approved', 'Rejected'].map(t => (
            <span 
              key={t} 
              style={styles.tab(filter === t)}
              onClick={() => setFilter(t)}
            >
              {t}
            </span>
          ))}
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${colors.border}`, backgroundColor: '#FAFAFA' }}>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: '700', color: colors.muted, textTransform: 'uppercase' }}>Employee</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: '700', color: colors.muted, textTransform: 'uppercase' }}>Leave Type</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: '700', color: colors.muted, textTransform: 'uppercase' }}>From</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: '700', color: colors.muted, textTransform: 'uppercase' }}>To</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: '700', color: colors.muted, textTransform: 'uppercase' }}>Days</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: '700', color: colors.muted, textTransform: 'uppercase' }}>Reason</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: '700', color: colors.muted, textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: '700', color: colors.muted, textTransform: 'uppercase', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {displayLeaves.map(l => (
                <tr key={l.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                  <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: '600', color: colors.primary }}>{l.employee}</td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <span style={styles.badge(l.type)}>{l.type}</span>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', color: colors.muted }}>{l.from}</td>
                  <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', color: colors.muted }}>{l.to}</td>
                  <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: '700', color: colors.primary }}>{l.days}</td>
                  <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', color: colors.muted }}>{l.reason}</td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <span style={styles.badge(l.status, true)}>{l.status}</span>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                    {role === 'admin' && l.status === 'Pending' ? (
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button style={styles.actionBtn(true)} onClick={() => updateStatus(l.id, 'Approved')}>
                          <CheckCircle size={14} /> Approve
                        </button>
                        <button style={styles.actionBtn(false)} onClick={() => updateStatus(l.id, 'Rejected')}>
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    ) : (
                      <button style={{ color: colors.muted, background: 'none', border: 'none', cursor: 'pointer' }}>
                        <ArrowRight size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '700' }}>Apply for Leave</h3>
              <X size={24} style={{ cursor: 'pointer' }} onClick={() => setIsModalOpen(false)} />
            </div>
            <form style={styles.form} onSubmit={handleSubmit}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Employee Name</label>
                <input 
                  style={styles.input} 
                  required
                  placeholder="Enter employee name"
                  value={form.employee}
                  onChange={e => setForm({...form, employee: e.target.value})}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Leave Type</label>
                <select 
                  style={styles.input}
                  value={form.type}
                  onChange={e => setForm({...form, type: e.target.value})}
                >
                  <option>Casual</option>
                  <option>Sick</option>
                  <option>Earned</option>
                  <option>WFH</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ ...styles.inputGroup, flex: 1 }}>
                  <label style={styles.label}>From Date</label>
                  <input 
                    type="date" 
                    style={styles.input} 
                    required
                    value={form.from}
                    onChange={e => setForm({...form, from: e.target.value})}
                  />
                </div>
                <div style={{ ...styles.inputGroup, flex: 1 }}>
                  <label style={styles.label}>To Date</label>
                  <input 
                    type="date" 
                    style={styles.input} 
                    required
                    value={form.to}
                    onChange={e => setForm({...form, to: e.target.value})}
                  />
                </div>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Reason</label>
                <textarea 
                  style={{ ...styles.input, height: '100px', resize: 'none' }}
                  required
                  placeholder="Enter reason for leave"
                  value={form.reason}
                  onChange={e => setForm({...form, reason: e.target.value})}
                />
              </div>
              <button type="submit" style={{ ...styles.applyBtn, width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
                Submit Leave Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveManagement;
