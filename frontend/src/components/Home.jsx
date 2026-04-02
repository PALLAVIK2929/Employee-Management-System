import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users, Building2, BookOpen, ArrowRight, Sparkles, PlusCircle,
    LayoutDashboard, BrainCircuit, FileUp, Terminal, Calendar,
    Clock, CheckSquare, DollarSign, User, Heart
} from 'lucide-react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { useLeave } from '../context/LeaveContext';

const ModuleCard = ({ title, description, icon: Icon, path, colorClass, index }) => {
    const navigate = useNavigate();
    return (
        <div 
            className={`bg-[var(--bg-card)] p-6 rounded-xl border border-[var(--border-color)] shadow-sm transition-all cursor-pointer group flex items-start gap-4 quick-action-card animate-fade-in-up opacity-0`}
            style={{ animationDelay: `${0.1 * (index + 5)}s`, animationFillMode: 'forwards' }}
            onClick={() => navigate(path)}
        >
            <div className={`p-3 rounded-lg ${colorClass} card-icon transition-transform`}>
                <Icon size={24} />
            </div>
            <div className="flex-1">
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1 group-hover:text-[var(--accent-color)] transition-colors">{title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{description}</p>
                <div className="mt-4 flex items-center text-[var(--accent-color)] text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Get Started <ArrowRight size={16} className="ml-1" />
                </div>
            </div>
        </div>
    );
};

const QuickStat = ({ label, value, icon: Icon, colorClass, index }) => (
    <div className={`flex items-center gap-4 bg-[var(--stat-pill-bg)] backdrop-blur-sm p-4 rounded-xl border border-[var(--stat-pill-border)] animate-fade-in-up opacity-0`} style={{ animationDelay: `${0.1 * (index + 3)}s`, animationFillMode: 'forwards' }}>
        <div className={`p-2 rounded-lg ${colorClass}`}>
            <Icon size={20} />
        </div>
        <div>
            <div className="text-xs font-medium text-[var(--hero-text)] opacity-60 uppercase tracking-wider">{label}</div>
            <div className="text-xl font-bold text-[var(--hero-text)]">{value}</div>
        </div>
    </div>
);

const Home = () => {
    const { user, role } = useAuth();
    const { getEmployeeBalance } = useLeave();
    const [stats, setStats] = useState({ employees: 0, departments: 0 });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    const firstName = user?.name ? user.name.split(' ')[0] : 'User';
    const employeeId = user?.id || 2;
    const balance = getEmployeeBalance(employeeId);

    // Attendance State
    const [attendance, setAttendance] = useState({
        isCheckedIn: false,
        checkInTime: null,
        totalHours: "00:00"
    });

    useEffect(() => {
        if (user?.email) {
            const savedAttendance = localStorage.getItem(`attendance_${user.email}`);
            if (savedAttendance) {
                setAttendance(JSON.parse(savedAttendance));
            }
        }
    }, [user?.email]);

    const handleAttendance = () => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        let newStatus;
        if (!attendance.isCheckedIn) {
            newStatus = { isCheckedIn: true, checkInTime: timeStr, totalHours: attendance.totalHours };
        } else {
            newStatus = { isCheckedIn: false, checkInTime: attendance.checkInTime, totalHours: "08:15" }; // Mock final hours
        }
        
        setAttendance(newStatus);
        localStorage.setItem(`attendance_${user.email}`, JSON.stringify(newStatus));
    };

    useEffect(() => {
        const fetchStats = async () => {
            if (role !== 'admin') {
                setLoading(false);
                return;
            }
            try {
                const [emps, depts] = await Promise.all([
                    api.getEmployees(),
                    api.getDepartments()
                ]);
                setStats({
                    employees: emps?.length || 0,
                    departments: depts?.length || 0
                });
            } catch (error) {
                console.error("Error fetching home stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [role]);

    const adminModules = [
        { title: "Employee Directory", description: "View, add, and manage your entire workforce database.", icon: Users, path: "/employees", colorClass: "bg-blue-100 text-blue-600" },
        { title: "Organization Structure", description: "Manage departments, team hierarchies, and reporting lines.", icon: Building2, path: "/departments", colorClass: "bg-green-100 text-green-600" },
        { title: "Bulk Import", description: "Upload employee data in bulk using CSV or Excel files.", icon: FileUp, path: "/bulk-upload", colorClass: "bg-purple-100 text-purple-600" },
        { title: "Workforce Analytics", description: "Get deep insights into your workforce with visual reports.", icon: LayoutDashboard, path: "/analytics", colorClass: "bg-orange-100 text-orange-600" },
        { title: "Platform Tools", description: "Execute advanced system tools using MCP integration.", icon: Terminal, path: "/tools", colorClass: "bg-red-100 text-red-600" },
        { title: "AI Handbook Assistant", description: "Ask questions about company policies using generative AI.", icon: BookOpen, path: "/handbook", colorClass: "bg-indigo-100 text-indigo-600" },
    ];

    const commonModules = [
        { title: "Task Management", description: "Track and manage your assigned tasks and deadlines.", icon: CheckSquare, path: "/tasks", colorClass: "bg-teal-100 text-teal-600" },
        { title: "Payroll & Salary", description: "View salary breakdown and download your monthly payslips.", icon: DollarSign, path: "/payroll", colorClass: "bg-emerald-100 text-emerald-600" },
        { title: "AI Handbook Assistant", description: "Ask questions about company policies using generative AI.", icon: BookOpen, path: "/handbook", colorClass: "bg-indigo-100 text-indigo-600" },
        { title: "My Profile", description: "View and update your personal information.", icon: User, path: "/profile", colorClass: "bg-pink-100 text-pink-600" },
    ];

    const modules = role === 'admin' 
        ? adminModules
        : commonModules;

    return (
        <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-[var(--bg-hero)] rounded-3xl p-8 md:p-12 mb-12 text-[var(--hero-text)] shadow-xl">
                <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-white/5 rounded-full animate-float blur-3xl" />
                <div className="absolute bottom-[-20%] left-[10%] w-96 h-96 bg-[var(--accent-color)] opacity-20 rounded-full animate-float blur-3xl" style={{ animationDelay: '1s' }} />
                
                <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold mb-6 border border-white/10 animate-fade-in-up opacity-0" style={{ animationFillMode: 'forwards' }}>
                        <Sparkles size={14} className="text-yellow-400" />
                        <span>Workforce Management Redefined</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight animate-fade-in-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
                        Welcome back, {firstName} 👋
                    </h1>
                    <p className="text-lg opacity-80 mb-8 leading-relaxed animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                        {role === 'admin' 
                            ? 'Manage your workforce, organize departments, and streamline your onboarding process all in one intelligent platform.' 
                            : 'Access your profile, track your tasks, and stay updated with company policies effortlessly.'}
                    </p>
                    
                    <div className="flex flex-wrap gap-4">
                        {role === 'admin' ? (
                            <>
                                <QuickStat label="Total Workforce" value={stats.employees} icon={Users} colorClass="bg-blue-500/20 text-blue-100" index={0} />
                                <QuickStat label="Active Departments" value={stats.departments} icon={Building2} colorClass="bg-green-500/20 text-green-100" index={1} />
                            </>
                        ) : (
                            <>
                                <QuickStat label="Leave Balance" value={`${balance.annual} Days`} icon={Calendar} colorClass="bg-cyan-500/20 text-cyan-100" index={0} />
                                <QuickStat label="My Department" value="Engineering" icon={Building2} colorClass="bg-green-500/20 text-green-100" index={1} />
                                <QuickStat label="My Manager" value="Sarah Wilson" icon={Heart} colorClass="bg-pink-500/20 text-pink-100" index={2} />
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Quick Actions Grid */}
            <section className="mb-12 px-4">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-800 text-[var(--text-primary)]">Quick Actions</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {modules.map((m, i) => (
                        <ModuleCard key={i} {...m} index={i} />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
