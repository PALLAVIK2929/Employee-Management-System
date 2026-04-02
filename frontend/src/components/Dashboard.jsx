import React, { useEffect, useState } from 'react';
import { Users, UserPlus, Building2, Briefcase, Activity, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { api } from '../api';
import Avatar from './Avatar';

const StatCard = ({ title, value, icon: Icon, trend, colorClass = "bg-blue-50 text-blue-600" }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
            <div>
                <p className="text-sm font-medium text-muted mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-primary">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${colorClass}`}>
                <Icon size={20} />
            </div>
        </div>
        {trend && (
            <div className="flex items-center gap-1 text-xs font-semibold text-green-600">
                <TrendingUp size={14} />
                <span>{trend}</span>
            </div>
        )}
    </div>
);

const Dashboard = () => {
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [empData, deptData] = await Promise.all([
                api.getEmployees(),
                api.getDepartments()
            ]);
            setEmployees(empData || []);
            setDepartments(deptData || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const deptStats = departments.map(dept => ({
        name: dept.name,
        count: employees.filter(e => e.department_id === dept.id).length
    }));

    const COLORS = ['#1E1B4B', '#3D3B8E', '#4F46E5', '#6366F1', '#818CF8'];

    // Calculate unique roles
    const activeRoles = new Set(employees.map(e => e.role).filter(Boolean)).size;

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            <p className="text-muted font-medium">Loading dashboard statistics...</p>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Dashboard</h1>
                <p className="text-muted">Overview of company metrics and HR status.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Employees" value={employees.length} icon={Users} trend="+12% from last month" colorClass="bg-blue-50 text-blue-600" />
                <StatCard title="Departments" value={departments.length} icon={Building2} colorClass="bg-purple-50 text-purple-600" />
                <StatCard title="Active Roles" value={activeRoles} icon={Briefcase} colorClass="bg-green-50 text-green-600" />
                <StatCard title="New Joiners" value={Math.min(employees.length, 5)} icon={UserPlus} trend="This week" colorClass="bg-orange-50 text-orange-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-bold text-primary mb-6">Employees by Department</h2>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={deptStats}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6B6B80', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6B6B80', fontSize: 12 }}
                                />
                                <Tooltip
                                    cursor={{ fill: '#F8FAFC' }}
                                    contentStyle={{
                                        backgroundColor: '#1E1B4B',
                                        border: 'none',
                                        borderRadius: '12px',
                                        padding: '12px',
                                        color: '#fff',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                    }}
                                />
                                <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={40}>
                                    {deptStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-bold text-primary mb-6">Recent Activity</h2>
                    <div className="space-y-6">
                        {employees.slice(0, 5).map((emp, i) => (
                            <div key={emp.id} className="flex items-center gap-4">
                                <Avatar 
                                    initials={`${emp.first_name[0]}${emp.last_name[0]}`}
                                    size="md"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-primary truncate">{emp.first_name} {emp.last_name}</p>
                                    <p className="text-xs text-muted truncate">{emp.role || 'New Employee'}</p>
                                </div>
                                <div className="text-[10px] font-semibold text-muted bg-gray-50 px-2 py-1 rounded">
                                    2h ago
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-8 py-2 text-sm font-semibold text-accent hover:bg-accent-light rounded-lg transition-colors">
                        View All Activity
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
