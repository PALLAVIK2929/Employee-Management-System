import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, ShieldCheck, ArrowRight, Eye, EyeOff } from 'lucide-react';

const FEATURES = [
  { icon: "👥", title: "Employee Directory", desc: "Manage your entire workforce in one place" },
  { icon: "✦", title: "AI Onboarding Agent", desc: "Auto-generate 30-60-90 day plans for new hires" },
  { icon: "📅", title: "Leave Management", desc: "Apply, approve and track leaves effortlessly" },
  { icon: "📊", title: "Analytics & Insights", desc: "Real-time workforce reports and dashboards" },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin"); // Role selector state
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError("");

    if (!email || !password) return setError("Please enter your email and password.");
    if (!email.includes("@")) return setError("Please enter a valid email address.");

    setLoading(true);
    try {
      // Mock Users
      const adminUser = { email: "admin@ems.com", password: "admin123", role: "admin", name: "Admin User", initials: "AD" };
      const employeeUser = { email: "employee@ems.com", password: "emp123", role: "employee", name: "John Doe", initials: "JD" };

      let targetUser;
      if (email === adminUser.email && password === adminUser.password && role === 'admin') {
        targetUser = adminUser;
      } else if (email === employeeUser.email && password === employeeUser.password && role === 'employee') {
        targetUser = employeeUser;
      }

      if (targetUser) {
        login(targetUser, "mock-jwt-token-123");
        navigate('/home');
      } else {
        setError("Invalid email, password, or role selection.");
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inpStyle = {
    width: "100%",
    background: "var(--input-bg)",
    border: "1.5px solid var(--border-color)",
    borderRadius: "10px",
    padding: "11px 14px",
    paddingLeft: "40px",
    fontSize: "14px",
    color: "var(--text-primary)",
    outline: "none",
    transition: "all 0.2s",
    fontFamily: "inherit"
  };

  const roleBtnStyle = (active) => ({
    flex: 1,
    padding: "10px",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: "600",
    border: `1.5px solid ${active ? "var(--accent-color)" : "var(--border-color)"}`,
    backgroundColor: active ? "var(--accent-color)" : "transparent",
    color: active ? "#fff" : "var(--text-secondary)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "all 0.2s"
  });

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Inter', sans-serif", overflow: "hidden", backgroundColor: "var(--bg-primary)" }}>

      {/* ── Left Panel ── */}
      <div style={{ width: "45%", background: "#1E1B4B", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 40, position: "relative", overflow: "hidden", flexShrink: 0 }}>
        {/* BG circles */}
        {[[-60, -60, 280], [40, -80, 200, true], [-40, 120, 140, true, true]].map(([a, b, s, , bottom], i) => (
          <div key={i} style={{ position: "absolute", ...(bottom ? { bottom: b, left: a } : { top: b, right: a }), width: s, height: s, borderRadius: "50%", background: "rgba(255,255,255,.04)" }} />
        ))}

        <div style={{ position: "relative" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 48 }}>
            <div style={{ width: 36, height: 36, background: "#fff", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "#1E1B4B" }}>E</div>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>EMS</span>
          </div>

          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", lineHeight: 1.25, marginBottom: 12 }}>Manage Your<br />Workforce Smarter</h1>
          <p style={{ fontSize: 13, color: "#A5B4FC", lineHeight: 1.7, marginBottom: 40 }}>One intelligent platform to manage employees, departments, onboarding and more.</p>

          {FEATURES.map((f) => (
            <div key={f.title} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(255,255,255,.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16 }}>{f.icon}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{f.title}</div>
                <div style={{ fontSize: 11.5, color: "#A5B4FC", marginTop: 1 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: "#6366F1", position: "relative" }}>© 2026 EMS · All rights reserved</div>
      </div>

      {/* ── Right Panel ── */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-primary)", padding: 40 }}>
        <div style={{ width: "100%", maxWidth: 380 }} className="animate-fade-in-up">

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ width: 48, height: 48, background: "#1E1B4B", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: "#fff", margin: "0 auto 16px" }}>E</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 6 }}>Welcome back 👋</h2>
            <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>Sign in to your EMS account to continue</p>
          </div>

          <form onSubmit={handleLogin}>
            {/* Role Selector */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 8, textTransform: "uppercase" }}>Sign in as</div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button type="button" onClick={() => setRole("admin")} style={roleBtnStyle(role === "admin")}>
                  <ShieldCheck size={16} /> Admin
                </button>
                <button type="button" onClick={() => setRole("employee")} style={roleBtnStyle(role === "employee")}>
                  <User size={16} /> Employee
                </button>
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 6 }}>Email Address</div>
              <div style={{ position: "relative" }}>
                <Mail size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder={role === "admin" ? "admin@ems.com" : "employee@ems.com"} style={inpStyle} />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 6 }}>Password</div>
              <div style={{ position: "relative" }}>
                <Lock size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
                <input value={password} onChange={(e) => setPassword(e.target.value)} type={showPwd ? "text" : "password"} placeholder="Enter your password" style={inpStyle} />
                <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} style={{ width: "100%", background: "#1E1B4B", color: "#fff", border: "none", borderRadius: 10, padding: "13px 0", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", opacity: loading ? 0.7 : 1, transition: "all 0.2s" }}>
              {loading ? "Verifying..." : "Sign In"} <ArrowRight size={18} />
            </button>
          </form>

          {/* Error */}
          {error && (
            <div style={{ marginTop: 12, background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: 10, padding: "12px 14px", fontSize: 13, color: "#EF4444", textAlign: "center", fontWeight: "600" }}>
              {error}
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: 24, fontSize: 13, color: "var(--text-secondary)" }}>
            Don't have an account?{" "}
            <span style={{ color: "var(--accent-color)", fontWeight: 700, cursor: "pointer" }}>Contact your Admin</span>
          </div>
        </div>
      </div>
    </div>
  );
}
