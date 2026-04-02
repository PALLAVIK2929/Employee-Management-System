import React, { useState, useEffect, createContext, useContext, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Plus, X, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { api } from './api';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import NotFound from './components/NotFound';
import { FloatingChat } from './components/ChatBot';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LeaveProvider } from './context/LeaveContext';
import { NotificationsProvider } from './context/NotificationsContext';
import { PerformanceProvider } from './context/PerformanceContext';
import { AttendanceProvider } from './context/AttendanceContext';

import './App.css';

// Lazy load route components
const EmployeeForm = lazy(() => import('./components/EmployeeForm'));
const DepartmentManager = lazy(() => import('./components/DepartmentManager'));
const DepartmentForm = lazy(() => import('./components/DepartmentForm'));
const ChatBot = lazy(() => import('./components/ChatBot'));
const OnboardingFlow = lazy(() => import('./components/OnboardingFlow'));
const BulkUpload = lazy(() => import('./components/BulkUpload'));
const Profile = lazy(() => import('./components/Profile'));
const ProfilePage = lazy(() => import('./components/ProfilePage'));
const Home = lazy(() => import('./components/Home'));
const Login = lazy(() => import('./components/Login'));
const LandingPage = lazy(() => import('./components/LandingPage'));
const PlatformTools = lazy(() => import('./components/PlatformTools'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));
const Unauthorized = lazy(() => import('./components/Unauthorized'));
const EmployeesPage = lazy(() => import('./components/EmployeesPage'));
const LeaveManagement = lazy(() => import('./components/LeaveManagement'));
const PayrollSystem = lazy(() => import('./components/PayrollSystem'));
const TaskManagement = lazy(() => import('./components/TaskManagement'));
const AnalyticsDashboard = lazy(() => import('./components/AnalyticsDashboard'));
const PerformanceManagement = lazy(() => import('./components/PerformanceManagement'));
const AttendanceTracking = lazy(() => import('./components/AttendanceTracking'));
const LeaveApplicationForm = lazy(() => import('./components/LeaveApplicationForm'));
const MyLeaves = lazy(() => import('./components/MyLeaves'));

// Wrapper component for Leave Application Form page
const LeaveApplicationFormPage = () => {
  const navigate = useNavigate();
  return <LeaveApplicationForm onClose={() => navigate('/my-leaves')} />;
};

const ToastContext = createContext();
const ThemeContext = createContext();

export const useToast = () => useContext(ToastContext);
export const useTheme = () => useContext(ThemeContext);

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle size={18} className="text-green-500" />,
    error: <AlertTriangle size={18} className="text-red-500" />,
    info: <Info size={18} className="text-blue-500" />,
  };

  return (
    <div className="fixed top-20 right-6 z-[100] toast-enter">
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] shadow-2xl rounded-xl p-4 flex items-center gap-3 min-w-[320px]">
        <div className={`p-2 rounded-lg ${type === 'success' ? 'bg-green-500/10' : type === 'error' ? 'bg-red-500/10' : 'bg-blue-500/10'}`}>
          {icons[type]}
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-[var(--text-primary)]">{type.charAt(0).toUpperCase() + type.slice(1)}</p>
          <p className="text-xs text-[var(--text-secondary)]">{message}</p>
        </div>
        <button onClick={onClose} className="text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

const MainLayout = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {isAuthenticated && <Sidebar />}
      <div className="main-content" style={{ 
        flex: 1, 
        marginLeft: isAuthenticated ? '215px' : '0', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'margin-left 0.3s ease'
      }}>
        {isAuthenticated && <Header />}
        <main style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </main>
      </div>
      
      <style>{`
        @media (max-width: 768px) {
          .main-content {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

function AppContent() {
  const { role, isAuthenticated } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeptFormOpen, setIsDeptFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editingDept, setEditingDept] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  useEffect(() => {
    if (isAuthenticated && role === 'admin') {
      fetchData();
    }
  }, [isAuthenticated, role]);

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
    }
  };

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setIsFormOpen(true);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setIsFormOpen(true);
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await api.deleteEmployee(id);
        setEmployees(employees.filter(emp => emp.id !== id));
        showToast('Employee deleted successfully');
      } catch (error) {
        console.error('Error deleting employee:', error);
        showToast('Failed to delete employee', 'error');
      }
    }
  };

  const handleEmployeeSubmit = async (data) => {
    try {
      if (editingEmployee) {
        await api.updateEmployee(editingEmployee.id, data);
        setEmployees(employees.map(emp => emp.id === editingEmployee.id ? { ...emp, ...data } : emp));
        showToast('Employee updated successfully');
      } else {
        const newEmp = await api.createEmployee(data);
        setEmployees([...employees, newEmp]);
        showToast('Employee added successfully');
      }
      setIsFormOpen(false);
      setEditingEmployee(null);
    } catch (error) {
      console.error('Error submitting employee:', error);
      showToast('Error submitting employee form', 'error');
    }
  };

  const handleAddDept = () => {
    setEditingDept(null);
    setIsDeptFormOpen(true);
  };

  const handleEditDept = (dept) => {
    setEditingDept(dept);
    setIsDeptFormOpen(true);
  };

  const handleDeleteDept = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await api.deleteDepartment(id);
        setDepartments(departments.filter(dept => dept.id !== id));
        showToast('Department deleted successfully');
      } catch (error) {
        console.error('Error deleting department:', error);
        showToast('Failed to delete department', 'error');
      }
    }
  };

  const handleDeptSubmit = async (data) => {
    try {
      if (editingDept) {
        await api.updateDepartment(editingDept.id, data);
        setDepartments(departments.map(dept => dept.id === editingDept.id ? { ...dept, ...data } : dept));
        showToast('Department updated successfully');
      } else {
        const newDept = await api.createDepartment(data);
        setDepartments([...departments, newDept]);
        showToast('Department created successfully');
      }
      setIsDeptFormOpen(false);
      setEditingDept(null);
    } catch (error) {
      console.error('Error submitting department:', error);
      showToast('Error submitting department form', 'error');
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ToastContext.Provider value={{ showToast }}>
        <Router>
          {toasts.map(toast => (
            <Toast 
              key={toast.id} 
              message={toast.message} 
              type={toast.type} 
              onClose={() => removeToast(toast.id)} 
              role="alert"
              aria-live="polite"
            />
          ))}
          <Suspense fallback={<LoadingSpinner fullScreen />}>
            <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            <Route path="/home" element={<ProtectedRoute><MainLayout><Home /></MainLayout></ProtectedRoute>} />
            
            <Route 
              path="/employees" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <MainLayout>
                    <EmployeesPage 
                      employees={employees}
                      departments={departments}
                      onAddEmployee={handleAddEmployee}
                      onEditEmployee={handleEditEmployee}
                      onDeleteEmployee={handleDeleteEmployee}
                    />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/departments" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'employee']}>
                  <MainLayout>
                    <DepartmentManager 
                      departments={departments}
                      onAddDept={handleAddDept}
                      onEditDept={handleEditDept}
                      onDeleteDept={handleDeleteDept}
                    />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            
            <Route path="/leaves" element={<ProtectedRoute><MainLayout><LeaveManagement /></MainLayout></ProtectedRoute>} />
            <Route path="/leaves/apply" element={<ProtectedRoute allowedRoles={['employee']}><MainLayout><LeaveApplicationFormPage /></MainLayout></ProtectedRoute>} />
            <Route path="/my-leaves" element={<ProtectedRoute allowedRoles={['employee']}><MainLayout><MyLeaves /></MainLayout></ProtectedRoute>} />
            <Route path="/tasks" element={<ProtectedRoute><MainLayout><TaskManagement /></MainLayout></ProtectedRoute>} />
            <Route path="/payroll" element={<ProtectedRoute><MainLayout><PayrollSystem /></MainLayout></ProtectedRoute>} />
            <Route path="/onboarding" element={<ProtectedRoute allowedRoles={['admin']}><MainLayout><OnboardingFlow /></MainLayout></ProtectedRoute>} />
            <Route path="/bulk-upload" element={<ProtectedRoute allowedRoles={['admin']}><MainLayout><BulkUpload /></MainLayout></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute allowedRoles={['admin']}><MainLayout><AnalyticsDashboard /></MainLayout></ProtectedRoute>} />
            <Route path="/performance" element={<ProtectedRoute><MainLayout><PerformanceManagement /></MainLayout></ProtectedRoute>} />
            <Route path="/attendance" element={<ProtectedRoute><MainLayout><AttendanceTracking /></MainLayout></ProtectedRoute>} />
            <Route path="/handbook" element={<ProtectedRoute><MainLayout><ChatBot /></MainLayout></ProtectedRoute>} />
            <Route path="/tools" element={<ProtectedRoute allowedRoles={['admin']}><MainLayout><PlatformTools /></MainLayout></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><MainLayout><ProfilePage /></MainLayout></ProtectedRoute>} />
            <Route path="/profile/:employeeId" element={<ProtectedRoute allowedRoles={['admin']}><MainLayout><ProfilePage /></MainLayout></ProtectedRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>

          {isFormOpen && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>{editingEmployee ? 'Edit Employee' : 'Add Employee'}</h3>
                <EmployeeForm 
                  onSubmit={handleEmployeeSubmit}
                  onCancel={() => { setIsFormOpen(false); setEditingEmployee(null); }}
                  employee={editingEmployee}
                  departments={departments}
                />
              </div>
            </div>
          )}

          {isDeptFormOpen && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>{editingDept ? 'Edit Department' : 'Add Department'}</h3>
                <DepartmentForm 
                  onSubmit={handleDeptSubmit}
                  onCancel={() => { setIsDeptFormOpen(false); setEditingDept(null); }}
                  department={editingDept}
                />
              </div>
            </div>
          )}
          <FloatingChat />
        </Router>
      </ToastContext.Provider>
    </ThemeContext.Provider>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NotificationsProvider>
          <PerformanceProvider>
            <AttendanceProvider>
              <LeaveProvider>
                <AppContent />
              </LeaveProvider>
            </AttendanceProvider>
          </PerformanceProvider>
        </NotificationsProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
