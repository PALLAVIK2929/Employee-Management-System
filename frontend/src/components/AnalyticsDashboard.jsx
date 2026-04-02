import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { 
  Users, Calendar, CheckCircle, TrendingUp, 
  PlusCircle, UserCheck, Clock, Award
} from 'lucide-react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

const AnimatedCounter = ({ target, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const startTimeRef = useRef(null);

  useEffect(() => {
    const targetNum = parseFloat(target.toString().replace(/[^0-9.]/g, ''));
    
    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = timestamp - startTimeRef.current;
      const percentage = Math.min(progress / duration, 1);
      
      const easeOutCubic = 1 - Math.pow(1 - percentage, 3);
      setCount(easeOutCubic * targetNum);

      if (percentage < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
    return () => startTimeRef.current = null;
  }, [target, duration]);

  const formattedCount = target.toString().includes('%') 
    ? count.toFixed(1) + "%" 
    : Math.floor(count).toLocaleString() + suffix;

  return <span>{formattedCount}</span>;
};

const AnalyticsDashboard = () => {
  const { role } = useAuth();
  const isAdmin = role === 'admin';
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeDepartments: 0,
    onLeaveToday: 0,
    newThisMonth: 0
  });
  const [loading, setLoading] = useState(true);

  const headcountData = [
    { month: 'Jan', count: 105 },
    { month: 'Feb', count: 108 },
    { month: 'Mar', count: 112 },
    { month: 'Apr', count: 115 },
    { month: 'May', count: 118 },
    { month: 'Jun', count: 124 },
    { month: 'Jul', count: 128 },
    { month: 'Aug', count: 132 },
    { month: 'Sep', count: 135 },
    { month: 'Oct', count: 138 },
    { month: 'Nov', count: 142 },
    { month: 'Dec', count: 145 },
  ];

  const [deptData, setDeptData] = useState([]);
  
  const leaveData = [
    { name: 'Approved', value: 45, color: '#1D9E75' },
    { name: 'Pending', value: 25, color: '#534AB7' },
    { name: 'Rejected', value: 15, color: '#D85A30' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employees, departments] = await Promise.all([
          api.getEmployees(),
          api.getDepartments()
        ]);

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        setStats({
          totalEmployees: employees.length,
          activeDepartments: departments.length,
          onLeaveToday: employees.filter(e => e.status === 'On Leave').length,
          newThisMonth: employees.filter(e => {
            const hireDate = new Date(e.hire_date);
            return hireDate.getMonth() === currentMonth && hireDate.getFullYear() === currentYear;
          }).length
        });

        const distribution = departments.map(dept => ({
          name: dept.name,
          count: employees.filter(e => e.department_id === dept.id).length
        }));
        setDeptData(distribution);

      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const CHART_COLORS = ['#534AB7', '#1D9E75', '#D85A30', '#6366F1', '#F59E0B'];

  return (
    <div style={{ padding: '24px', backgroundColor: 'var(--bg-primary)', minHeight: 'calc(100vh - 64px)', transition: 'all 0.3s' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>Analytics Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Comprehensive workforce insights and performance metrics.</p>
      </div>

      {/* Top Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <StatCard icon={Users} label="Total Employees" value={stats.totalEmployees} color="#534AB7" />
        <StatCard icon={Building} label="Active Departments" value={stats.activeDepartments} color="#1D9E75" />
        <StatCard icon={Calendar} label="On Leave Today" value={stats.onLeaveToday} color="#D85A30" />
        <StatCard icon={PlusCircle} label="New This Month" value={stats.newThisMonth} color="#6366F1" />
      </div>

      {/* Main Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Headcount Growth - Line Chart */}
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: 'var(--card-shadow)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px', color: 'var(--text-primary)' }}>Headcount Growth (12 Months)</h2>
          <div style={{ height: '350px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={headcountData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#534AB7" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#534AB7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                />
                <Area type="monotone" dataKey="count" stroke="#534AB7" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" isAnimationActive={true} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leave Status - Donut Chart */}
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: 'var(--card-shadow)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px', color: 'var(--text-primary)' }}>Leave Status Breakdown</h2>
          <div style={{ height: '350px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leaveData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                  isAnimationActive={true}
                >
                  {leaveData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        {/* Department Distribution - Bar Chart */}
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: 'var(--card-shadow)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px', color: 'var(--text-primary)' }}>Department-wise Distribution</h2>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <Tooltip cursor={{ fill: 'var(--bg-primary)', opacity: 0.4 }} contentStyle={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} isAnimationActive={true}>
                  {deptData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div style={{ 
    backgroundColor: 'var(--bg-card)', 
    padding: '24px', 
    borderRadius: '16px', 
    border: '1px solid var(--border-color)', 
    boxShadow: 'var(--card-shadow)',
    transition: 'transform 0.3s ease',
  }} className="quick-action-card">
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ 
        padding: '12px', 
        borderRadius: '12px', 
        backgroundColor: `${color}15`, 
        color: color 
      }} className="card-icon">
        <Icon size={24} />
      </div>
      <div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>{label}</div>
        <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)' }}>
          <AnimatedCounter target={value} />
        </div>
      </div>
    </div>
  </div>
);

const Building = ({ size, color }) => <Building2 size={size} color={color} />;
import { Building2 } from 'lucide-react';

export default AnalyticsDashboard;
