import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, Calendar, MapPin, Briefcase, 
  Edit2, Save, X, CheckCircle, Clock, XCircle,
  Building2, Users, Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLeave } from '../context/LeaveContext';
import { useToast } from '../App';
import Avatar from './Avatar';

const ProfilePage = () => {
  const { employeeId } = useParams();
  const { user, role } = useAuth();
  const { leaves, getEmployeeBalance } = useLeave();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Determine which employee to show
  const targetEmployeeId = employeeId ? parseInt(employeeId) : (user?.id || 2);
  
  // Load employee data from localStorage
  const [employees, setEmployees] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setMounted(true);
    loadEmployeeData();
  }, [targetEmployeeId]);

  const loadEmployeeData = () => {
    // Load from localStorage or use mock data
    const savedEmployees = localStorage.getItem('employees');
    let employeeList = [];
    
    if (savedEmployees) {
      employeeList = JSON.parse(savedEmployees);
    }

    // Mock employee data if not found
    const mockEmployees = [
      {
        id: 2,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@company.com',
        phone: '+1 (555) 123-4567',
        dateOfBirth: '1990-05-15',
        address: '123 Main St, New York, NY 10001',
        employeeId: 'EMP-2024-002',
        department: 'Engineering',
        role: 'Senior Developer',
        manager: 'Sarah Wilson',
        startDate: '2022-03-15',
        employmentType: 'Full-time',
        joinedDate: 'March 15, 2022'
      },
      {
        id: 1,
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@company.com',
        phone: '+1 (555) 000-1234',
        dateOfBirth: '1985-01-10',
        address: '456 Executive Ave, New York, NY 10002',
        employeeId: 'EMP-2024-001',
        department: 'Executive Management',
        role: 'Administrator',
        manager: 'CEO',
        startDate: '2021-01-01',
        employmentType: 'Full-time',
        joinedDate: 'January 1, 2021'
      }
    ];

    const allEmployees = employeeList.length > 0 ? employeeList : mockEmployees;
    setEmployees(allEmployees);

    const employee = allEmployees.find(e => e.id === targetEmployeeId) || mockEmployees[0];
    setProfileData(employee);
    setEditData({ ...employee });
  };

  const balance = getEmployeeBalance(targetEmployeeId);
  const employeeLeaves = leaves.filter(l => l.employeeId === targetEmployeeId).slice(0, 3);

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!editData.email || !emailRegex.test(editData.email)) {
      newErrors.email = 'Valid email is required';
    }

    // Phone validation
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    if (!editData.phone || !phoneRegex.test(editData.phone)) {
      newErrors.phone = 'Valid phone number is required';
    }

    // Required fields
    if (!editData.firstName?.trim()) newErrors.firstName = 'First name is required';
    if (!editData.lastName?.trim()) newErrors.lastName = 'Last name is required';
    if (!editData.department?.trim()) newErrors.department = 'Department is required';
    if (!editData.role?.trim()) newErrors.role = 'Role is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      showToast('Please fix the errors in the form', 'error');
      return;
    }

    // Update in employees array
    const updatedEmployees = employees.map(e => 
      e.id === targetEmployeeId ? editData : e
    );
    
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
    setEmployees(updatedEmployees);
    setProfileData(editData);
    setIsEditing(false);
    showToast('Profile updated successfully', 'success');
  };

  const handleCancel = () => {
    setEditData({ ...profileData });
    setErrors({});
    setIsEditing(false);
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      approved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    };

    const icons = {
      pending: <Clock size={12} />,
      approved: <CheckCircle size={12} />,
      rejected: <XCircle size={12} />
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${styles[status]}`}>
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (!profileData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--text-secondary)]">Loading profile...</p>
        </div>
      </div>
    );
  }

  const fullName = `${profileData.firstName} ${profileData.lastName}`;
  const initials = `${profileData.firstName?.[0] || ''}${profileData.lastName?.[0] || ''}`.toUpperCase();

  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Header Section */}
      <div 
        className={`bg-gradient-to-r from-[#1E1B4B] to-[#3D3B8E] rounded-3xl p-8 mb-8 text-white shadow-xl relative overflow-hidden animate-fade-in-up opacity-0 stagger-1`}
        style={{ animationFillMode: 'forwards' }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex items-start justify-between">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <Avatar 
              initials={initials}
              size="lg"
            />
            
            {/* Info */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{fullName}</h1>
              <div className="flex items-center gap-4 mb-3">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full text-sm font-semibold">
                  <Award size={14} />
                  {profileData.role}
                </span>
                <span className="inline-flex items-center gap-1 text-sm opacity-80">
                  <Building2 size={14} />
                  {profileData.department}
                </span>
              </div>
              <p className="text-sm opacity-70">
                Joined {profileData.joinedDate || formatDate(profileData.startDate)}
              </p>
            </div>
          </div>

          {/* Edit Button */}
          {!isEditing && (role === 'admin' || targetEmployeeId === user?.id) && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl font-semibold transition-all flex items-center gap-2"
            >
              <Edit2 size={16} />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Personal Info */}
          <div 
            className={`bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] shadow-sm p-6 animate-fade-in-up opacity-0 stagger-2`}
            style={{ animationFillMode: 'forwards' }}
          >
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">Personal Information</h2>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase mb-2">
                  First Name
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      value={editData.firstName}
                      onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.firstName ? 'border-red-500' : 'border-[var(--border-color)]'
                      } bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]`}
                    />
                    {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                  </div>
                ) : (
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{profileData.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase mb-2">
                  Last Name
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      value={editData.lastName}
                      onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.lastName ? 'border-red-500' : 'border-[var(--border-color)]'
                      } bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]`}
                    />
                    {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
                  </div>
                ) : (
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{profileData.lastName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase mb-2 flex items-center gap-1">
                  <Mail size={12} /> Email
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.email ? 'border-red-500' : 'border-[var(--border-color)]'
                      } bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]`}
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>
                ) : (
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{profileData.email}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase mb-2 flex items-center gap-1">
                  <Phone size={12} /> Phone
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.phone ? 'border-red-500' : 'border-[var(--border-color)]'
                      } bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]`}
                    />
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                  </div>
                ) : (
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{profileData.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase mb-2 flex items-center gap-1">
                  <Calendar size={12} /> Date of Birth
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editData.dateOfBirth}
                    onChange={(e) => setEditData({ ...editData, dateOfBirth: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                  />
                ) : (
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{formatDate(profileData.dateOfBirth)}</p>
                )}
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase mb-2 flex items-center gap-1">
                  <MapPin size={12} /> Address
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.address}
                    onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                  />
                ) : (
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{profileData.address}</p>
                )}
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div 
            className={`bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] shadow-sm p-6 animate-fade-in-up opacity-0 stagger-3`}
            style={{ animationFillMode: 'forwards' }}
          >
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">Job Details</h2>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase mb-2">
                  Employee ID
                </label>
                <p className="text-sm font-semibold text-[var(--text-primary)]">{profileData.employeeId}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase mb-2">
                  Department
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      value={editData.department}
                      onChange={(e) => setEditData({ ...editData, department: e.target.value })}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.department ? 'border-red-500' : 'border-[var(--border-color)]'
                      } bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]`}
                    />
                    {errors.department && <p className="text-xs text-red-500 mt-1">{errors.department}</p>}
                  </div>
                ) : (
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{profileData.department}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase mb-2">
                  Role
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      value={editData.role}
                      onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.role ? 'border-red-500' : 'border-[var(--border-color)]'
                      } bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]`}
                    />
                    {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role}</p>}
                  </div>
                ) : (
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{profileData.role}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase mb-2">
                  Manager
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.manager}
                    onChange={(e) => setEditData({ ...editData, manager: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                  />
                ) : (
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{profileData.manager}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase mb-2">
                  Start Date
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editData.startDate}
                    onChange={(e) => setEditData({ ...editData, startDate: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                  />
                ) : (
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{formatDate(profileData.startDate)}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase mb-2">
                  Employment Type
                </label>
                {isEditing ? (
                  <select
                    value={editData.employmentType}
                    onChange={(e) => setEditData({ ...editData, employmentType: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                  </select>
                ) : (
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{profileData.employmentType}</p>
                )}
              </div>
            </div>
          </div>

          {/* Edit Actions */}
          {isEditing && (
            <div 
              className={`flex gap-4 animate-fade-in-up opacity-0 stagger-4`}
              style={{ animationFillMode: 'forwards' }}
            >
              <button
                onClick={handleSave}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#1E1B4B] to-[#3D3B8E] text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Save size={20} />
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 px-6 py-3 border-2 border-[var(--border-color)] text-[var(--text-secondary)] font-bold rounded-xl hover:bg-[var(--input-bg)] transition-all flex items-center justify-center gap-2"
              >
                <X size={20} />
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Leave Summary */}
          <div 
            className={`bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] shadow-sm p-6 animate-fade-in-up opacity-0 stagger-2`}
            style={{ animationFillMode: 'forwards' }}
          >
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">Leave Summary</h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase mb-1">Balance</p>
                <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{balance.annual}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">days available</p>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <p className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase mb-1">Used</p>
                <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">{balance.used}</p>
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">days taken</p>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase mb-1">Pending</p>
                <p className="text-3xl font-bold text-amber-700 dark:text-amber-300">{balance.pending}</p>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">awaiting approval</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div 
            className={`bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] shadow-sm p-6 animate-fade-in-up opacity-0 stagger-3`}
            style={{ animationFillMode: 'forwards' }}
          >
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">Recent Activity</h2>
            
            {employeeLeaves.length === 0 ? (
              <p className="text-sm text-[var(--text-secondary)] text-center py-8">No recent leave requests</p>
            ) : (
              <div className="space-y-4">
                {employeeLeaves.map((leave) => (
                  <div key={leave.id} className="p-4 bg-[var(--input-bg)] rounded-xl">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-bold text-[var(--text-primary)]">{leave.type} Leave</p>
                      {getStatusBadge(leave.status)}
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mb-1">
                      {formatDate(leave.from)} - {formatDate(leave.to)}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {leave.days} day{leave.days !== 1 ? 's' : ''}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
