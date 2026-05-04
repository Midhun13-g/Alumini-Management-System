import { useState } from "react";
import { motion } from "framer-motion";
import AuthService from "../services/AuthService";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { T } from "../theme";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) { setError("Please fill in both fields."); return; }
    setLoading(true);
    try {
      const { data } = await AuthService.login(email, password);
      login(data);
      navigate(data.role === "ADMIN" ? "/admin" : "/home");
    } catch (err) {
      setError(err?.response?.data || "Login failed. Check your credentials.");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: T.bg, padding: 16, fontFamily: T.font }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        style={{ width: "100%", maxWidth: 420, background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 40 }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: T.gradientBlue, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(37,99,235,0.4)", fontSize: 22 }}>🎓</div>
          <div>
            <div style={{ color: T.textPrimary, fontWeight: 800, fontSize: "1.1rem" }}>Alumni Network</div>
            <div style={{ color: T.textSecondary, fontSize: "0.75rem" }}>Connect · Grow · Succeed</div>
          </div>
        </div>

        <h1 style={{ color: T.textPrimary, fontWeight: 800, fontSize: "1.6rem", marginBottom: 6 }}>Welcome back</h1>
        <p style={{ color: T.textSecondary, marginBottom: 28, fontSize: "0.9rem" }}>Sign in to your account</p>

        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", color: T.textSecondary, fontSize: "0.8rem", fontWeight: 600, marginBottom: 6 }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email"
              placeholder="you@example.com"
              style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "12px 14px", color: T.textPrimary, fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }}
              onFocus={(e) => e.target.style.borderColor = T.primary}
              onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />
          </div>
          <div>
            <label style={{ display: "block", color: T.textSecondary, fontSize: "0.8rem", fontWeight: 600, marginBottom: 6 }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password"
              placeholder="••••••••"
              style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "12px 14px", color: T.textPrimary, fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }}
              onFocus={(e) => e.target.style.borderColor = T.primary}
              onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />
          </div>

          {error && <div style={{ color: "#FCA5A5", fontSize: "0.85rem", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "8px 12px" }}>{error}</div>}

          <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            style={{ background: T.gradientBlue, color: "#fff", border: "none", borderRadius: 12, padding: "13px", fontWeight: 700, fontSize: "0.95rem", cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 4px 16px rgba(37,99,235,0.4)", opacity: loading ? 0.7 : 1, fontFamily: T.font }}>
            {loading ? "Signing in…" : "Sign In"}
          </motion.button>
        </form>

        <div style={{ marginTop: 24, textAlign: "center", color: T.textSecondary, fontSize: "0.875rem" }}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "#60A5FA", textDecoration: "none", fontWeight: 600 }}>Sign up</Link>
        </div>

        <div style={{ marginTop: 20, padding: "12px 16px", background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.2)", borderRadius: 10 }}>
          <div style={{ color: T.textSecondary, fontSize: "0.75rem", fontWeight: 600, marginBottom: 4 }}>Demo credentials</div>
          <div style={{ color: T.textPrimary, fontSize: "0.78rem" }}>Admin: admin@alumni.edu</div>
          <div style={{ color: T.textPrimary, fontSize: "0.78rem" }}>Alumni: arjun.sharma@alumni.edu</div>
          <div style={{ color: T.textPrimary, fontSize: "0.78rem" }}>Student: aditya.kumar@student.edu</div>
          <div style={{ color: T.textMuted, fontSize: "0.75rem", marginTop: 2 }}>Password: password123</div>
        </div>
      </motion.div>
    </div>
  );
}
