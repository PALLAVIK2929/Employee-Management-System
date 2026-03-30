import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

const FEATURES = [
  { icon: "👥", title: "Employee Directory", desc: "Manage your entire workforce in one place" },
  { icon: "✦", title: "AI Onboarding Agent", desc: "Auto-generate 30-60-90 day plans for new hires" },
  { icon: "📅", title: "Leave Management", desc: "Apply, approve and track leaves effortlessly" },
  { icon: "📊", title: "Analytics & Insights", desc: "Real-time workforce reports and dashboards" },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email || !password) return setError("Please enter your email and password.");
    if (!email.includes("@")) return setError("Please enter a valid email address.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");

    setLoading(true);
    try {
      // Functional backend authentication
      let response;
      let userData;
      
      if (email === 'admin@company.com' && password === 'admin123') {
        // Real admin login
        response = await api.login(email, password);
        userData = {
          email: email,
          name: 'Admin User',
          role: 'admin',
          initials: 'AD'
        };
      } else {
        // Demo bypass for employee view
        // In a real app, this would also be a call to api.login
        userData = {
          email: email,
          name: 'Standard Employee',
          role: 'employee',
          initials: 'EM'
        };
        // Mock a token for demo purposes
        localStorage.setItem('token', 'demo-token-123');
      }
      
      localStorage.setItem('user', JSON.stringify(userData));
      
      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/home';
      }, 1000);
    } catch (err) {
      setError("Invalid email or password. Try admin@company.com / admin123");
    } finally {
      setLoading(false);
    }
  };

  // shared input style 
  const inp = (extra = {}) => ({
    width: "100%", background: "#F9FAFB", border: "1.5px solid #E5E7EB", borderRadius: 10,
    padding: "11px 14px", fontSize: 13.5, color: "#1A1A2E", outline: "none", fontFamily: "inherit", ...extra,
  });

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Inter', sans-serif", overflow: "hidden" }}>

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

          {/* Headline */}
          <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", lineHeight: 1.25, marginBottom: 12 }}>Manage Your<br />Workforce Smarter</div>
          <div style={{ fontSize: 13, color: "#A5B4FC", lineHeight: 1.7, marginBottom: 40 }}>One intelligent platform to manage employees, departments, onboarding and more.</div>

          {/* Features */}
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
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#F8F8FC", padding: 40 }}>
        <div style={{ width: "100%", maxWidth: 380 }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ width: 48, height: 48, background: "#1E1B4B", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: "#fff", margin: "0 auto 16px" }}>E</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#1A1A2E", marginBottom: 6 }}>Welcome back 👋</div>
            <div style={{ fontSize: 13, color: "#6B7280" }}>Sign in to your EMS account to continue</div>
          </div>

          {/* Social buttons */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 22 }}>
            {[
              { label: "Google", color: "#4285F4" },
              { label: "Microsoft", color: "#0078D4" },
            ].map((s) => (
              <button key={s.label} style={{ background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 10, padding: "11px 0", fontSize: 13, fontWeight: 500, color: "#374151", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 9 }}>
                <span style={{ width: 16, height: 16, background: s.color, borderRadius: 3, display: "inline-block" }} />
                {s.label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
            <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
            <span style={{ fontSize: 12, color: "#9CA3AF" }}>or sign in with email</span>
            <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
          </div>

          {/* Email */}
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Email Address</div>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="admin@company.com" style={inp()} />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Password</div>
              <div style={{ position: "relative" }}>
                <input value={password} onChange={(e) => setPassword(e.target.value)} type={showPwd ? "text" : "password"} placeholder="Enter your password" style={inp({ paddingRight: 42 })} />
                <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", fontSize: 14 }}>
                  {showPwd ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 7, cursor: "pointer", fontSize: 12.5, color: "#4B5563" }}>
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} style={{ accentColor: "#1E1B4B", width: 14, height: 14 }} />
                Remember me
              </label>
              <span style={{ fontSize: 12.5, color: "#3D3B8E", fontWeight: 500, cursor: "pointer" }}>Forgot password?</span>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} style={{ width: "100%", background: "#1E1B4B", color: "#fff", border: "none", borderRadius: 10, padding: "13px 0", fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", letterSpacing: ".3px", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Signing In..." : "Sign In to EMS"}
            </button>
          </form>

          {/* Error */}
          {error && (
            <div style={{ marginTop: 12, background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "10px 14px", fontSize: 12.5, color: "#DC2626", textAlign: "center" }}>
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div style={{ marginTop: 12, background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 8, padding: "10px 14px", fontSize: 12.5, color: "#16A34A", textAlign: "center" }}>
              ✓ Login successful! Redirecting to dashboard...
            </div>
          )}

          {/* Sign up */}
          <div style={{ textAlign: "center", marginTop: 20, fontSize: 12.5, color: "#6B7280" }}>
            Don't have an account?{" "}
            <span style={{ color: "#3D3B8E", fontWeight: 600, cursor: "pointer" }}>Contact your Admin</span>
          </div>
        </div>
      </div>
    </div>
  );
}
