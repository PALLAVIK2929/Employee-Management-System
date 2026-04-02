import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Sparkles, Calendar, BarChart3, 
  ChevronRight, ShieldCheck, Zap, Globe, ArrowRight, PlayCircle, Star, Github,
  Twitter, Linkedin, Instagram, X, BookOpen, Terminal
} from 'lucide-react';

const VideoModal = ({ isOpen, onClose }) => {
  const videoRef = React.useRef(null);
  if (!isOpen) return null;

  const demoFeatures = [
    { title: "Landing Page", time: "0:00", icon: Globe, desc: "A high-fidelity entry point for your platform.", color: "#4F46E5" },
    { title: "Employee Directory", time: "0:30", icon: Users, desc: "Centralized hub for all workforce data.", color: "#0891B2" },
    { title: "AI Onboarding", time: "0:55", icon: Sparkles, desc: "Automated 30-60-90 day roadmaps.", color: "#10B981" },
    { title: "Handbook Chat", time: "1:20", icon: BookOpen, desc: "RAG-powered assistant for policy questions.", color: "#3D3B8E" },
    { title: "Platform Tools", time: "1:40", icon: Terminal, desc: "Advanced system integration via MCP.", color: "#EF4444" }
  ];

  const seekTo = (timeStr) => {
    const [mins, secs] = timeStr.split(':').map(Number);
    const totalSecs = mins * 60 + secs;
    if (videoRef.current) {
      videoRef.current.currentTime = totalSecs;
      videoRef.current.play();
    }
  };

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(30, 27, 75, 0.98)',
        backdropFilter: 'blur(12px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div 
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '1200px',
          maxHeight: '90vh',
          backgroundColor: '#fff',
          borderRadius: '40px',
          boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Modal Header */}
        <div style={{ padding: '32px 40px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ width: '32px', height: '32px', backgroundColor: '#1E1B4B', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800' }}>E</div>
              <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>Project Walkthrough (1:52)</h2>
            </div>
            <p style={{ fontSize: '15px', color: '#6B7280', margin: 0 }}>Explore the intelligent Employee Management System.</p>
          </div>
          <button 
            onClick={onClose}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#F3F4F6',
              color: '#1E1B4B',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = '#E5E7EB'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = '#F3F4F6'}
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '60px' }}>
            {/* Left: Video Player */}
            <div style={{ position: 'relative' }}>
              <div style={{ 
                width: '100%', 
                aspectRatio: '16/10', 
                backgroundColor: '#1E1B4B', 
                borderRadius: '24px', 
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(30, 27, 75, 0.2)',
                border: '8px solid #F3F4F6'
              }}>
                <video 
                  ref={videoRef}
                  width="100%" 
                  height="100%" 
                  controls 
                  autoPlay 
                  muted
                  style={{ width: '100%', height: '100%', backgroundColor: '#000' }}
                >
                  <source src="/demo.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              
              <div style={{ marginTop: '32px' }}>
                <h4 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px', color: '#1E1B4B' }}>Why choose EMS Platform?</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3D3B8E', flexShrink: 0 }}>✓</div>
                    <span style={{ fontSize: '14px', color: '#4B5563', fontWeight: '500' }}>AI-driven decision making</span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3D3B8E', flexShrink: 0 }}>✓</div>
                    <span style={{ fontSize: '14px', color: '#4B5563', fontWeight: '500' }}>Secure & Enterprise Ready</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Feature Chapters */}
            <div>
              <h4 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px', color: '#1E1B4B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Chapters</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {demoFeatures.map((f, i) => (
                  <div 
                    key={i} 
                    onClick={() => seekTo(f.time)}
                    style={{ 
                      display: 'flex', 
                      gap: '20px', 
                      padding: '16px', 
                      borderRadius: '16px', 
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      backgroundColor: '#F9FAFB',
                      border: '1px solid transparent'
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.backgroundColor = '#fff';
                      e.currentTarget.style.borderColor = '#E5E7EB';
                      e.currentTarget.style.transform = 'translateX(8px)';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.backgroundColor = '#F9FAFB';
                      e.currentTarget.style.borderColor = 'transparent';
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: `${f.color}10`, color: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <f.icon size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <div style={{ fontSize: '15px', fontWeight: '800', color: '#1E1B4B' }}>{f.title}</div>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: f.color, backgroundColor: `${f.color}10`, padding: '2px 8px', borderRadius: '6px' }}>{f.time}</div>
                      </div>
                      <div style={{ fontSize: '12px', color: '#6B7280', lineHeight: '1.4' }}>{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{ padding: '32px 40px', borderTop: '1px solid #F3F4F6', backgroundColor: '#F9FAFB', display: 'flex', justifyContent: 'center' }}>
          <button 
            onClick={() => { navigate('/login'); onClose(); }}
            style={{ padding: '16px 40px', borderRadius: '16px', border: 'none', backgroundColor: '#1E1B4B', color: '#fff', fontSize: '16px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 10px 20px rgba(30, 27, 75, 0.2)' }}
          >
            Start Free Trial
          </button>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc, color }) => (
  <div className="landing-feature-card" style={{
    padding: '40px',
    borderRadius: '24px',
    backgroundColor: '#fff',
    border: '1px solid #E5E7EB',
    transition: 'all 0.3s ease',
    cursor: 'default'
  }}>
    <div style={{
      width: '56px',
      height: '56px',
      borderRadius: '16px',
      backgroundColor: `${color}10`,
      color: color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '24px'
    }}>
      <Icon size={28} />
    </div>
    <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#1E1B4B', marginBottom: '12px' }}>{title}</h3>
    <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: '1.6', margin: 0 }}>{desc}</p>
  </div>
);

const LandingPage = () => {
  const navigate = useNavigate();
  const [isVideoOpen, setIsVideoOpen] = React.useState(false);

  useEffect(() => {
    // Add font and global styles for landing page
    const style = document.createElement('style');
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
      
      .landing-page {
        font-family: 'Sora', sans-serif;
        color: #1E1B4B;
        overflow-x: hidden;
      }

      .landing-feature-card:hover {
        transform: translateY(-10px);
        box-shadow: 0 20px 40px -10px rgba(30, 27, 75, 0.1);
        border-color: #3D3B8E !important;
      }

      @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
        100% { transform: translateY(0px); }
      }

      @keyframes float-slow {
        0% { transform: translate(0, 0); }
        33% { transform: translate(10px, -15px); }
        66% { transform: translate(-10px, 10px); }
        100% { transform: translate(0, 0); }
      }

      .float-anim {
        animation: float 6s ease-in-out infinite;
      }

      .float-slow-anim {
        animation: float-slow 8s ease-in-out infinite;
      }

      .hero-grid-bg {
        background-image: radial-gradient(#1E1B4B 0.5px, transparent 0.5px);
        background-size: 24px 24px;
        opacity: 0.05;
      }

      .gradient-text {
        background: linear-gradient(90deg, #1E1B4B 0%, #3D3B8E 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .nav-link:hover { color: #3D3B8E !important; }

      html {
        scroll-behavior: smooth;
      }

      @media (max-width: 1024px) {
        #hero .maxWidth-1200 { grid-template-columns: 1fr !important; gap: 40px !important; }
        #hero { padding: 120px 40px 60px 40px !important; }
        #features { padding: 60px 40px !important; }
        #features .grid { grid-template-columns: repeat(2, 1fr) !important; }
        nav { padding: 20px 40px !important; }
      }

      @media (max-width: 768px) {
        #features .grid { grid-template-columns: 1fr !important; }
        h1 { fontSize: 48px !important; }
        .hero-btns { flex-direction: column !important; }
        nav .nav-links { display: none !important; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="landing-page" style={{ backgroundColor: '#fff' }}>
      <VideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />
      {/* ── Navigation ── */}
      <nav style={{
        padding: '24px 80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        zIndex: 1000,
        borderBottom: '1px solid #F3F4F6'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', backgroundColor: '#1E1B4B', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800' }}>E</div>
          <span style={{ fontSize: '20px', fontWeight: '800', tracking: '-0.02em' }}>EMS Platform</span>
        </div>
        
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          {['Features', 'Solutions', 'Resources', 'Pricing'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} className="nav-link" style={{ fontSize: '14px', fontWeight: '600', color: '#6B7280', textDecoration: 'none', transition: 'color 0.2s' }}>{item}</a>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={() => navigate('/login')}
            style={{ padding: '12px 24px', borderRadius: '12px', border: 'none', backgroundColor: 'transparent', color: '#1E1B4B', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}
          >
            Log in
          </button>
          <button 
            onClick={() => navigate('/login')}
            style={{ padding: '12px 28px', borderRadius: '12px', border: 'none', backgroundColor: '#1E1B4B', color: '#fff', fontSize: '14px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(30, 27, 75, 0.2)' }}
          >
            Start Free Trial
          </button>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section id="hero" style={{ padding: '180px 80px 100px 80px', position: 'relative', overflow: 'hidden' }}>
        <div className="maxWidth-1200" style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '80px', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '999px', backgroundColor: '#EEF2FF', color: '#3D3B8E', fontSize: '12px', fontWeight: '800', marginBottom: '24px' }}>
              <Sparkles size={14} />
              <span>THE FUTURE OF WORKFORCE MANAGEMENT</span>
            </div>
            <h1 style={{ fontSize: '64px', fontWeight: '800', lineHeight: '1.1', marginBottom: '24px', letterSpacing: '-0.03em' }}>
              Manage your <span className="gradient-text">people</span>, not just spreadsheets.
            </h1>
            <p style={{ fontSize: '18px', color: '#6B7280', lineHeight: '1.6', marginBottom: '40px', maxWidth: '540px' }}>
              The all-in-one platform for modern HR teams. From AI-powered onboarding to seamless leave management and deep workforce analytics.
            </p>
            <div className="hero-btns" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <button 
                onClick={() => navigate('/login')}
                style={{ padding: '18px 36px', borderRadius: '16px', border: 'none', backgroundColor: '#1E1B4B', color: '#fff', fontSize: '16px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                Get Started for Free <ArrowRight size={20} />
              </button>
              <button 
                onClick={() => setIsVideoOpen(true)}
                style={{ padding: '18px 36px', borderRadius: '16px', border: '1px solid #E5E7EB', backgroundColor: '#fff', color: '#1E1B4B', fontSize: '16px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                <PlayCircle size={20} /> Watch Demo
              </button>
            </div>
            
            <div style={{ marginTop: '60px', display: 'flex', alignItems: 'center', gap: '32px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '24px', fontWeight: '800' }}>10k+</div>
                <div style={{ fontSize: '13px', color: '#6B7280', fontWeight: '600' }}>Active Users</div>
              </div>
              <div style={{ width: '1px', height: '40px', backgroundColor: '#E5E7EB' }} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '24px', fontWeight: '800' }}>99.9%</div>
                <div style={{ fontSize: '13px', color: '#6B7280', fontWeight: '600' }}>Uptime</div>
              </div>
              <div style={{ width: '1px', height: '40px', backgroundColor: '#E5E7EB' }} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Star size={18} fill="#F59E0B" color="#F59E0B" />
                  <span style={{ fontSize: '24px', fontWeight: '800' }}>4.9</span>
                </div>
                <div style={{ fontSize: '13px', color: '#6B7280', fontWeight: '600' }}>Capterra Rating</div>
              </div>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <div className="float-anim" style={{ 
              width: '100%', 
              aspectRatio: '1', 
              backgroundColor: '#EEF2FF', 
              borderRadius: '40px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 40px 80px -20px rgba(30, 27, 75, 0.1)',
              overflow: 'hidden'
            }}>
              {/* Grid Background Overlay */}
              <div className="hero-grid-bg" style={{ position: 'absolute', inset: 0 }} />

              {/* Abstract UI Elements */}
              <div style={{ position: 'absolute', top: '10%', left: '-10%', width: '60%', padding: '20px', backgroundColor: '#fff', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6', zIndex: 2 }}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#F3F4F6' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ width: '60%', height: '8px', backgroundColor: '#F3F4F6', borderRadius: '4px', marginBottom: '8px' }} />
                    <div style={{ width: '40%', height: '8px', backgroundColor: '#F3F4F6', borderRadius: '4px' }} />
                  </div>
                </div>
                <div style={{ width: '100%', height: '100px', backgroundColor: '#F9FAFB', borderRadius: '12px' }} />
              </div>
              
              <div style={{ position: 'absolute', bottom: '15%', right: '-5%', width: '50%', padding: '24px', backgroundColor: '#1E1B4B', borderRadius: '24px', color: '#fff', boxShadow: '0 20px 40px rgba(30, 27, 75, 0.2)', zIndex: 3 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <div style={{ width: '28px', height: '28px', backgroundColor: 'rgba(165, 180, 252, 0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Zap size={16} color="#A5B4FC" />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '0.05em' }}>AI INSIGHTS</span>
                </div>
                <div style={{ fontSize: '15px', fontWeight: '600', opacity: 0.95, lineHeight: '1.4' }}>Onboarding plan generated for 12 new hires.</div>
              </div>

              {/* Decorative Floating Badges to fill the middle */}
              <div className="float-slow-anim" style={{ position: 'absolute', top: '35%', right: '15%', backgroundColor: '#fff', padding: '12px 20px', borderRadius: '16px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '10px', zIndex: 1 }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#1E1B4B' }}>Active Projects</span>
              </div>

              <div className="float-slow-anim" style={{ position: 'absolute', bottom: '30%', left: '10%', backgroundColor: '#fff', padding: '12px 20px', borderRadius: '16px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '10px', zIndex: 1, animationDelay: '-2s' }}>
                <Users size={16} color="#3D3B8E" />
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#1E1B4B' }}>54 Employees</span>
              </div>

              <div className="float-slow-anim" style={{ position: 'absolute', top: '15%', right: '10%', width: '48px', height: '48px', backgroundColor: '#3D3B8E', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 10px 20px rgba(61, 59, 142, 0.2)', zIndex: 1, animationDelay: '-4s' }}>
                <BarChart3 size={24} />
              </div>

              <div style={{ fontSize: '100px', zIndex: 2, filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.1))' }}>🚀</div>
            </div>
            
            {/* Background blobs */}
            <div style={{ position: 'absolute', top: '-20%', right: '-20%', width: '300px', height: '300px', backgroundColor: '#EEF2FF', borderRadius: '50%', filter: 'blur(80px)', zIndex: -1 }} />
            <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '200px', height: '200px', backgroundColor: '#FDF2F8', borderRadius: '50%', filter: 'blur(60px)', zIndex: -1 }} />
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section id="features" style={{ padding: '100px 80px', backgroundColor: '#F9FAFB' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{ fontSize: '40px', fontWeight: '800', marginBottom: '20px' }}>Everything you need to <span className="gradient-text">scale</span>.</h2>
            <p style={{ fontSize: '18px', color: '#6B7280', maxWidth: '600px', margin: '0 auto' }}>Powerful tools designed to simplify complex HR workflows and empower your employees.</p>
          </div>

          <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            <FeatureCard 
              icon={Users} 
              title="Employee Directory" 
              desc="A unified source of truth for your entire workforce. Search, filter, and manage details with ease."
              color="#4F46E5"
            />
            <FeatureCard 
              icon={Sparkles} 
              title="AI Onboarding" 
              desc="Automatically generate personalized 30-60-90 day roadmaps tailored to roles and skills."
              color="#0891B2"
            />
            <FeatureCard 
              icon={Calendar} 
              title="Leave Management" 
              desc="Streamlined request and approval workflows with real-time balance tracking for everyone."
              color="#10B981"
            />
            <FeatureCard 
              icon={BarChart3} 
              title="Workforce Analytics" 
              desc="Deep insights into department distributions, growth trends, and employee performance metrics."
              color="#F59E0B"
            />
            <FeatureCard 
              icon={ShieldCheck} 
              title="Enterprise Security" 
              desc="Role-based access controls, end-to-end encryption, and comprehensive activity logs."
              color="#EF4444"
            />
            <FeatureCard 
              icon={Globe} 
              title="Platform Tools" 
              desc="Integrate with your existing tech stack using our powerful MCP (Model Context Protocol) interface."
              color="#3D3B8E"
            />
          </div>
        </div>
      </section>

      {/* ── Solutions Section ── */}
      <section id="solutions" style={{ padding: '100px 80px', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{ fontSize: '40px', fontWeight: '800', marginBottom: '20px' }}>Built for every <span className="gradient-text">team</span>.</h2>
            <p style={{ fontSize: '18px', color: '#6B7280', maxWidth: '600px', margin: '0 auto' }}>Empowering everyone from HR specialists to individual contributors with specialized workflows.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '40px' }}>
            <div style={{ padding: '40px', borderRadius: '32px', backgroundColor: '#EEF2FF', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '16px' }}>For HR & People Ops</h3>
                <p style={{ color: '#6B7280', marginBottom: '24px', lineHeight: '1.6' }}>Streamline administrative tasks, manage compliance, and drive employee engagement with automated workflows.</p>
                <button style={{ padding: '12px 24px', borderRadius: '12px', border: 'none', backgroundColor: '#1E1B4B', color: '#fff', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>Learn more</button>
              </div>
              <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', fontSize: '80px', opacity: 0.1 }}>📋</div>
            </div>

            <div style={{ padding: '40px', borderRadius: '32px', backgroundColor: '#FDF2F8', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '16px' }}>For Managers</h3>
                <p style={{ color: '#6B7280', marginBottom: '24px', lineHeight: '1.6' }}>Gain deep insights into your team's performance, manage leaves, and guide new hires through onboarding effortlessly.</p>
                <button style={{ padding: '12px 24px', borderRadius: '12px', border: 'none', backgroundColor: '#1E1B4B', color: '#fff', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>Learn more</button>
              </div>
              <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', fontSize: '80px', opacity: 0.1 }}>🎯</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Resources Section ── */}
      <section id="resources" style={{ padding: '100px 80px', backgroundColor: '#F9FAFB' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px' }}>
            <div>
              <h2 style={{ fontSize: '40px', fontWeight: '800', marginBottom: '20px' }}>Latest <span className="gradient-text">Resources</span></h2>
              <p style={{ fontSize: '18px', color: '#6B7280', maxWidth: '500px' }}>Insights and guides to help you build a better workplace.</p>
            </div>
            <button style={{ color: '#3D3B8E', fontWeight: '700', fontSize: '16px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>View all resources <ChevronRight size={20} /></button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            {[
              { 
                title: "The Future of AI in HR", 
                type: "Guide", 
                bgColor: "#1e1b4b",
                icon: Sparkles
              },
              { 
                title: "Building a Remote Culture", 
                type: "Case Study", 
                bgColor: "#534AB7",
                icon: Globe
              },
              { 
                title: "Compliance Checklist 2026", 
                type: "Whitepaper", 
                bgColor: "#1D9E75",
                icon: ShieldCheck
              }
            ].map((res, i) => (
              <div key={i} style={{ backgroundColor: '#fff', borderRadius: '24px', border: '1px solid #E5E7EB', overflow: 'hidden', transition: 'all 0.3s ease', cursor: 'pointer' }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(30, 27, 75, 0.15)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ 
                  height: '200px', 
                  backgroundColor: res.bgColor,
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '12px 12px 0 0'
                }}>
                  {/* Dot grid pattern overlay */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }} />
                  {/* Icon */}
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <res.icon size={40} color="white" strokeWidth={2} />
                  </div>
                </div>
                <div style={{ padding: '24px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '800', color: '#3D3B8E', textTransform: 'uppercase', marginBottom: '8px' }}>{res.type}</div>
                  <h4 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px', color: '#1E1B4B' }}>{res.title}</h4>
                  <a href="#" style={{ color: '#1E1B4B', fontWeight: '700', fontSize: '14px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>Read Article <ArrowRight size={16} /></a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing Section ── */}
      <section id="pricing" style={{ padding: '100px 80px', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{ fontSize: '40px', fontWeight: '800', marginBottom: '20px' }}>Simple, <span className="gradient-text">transparent</span> pricing.</h2>
            <p style={{ fontSize: '18px', color: '#6B7280', maxWidth: '600px', margin: '0 auto' }}>Choose the plan that's right for your organization's stage of growth.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            {[
              { name: "Starter", price: "49", features: ["Up to 25 employees", "Basic Directory", "Standard Onboarding", "Email Support"] },
              { name: "Professional", price: "149", features: ["Up to 100 employees", "Advanced Analytics", "AI Onboarding Agent", "Priority Support"], popular: true },
              { name: "Enterprise", price: "Custom", features: ["Unlimited employees", "Custom Integrations", "Dedicated Manager", "24/7 Phone Support"] }
            ].map((plan, i) => (
              <div key={i} style={{ 
                padding: '48px 40px', 
                borderRadius: '32px', 
                border: plan.popular ? '2px solid #3D3B8E' : '1px solid #E5E7EB',
                backgroundColor: plan.popular ? '#F9FAFB' : '#fff',
                position: 'relative'
              }}>
                {plan.popular && (
                  <div style={{ position: 'absolute', top: '24px', right: '24px', padding: '6px 12px', backgroundColor: '#3D3B8E', color: '#fff', borderRadius: '8px', fontSize: '12px', fontWeight: '800' }}>MOST POPULAR</div>
                )}
                <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '12px' }}>{plan.name}</h3>
                <div style={{ marginBottom: '32px' }}>
                  <span style={{ fontSize: '40px', fontWeight: '800' }}>{plan.price === "Custom" ? plan.price : `$${plan.price}`}</span>
                  {plan.price !== "Custom" && <span style={{ color: '#6B7280', fontWeight: '600' }}>/month</span>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#6B7280', fontWeight: '600' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</div>
                      {f}
                    </div>
                  ))}
                </div>
                <button style={{ 
                  width: '100%', 
                  padding: '16px', 
                  borderRadius: '16px', 
                  border: plan.popular ? 'none' : '1px solid #E5E7EB', 
                  backgroundColor: plan.popular ? '#1E1B4B' : 'transparent', 
                  color: plan.popular ? '#fff' : '#1E1B4B',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}>Get Started</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section style={{ padding: '100px 80px' }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          backgroundColor: '#1E1B4B', 
          borderRadius: '40px', 
          padding: '80px', 
          textAlign: 'center',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '24px' }}>Ready to transform your HR?</h2>
            <p style={{ fontSize: '18px', opacity: 0.8, maxWidth: '600px', margin: '0 auto 40px' }}>Join over 500+ companies already using EMS to build better workplaces.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
              <button 
                onClick={() => navigate('/login')}
                style={{ padding: '18px 40px', borderRadius: '16px', border: 'none', backgroundColor: '#fff', color: '#1E1B4B', fontSize: '16px', fontWeight: '800', cursor: 'pointer' }}
              >
                Get Started Now
              </button>
              <button style={{ padding: '18px 40px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'transparent', color: '#fff', fontSize: '16px', fontWeight: '800', cursor: 'pointer' }}>
                Contact Sales
              </button>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div style={{ position: 'absolute', top: '-50%', left: '-10%', width: '400px', height: '400px', backgroundColor: 'rgba(61, 59, 142, 0.3)', borderRadius: '50%', filter: 'blur(100px)' }} />
          <div style={{ position: 'absolute', bottom: '-50%', right: '-10%', width: '400px', height: '400px', backgroundColor: 'rgba(99, 102, 241, 0.2)', borderRadius: '50%', filter: 'blur(100px)' }} />
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ padding: '80px 80px 40px 80px', borderTop: '1px solid #F3F4F6' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '80px', marginBottom: '80px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ width: '32px', height: '32px', backgroundColor: '#1E1B4B', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800', fontSize: '14px' }}>E</div>
                <span style={{ fontSize: '18px', fontWeight: '800' }}>EMS Platform</span>
              </div>
              <p style={{ color: '#6B7280', lineHeight: '1.6', marginBottom: '24px' }}>Empowering modern organizations with intelligent workforce management tools.</p>
              <div style={{ display: 'flex', gap: '16px' }}>
                {[Twitter, Github, Linkedin, Instagram].map((Icon, i) => (
                  <a key={i} href="#" style={{ color: '#9CA3AF', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#3D3B8E'} onMouseOut={e => e.currentTarget.style.color = '#9CA3AF'}>
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Product</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['Features', 'Pricing', 'Documentation', 'Changelog'].map(item => (
                  <a key={item} href="#" style={{ fontSize: '14px', color: '#6B7280', textDecoration: 'none' }}>{item}</a>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Company</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['About Us', 'Careers', 'Blog', 'Contact'].map(item => (
                  <a key={item} href="#" style={{ fontSize: '14px', color: '#6B7280', textDecoration: 'none' }}>{item}</a>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Legal</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Security'].map(item => (
                  <a key={item} href="#" style={{ fontSize: '14px', color: '#6B7280', textDecoration: 'none' }}>{item}</a>
                ))}
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '40px', borderTop: '1px solid #F3F4F6' }}>
            <p style={{ fontSize: '14px', color: '#9CA3AF' }}>© 2026 EMS Platform. All rights reserved.</p>
            <div style={{ display: 'flex', gap: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#6B7280' }}>System Status: Operational</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
