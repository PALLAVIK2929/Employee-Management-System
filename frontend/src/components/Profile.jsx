import React, { useState, useEffect } from 'react';
import { 
  User, Shield, Activity, Settings, 
  MapPin, Mail, Phone, Calendar, 
  CheckCircle, AlertCircle, X, 
  ChevronRight, Lock, Bell, Smartphone,
  Sparkles, FileText, Download, Eye,
  QrCode, CreditCard, Award, Zap, BookOpen
} from 'lucide-react';

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role || 'admin';

  // 1. State Management
  const [activeTab, setActiveTab] = useState('Overview');
  const [editForm, setEditForm] = useState({
    name: user.name || 'Admin User',
    email: user.email || 'admin@company.com',
    role: role === 'admin' ? 'Super Administrator' : 'Senior AI Developer',
    phone: '+1 (555) 000-1234',
    department: role === 'admin' ? 'Executive Management' : 'Engineering',
    location: 'New York, USA',
    bio: role === 'admin' 
      ? 'Passionate HR leader with 10+ years of experience in building high-performing teams and scaling organizational culture.'
      : 'Full-stack developer specialized in AI-driven applications and workforce automation systems.'
  });
  const [saved, setSaved] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const [twoFA, setTwoFA] = useState(true);
  const [notifications, setNotifications] = useState({ email: true, push: true, sms: false });

  // 2. Design Tokens
  const colors = {
    white: '#fff',
    pageBg: '#F3F4F6',
    primary: '#1E1B4B',
    accent: '#3D3B8E',
    lightPurple: '#EEF2FF',
    muted: '#6B7280',
    border: '#E5E7EB',
    green: '#10B981',
    red: '#EF4444',
    amber: '#F59E0B',
    indigo: '#6366F1'
  };

  // 3. Handlers
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');
    if (!passwords.current || !passwords.new || !passwords.confirm) return setPwError('All fields are required');
    if (passwords.new.length < 6) return setPwError('Password must be at least 6 characters');
    if (passwords.new !== passwords.confirm) return setPwError('Passwords do not match');
    
    setPwSuccess('Password updated successfully!');
    setPasswords({ current: '', new: '', confirm: '' });
  };

  // 4. Styles
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: colors.pageBg,
      fontFamily: "'Sora', sans-serif",
      animation: 'fadeUp 0.6s ease-out'
    },
    hero: {
      height: '240px',
      backgroundColor: colors.primary,
      position: 'relative',
      padding: '40px',
      color: colors.white,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      overflow: 'hidden'
    },
    heroOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
      backgroundSize: '20px 20px',
      pointerEvents: 'none'
    },
    avatar: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #3D3B8E 0%, #6366F1 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      fontWeight: '800',
      position: 'relative',
      boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
    },
    onlineDot: {
      width: '16px',
      height: '16px',
      backgroundColor: colors.green,
      borderRadius: '50%',
      border: '3px solid #1E1B4B',
      position: 'absolute',
      bottom: '2px',
      right: '2px'
    },
    badge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      backgroundColor: 'rgba(255,255,255,0.1)',
      padding: '4px 12px',
      borderRadius: '999px',
      fontSize: '11px',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      marginBottom: '12px'
    },
    statCounter: {
      textAlign: 'center',
      padding: '0 24px',
      borderRight: '1px solid rgba(255,255,255,0.1)'
    },
    tabBar: {
      backgroundColor: colors.white,
      padding: '0 40px',
      display: 'flex',
      gap: '32px',
      borderBottom: `1px solid ${colors.border}`,
      position: 'sticky',
      top: 0,
      zIndex: 10
    },
    tab: (active) => ({
      padding: '20px 0',
      fontSize: '14px',
      fontWeight: active ? '700' : '500',
      color: active ? colors.primary : colors.muted,
      borderBottom: `3px solid ${active ? colors.primary : 'transparent'}`,
      cursor: 'pointer',
      transition: 'all 0.2s'
    }),
    content: {
      padding: '40px',
      animation: 'fadeUp 0.4s ease-out'
    },
    card: {
      backgroundColor: colors.white,
      borderRadius: '16px',
      padding: '24px',
      border: `1px solid ${colors.border}`,
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    },
    infoRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '12px 0',
      borderBottom: `1px solid #F9FAFB`
    },
    chip: {
      backgroundColor: colors.lightPurple,
      color: colors.accent,
      padding: '6px 14px',
      borderRadius: '8px',
      fontSize: '12px',
      fontWeight: '700'
    },
    quickStat: (color) => ({
      padding: '20px',
      borderRadius: '12px',
      backgroundColor: `${color}08`,
      border: `1px solid ${color}15`
    }),
    input: {
      width: '100%',
      padding: '12px 16px',
      borderRadius: '10px',
      border: `1px solid ${colors.border}`,
      fontSize: '14px',
      outline: 'none',
      backgroundColor: '#FAFAFA',
      transition: 'border-color 0.2s'
    },
    toggle: (active) => ({
      width: '44px',
      height: '24px',
      backgroundColor: active ? colors.primary : '#D1D5DB',
      borderRadius: '999px',
      position: 'relative',
      cursor: 'pointer',
      transition: 'background-color 0.3s'
    }),
    toggleBall: (active) => ({
      width: '18px',
      height: '18px',
      backgroundColor: '#fff',
      borderRadius: '50%',
      position: 'absolute',
      top: '3px',
      left: active ? '23px' : '3px',
      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }),
    activityRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '16px 0',
      borderBottom: `1px solid #F9FAFB`
    }
  };

  return (
    <div style={styles.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── Hero Banner ── */}
      <div style={styles.hero}>
        <div style={styles.heroOverlay} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px', position: 'relative' }}>
          <div style={styles.avatar}>
            AU
            <div style={styles.onlineDot} />
          </div>
          <div>
            <div style={styles.badge}>
              <Sparkles size={12} /> Administrator
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 8px 0' }}>{editForm.name}</h1>
            <p style={{ margin: '0 0 16px 0', opacity: 0.8, fontWeight: '500' }}>{editForm.role} • {editForm.department}</p>
            <div style={{ display: 'flex', gap: '24px', fontSize: '12px', fontWeight: '600', opacity: 0.7 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} /> {editForm.location}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} /> {editForm.email}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={14} /> {editForm.phone}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', position: 'relative' }}>
          <div style={styles.statCounter}>
            <div style={{ fontSize: '24px', fontWeight: '800' }}>60</div>
            <div style={{ fontSize: '11px', fontWeight: '700', opacity: 0.6, textTransform: 'uppercase', marginTop: '4px' }}>Employees</div>
          </div>
          <div style={styles.statCounter}>
            <div style={{ fontSize: '24px', fontWeight: '800' }}>47</div>
            <div style={{ fontSize: '11px', fontWeight: '700', opacity: 0.6, textTransform: 'uppercase', marginTop: '4px' }}>Departments</div>
          </div>
          <div style={{ ...styles.statCounter, borderRight: 'none' }}>
            <div style={{ fontSize: '24px', fontWeight: '800' }}>3y</div>
            <div style={{ fontSize: '11px', fontWeight: '700', opacity: 0.6, textTransform: 'uppercase', marginTop: '4px' }}>Tenure</div>
          </div>
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div style={styles.tabBar}>
        {['Overview', 'Edit Profile', 'Security', 'Activity', ...(role === 'employee' ? ['My Documents', 'Digital ID'] : [])].map(t => (
          <div key={t} style={styles.tab(activeTab === t)} onClick={() => setActiveTab(t)}>{t}</div>
        ))}
      </div>

      {/* ── Tab Content ── */}
      <div style={styles.content}>
        
        {/* Overview Tab */}
        {activeTab === 'Overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div style={styles.card}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '20px', color: colors.primary }}>About Administrator</h3>
                <p style={{ fontSize: '14px', lineHeight: '1.7', color: colors.muted, marginBottom: '24px' }}>{editForm.bio}</p>
                <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: '12px' }}>
                  {[
                    ['Role', editForm.role],
                    ['Department', editForm.department],
                    ['Email', editForm.email],
                    ['Phone', editForm.phone],
                    ['Location', editForm.location],
                    ['Joined', 'March 2021']
                  ].map(([k, v]) => (
                    <div key={k} style={styles.infoRow}>
                      <span style={{ fontSize: '13px', color: colors.muted }}>{k}</span>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: colors.primary }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div style={styles.card}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '20px', color: colors.primary }}>Skills & Expertise</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {['HR Management', 'Team Leadership', 'Data Analytics', 'Onboarding', 'Compliance', 'Payroll'].map(s => (
                    <span key={s} style={styles.chip}>{s}</span>
                  ))}
                </div>
              </div>

              <div style={styles.card}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '20px', color: colors.primary }}>Quick Stats</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {[
                    ['Leaves Approved', '124', colors.green],
                    ['Employees Added', '68', colors.indigo],
                    ['Plans Generated', '45', colors.amber],
                    ['Reports Exported', '89', colors.accent]
                  ].map(([l, v, c]) => (
                    <div key={l} style={styles.quickStat(c)}>
                      <div style={{ fontSize: '24px', fontWeight: '800', color: c }}>{v}</div>
                      <div style={{ fontSize: '11px', fontWeight: '700', color: colors.muted, marginTop: '4px' }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Profile Tab */}
        {activeTab === 'Edit Profile' && (
          <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: colors.primary }}>Account Settings</h3>
              {saved && <span style={{ backgroundColor: `${colors.green}15`, color: colors.green, padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '700' }}>✓ Saved successfully</span>}
            </div>
            <form onSubmit={handleSaveProfile} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '11px', fontWeight: '800', color: colors.primary, textTransform: 'uppercase' }}>Full Name</label>
                <input style={styles.input} value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '11px', fontWeight: '800', color: colors.primary, textTransform: 'uppercase' }}>Email Address</label>
                <input style={styles.input} value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '11px', fontWeight: '800', color: colors.primary, textTransform: 'uppercase' }}>Role / Title</label>
                <input style={styles.input} value={editForm.role} onChange={e => setEditForm({...editForm, role: e.target.value})} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '11px', fontWeight: '800', color: colors.primary, textTransform: 'uppercase' }}>Phone Number</label>
                <input style={styles.input} value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '11px', fontWeight: '800', color: colors.primary, textTransform: 'uppercase' }}>Department</label>
                <input style={styles.input} value={editForm.department} onChange={e => setEditForm({...editForm, department: e.target.value})} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '11px', fontWeight: '800', color: colors.primary, textTransform: 'uppercase' }}>Location</label>
                <input style={styles.input} value={editForm.location} onChange={e => setEditForm({...editForm, location: e.target.value})} />
              </div>
              <div style={{ gridColumn: '1 / span 2', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '11px', fontWeight: '800', color: colors.primary, textTransform: 'uppercase' }}>Bio / Description</label>
                <textarea style={{ ...styles.input, height: '100px', resize: 'none' }} value={editForm.bio} onChange={e => setEditForm({...editForm, bio: e.target.value})} />
              </div>
              <button type="submit" style={{ gridColumn: '1 / span 2', padding: '16px', borderRadius: '12px', border: 'none', background: 'linear-gradient(90deg, #1E1B4B 0%, #3D3B8E 100%)', color: '#fff', fontSize: '14px', fontWeight: '700', cursor: 'pointer', marginTop: '12px' }}>Save Changes</button>
            </form>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'Security' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            <div style={styles.card}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '32px', color: colors.primary }}>Change Password</h3>
              <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {pwError && <div style={{ padding: '12px', backgroundColor: `${colors.red}10`, border: `1px solid ${colors.red}20`, color: colors.red, fontSize: '12px', fontWeight: '700', borderRadius: '8px' }}>{pwError}</div>}
                {pwSuccess && <div style={{ padding: '12px', backgroundColor: `${colors.green}10`, border: `1px solid ${colors.green}20`, color: colors.green, fontSize: '12px', fontWeight: '700', borderRadius: '8px' }}>{pwSuccess}</div>}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '800', color: colors.primary, textTransform: 'uppercase' }}>Current Password</label>
                  <input type="password" style={styles.input} value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '800', color: colors.primary, textTransform: 'uppercase' }}>New Password</label>
                  <input type="password" style={styles.input} value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '800', color: colors.primary, textTransform: 'uppercase' }}>Confirm Password</label>
                  <input type="password" style={styles.input} value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} />
                </div>
                <button type="submit" style={{ padding: '14px', borderRadius: '10px', border: 'none', backgroundColor: colors.primary, color: '#fff', fontSize: '13px', fontWeight: '700', cursor: 'pointer', marginTop: '8px' }}>Update Password</button>
              </form>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div style={styles.card}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px', color: colors.primary }}>Security Settings</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: colors.primary }}>Two-Factor Authentication</div>
                    <div style={{ fontSize: '12px', color: colors.muted, marginTop: '2px' }}>Enable extra security for your account</div>
                  </div>
                  <div style={styles.toggle(twoFA)} onClick={() => setTwoFA(!twoFA)}>
                    <div style={styles.toggleBall(twoFA)} />
                  </div>
                </div>
                <div style={{ height: '1px', backgroundColor: colors.border, margin: '24px 0' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {[
                    ['email', 'Email Notifications', 'Receive security alerts via email', <Mail size={16} />],
                    ['push', 'Push Notifications', 'Real-time alerts on your devices', <Smartphone size={16} />],
                    ['sms', 'SMS Alerts', 'Critical security updates via text', <Phone size={16} />]
                  ].map(([k, t, s, i]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div style={{ color: colors.muted }}>{i}</div>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: '700', color: colors.primary }}>{t}</div>
                          <div style={{ fontSize: '11px', color: colors.muted }}>{s}</div>
                        </div>
                      </div>
                      <div style={styles.toggle(notifications[k])} onClick={() => setNotifications({...notifications, [k]: !notifications[k]})}>
                        <div style={styles.toggleBall(notifications[k])} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'Activity' && (
          <div style={styles.card}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px', color: colors.primary }}>Recent Platform Activity</h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {[
                ['✅', 'Approved leave request', 'Dianne Russell', '2m ago'],
                ['👤', 'Added new employee', 'Cody Fisher', '1h ago'],
                ['✦', 'Updated onboarding plan', 'Leslie Alexander', '4h ago'],
                ['🔐', 'Changed account password', null, 'Yesterday'],
                ['📊', 'Exported workforce report', null, '2 days ago']
              ].map(([i, t, w, s], idx) => (
                <div key={idx} style={styles.activityRow}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: colors.lightPurple, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>{i}</div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: colors.primary }}>{t}</span>
                    {w && <span style={{ fontSize: '13px', color: colors.muted }}> · {w}</span>}
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: colors.muted }}>{s}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Documents Tab (Employee Only) */}
        {activeTab === 'My Documents' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={styles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: colors.primary }}>Corporate Documents</h3>
                <button style={{ ...styles.chip, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Download size={14} /> Download All
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {[
                  { name: 'Employment Contract', size: '2.4 MB', date: 'Mar 12, 2024', icon: FileText, color: colors.indigo, file: '/contract.txt' },
                  { name: 'Offer Letter', size: '1.1 MB', date: 'Feb 28, 2024', icon: FileText, color: colors.green, file: '/offer-letter.txt' },
                  { name: 'Non-Disclosure Agreement', size: '850 KB', date: 'Mar 12, 2024', icon: Shield, color: colors.red, file: '/dummy-doc.txt' },
                  { name: 'Company Policy Handbook', size: '5.2 MB', date: 'Jan 15, 2024', icon: BookOpen, color: colors.amber, file: '/dummy-doc.txt' },
                  { name: 'Health Insurance Plan', size: '3.1 MB', date: 'Apr 01, 2024', icon: CheckCircle, color: colors.accent, file: '/dummy-doc.txt' }
                ].map((doc, i) => (
                  <div key={i} style={{ 
                    padding: '20px', 
                    borderRadius: '16px', 
                    border: `1px solid ${colors.border}`, 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '16px',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.borderColor = doc.color;
                    e.currentTarget.style.backgroundColor = `${doc.color}05`;
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.borderColor = colors.border;
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  >
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: `${doc.color}15`, color: doc.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <doc.icon size={24} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: colors.primary, marginBottom: '4px' }}>{doc.name}</div>
                      <div style={{ fontSize: '11px', color: colors.muted }}>{doc.size} • {doc.date}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <a href={doc.file} target="_blank" rel="noopener noreferrer" style={{ color: colors.muted }}><Eye size={16} /></a>
                      <a href={doc.file} download={doc.name} style={{ color: colors.muted }}><Download size={16} /></a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.card}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px', color: colors.primary }}>Payslips & Tax Forms</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['March 2024', 'February 2024', 'January 2024'].map((month, i) => (
                  <div key={i} style={{ ...styles.infoRow, alignItems: 'center', padding: '16px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: colors.lightPurple, color: colors.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CreditCard size={16} />
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: colors.primary }}>Salary Slip - {month}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                      <span style={{ fontSize: '12px', color: colors.muted }}>Processed on {month.split(' ')[0]} 30th</span>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <a href="/payslip.txt" target="_blank" rel="noopener noreferrer" style={{ color: colors.accent, textDecoration: 'none', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Eye size={14} /> View
                        </a>
                        <a href="/payslip.txt" download={`Payslip_${month}.txt`} style={{ color: colors.accent, textDecoration: 'none', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Download size={14} /> PDF
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Digital ID Tab (Employee Only) */}
        {activeTab === 'Digital ID' && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
            <div style={{ 
              width: '400px', 
              backgroundColor: colors.primary, 
              borderRadius: '32px', 
              overflow: 'hidden',
              boxShadow: '0 30px 60px rgba(30, 27, 75, 0.3)',
              position: 'relative',
              color: colors.white,
              fontFamily: "'Sora', sans-serif"
            }}>
              {/* ID Card Pattern */}
              <div style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                right: 0, 
                height: '150px', 
                background: 'linear-gradient(135deg, #3D3B8E 0%, #1E1B4B 100%)',
                zIndex: 0
              }} />
              <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 1, opacity: 0.2 }}><Zap size={100} /></div>

              <div style={{ position: 'relative', zIndex: 2, padding: '40px', textAlign: 'center' }}>
                <div style={{ 
                  width: '120px', 
                  height: '120px', 
                  borderRadius: '50%', 
                  border: '4px solid #fff',
                  margin: '0 auto 24px',
                  background: 'linear-gradient(135deg, #6366F1 0%, #3D3B8E 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '40px',
                  fontWeight: '800',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                }}>
                  {editForm.name.split(' ').map(n => n[0]).join('')}
                </div>

                <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>{editForm.name}</h2>
                <div style={{ 
                  display: 'inline-flex', 
                  padding: '6px 16px', 
                  backgroundColor: 'rgba(255,255,255,0.1)', 
                  borderRadius: '999px', 
                  fontSize: '12px', 
                  fontWeight: '700',
                  marginBottom: '32px',
                  backdropFilter: 'blur(4px)'
                }}>
                  {editForm.role.toUpperCase()}
                </div>

                <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '32px', marginBottom: '32px', display: 'flex', justifyContent: 'center' }}>
                  <QrCode size={160} color={colors.primary} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', textAlign: 'left' }}>
                  <div>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: '700', marginBottom: '4px' }}>Employee ID</div>
                    <div style={{ fontSize: '14px', fontWeight: '700' }}>#EMS-2024-089</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: '700', marginBottom: '4px' }}>Department</div>
                    <div style={{ fontSize: '14px', fontWeight: '700' }}>{editForm.department}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: '700', marginBottom: '4px' }}>Valid Thru</div>
                    <div style={{ fontSize: '14px', fontWeight: '700' }}>12/2028</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: '700', marginBottom: '4px' }}>Blood Group</div>
                    <div style={{ fontSize: '14px', fontWeight: '700' }}>O+ Positive</div>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '20px', textAlign: 'center', fontSize: '11px', fontWeight: '600', letterSpacing: '0.1em', opacity: 0.8 }}>
                EMS PLATFORM • VERIFIED IDENTITY
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
