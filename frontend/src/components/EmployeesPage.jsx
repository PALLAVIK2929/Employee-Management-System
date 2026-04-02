import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, ChevronDown, Mail, Edit2, Plus, Trash2, 
  ChevronLeft, ChevronRight, ArrowUpDown, Filter, Users
} from 'lucide-react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import EmptyState from './EmptyState';

const StatCard = ({ label, value, dotColor, colorClass }) => (
  <div style={{ 
    flex: 1, 
    padding: '24px', 
    borderRight: '1px solid var(--border-color)', 
    backgroundColor: 'var(--bg-card)',
    transition: 'all 0.3s ease'
  }} className={colorClass}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: dotColor }} />
      <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '500' }}>{label}</span>
    </div>
    <div style={{ fontSize: '24px', fontBold: '800', color: 'var(--text-primary)' }}>{value}</div>
  </div>
);

const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td style={{ padding: '16px' }}><div style={{ width: '16px', height: '16px', backgroundColor: 'var(--border-color)', borderRadius: '4px' }} /></td>
    <td style={{ padding: '16px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ height: '16px', width: '120px', backgroundColor: 'var(--border-color)', borderRadius: '4px' }} className="skeleton-shimmer" />
        <div style={{ height: '12px', width: '80px', backgroundColor: 'var(--border-color)', borderRadius: '4px' }} className="skeleton-shimmer" />
      </div>
    </td>
    <td style={{ padding: '16px' }}><div style={{ height: '24px', width: '64px', backgroundColor: 'var(--border-color)', borderRadius: '99px' }} className="skeleton-shimmer" /></td>
    <td style={{ padding: '16px' }}><div style={{ height: '16px', width: '100px', backgroundColor: 'var(--border-color)', borderRadius: '4px' }} className="skeleton-shimmer" /></td>
    <td style={{ padding: '16px' }}><div style={{ height: '16px', width: '120px', backgroundColor: 'var(--border-color)', borderRadius: '4px' }} className="skeleton-shimmer" /></td>
    <td style={{ padding: '16px' }}><div style={{ height: '16px', width: '80px', backgroundColor: 'var(--border-color)', borderRadius: '4px' }} className="skeleton-shimmer" /></td>
    <td style={{ padding: '16px' }}><div style={{ height: '16px', width: '80px', backgroundColor: 'var(--border-color)', borderRadius: '4px' }} className="skeleton-shimmer" /></td>
    <td style={{ padding: '16px' }}><div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}><div style={{ width: '32px', height: '32px', backgroundColor: 'var(--border-color)', borderRadius: '8px' }} /><div style={{ width: '32px', height: '32px', backgroundColor: 'var(--border-color)', borderRadius: '8px' }} /></div></td>
  </tr>
);

const EmployeesPage = ({ onAddEmployee, onEditEmployee, onDeleteEmployee }) => {
  const { role } = useAuth();
  const isAdmin = role === 'admin';
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Sorting State
  const [sortConfig, setSortConfig] = useState({ key: 'first_name', direction: 'asc' });
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [empData, deptData] = await Promise.all([
        api.getEmployees(),
        api.getDepartments(),
      ]);
      setEmployees(empData || []);
      setDepartments(deptData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredEmployees = useMemo(() => {
    let result = [...employees];

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(emp => 
        emp.first_name.toLowerCase().includes(query) || 
        emp.last_name.toLowerCase().includes(query) ||
        emp.role?.toLowerCase().includes(query)
      );
    }

    // Dept Filter
    if (deptFilter !== 'All') {
      result = result.filter(emp => {
        const dept = departments.find(d => d.id === emp.department_id);
        return dept?.name === deptFilter;
      });
    }

    // Status Filter
    if (statusFilter !== 'All') {
      result = result.filter(emp => (emp.status || 'Active') === statusFilter);
    }

    // Sorting
    result.sort((a, b) => {
      const aValue = a[sortConfig.key] || '';
      const bValue = b[sortConfig.key] || '';
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [employees, searchQuery, deptFilter, statusFilter, sortConfig, departments]);

  const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);
  const currentEmployees = filteredEmployees.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return { bg: 'var(--status-active-bg)', text: 'var(--status-active-text)' };
      case 'On Leave': return { bg: 'var(--status-leave-bg)', text: 'var(--status-leave-text)' };
      case 'Inactive': return { bg: 'var(--status-inactive-bg)', text: 'var(--status-inactive-text)' };
      case 'Pending': return { bg: 'var(--status-pending-bg)', text: 'var(--status-pending-text)' };
      default: return { bg: 'var(--bg-primary)', text: 'var(--text-secondary)' };
    }
  };

  const stats = [
    { label: 'Total Employees', value: employees.length, dotColor: '#94A3B8' },
    { label: 'Active', value: employees.filter(e => (e.status || 'Active') === 'Active').length, dotColor: '#10B981' },
    { label: 'On Leave', value: employees.filter(e => e.status === 'On Leave').length, dotColor: '#3B82F6' },
    { label: 'Inactive', value: employees.filter(e => e.status === 'Inactive').length, dotColor: '#EF4444' },
  ];

  return (
    <div style={{ flex: 1, backgroundColor: 'var(--bg-primary)', transition: 'all 0.3s ease' }}>
      <main style={{ padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>Employees</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>{isAdmin ? 'Manage your workforce and view employee details.' : 'View employee directory and details.'}</p>
          </div>
          {isAdmin && (
            <button 
              onClick={onAddEmployee}
              style={{ 
                backgroundColor: 'var(--accent-color)', 
                color: '#fff', 
                padding: '10px 20px', 
                borderRadius: '12px', 
                fontSize: '14px', 
                fontWeight: '700', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                border: 'none',
                cursor: 'pointer',
                boxShadow: 'var(--card-shadow)'
              }}
            >
              <Plus size={18} />
              Add Employee
            </button>
          )}
        </div>

        {/* Stat Cards */}
        <div style={{ 
          display: 'flex', 
          border: '1px solid var(--border-color)', 
          borderRadius: '16px', 
          overflow: 'hidden', 
          marginBottom: '32px', 
          boxShadow: 'var(--card-shadow)',
          backgroundColor: 'var(--bg-card)'
        }}>
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        {/* Filters & Search */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search by name or role..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              style={{
                width: '100%',
                padding: '12px 16px 12px 42px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                fontSize: '14px',
                color: 'var(--text-primary)',
                outline: 'none',
                transition: 'all 0.2s'
              }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              <select 
                value={deptFilter}
                onChange={(e) => { setDeptFilter(e.target.value); setCurrentPage(1); }}
                style={{
                  padding: '12px 40px 12px 16px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  fontSize: '14px',
                  color: 'var(--text-primary)',
                  appearance: 'none',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="All">All Departments</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.name}>{dept.name}</option>
                ))}
              </select>
              <ChevronDown size={16} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', pointerEvents: 'none' }} />
            </div>

            <div style={{ display: 'flex', backgroundColor: 'var(--bg-card)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              {['All', 'Active', 'On Leave', 'Inactive'].map((status) => (
                <button
                  key={status}
                  onClick={() => { setStatusFilter(status); setCurrentPage(1); }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    backgroundColor: statusFilter === status ? 'var(--accent-color)' : 'transparent',
                    color: statusFilter === status ? '#fff' : 'var(--text-secondary)'
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', boxShadow: 'var(--card-shadow)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '16px', width: '40px' }}><input type="checkbox" style={{ cursor: 'pointer' }} /></th>
                <th 
                  onClick={() => handleSort('first_name')}
                  style={{ padding: '16px', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Employee <ArrowUpDown size={14} />
                  </div>
                </th>
                <th style={{ padding: '16px', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                <th style={{ padding: '16px', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Department</th>
                <th 
                  onClick={() => handleSort('role')}
                  style={{ padding: '16px', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Role <ArrowUpDown size={14} />
                  </div>
                </th>
                <th style={{ padding: '16px', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Joined Date</th>
                {isAdmin && <th style={{ padding: '16px', textAlign: 'right', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Action</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(5).fill(0).map((_, i) => <SkeletonRow key={i} />)
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    <EmptyState
                      illustration="employees"
                      title="No employees yet"
                      description="Get started by adding your first employee to the system"
                      actionLabel={isAdmin ? "Add Employee" : undefined}
                      onAction={isAdmin ? onAddEmployee : undefined}
                    />
                  </td>
                </tr>
              ) : currentEmployees.length === 0 ? (
                <tr><td colSpan="7" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>No employees found matching your filters.</td></tr>
              ) : currentEmployees.map((emp, index) => {
                const statusStyles = getStatusColor(emp.status || 'Active');
                return (
                  <tr 
                    key={emp.id} 
                    style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s' }}
                    className="animate-fade-in-up"
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-primary)'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '16px' }}><input type="checkbox" style={{ cursor: 'pointer' }} /></td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ 
                          width: '36px', 
                          height: '36px', 
                          borderRadius: '10px', 
                          backgroundColor: 'var(--accent-color)', 
                          color: '#fff', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          fontSize: '14px'
                        }}>
                          {emp.first_name[0]}{emp.last_name[0]}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '14px' }}>{emp.first_name} {emp.last_name}</span>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{emp.email}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ 
                        padding: '4px 12px', 
                        borderRadius: '99px', 
                        fontSize: '12px', 
                        fontWeight: '700', 
                        backgroundColor: statusStyles.bg, 
                        color: statusStyles.text 
                      }}>
                        {emp.status || 'Active'}
                      </span>
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', color: 'var(--text-primary)' }}>
                      {departments.find(d => d.id === emp.department_id)?.name || 'Unassigned'}
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', color: 'var(--text-primary)' }}>{emp.role || '-'}</td>
                    <td style={{ padding: '16px', fontSize: '14px', color: 'var(--text-primary)' }}>{emp.hire_date || 'N/A'}</td>
                    {isAdmin && (
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                          <button style={{ padding: '8px', borderRadius: '8px', color: 'var(--text-secondary)', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}><Mail size={16} /></button>
                          <button 
                            onClick={() => onEditEmployee(emp)}
                            style={{ padding: '8px', borderRadius: '8px', color: 'var(--accent-color)', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => onDeleteEmployee(emp.id)}
                            style={{ padding: '8px', borderRadius: '8px', color: '#EF4444', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {/* Pagination */}
          <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--bg-card)', borderTop: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Showing <strong>{(currentPage - 1) * rowsPerPage + 1}</strong> to <strong>{Math.min(currentPage * rowsPerPage, filteredEmployees.length)}</strong> of <strong>{filteredEmployees.length}</strong> employees
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                style={{ 
                  padding: '8px 12px', 
                  borderRadius: '10px', 
                  border: '1px solid var(--border-color)', 
                  backgroundColor: 'var(--bg-card)', 
                  color: currentPage === 1 ? 'var(--border-color)' : 'var(--text-primary)',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <ChevronLeft size={16} /> Previous
              </button>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                style={{ 
                  padding: '8px 12px', 
                  borderRadius: '10px', 
                  border: '1px solid var(--border-color)', 
                  backgroundColor: 'var(--bg-card)', 
                  color: (currentPage === totalPages || totalPages === 0) ? 'var(--border-color)' : 'var(--text-primary)',
                  cursor: (currentPage === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployeesPage;
