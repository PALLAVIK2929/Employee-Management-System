import React, { useState, useEffect } from 'react';
import { 
  Search, Bell, MessageSquare, ChevronDown, 
  MoreVertical, Mail, Edit2, Plus, Trash2
} from 'lucide-react';
import { api } from '../api';

const StatCard = ({ label, value, color, dotColor }) => (
  <div className={`flex-1 p-6 border-r last:border-r-0 border-gray-100 bg-white ${color}`}>
    <div className="flex items-center gap-2 mb-2">
      <div className={`w-2 h-2 rounded-full ${dotColor}`} />
      <span className="text-sm text-muted font-medium">{label}</span>
    </div>
    <div className="text-2xl font-bold text-primary">{value}</div>
  </div>
);

const EmployeesPage = ({ onAddEmployee, onEditEmployee, onDeleteEmployee }) => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const stats = [
    { label: 'Total Employees', value: employees.length, dotColor: 'bg-gray-400', color: 'bg-white' },
    { label: 'Active', value: employees.filter(e => e.status === 'Active').length || 0, dotColor: 'bg-green-500', color: 'bg-status-active' },
    { label: 'Pending', value: employees.filter(e => e.status === 'Pending').length || 0, dotColor: 'bg-yellow-500', color: 'bg-status-pending' },
    { label: 'On Leave', value: employees.filter(e => e.status === 'On Leave').length || 0, dotColor: 'bg-blue-500', color: 'bg-status-leave' },
    { label: 'Terminated', value: employees.filter(e => e.status === 'Terminated').length || 0, dotColor: 'bg-red-500', color: 'bg-status-terminated' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'On Leave': return 'bg-blue-100 text-blue-700';
      case 'Terminated': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-page-bg">
      <main className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-primary">Employees</h1>
          <button 
            onClick={onAddEmployee}
            className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Plus size={18} />
            Add Employee
          </button>
        </div>

        {/* Stat Cards */}
        <div className="flex border border-gray-200 rounded-xl overflow-hidden mb-8 shadow-sm">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          {['Status', 'Department', 'Type'].map((filter) => (
            <button key={filter} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-muted flex items-center gap-2 hover:bg-gray-50">
              {filter}: All
              <ChevronDown size={16} />
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-header-bg border-b border-gray-100">
                <th className="p-4 w-10"><input type="checkbox" className="rounded border-gray-300" /></th>
                <th className="p-4 text-xs font-semibold text-muted uppercase tracking-wider">Employee</th>
                <th className="p-4 text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-muted uppercase tracking-wider">Department</th>
                <th className="p-4 text-xs font-semibold text-muted uppercase tracking-wider">Manager</th>
                <th className="p-4 text-xs font-semibold text-muted uppercase tracking-wider">Start Day</th>
                <th className="p-4 text-xs font-semibold text-muted uppercase tracking-wider">Type</th>
                <th className="p-4 text-xs font-semibold text-muted uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="8" className="p-8 text-center text-muted">Loading employees...</td></tr>
              ) : employees.length === 0 ? (
                <tr><td colSpan="8" className="p-8 text-center text-muted">No employees found.</td></tr>
              ) : employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4"><input type="checkbox" className="rounded border-gray-300" /></td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-accent">{emp.first_name} {emp.last_name}</span>
                      <span className="text-xs text-muted">{emp.role || 'No Role'}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(emp.status || 'Active')}`}>
                      {emp.status || 'Active'}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-primary">
                    {departments.find(d => d.id === emp.department_id)?.name || 'Unassigned'}
                  </td>
                  <td className="p-4 text-sm text-primary">Dianne Russell</td>
                  <td className="p-4 text-sm text-primary">Oct 12, 2024</td>
                  <td className="p-4 text-sm text-primary">Full-time</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2 text-muted">
                      <button className="p-1 hover:text-accent transition-colors"><Mail size={16} /></button>
                      <button 
                        onClick={() => onEditEmployee(emp)}
                        className="p-1 hover:text-accent transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => onDeleteEmployee(emp.id)}
                        className="p-1 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default EmployeesPage;
