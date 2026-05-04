import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthService from '../services/AuthService';
import { T } from '../theme';

const inputStyle = {
  width: "100%", background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10,
  padding: "10px 14px", color: T.textPrimary, fontSize: "0.875rem",
  outline: "none", boxSizing: "border-box", fontFamily: T.font,
};
const labelStyle = { display: "block", color: T.textSecondary, fontSize: "0.78rem", fontWeight: 600, marginBottom: 5 };
const fieldWrap = { marginBottom: 14 };

function Field({ label, name, type = "text", value, onChange, required }) {
  return (
    <div style={fieldWrap}>
      <label style={labelStyle}>{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} required={required}
        style={inputStyle}
        onFocus={(e) => e.target.style.borderColor = T.primary}
        onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
      />
    </div>
  );
}

function SignupPage() {
  const [formData, setFormData] = useState({
    email: '', password: '', firstName: '', lastName: '', userType: 'ALUMNI',
    graduationYear: '', industry: '', skills: '', bio: '', isMentor: false,
    linkedinUrl: '', studentId: '', department: '', yearOfJoining: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.includes('@') || formData.password.length < 6) { setError('Invalid email or password (min 6 chars)'); return; }
    if (!formData.firstName || !formData.lastName) { setError('First and last name are required'); return; }
    if (formData.userType === 'ALUMNI' && !formData.graduationYear) { setError('Graduation year required for alumni'); return; }
    if (formData.userType === 'STUDENT' && (!formData.studentId || !formData.yearOfJoining)) { setError('Student ID and year of joining required'); return; }
    try {
      await AuthService.signup({ ...formData, graduationYear: formData.graduationYear ? parseInt(formData.graduationYear) : null, yearOfJoining: formData.yearOfJoining ? parseInt(formData.yearOfJoining) : null });
      navigate('/login');
    } catch (err) { setError(err.response?.data || err.message); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: T.bg, padding: 16, fontFamily: T.font }}>
      <div style={{ width: "100%", maxWidth: 460, background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 36 }}>
        <h2 style={{ color: T.textPrimary, fontWeight: 800, fontSize: "1.5rem", marginBottom: 6, textAlign: "center" }}>Create Account</h2>
        <p style={{ color: T.textSecondary, fontSize: "0.85rem", textAlign: "center", marginBottom: 24 }}>Join the alumni network</p>

        {error && <div style={{ color: "#FCA5A5", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "8px 12px", marginBottom: 16, fontSize: "0.85rem" }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            <div><label style={labelStyle}>First Name</label><input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required style={inputStyle} onFocus={(e) => e.target.style.borderColor = T.primary} onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"} /></div>
            <div><label style={labelStyle}>Last Name</label><input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required style={inputStyle} onFocus={(e) => e.target.style.borderColor = T.primary} onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"} /></div>
          </div>
          <Field label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
          <Field label="Password (min 6 chars)" name="password" type="password" value={formData.password} onChange={handleChange} required />

          <div style={fieldWrap}>
            <label style={labelStyle}>Account Type</label>
            <select name="userType" value={formData.userType} onChange={handleChange}
              style={{ ...inputStyle, cursor: "pointer" }}>
              <option value="ALUMNI" style={{ background: "#0F1629" }}>Alumni</option>
              <option value="STUDENT" style={{ background: "#0F1629" }}>Student</option>
            </select>
          </div>

          {formData.userType === 'ALUMNI' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }}>
              <Field label="Graduation Year" name="graduationYear" type="number" value={formData.graduationYear} onChange={handleChange} required />
              <Field label="Industry" name="industry" value={formData.industry} onChange={handleChange} />
              <Field label="Skills (comma-separated)" name="skills" value={formData.skills} onChange={handleChange} />
              <div style={fieldWrap}>
                <label style={labelStyle}>Bio</label>
                <textarea name="bio" value={formData.bio} onChange={handleChange} rows={3}
                  style={{ ...inputStyle, resize: "vertical" }} />
              </div>
              <div style={{ ...fieldWrap, display: "flex", alignItems: "center", gap: 8 }}>
                <input type="checkbox" name="isMentor" checked={formData.isMentor} onChange={handleChange} style={{ accentColor: T.primary, width: 16, height: 16 }} />
                <label style={{ ...labelStyle, marginBottom: 0, cursor: "pointer" }}>Willing to be a Mentor</label>
              </div>
              <Field label="LinkedIn URL" name="linkedinUrl" type="url" value={formData.linkedinUrl} onChange={handleChange} />
            </motion.div>
          )}

          {formData.userType === 'STUDENT' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }}>
              <Field label="Student ID" name="studentId" value={formData.studentId} onChange={handleChange} required />
              <Field label="Department" name="department" value={formData.department} onChange={handleChange} />
              <Field label="Year of Joining" name="yearOfJoining" type="number" value={formData.yearOfJoining} onChange={handleChange} required />
              <Field label="LinkedIn URL" name="linkedinUrl" type="url" value={formData.linkedinUrl} onChange={handleChange} />
            </motion.div>
          )}

          <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            style={{ width: "100%", background: T.gradientBlue, color: "#fff", border: "none", borderRadius: 12, padding: "13px", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer", boxShadow: "0 4px 16px rgba(37,99,235,0.4)", marginTop: 8, fontFamily: T.font }}>
            Create Account
          </motion.button>
        </form>

        <p style={{ marginTop: 20, textAlign: "center", color: T.textSecondary, fontSize: "0.875rem" }}>
          Already have an account?{' '}
          <a href="/login" style={{ color: "#60A5FA", textDecoration: "none", fontWeight: 600 }}>Log in</a>
        </p>
      </div>
    </motion.div>
  );
}

export default SignupPage;
