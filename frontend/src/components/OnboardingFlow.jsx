import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Briefcase, FileText, CheckCircle, 
  ChevronRight, ChevronLeft, Upload, Sparkles,
  Check
} from 'lucide-react';
import { useToast } from '../App';

const OnboardingFlow = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    department: '',
    role: '',
    startDate: '',
    employeeId: '',
    photo: null,
    idProof: null
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const validateStep = (currentStep) => {
    const newErrors = {};
    if (currentStep === 1) {
      if (!formData.fullName) newErrors.fullName = 'Full Name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
      if (!formData.phone) newErrors.phone = 'Phone number is required';
      if (!formData.dob) newErrors.dob = 'Date of birth is required';
    } else if (currentStep === 2) {
      if (!formData.department) newErrors.department = 'Department is required';
      if (!formData.role) newErrors.role = 'Role is required';
      if (!formData.startDate) newErrors.startDate = 'Start date is required';
      if (!formData.employeeId) newErrors.employeeId = 'Employee ID is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, [field]: file.name }));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setStep(5); // Success step
    showToast('Employee onboarding completed successfully!');
  };

  const steps = [
    { id: 1, title: 'Personal Info', icon: User },
    { id: 2, title: 'Job Details', icon: Briefcase },
    { id: 3, title: 'Documents', icon: FileText },
    { id: 4, title: 'Review', icon: CheckCircle },
  ];

  const renderProgress = () => (
    <div style={{ marginBottom: '48px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: '12px' }}>
        <div style={{ position: 'absolute', top: '20px', left: '0', right: '0', height: '2px', backgroundColor: 'var(--border-color)', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: '20px', left: '0', width: `${((step - 1) / (steps.length - 1)) * 100}%`, height: '2px', backgroundColor: 'var(--accent-color)', transition: 'width 0.5s ease', zIndex: 0 }} />
        
        {steps.map((s) => {
          const Icon = s.icon;
          const isActive = step >= s.id;
          const isCompleted = step > s.id;
          
          return (
            <div key={s.id} style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                backgroundColor: isCompleted ? 'var(--accent-color)' : isActive ? 'var(--accent-color)' : 'var(--bg-card)', 
                border: `2px solid ${isActive ? 'var(--accent-color)' : 'var(--border-color)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isCompleted || isActive ? '#fff' : 'var(--text-secondary)',
                transition: 'all 0.3s ease'
              }}>
                {isCompleted ? <Check size={20} /> : <Icon size={20} />}
              </div>
              <span style={{ fontSize: '12px', fontWeight: '700', color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{s.title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="animate-fade-in-up">
            <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '24px', color: 'var(--text-primary)' }}>Personal Information</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} placeholder="e.g. John Doe" />
                {errors.fullName && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>{errors.fullName}</p>}
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="john@company.com" />
                {errors.email && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>{errors.email}</p>}
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="+1 (555) 000-0000" />
                {errors.phone && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>{errors.phone}</p>}
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input type="date" value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} />
                {errors.dob && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>{errors.dob}</p>}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="animate-fade-in-up">
            <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '24px', color: 'var(--text-primary)' }}>Job Details</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label>Department</label>
                <select value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})}>
                  <option value="">Select Department</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="Human Resources">Human Resources</option>
                </select>
                {errors.department && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>{errors.department}</p>}
              </div>
              <div className="form-group">
                <label>Role</label>
                <input type="text" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} placeholder="e.g. Senior Developer" />
                {errors.role && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>{errors.role}</p>}
              </div>
              <div className="form-group">
                <label>Start Date</label>
                <input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} />
                {errors.startDate && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>{errors.startDate}</p>}
              </div>
              <div className="form-group">
                <label>Employee ID</label>
                <input type="text" value={formData.employeeId} onChange={(e) => setFormData({...formData, employeeId: e.target.value})} placeholder="EMP-001" />
                {errors.employeeId && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>{errors.employeeId}</p>}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="animate-fade-in-up">
            <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '24px', color: 'var(--text-primary)' }}>Document Upload</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ padding: '32px', border: '2px dashed var(--border-color)', borderRadius: '16px', textAlign: 'center', cursor: 'pointer' }} onClick={() => document.getElementById('photo-upload').click()}>
                <Upload size={32} style={{ color: 'var(--accent-color)', marginBottom: '12px' }} />
                <p style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{formData.photo || 'Upload Profile Photo'}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>PNG, JPG up to 5MB</p>
                <input id="photo-upload" type="file" hidden onChange={(e) => handleFileChange(e, 'photo')} />
              </div>
              <div style={{ padding: '32px', border: '2px dashed var(--border-color)', borderRadius: '16px', textAlign: 'center', cursor: 'pointer' }} onClick={() => document.getElementById('id-upload').click()}>
                <Upload size={32} style={{ color: 'var(--accent-color)', marginBottom: '12px' }} />
                <p style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{formData.idProof || 'Upload ID Proof'}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>PDF, JPG up to 10MB</p>
                <input id="id-upload" type="file" hidden onChange={(e) => handleFileChange(e, 'idProof')} />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="animate-fade-in-up">
            <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '24px', color: 'var(--text-primary)' }}>Review & Confirm</h2>
            <div style={{ backgroundColor: 'var(--bg-primary)', padding: '24px', borderRadius: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700' }}>Full Name</p>
                <p style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{formData.fullName}</p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700' }}>Email</p>
                <p style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{formData.email}</p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700' }}>Department</p>
                <p style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{formData.department}</p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700' }}>Role</p>
                <p style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{formData.role}</p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700' }}>Employee ID</p>
                <p style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{formData.employeeId}</p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700' }}>Start Date</p>
                <p style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{formData.startDate}</p>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div style={{ textAlign: 'center', padding: '48px 0' }} className="animate-fade-in-up">
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--status-active-bg)', 
              color: 'var(--status-active-text)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 24px'
            }} className="ripple-badge">
              <Check size={40} />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '12px' }}>Onboarding Complete!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>The employee profile has been created and onboarding sequence initiated.</p>
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Button clicked, navigating to /employees');
                navigate('/employees');
              }}
              style={{ 
                backgroundColor: 'var(--accent-color)', 
                color: '#fff', 
                padding: '12px 32px', 
                borderRadius: '12px', 
                border: 'none', 
                fontWeight: '700', 
                cursor: 'pointer',
                pointerEvents: 'auto',
                zIndex: 10,
                position: 'relative'
              }}
            >
              View Employee List
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>Employee Onboarding</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Follow the steps to add a new employee to the system.</p>
      </div>

      {step < 5 && renderProgress()}

      <div style={{ backgroundColor: 'var(--bg-card)', padding: '40px', borderRadius: '24px', border: '1px solid var(--border-color)', boxShadow: 'var(--card-shadow)' }}>
        {renderStep()}

        {step < 5 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', borderTop: '1px solid var(--border-color)', paddingTop: '32px' }}>
            <button 
              onClick={handleBack} 
              disabled={step === 1}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '8px', 
                backgroundColor: 'transparent', border: 'none', color: 'var(--text-secondary)', 
                fontWeight: '700', cursor: step === 1 ? 'not-allowed' : 'pointer', opacity: step === 1 ? 0.5 : 1
              }}
            >
              <ChevronLeft size={20} /> Back
            </button>
            
            {step === 4 ? (
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={{ 
                  backgroundColor: 'var(--accent-color)', color: '#fff', 
                  padding: '12px 32px', borderRadius: '12px', border: 'none', 
                  fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                }}
              >
                {isSubmitting ? 'Processing...' : 'Complete Onboarding'} <Sparkles size={18} />
              </button>
            ) : (
              <button 
                onClick={handleNext}
                style={{ 
                  backgroundColor: 'var(--accent-color)', color: '#fff', 
                  padding: '12px 32px', borderRadius: '12px', border: 'none', 
                  fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                }}
              >
                Continue <ChevronRight size={18} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingFlow;
