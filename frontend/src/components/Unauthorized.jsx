import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { role } = useAuth();

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh', 
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      padding: '20px',
      textAlign: 'center'
    }}>
      <div style={{ 
        width: '80px', 
        height: '80px', 
        borderRadius: '50%', 
        backgroundColor: 'rgba(239, 68, 68, 0.1)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        marginBottom: '24px'
      }}>
        <ShieldAlert size={48} color="#EF4444" />
      </div>
      
      <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '12px' }}>Access Denied</h1>
      <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '400px' }}>
        You don't have permission to view this page. Restricted area for <strong>{role === 'admin' ? 'Admins' : 'Employees'}</strong>.
      </p>

      <div style={{ display: 'flex', gap: '16px' }}>
        <button 
          onClick={() => navigate('/home')}
          style={{ 
            backgroundColor: 'var(--accent-color)', 
            color: '#fff', 
            padding: '12px 24px', 
            borderRadius: '12px', 
            border: 'none', 
            fontWeight: '700', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
