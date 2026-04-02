import React, { useState, useEffect } from 'react';
import { Building2, Plus, Users, Calendar, Edit2, Trash2, Search, X } from 'lucide-react';
import { api } from '../api';
import EmptyState from './EmptyState';
import Avatar from './Avatar';
import { useAuth } from '../context/AuthContext';

// Mock data for departments with additional fields
const MOCK_DEPARTMENT_DATA = {
  1: { head: 'Sarah Wilson', employeeCount: 1, createdDate: 'Jan 12, 2023', description: 'Executive leadership and strategic planning' },
  2: { head: 'Michael Chen', employeeCount: 15, createdDate: 'Feb 8, 2023', description: 'Software development and technical operations' },
  3: { head: 'Emily Rodriguez', employeeCount: 8, createdDate: 'Mar 15, 2023', description: 'Human resources and talent management' },
  4: { head: 'David Kim', employeeCount: 12, createdDate: 'Apr 22, 2023', description: 'Sales and business development' },
  5: { head: 'Lisa Anderson', employeeCount: 10, createdDate: 'May 10, 2023', description: 'Marketing and brand management' }
};

function DepartmentManager({ departments, onAddDept, onEditDept, onDeleteDept }) {
  const { role } = useAuth();
  const isAdmin = role === 'admin';
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    head: '',
    description: ''
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const empData = await api.getEmployees();
      setEmployees(empData || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const getDeptData = (deptId) => {
    const mockData = MOCK_DEPARTMENT_DATA[deptId] || { 
      head: 'Not Assigned', 
      employeeCount: 0, 
      createdDate: 'N/A',
      description: ''
    };
    
    // Calculate actual employee count
    const actualCount = employees.filter(e => e.department_id === deptId).length;
    
    return {
      ...mockData,
      employeeCount: actualCount > 0 ? actualCount : mockData.employeeCount
    };
  };

  const handleOpenModal = (dept = null) => {
    if (dept) {
      const deptData = getDeptData(dept.id);
      setEditingDept(dept);
      setFormData({
        name: dept.name,
        head: deptData.head,
        description: deptData.description
      });
    } else {
      setEditingDept(null);
      setFormData({ name: '', head: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDept(null);
    setFormData({ name: '', head: '', description: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingDept) {
      onEditDept(editingDept);
    } else {
      onAddDept();
    }
    handleCloseModal();
  };

  const handleDelete = (dept) => {
    if (window.confirm(`Are you sure you want to delete "${dept.name}"? Employees in this department will be unassigned.`)) {
      onDeleteDept(dept.id);
    }
  };

  const filteredDepartments = departments.filter(dept => 
    dept.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate totals
  const totalDepartments = departments.length;
  const totalEmployees = departments.reduce((sum, dept) => {
    return sum + getDeptData(dept.id).employeeCount;
  }, 0);

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Departments</h1>
          <p className="text-[var(--text-secondary)]">{isAdmin ? 'Manage organizational structure and team hierarchies' : 'View organizational structure and team hierarchies'}</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-[var(--accent-color)] text-white font-semibold rounded-xl hover:opacity-90 transition-all flex items-center gap-2 shadow-lg"
          >
            <Plus size={18} />
            Add Department
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-[var(--bg-card)] rounded-xl p-6 border-l-4 border-[#534AB7] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#534AB7]/10 rounded-xl">
              <Building2 size={24} className="text-[#534AB7]" />
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)] font-medium mb-1">Total Departments</p>
              <p className="text-3xl font-bold text-[#534AB7]">{totalDepartments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[var(--bg-card)] rounded-xl p-6 border-l-4 border-[#1D9E75] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#1D9E75]/10 rounded-xl">
              <Users size={24} className="text-[#1D9E75]" />
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)] font-medium mb-1">Total Employees</p>
              <p className="text-3xl font-bold text-[#1D9E75]">{totalEmployees}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]" size={20} />
          <input
            type="text"
            placeholder="Search departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Department Table */}
      <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] shadow-sm overflow-hidden">
        {filteredDepartments.length === 0 && departments.length === 0 ? (
          <EmptyState
            illustration="default"
            title="No departments yet"
            description="Get started by creating your first department to organize your workforce"
            actionLabel={isAdmin ? "Add Department" : undefined}
            onAction={isAdmin ? () => handleOpenModal() : undefined}
          />
        ) : filteredDepartments.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-[var(--text-secondary)]">No departments found matching your search.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--input-bg)]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    Department Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    Head of Department
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    Employee Count
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    Created Date
                  </th>
                  {isAdmin && (
                    <th className="px-6 py-4 text-right text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {filteredDepartments.map((dept) => {
                  const deptData = getDeptData(dept.id);
                  return (
                    <tr key={dept.id} className="hover:bg-[var(--input-bg)] transition-colors group">
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--input-bg)] text-xs font-bold text-[var(--text-primary)] border border-[var(--border-color)]">
                          {dept.id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar 
                            initials={dept.name[0]}
                            size="md"
                          />
                          <span className="font-semibold text-[var(--text-primary)]">{dept.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--text-primary)]">
                        {deptData.head}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                          <Users size={12} />
                          {deptData.employeeCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                        {deptData.createdDate}
                      </td>
                      {isAdmin && (
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleOpenModal(dept)}
                              className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent-color)] hover:bg-[var(--input-bg)] rounded-lg transition-all"
                              title="Edit Department"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(dept)}
                              className="p-2 text-[var(--text-secondary)] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
                              title="Delete Department"
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
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-[var(--bg-card)] rounded-2xl shadow-2xl w-full max-w-md p-6 m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[var(--text-primary)]">
                {editingDept ? 'Edit Department' : 'Add Department'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-[var(--input-bg)] rounded-lg transition-colors"
              >
                <X size={20} className="text-[var(--text-secondary)]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                  Department Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Engineering"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                  Head of Department
                </label>
                <select
                  value={formData.head}
                  onChange={(e) => setFormData({ ...formData, head: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent transition-all"
                >
                  <option value="">Select an employee</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={`${emp.first_name} ${emp.last_name}`}>
                      {emp.first_name} {emp.last_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the department..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent transition-all resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-3 border-2 border-[var(--border-color)] text-[var(--text-secondary)] font-bold rounded-xl hover:bg-[var(--input-bg)] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-[var(--accent-color)] text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg"
                >
                  {editingDept ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DepartmentManager;
