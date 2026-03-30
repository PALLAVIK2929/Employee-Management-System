import React, { useState } from 'react';
import { 
  Sparkles, ChevronRight, Check, 
  Download, Calendar, User, 
  Briefcase, FileText, Layout
} from 'lucide-react';

const OnboardingAgent = () => {
  // State management as requested
  const [form, setForm] = useState({
    name: '',
    role: '',
    startDate: '',
    manager: '',
    department: 'Engineering',
    notes: ''
  });
  const [isGenerated, setIsGenerated] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // 0: 1-30, 1: 31-60, 2: 61-90
  const [taskStates, setTaskStates] = useState([
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false]
  ]);

  // Design tokens
  const colors = {
    white: '#fff',
    pageBg: '#F3F4F6',
    primary: '#1E1B4B',
    accent: '#3D3B8E',
    hover: '#EEF2FF',
    muted: '#6B7280',
    green: '#F0FDF4',
    orange: '#FFF7ED',
    border: '#E5E7EB'
  };

  const phases = [
    { label: 'Day 1–30', title: 'Integration & Learning', color: colors.hover, accent: '#4F46E5' },
    { label: 'Day 31–60', title: 'Execution & Contribution', color: colors.green, accent: '#16A34A' },
    { label: 'Day 61–90', title: 'Autonomy & Growth', color: colors.orange, accent: '#EA580C' }
  ];

  const mockTasks = [
    [
      { title: 'System Access & Setup', desc: 'Configure workstation and access company internal tools.', tag: 'Admin', week: 'Week 1' },
      { title: 'Product Deep-Dive', desc: 'Complete the core product training modules and certification.', tag: 'Technical', week: 'Week 2' },
      { title: 'Meet the Team', desc: 'Schedule 1-on-1 coffee chats with all immediate team members.', tag: 'Culture', week: 'Week 2' },
      { title: 'Initial Project Assign', desc: 'Receive first minor bug fix or documentation task.', tag: 'Process', week: 'Week 4' }
    ],
    [
      { title: 'Lead Team Standup', desc: 'Run the daily synchronization meeting for one full week.', tag: 'Leadership', week: 'Week 6' },
      { title: 'First Feature Launch', desc: 'Deploy a small-to-medium feature to the production environment.', tag: 'Technical', week: 'Week 7' },
      { title: 'Stakeholder Intro', desc: 'Present work progress to cross-functional stakeholders.', tag: 'Growth', week: 'Week 8' },
      { title: 'Documentation Update', desc: 'Audit and update internal wiki for team processes.', tag: 'Admin', week: 'Week 8' }
    ],
    [
      { title: 'Mentorship Session', desc: 'Mentor a newer hire or peer on a specific technical domain.', tag: 'Growth', week: 'Week 10' },
      { title: 'Quarterly Roadmap', desc: 'Contribute to the team planning for the next quarter.', tag: 'Process', week: 'Week 11' },
      { title: 'Process Optimization', desc: 'Identify and fix one bottleneck in the current dev workflow.', tag: 'Technical', week: 'Week 12' },
      { title: '90-Day Review', desc: 'Prepare and conduct the formal performance review with manager.', tag: 'Leadership', week: 'Week 12' }
    ]
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!form.name || !form.role) {
      alert('Please enter at least Employee Name and Role.');
      return;
    }
    setIsGenerated(true);
  };

  const toggleTask = (phaseIdx, taskIdx) => {
    const newState = [...taskStates];
    newState[phaseIdx][taskIdx] = !newState[phaseIdx][taskIdx];
    setTaskStates(newState);
  };

  const getProgress = (phaseIdx) => {
    const completed = taskStates[phaseIdx].filter(Boolean).length;
    return (completed / 4) * 100;
  };

  const getTagColor = (tag) => {
    const map = {
      Admin: { bg: '#F3F4F6', text: '#374151' },
      Culture: { bg: '#FDF2F8', text: '#9D174D' },
      Technical: { bg: '#EFF6FF', text: '#1E40AF' },
      Growth: { bg: '#F0FDF4', text: '#166534' },
      Process: { bg: '#FEF9C3', text: '#854D0E' },
      Leadership: { bg: '#F5F3FF', text: '#5B21B6' }
    };
    return map[tag] || map.Admin;
  };

  // Inline Styles
  const styles = {
    container: {
      padding: '2rem',
      backgroundColor: colors.pageBg,
      minHeight: '100vh',
      fontFamily: "'Inter', sans-serif"
    },
    header: {
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
    mainLayout: {
      display: 'grid',
      gridTemplateColumns: '350px 1fr',
      gap: '2rem',
      alignItems: 'start'
    },
    card: {
      backgroundColor: colors.white,
      borderRadius: '14px',
      border: `1px solid ${colors.border}`,
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      overflow: 'hidden'
    },
    cardHeader: {
      padding: '1.5rem',
      borderBottom: `1px solid ${colors.border}`,
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    },
    form: {
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem'
    },
    label: {
      display: 'block',
      fontSize: '0.75rem',
      fontWeight: '700',
      color: colors.primary,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      marginBottom: '0.5rem'
    },
    input: {
      width: '100%',
      padding: '0.75rem 1rem',
      borderRadius: '8px',
      border: `1px solid ${colors.border}`,
      fontSize: '0.875rem',
      color: colors.primary,
      backgroundColor: '#FAFAFA',
      outline: 'none',
      transition: 'border-color 0.2s'
    },
    generateBtn: {
      width: '100%',
      padding: '1rem',
      backgroundColor: colors.primary,
      color: colors.white,
      border: 'none',
      borderRadius: '10px',
      fontSize: '0.875rem',
      fontWeight: '700',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      marginTop: '1rem',
      transition: 'opacity 0.2s'
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8rem 2rem',
      textAlign: 'center'
    },
    iconBox: {
      width: '64px',
      height: '64px',
      backgroundColor: colors.hover,
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: colors.accent,
      marginBottom: '1.5rem'
    },
    planHeader: {
      padding: '2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      backgroundColor: '#fff'
    },
    exportBtn: {
      padding: '0.5rem 1rem',
      backgroundColor: colors.white,
      border: `1px solid ${colors.border}`,
      borderRadius: '8px',
      fontSize: '0.75rem',
      fontWeight: '700',
      color: colors.primary,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    progressGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '1rem',
      padding: '0 2rem 2rem 2rem'
    },
    progressCard: (phase) => ({
      padding: '1.25rem',
      borderRadius: '12px',
      backgroundColor: phase.color,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem'
    }),
    progressBarBg: {
      width: '100%',
      height: '6px',
      backgroundColor: 'rgba(0,0,0,0.05)',
      borderRadius: '3px',
      overflow: 'hidden'
    },
    progressBarFill: (percent, color) => ({
      width: `${percent}%`,
      height: '100%',
      backgroundColor: color,
      transition: 'width 0.4s ease-out'
    }),
    tabSwitcher: {
      display: 'flex',
      backgroundColor: colors.pageBg,
      padding: '0.5rem',
      margin: '0 2rem 2rem 2rem',
      borderRadius: '12px',
      gap: '0.5rem'
    },
    tab: (active) => ({
      flex: 1,
      padding: '0.75rem',
      border: 'none',
      borderRadius: '8px',
      fontSize: '0.875rem',
      fontWeight: '700',
      cursor: 'pointer',
      backgroundColor: active ? colors.primary : 'transparent',
      color: active ? colors.white : colors.muted,
      transition: 'all 0.2s'
    }),
    taskList: {
      padding: '0 2rem 2rem 2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    },
    taskItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '1rem',
      padding: '1.25rem',
      borderRadius: '12px',
      border: `1px solid ${colors.border}`,
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    checkbox: (checked) => ({
      width: '20px',
      height: '20px',
      borderRadius: '6px',
      border: `2px solid ${checked ? colors.primary : colors.border}`,
      backgroundColor: checked ? colors.primary : colors.white,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: colors.white,
      marginTop: '2px',
      flexShrink: 0
    }),
    badge: (tag) => {
      const colors = getTagColor(tag);
      return {
        padding: '0.25rem 0.625rem',
        borderRadius: '999px',
        fontSize: '0.7rem',
        fontWeight: '700',
        backgroundColor: colors.bg,
        color: colors.text
      };
    },
    weekBadge: {
      padding: '0.25rem 0.625rem',
      borderRadius: '999px',
      fontSize: '0.7rem',
      fontWeight: '700',
      backgroundColor: colors.hover,
      color: colors.accent
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Onboarding Agent</h1>
        <p style={styles.subtitle}>Generate personalized 30-60-90 day onboarding plans for new hires using AI.</p>
      </header>

      <div style={styles.mainLayout}>
        {/* LEFT COLUMN - Form */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <Sparkles size={18} color={colors.accent} />
            <span style={{ fontWeight: '700', color: colors.primary }}>New Hire Details</span>
          </div>
          <form style={styles.form} onSubmit={handleGenerate}>
            <div>
              <label style={styles.label}>Employee Name</label>
              <input 
                style={styles.input} 
                name="name"
                value={form.name}
                onChange={handleInputChange}
                placeholder="e.g. John Doe" 
              />
            </div>
            <div>
              <label style={styles.label}>Role / Job Title</label>
              <input 
                style={styles.input} 
                name="role"
                value={form.role}
                onChange={handleInputChange}
                placeholder="e.g. Senior Frontend Engineer" 
              />
            </div>
            <div>
              <label style={styles.label}>Start Date</label>
              <input 
                style={styles.input} 
                name="startDate"
                value={form.startDate}
                onChange={handleInputChange}
                type="date" 
              />
            </div>
            <div>
              <label style={styles.label}>Manager</label>
              <input 
                style={styles.input} 
                name="manager"
                value={form.manager}
                onChange={handleInputChange}
                placeholder="e.g. Sarah Jenkins" 
              />
            </div>
            <div>
              <label style={styles.label}>Department</label>
              <select 
                style={styles.input} 
                name="department"
                value={form.department}
                onChange={handleInputChange}
              >
                <option>Engineering</option>
                <option>Design</option>
                <option>HR</option>
                <option>Marketing</option>
                <option>Finance</option>
                <option>Operations</option>
              </select>
            </div>
            <div>
              <label style={styles.label}>Additional Notes</label>
              <textarea 
                style={{ ...styles.input, height: '80px', resize: 'none' }} 
                name="notes"
                value={form.notes}
                onChange={handleInputChange}
                placeholder="Focus on React and performance optimization..." 
              />
            </div>
            <button type="submit" style={styles.generateBtn}>
              <Sparkles size={16} />
              Generate 30-60-90 Plan
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN - Plan Output */}
        <div style={styles.card}>
          {!isGenerated ? (
            <div style={styles.emptyState}>
              <div style={styles.iconBox}>
                <Sparkles size={32} />
              </div>
              <h3 style={{ margin: '0 0 0.5rem 0', color: colors.primary, fontWeight: '700' }}>No plan generated yet</h3>
              <p style={{ margin: 0, color: colors.muted, fontSize: '0.875rem', maxWidth: '280px' }}>
                Fill out the form on the left to create a customized onboarding roadmap.
              </p>
            </div>
          ) : (
            <div style={{ animation: 'fadeIn 0.5s ease-in' }}>
              <div style={styles.planHeader}>
                <div>
                  <h2 style={{ margin: '0 0 0.25rem 0', color: colors.primary, fontSize: '1.25rem', fontWeight: '800' }}>
                    {form.name} • {form.role}
                  </h2>
                  <p style={{ margin: 0, color: colors.muted, fontSize: '0.875rem', fontWeight: '500' }}>
                    {form.department} Department • Starts {form.startDate || 'TBD'}
                  </p>
                </div>
                <button style={styles.exportBtn}>
                  <Download size={14} />
                  Export PDF
                </button>
              </div>

              <div style={styles.progressGrid}>
                {phases.map((phase, i) => (
                  <div key={i} style={styles.progressCard(phase)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.65rem', fontWeight: '800', color: phase.accent, textTransform: 'uppercase' }}>
                        {phase.label}
                      </span>
                      <span style={{ fontSize: '0.65rem', fontWeight: '800', color: phase.accent }}>
                        {taskStates[i].filter(Boolean).length}/4 Tasks
                      </span>
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: '700', color: colors.primary }}>{phase.title}</span>
                    <div style={styles.progressBarBg}>
                      <div style={styles.progressBarFill(getProgress(i), phase.accent)} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={styles.tabSwitcher}>
                {phases.map((phase, i) => (
                  <button 
                    key={i} 
                    style={styles.tab(activeTab === i)}
                    onClick={() => setActiveTab(i)}
                  >
                    {phase.label}
                  </button>
                ))}
              </div>

              <div style={styles.taskList}>
                {mockTasks[activeTab].map((task, i) => (
                  <div 
                    key={i} 
                    style={{
                      ...styles.taskItem,
                      borderColor: taskStates[activeTab][i] ? colors.primary : colors.border,
                      backgroundColor: taskStates[activeTab][i] ? '#F8FAFC' : '#fff'
                    }}
                    onClick={() => toggleTask(activeTab, i)}
                  >
                    <div style={styles.checkbox(taskStates[activeTab][i])}>
                      {taskStates[activeTab][i] && <Check size={14} strokeWidth={3} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                        <h4 style={{ 
                          margin: 0, 
                          fontSize: '0.9rem', 
                          fontWeight: '700', 
                          color: colors.primary,
                          textDecoration: taskStates[activeTab][i] ? 'line-through' : 'none',
                          opacity: taskStates[activeTab][i] ? 0.6 : 1
                        }}>
                          {task.title}
                        </h4>
                        <span style={styles.weekBadge}>{task.week}</span>
                      </div>
                      <p style={{ 
                        margin: '0 0 0.75rem 0', 
                        fontSize: '0.8rem', 
                        color: colors.muted,
                        lineHeight: '1.4'
                      }}>
                        {task.desc}
                      </p>
                      <span style={styles.badge(task.tag)}>{task.tag}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingAgent;
