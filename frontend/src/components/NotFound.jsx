import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated Background Shapes */}
      <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-purple-500/10 rounded-full animate-float blur-3xl" />
      <div className="absolute bottom-[-20%] left-[10%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" style={{ animationDelay: '1s' }} />
      <div className="absolute top-[30%] left-[-10%] w-48 h-48 bg-indigo-500/10 rounded-full animate-float blur-3xl" style={{ animationDelay: '2s' }} />
      
      <div className="max-w-2xl w-full text-center relative z-10">
        <div className="mb-8 animate-fade-in-up opacity-0" style={{ animationFillMode: 'forwards' }}>
          <h1 className="text-[180px] md:text-[240px] font-black leading-none bg-gradient-to-r from-[#1E1B4B] to-[#6366F1] bg-clip-text text-transparent mb-4">
            404
          </h1>
        </div>
        
        <div className="animate-fade-in-up opacity-0 stagger-1" style={{ animationFillMode: 'forwards' }}>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
            Page not found
          </h2>
          <p className="text-lg text-[var(--text-secondary)] mb-8 leading-relaxed max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back on track.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up opacity-0 stagger-2" style={{ animationFillMode: 'forwards' }}>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-[var(--border-color)] text-[var(--text-primary)] font-semibold rounded-xl hover:bg-[var(--input-bg)] transition-all transform hover:scale-105 active:scale-95"
            aria-label="Go back to previous page"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
          <button
            onClick={() => navigate('/home')}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1E1B4B] to-[#3D3B8E] text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg transform hover:scale-105 active:scale-95"
            aria-label="Go to dashboard"
          >
            <Home size={20} />
            Go to Dashboard
          </button>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default NotFound;
