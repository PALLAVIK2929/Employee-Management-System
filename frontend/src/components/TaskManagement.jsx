import React, { useState } from 'react';
import { 
  CheckCircle2, Clock, AlertCircle, Plus, 
  Calendar, User, Tag, MoreVertical,
  Search, Filter
} from 'lucide-react';

const TaskManagement = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Quarterly Performance Review",
      desc: "Conduct performance reviews for the engineering team and submit feedback by Friday.",
      status: "In Progress",
      deadline: "2026-04-05",
      priority: "High",
      assignedBy: "Admin",
      category: "Management"
    },
    {
      id: 2,
      title: "Update Employee Handbook",
      desc: "Revise the remote work policy and inclusion guidelines in the central handbook.",
      status: "Pending",
      deadline: "2026-04-10",
      priority: "Medium",
      assignedBy: "HR Manager",
      category: "Policy"
    },
    {
      id: 3,
      title: "Fix Payroll Bug #1024",
      desc: "Resolve the issue where bonus calculations were off by 2% for part-time staff.",
      status: "Completed",
      deadline: "2026-03-28",
      priority: "High",
      assignedBy: "Tech Lead",
      category: "Development"
    },
    {
      id: 4,
      title: "Organize Team Building",
      desc: "Plan a virtual team-building event for the upcoming weekend.",
      status: "Pending",
      deadline: "2026-04-15",
      priority: "Low",
      assignedBy: "Office Manager",
      category: "Culture"
    }
  ]);

  const [filter, setFilter] = useState('All');

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return { bg: '#DEF7EC', text: '#03543F', icon: CheckCircle2 };
      case 'In Progress': return { bg: '#E1EFFE', text: '#1E429F', icon: Clock };
      case 'Pending': return { bg: '#FDF2F2', text: '#9B1C1C', icon: AlertCircle };
      default: return { bg: '#F3F4F6', text: '#374151', icon: AlertCircle };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#EF4444';
      case 'Medium': return '#F59E0B';
      case 'Low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const markCompleted = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status: 'Completed' } : task
    ));
  };

  const filteredTasks = filter === 'All' 
    ? tasks 
    : tasks.filter(task => task.status === filter);

  const colors = {
    primary: '#1E1B4B',
    accent: '#3D3B8E',
    bg: '#F3F4F6',
    white: '#FFFFFF',
    textMuted: '#6B7280'
  };

  return (
    <div style={{ padding: '24px', fontFamily: "'Inter', sans-serif", backgroundColor: colors.bg, minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: colors.primary }}>Task Management</h1>
          <p style={{ color: colors.textMuted }}>Track and manage your assigned responsibilities</p>
        </div>
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: colors.accent,
          color: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
          fontWeight: '600'
        }}>
          <Plus size={18} />
          New Task
        </button>
      </div>

      {/* Toolbar */}
      <div style={{ 
        display: 'flex', 
        gap: '16px', 
        marginBottom: '24px',
        backgroundColor: colors.white,
        padding: '16px',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        alignItems: 'center'
      }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            style={{ 
              width: '100%', 
              padding: '10px 10px 10px 40px', 
              borderRadius: '8px', 
              border: '1px solid #E5E7EB',
              outline: 'none',
              fontSize: '14px'
            }} 
          />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['All', 'Pending', 'In Progress', 'Completed'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid #E5E7EB',
                backgroundColor: filter === f ? colors.accent : 'white',
                color: filter === f ? 'white' : '#4B5563',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredTasks.map(task => {
          const status = getStatusColor(task.status);
          const StatusIcon = status.icon;
          
          return (
            <div key={task.id} style={{ 
              backgroundColor: colors.white, 
              padding: '20px', 
              borderRadius: '12px', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              display: 'grid',
              gridTemplateColumns: 'auto 1fr auto',
              gap: '20px',
              alignItems: 'start',
              borderLeft: `4px solid ${getPriorityColor(task.priority)}`
            }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '10px', 
                backgroundColor: status.bg, 
                color: status.text,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <StatusIcon size={22} />
              </div>
              
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: colors.primary }}>{task.title}</h3>
                  <span style={{ 
                    fontSize: '11px', 
                    fontWeight: '700', 
                    padding: '2px 8px', 
                    borderRadius: '12px', 
                    backgroundColor: status.bg, 
                    color: status.text,
                    textTransform: 'uppercase'
                  }}>
                    {task.status}
                  </span>
                </div>
                <p style={{ fontSize: '14px', color: '#4B5563', marginBottom: '16px', lineHeight: '1.5' }}>{task.desc}</p>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                  <InfoItem icon={Calendar} text={`Due: ${task.deadline}`} />
                  <InfoItem icon={User} text={`By: ${task.assignedBy}`} />
                  <InfoItem icon={Tag} text={task.category} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
                <button style={{ color: '#9CA3AF', padding: '4px', borderRadius: '4px', border: 'none', background: 'none', cursor: 'pointer' }}>
                  <MoreVertical size={20} />
                </button>
                {task.status !== 'Completed' && (
                  <button 
                    onClick={() => markCompleted(task.id)}
                    style={{
                      backgroundColor: '#DEF7EC',
                      color: '#03543F',
                      border: '1px solid #84E1BC',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#BCF0DA'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#DEF7EC'}
                  >
                    Mark Complete
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const InfoItem = ({ icon: Icon, text }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#6B7280' }}>
    <Icon size={14} />
    <span>{text}</span>
  </div>
);

export default TaskManagement;
