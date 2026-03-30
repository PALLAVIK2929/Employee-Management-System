import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { api } from './api';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import DepartmentManager from './components/DepartmentManager';
import DepartmentForm from './components/DepartmentForm';
import ChatBot from './components/ChatBot';
import Dashboard from './components/Dashboard';
import OnboardingPlan from './components/OnboardingPlan';
import OnboardingAgent from './components/OnboardingAgent';
import BulkUpload from './components/BulkUpload';
import Profile from './components/Profile';
import Home from './components/Home';
import Login from './components/Login';
import LandingPage from './components/LandingPage';
import PlatformTools from './components/PlatformTools';
import PrivateRoute from './components/PrivateRoute';
import EmployeesPage from './components/EmployeesPage';
import LeaveManagement from './components/LeaveManagement';
import PayrollSystem from './components/PayrollSystem';
import TaskManagement from './components/TaskManagement';
import AnalyticsDashboard from './components/AnalyticsDashboard';

import './App.css';

const MainLayout = ({ children }) => {
  const userStr = localStorage.getItem('user');
  let user = {};
  try {
    user = JSON.parse(userStr || '{}');
  } catch (e) {
    user = {};
  }
  const role = user.role || 'admin';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F3F4F6' }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: '215px', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeptFormOpen, setIsDeptFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editingDept, setEditingDept] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    let user = {};
    try {
      user = JSON.parse(userStr || '{}');
    } catch (e) {
      user = {};
    }
    const role = user.role || 'admin';

    if (!token || role !== 'admin') return;

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
      await api.deleteEmployee(id);
      fetchData();
    }
  };

  const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    let user = {};
    try {
      user = JSON.parse(userStr || '{}');
    } catch (e) {
      user = {};
    }
    const role = user.role || 'admin';

  return (
    <Router>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/home" replace /> : <LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={
          <PrivateRoute>
            <MainLayout>
              <Routes>
                <Route path="/home" element={<div style={{ padding: '2rem' }}><Home /></div>} />
                <Route path="/analytics" element={<AnalyticsDashboard />} />
                <Route path="/payroll" element={role === 'employee' ? <PayrollSystem /> : <Navigate to="/home" replace />} />
                <Route path="/tasks" element={role === 'employee' ? <TaskManagement /> : <Navigate to="/home" replace />} />
                <Route path="/employees" element={role === 'admin' ? <EmployeesPage onAddEmployee={handleAddEmployee} onEditEmployee={handleEditEmployee} onDeleteEmployee={handleDeleteEmployee} /> : <Navigate to="/home" replace />} />
                <Route path="/departments" element={
                  role === 'admin' ? (
                    <div style={{ padding: '2rem' }}>
                      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1E1B4B' }}>Department Management</h1>
                        <button 
                          onClick={() => {
                            setEditingDept(null);
                            setIsDeptFormOpen(true);
                          }}
                          style={{
                            backgroundColor: '#3D3B8E',
                            color: '#fff',
                            padding: '10px 20px',
                            borderRadius: '12px',
                            border: 'none',
                            fontSize: '14px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          <Plus size={18} />
                          Add Department
                        </button>
                      </header>
                      <DepartmentManager 
                        departments={departments} 
                        onRefresh={fetchData} 
                        onEditDept={(dept) => {
                          setEditingDept(dept);
                          setIsDeptFormOpen(true);
                        }}
                      />
                    </div>
                  ) : <Navigate to="/home" replace />
                } />
                <Route path="/leaves" element={<LeaveManagement />} />
                <Route path="/bulk-upload" element={role === 'admin' ? <div style={{ padding: '2rem' }}><BulkUpload onUploadSuccess={fetchData} /></div> : <Navigate to="/home" replace />} />
                <Route path="/onboarding" element={<OnboardingAgent employees={employees} />} />
                <Route path="/handbook" element={<ChatBot />} />
                <Route path="/tools" element={role === 'admin' ? <div style={{ padding: '2rem' }}><PlatformTools /></div> : <Navigate to="/home" replace />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </MainLayout>
          </PrivateRoute>
        } />
      </Routes>

      {isFormOpen && (
        <EmployeeForm
          employee={editingEmployee}
          departments={departments}
          onClose={() => setIsFormOpen(false)}
          onSave={() => {
            setIsFormOpen(false);
            fetchData();
          }}
        />
      )}
      {isDeptFormOpen && (
        <DepartmentForm
          department={editingDept}
          onClose={() => setIsDeptFormOpen(false)}
          onSave={() => {
            setIsDeptFormOpen(false);
            fetchData();
          }}
        />
      )}
    </Router>
  );
}

export default App;
