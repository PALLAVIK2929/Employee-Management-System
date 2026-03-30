import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { 
  Users, Calendar, CheckCircle, TrendingUp, 
  Clock, Award, Briefcase, Building
} from 'lucide-react';

const AnalyticsDashboard = () => {
  const attendanceData = [
    { name: 'Mon', present: 95, absent: 5 },
    { name: 'Tue', present: 98, absent: 2 },
    { name: 'Wed', present: 92, absent: 8 },
    { name: 'Thu', present: 96, absent: 4 },
    { name: 'Fri', present: 90, absent: 10 },
  ];

  const leaveUsageData = [
    { name: 'Sick Leave', value: 25 },
    { name: 'Casual Leave', value: 45 },
    { name: 'Earned Leave', value: 30 },
  ];

  const taskCompletionData = [
    { name: 'Week 1', completed: 12, total: 15 },
    { name: 'Week 2', completed: 18, total: 20 },
    { name: 'Week 3', completed: 15, total: 18 },
    { name: 'Week 4', completed: 22, total: 25 },
  ];

  const COLORS = ['#3D3B8E', '#10B981', '#F59E0B', '#EF4444'];

  const colors = {
    primary: '#1E1B4B',
    accent: '#3D3B8E',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    bg: '#F3F4F6',
    white: '#FFFFFF',
    textMuted: '#6B7280'
  };

  return (
    <div style={{ padding: '24px', fontFamily: "'Inter', sans-serif", backgroundColor: colors.bg, minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: colors.primary }}>Analytics Dashboard</h1>
        <p style={{ color: colors.textMuted }}>Key performance indicators and workforce insights</p>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <StatCard icon={Users} label="Total Headcount" value="124" trend="+4%" color={colors.accent} />
        <StatCard icon={Calendar} label="Avg. Attendance" value="94.2%" trend="+1.2%" color={colors.success} />
        <StatCard icon={CheckCircle} label="Task Completion" value="88%" trend="+5.4%" color={colors.warning} />
        <StatCard icon={TrendingUp} label="Retention Rate" value="92%" trend="+2%" color={colors.error} />
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Attendance Overview */}
        <div style={{ backgroundColor: colors.white, padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: colors.primary }}>Attendance Overview (Last 5 Days)</h2>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  cursor={{ fill: '#F9FAFB' }}
                />
                <Legend iconType="circle" />
                <Bar dataKey="present" fill={colors.accent} radius={[4, 4, 0, 0]} name="Present" />
                <Bar dataKey="absent" fill="#E5E7EB" radius={[4, 4, 0, 0]} name="Absent" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leave Usage */}
        <div style={{ backgroundColor: colors.white, padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: colors.primary }}>Leave Distribution</h2>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leaveUsageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {leaveUsageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Task Completion Rate */}
        <div style={{ backgroundColor: colors.white, padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: colors.primary }}>Task Completion Trend</h2>
          <div style={{ height: '250px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={taskCompletionData}>
                <defs>
                  <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.accent} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={colors.accent} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
                <Area type="monotone" dataKey="completed" stroke={colors.accent} fillOpacity={1} fill="url(#colorComp)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Productivity Score */}
        <div style={{ backgroundColor: colors.white, padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: colors.primary }}>Productivity Metrics</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <MetricRow icon={Clock} label="Avg. Work Hours" value="8.4 hrs/day" progress={84} color={colors.accent} />
            <MetricRow icon={Award} label="Kudos Received" value="24 this month" progress={60} color={colors.success} />
            <MetricRow icon={Briefcase} label="Projects Delivered" value="12 YTD" progress={75} color={colors.warning} />
            <MetricRow icon={Building} label="Dept. Efficiency" value="92%" progress={92} color={colors.error} />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, trend, color }) => (
  <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
      <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: `${color}10`, color: color }}>
        <Icon size={20} />
      </div>
      <span style={{ fontSize: '12px', fontWeight: '600', color: trend.startsWith('+') ? '#10B981' : '#EF4444' }}>
        {trend}
      </span>
    </div>
    <div style={{ color: '#6B7280', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>{label}</div>
    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{value}</div>
  </div>
);

const MetricRow = ({ icon: Icon, label, value, progress, color }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#374151' }}>
        <Icon size={16} style={{ color: '#9CA3AF' }} />
        <span>{label}</span>
      </div>
      <span style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{value}</span>
    </div>
    <div style={{ height: '6px', backgroundColor: '#F3F4F6', borderRadius: '3px', overflow: 'hidden' }}>
      <div style={{ 
        height: '100%', 
        width: `${progress}%`, 
        backgroundColor: color,
        borderRadius: '3px'
      }} />
    </div>
  </div>
);

export default AnalyticsDashboard;
