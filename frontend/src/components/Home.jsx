import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    Building2,
    BookOpen,
    Rocket,
    ArrowRight,
    Sparkles,
    PlusCircle,
    LayoutDashboard,
    BrainCircuit,
    FileUp,
    Terminal,
    Calendar,
    MessageSquare,
    Heart,
    MoreHorizontal,
    FileText,
    Download,
    CheckSquare,
    Clock,
    TrendingUp,
    Check,
    DollarSign,
    CreditCard
} from 'lucide-react';
import { api } from '../api';

const ModuleCard = ({ title, description, icon: Icon, path, colorClass }) => {
    const navigate = useNavigate();
    return (
        <div 
            className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group flex items-start gap-4"
            onClick={() => navigate(path)}
        >
            <div className={`p-3 rounded-lg ${colorClass} group-hover:scale-110 transition-transform`}>
                <Icon size={24} />
            </div>
            <div className="flex-1">
                <h3 className="text-lg font-bold text-primary mb-1 group-hover:text-accent transition-colors">{title}</h3>
                <p className="text-sm text-muted leading-relaxed">{description}</p>
                <div className="mt-4 flex items-center text-accent text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Get Started <ArrowRight size={16} className="ml-1" />
                </div>
            </div>
        </div>
    );
};

const QuickStat = ({ label, value, icon: Icon, colorClass }) => (
    <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-white/20">
        <div className={`p-2 rounded-lg ${colorClass}`}>
            <Icon size={20} />
        </div>
        <div>
            <div className="text-xs font-medium text-primary/60 uppercase tracking-wider">{label}</div>
            <div className="text-xl font-bold text-primary">{value}</div>
        </div>
    </div>
);

const Home = () => {
    const [stats, setStats] = useState({ employees: 0, departments: 0 });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user.role || 'admin';
    const firstName = user.name ? user.name.split(' ')[0] : 'Admin';
    const pageTitle = "Dashboard";

    // Attendance State
    const [attendance, setAttendance] = useState({
        isCheckedIn: false,
        checkInTime: null,
        totalHours: "00:00"
    });

    useEffect(() => {
        const savedAttendance = localStorage.getItem(`attendance_${user.email}`);
        if (savedAttendance) {
            setAttendance(JSON.parse(savedAttendance));
        }
    }, [user.email]);

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
    ];

    const commonModules = [
        { title: "Task Management", description: "Track and manage your assigned tasks and deadlines.", icon: CheckSquare, path: "/tasks", colorClass: "bg-teal-100 text-teal-600", employeeOnly: true },
        { title: "Payroll & Salary", description: "View salary breakdown and download your monthly payslips.", icon: DollarSign, path: "/payroll", colorClass: "bg-emerald-100 text-emerald-600", employeeOnly: true },
        { title: "AI Handbook Assistant", description: "Ask questions about company policies using generative AI.", icon: BookOpen, path: "/handbook", colorClass: "bg-indigo-100 text-indigo-600" },
        { title: "Onboarding Agent", description: "Generate personalized 30-60-90 day plans for new hires.", icon: BrainCircuit, path: "/onboarding", colorClass: "bg-pink-100 text-pink-600" },
    ];

    const modules = role === 'admin' 
        ? [...adminModules, ...commonModules.filter(m => !m.employeeOnly)]
        : commonModules;

    return (
        <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-primary rounded-3xl p-8 md:p-12 mb-12 text-white">
                <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold mb-6 border border-white/10">
                        <Sparkles size={14} className="text-yellow-400" />
                        <span>Workforce Management Redefined</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                        Employee Management System
                    </h1>
                    <p className="text-lg text-white/80 mb-8 leading-relaxed">
                        Welcome back, {firstName}. {role === 'admin' ? 'Manage your workforce, organize departments, and streamline your onboarding process all in one intelligent platform.' : 'View your profile, request leaves, and access company resources all in one place.'}
                    </p>
                    
                    {role === 'admin' ? (
                        <div className="flex flex-wrap gap-4">
                            <QuickStat 
                                label="Total Workforce" 
                                value={stats.employees} 
                                icon={Users} 
                                colorClass="bg-blue-500/20 text-blue-100"
                            />
                            <QuickStat 
                                label="Active Departments" 
                                value={stats.departments} 
                                icon={Building2} 
                                colorClass="bg-green-500/20 text-green-100"
                            />
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                                <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-100">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <div className="text-xs font-medium text-white/60 uppercase tracking-wider">Leave Balance</div>
                                    <div className="text-xl font-bold">12 Days</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                                <div className="p-2 rounded-lg bg-pink-500/20 text-pink-100">
                                    <BrainCircuit size={20} />
                                </div>
                                <div className="flex-1 min-w-[140px]">
                                    <div className="text-xs font-medium text-white/60 uppercase tracking-wider">Onboarding</div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-xl font-bold">65%</div>
                                        <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                                            <div className="h-full bg-pink-400 rounded-full" style={{ width: '65%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                                <div className={`p-2 rounded-lg ${attendance.isCheckedIn ? 'bg-red-500/20 text-red-100' : 'bg-green-500/20 text-green-100'}`}>
                                    <Clock size={20} />
                                </div>
                                <div style={{ minWidth: '160px' }}>
                                    <div className="text-xs font-medium text-white/60 uppercase tracking-wider">Attendance</div>
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <div className="text-xl font-bold">{attendance.isCheckedIn ? 'Checked In' : 'Checked Out'}</div>
                                            <div className="text-[10px] opacity-60">{attendance.isCheckedIn ? `Since ${attendance.checkInTime}` : `Last: ${attendance.totalHours}`}</div>
                                        </div>
                                        <button 
                                            onClick={handleAttendance}
                                            style={{
                                                padding: '6px 12px',
                                                borderRadius: '8px',
                                                border: 'none',
                                                backgroundColor: attendance.isCheckedIn ? '#EF4444' : '#10B981',
                                                color: '#fff',
                                                fontSize: '11px',
                                                fontWeight: '800',
                                                cursor: 'pointer',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                            }}
                                        >
                                            {attendance.isCheckedIn ? 'Out' : 'In'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none overflow-hidden">
                    <LayoutDashboard size={400} className="translate-x-1/4 -translate-y-1/4" />
                </div>
            </section>

            {/* Quick Actions Grid */}
            <section className="mb-12">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-primary">Quick Actions</h2>
                    <div className="h-px flex-1 bg-gray-100 mx-8"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {modules.map((module, idx) => (
                        <ModuleCard key={idx} {...module} />
                    ))}
                </div>

                {role === 'admin' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
                        {/* Admin Dashboard: Recent Activity */}
                        <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '24px', border: '1px solid #E5E7EB' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1E1B4B' }}>Recent System Activity</h2>
                                <button style={{ background: 'none', border: 'none', color: '#3D3B8E', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>View Logs</button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {[
                                    { user: "Sarah Wilson", action: "Completed Onboarding", time: "2m ago", icon: Rocket, color: "#4F46E5" },
                                    { user: "John Doe", action: "Applied for Leave", time: "1h ago", icon: Calendar, color: "#10B981" },
                                    { user: "System", action: "Payroll Generated for March", time: "3h ago", icon: CreditCard, color: "#F59E0B" },
                                    { user: "Admin", action: "Added New Department: AI Labs", time: "5h ago", icon: Building2, color: "#3D3B8E" }
                                ].map((activity, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: `${activity.color}10`, color: activity.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <activity.icon size={20} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '14px', fontWeight: '700', color: '#1E1B4B' }}>{activity.user}</div>
                                            <div style={{ fontSize: '12px', color: '#6B7280' }}>{activity.action}</div>
                                        </div>
                                        <div style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: '600' }}>{activity.time}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Admin Dashboard: Quick Insights */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '24px', border: '1px solid #E5E7EB' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#1E1B4B', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <TrendingUp size={18} color="#3D3B8E" /> Workforce Growth
                                </h3>
                                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '60px', marginBottom: '16px' }}>
                                    {[30, 45, 35, 60, 55, 75, 90].map((h, i) => (
                                        <div key={i} style={{ flex: 1, height: `${h}%`, backgroundColor: i === 6 ? '#3D3B8E' : '#EEF2FF', borderRadius: '4px' }}></div>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ fontSize: '24px', fontWeight: '800', color: '#1E1B4B' }}>+12.5%</div>
                                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#10B981' }}>↑ Monthly</div>
                                </div>
                            </div>

                            <div style={{ backgroundColor: '#1E1B4B', padding: '24px', borderRadius: '24px', color: '#fff' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <CheckSquare size={18} color="#fff" /> Pending Approvals
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                                        <span style={{ fontSize: '13px', fontWeight: '600' }}>Leave Requests</span>
                                        <span style={{ fontSize: '13px', fontWeight: '800', backgroundColor: '#EF4444', padding: '2px 8px', borderRadius: '4px' }}>5</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                                        <span style={{ fontSize: '13px', fontWeight: '600' }}>Onboarding Tasks</span>
                                        <span style={{ fontSize: '13px', fontWeight: '800', backgroundColor: '#F59E0B', padding: '2px 8px', borderRadius: '4px' }}>12</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {role === 'employee' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
                        {/* News Feed */}
                        <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '24px', border: '1px solid #E5E7EB' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1E1B4B' }}>Company News Feed</h2>
                                <button style={{ background: 'none', border: 'none', color: '#3D3B8E', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>View all</button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                {[
                                    { title: "Annual Tech Summit 2024", tag: "Events", time: "2h ago", desc: "Join us for our biggest annual tech conference next month. Register now to secure your spot!", img: "🚀" },
                                    { title: "New Health & Wellness Perk", tag: "Benefits", time: "1d ago", desc: "We've added a new gym membership reimbursement program for all full-time employees.", img: "🧘" },
                                    { title: "Q1 Product Roadmap Update", tag: "Product", time: "3d ago", desc: "Check out the latest updates on what we're building this quarter.", img: "🛠️" }
                                ].map((news, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '20px', paddingBottom: '24px', borderBottom: i < 2 ? '1px solid #F3F4F6' : 'none' }}>
                                        <div style={{ width: '60px', height: '60px', borderRadius: '16px', backgroundColor: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>
                                            {news.img}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '4px' }}>
                                                <span style={{ fontSize: '11px', fontWeight: '800', color: '#3D3B8E', backgroundColor: '#EEF2FF', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>{news.tag}</span>
                                                <span style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: '600' }}>{news.time}</span>
                                            </div>
                                            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#1E1B4B', marginBottom: '8px' }}>{news.title}</h3>
                                            <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.5', margin: 0 }}>{news.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Kudos Wall */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            <div style={{ backgroundColor: '#1E1B4B', padding: '32px', borderRadius: '24px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.1 }}><Heart size={120} /></div>
                                <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px', position: 'relative' }}>Kudos Wall</h2>
                                <p style={{ fontSize: '13px', opacity: 0.7, marginBottom: '24px', position: 'relative' }}>Celebrate your teammates' wins!</p>
                                
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
                                    {[
                                        { from: "Sarah W.", to: "You", msg: "Amazing job on the AI integration! 🚀", color: "#4F46E5" },
                                        { from: "Mike R.", to: "Jane D.", msg: "Thanks for helping with the Q1 reports!", color: "#10B981" }
                                    ].map((kudo, i) => (
                                        <div key={i} style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: kudo.color, fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>{kudo.from[0]}</div>
                                                <span style={{ fontSize: '12px', fontWeight: '700' }}>{kudo.from} → {kudo.to}</span>
                                            </div>
                                            <p style={{ fontSize: '13px', margin: 0, opacity: 0.9 }}>"{kudo.msg}"</p>
                                        </div>
                                    ))}
                                <button style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.3)', backgroundColor: 'transparent', color: '#fff', fontSize: '13px', fontWeight: '700', cursor: 'pointer', marginTop: '8px' }}>
                                    + Give Kudos
                                </button>
                            </div>
                        </div>

                        {/* Recent Documents */}
                        <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '24px', border: '1px solid #E5E7EB' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>Recent Documents</h3>
                                <button onClick={() => navigate('/profile')} style={{ background: 'none', border: 'none', color: '#3D3B8E', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}>View All</button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {[
                                    { name: "Salary Slip - March", date: "2d ago", file: "/payslip.txt" },
                                    { name: "Employment Contract", date: "1m ago", file: "/contract.txt" }
                                ].map((doc, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#F9FAFB', borderRadius: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <FileText size={16} color="#6B7280" />
                                            <div>
                                                <div style={{ fontSize: '13px', fontWeight: '700', color: '#1E1B4B' }}>{doc.name}</div>
                                                <div style={{ fontSize: '11px', color: '#9CA3AF' }}>{doc.date}</div>
                                            </div>
                                        </div>
                                        <a href={doc.file} download style={{ color: '#3D3B8E' }}><Download size={16} /></a>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* My Daily Tasks */}
                        <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '24px', border: '1px solid #E5E7EB' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#1E1B4B', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <CheckSquare size={18} color="#3D3B8E" /> Daily Tasks
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {[
                                    { task: "Update Q1 Progress", done: true },
                                    { task: "Submit Leave Request", done: false },
                                    { task: "Complete Security Training", done: false }
                                ].map((t, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#F9FAFB', borderRadius: '12px' }}>
                                        <div style={{ width: '20px', height: '20px', borderRadius: '6px', border: `2px solid ${t.done ? '#10B981' : '#E5E7EB'}`, backgroundColor: t.done ? '#10B981' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {t.done && <Check size={12} color="#fff" />}
                                        </div>
                                        <span style={{ fontSize: '13px', fontWeight: '600', color: t.done ? '#9CA3AF' : '#1E1B4B', textDecoration: t.done ? 'line-through' : 'none' }}>{t.task}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Performance Snapshot */}
                        <div style={{ backgroundColor: '#EEF2FF', padding: '24px', borderRadius: '24px', border: '1px solid #E0E7FF' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#1E1B4B', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <TrendingUp size={18} color="#3D3B8E" /> Performance
                            </h3>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '32px', fontWeight: '800', color: '#3D3B8E', marginBottom: '4px' }}>4.8<span style={{ fontSize: '16px', opacity: 0.6 }}>/5.0</span></div>
                                <div style={{ fontSize: '12px', fontWeight: '700', color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Top Performer</div>
                                <div style={{ marginTop: '16px', height: '4px', backgroundColor: 'rgba(61, 59, 142, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                                    <div style={{ width: '92%', height: '100%', backgroundColor: '#3D3B8E' }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Upcoming Holidays */}
                            <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '24px', border: '1px solid #E5E7EB' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#1E1B4B', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Calendar size={18} color="#3D3B8E" /> Upcoming Holidays
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {[
                                        { name: "Memorial Day", date: "May 27, 2024" },
                                        { name: "Juneteenth", date: "June 19, 2024" }
                                    ].map((h, i) => (
                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#F9FAFB', borderRadius: '12px' }}>
                                            <span style={{ fontSize: '13px', fontWeight: '700', color: '#1E1B4B' }}>{h.name}</span>
                                            <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: '600' }}>{h.date}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* Footer info */}
            <footer className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-white text-[10px] font-bold">E</div>
                    <span className="font-semibold text-primary">EMS Platform</span>
                    <span>• Empowering workforce management.</span>
                </div>
                <div className="flex gap-6">
                    <a href="#" className="hover:text-accent transition-colors">Analytics</a>
                    <a href="#" className="hover:text-accent transition-colors">Support</a>
                    <a href="#" className="hover:text-accent transition-colors">Documentation</a>
                </div>
                <div>© 2026 EMS Platform. All rights reserved.</div>
            </footer>
        </div>
    );
};

export default Home;
