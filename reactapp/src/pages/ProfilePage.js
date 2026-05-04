import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box, Typography, Avatar, Button, Dialog, DialogActions, DialogContent,
  DialogTitle, TextField, List, ListItem, ListItemText, IconButton,
  Chip, CircularProgress, Divider,
} from "@mui/material";
import {
  Edit as EditIcon, Delete as DeleteIcon, ArrowForward as ArrowForwardIcon,
  ConnectWithoutContact as ConnectIcon, HourglassEmpty as PendingIcon,
  Logout as LogoutIcon, LinkedIn as LinkedInIcon, Verified as VerifiedIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AppSidebar from "../components/AppSidebar";
import { T, pageVariants, listVariants, itemVariants } from "../theme";

const getAvatarGradient = (name = "") => {
  const colors = ["linear-gradient(135deg,#1e3a8a,#2563EB)", "linear-gradient(135deg,#065f46,#10B981)", "linear-gradient(135deg,#7c2d12,#F5A623)", "linear-gradient(135deg,#4c1d95,#8B5CF6)"];
  return colors[(name.charCodeAt(0) || 0) % colors.length];
};

const GlassCard = ({ children, sx = {} }) => (
  <Box sx={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)", border: `1px solid ${T.border}`, borderRadius: "16px", p: 3, ...sx }}>
    {children}
  </Box>
);

const SLabel = ({ children }) => (
  <Typography sx={{ color: T.textSecondary, fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", mb: 1 }}>
    {children}
  </Typography>
);

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [industry, setIndustry] = useState("");
  const [skills, setSkills] = useState("");
  const [department, setDepartment] = useState("");
  const [yearOfJoining, setYearOfJoining] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentPending, setSentPending] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };
  const profileApi = user?.userType === "ALUMNI" ? "http://localhost:8080/api/alumni/my" : "http://localhost:8080/api/student/my";

  // Admin has no alumni/student profile — skip loading
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    if (!token || isAdmin) { setLoading(false); return; }
    const load = async () => {
      try {
        setLoading(true);
        const [pRes, recRes, sentRes] = await Promise.all([
          axios.get(profileApi, axiosConfig),
          axios.get("http://localhost:8080/api/connect/received/pending", axiosConfig),
          axios.get("http://localhost:8080/api/connect/sent/pending", axiosConfig),
        ]);
        setProfile(pRes.data);
        if (user.userType === "ALUMNI") { setIndustry(pRes.data.industry || ""); setSkills(pRes.data.skills || ""); setLinkedinUrl(pRes.data.linkedinUrl || ""); }
        else { setDepartment(pRes.data.department || ""); setYearOfJoining(pRes.data.yearOfJoining || ""); setLinkedinUrl(pRes.data.linkedinUrl || ""); }
        setReceivedRequests(recRes.data);
        setSentPending(sentRes.data);
      } catch (err) { setError("Failed to load profile."); }
      finally { setLoading(false); }
    };
    load();
  }, [token]); // eslint-disable-line

  const handleUpdate = async () => {
    try {
      const body = user.userType === "ALUMNI" ? { industry, skills, linkedinUrl } : { department, yearOfJoining, linkedinUrl };
      const res = await axios.put(profileApi, body, axiosConfig);
      setProfile(res.data); setEditOpen(false); setError(null);
    } catch (err) { setError("Failed to update."); }
  };

  const handleAccept = async (id) => {
    await axios.post(`http://localhost:8080/api/connect/accept/${id}`, {}, axiosConfig);
    setReceivedRequests((p) => p.filter((r) => r.id !== id));
  };
  const handleReject = async (id) => {
    await axios.post(`http://localhost:8080/api/connect/reject/${id}`, {}, axiosConfig);
    setReceivedRequests((p) => p.filter((r) => r.id !== id));
  };
  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8080/api/connect/${id}`, axiosConfig);
    setSentPending((p) => p.filter((r) => r.id !== id));
  };
  const handleLogout = () => { logout(); navigate("/login"); };

  if (loading) return (
    <Box sx={{ display: "flex", height: "100vh", background: T.bg }}>
      <AppSidebar />
      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", ml: "72px" }}>
        <CircularProgress sx={{ color: T.primary }} />
      </Box>
    </Box>
  );

  // Admin profile view
  if (isAdmin) return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: T.bg, fontFamily: T.font }}>
      <AppSidebar />
      <Box sx={{ flex: 1, ml: "72px", p: 4, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <Box sx={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${T.border}`, borderRadius: "20px", p: 5, textAlign: "center", maxWidth: 400 }}>
          <Box sx={{ width: 72, height: 72, borderRadius: "16px", background: T.gradientBlue, display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 3, boxShadow: "0 4px 20px rgba(37,99,235,0.4)" }}>
            <Typography sx={{ fontSize: 32 }}>🛡️</Typography>
          </Box>
          <Typography variant="h5" sx={{ color: T.textPrimary, fontWeight: 800, mb: 1 }}>Admin Account</Typography>
          <Typography sx={{ color: T.textSecondary, mb: 3 }}>{user?.email}</Typography>
          <Button onClick={handleLogout}
            sx={{ background: "rgba(239,68,68,0.15)", color: "#FCA5A5", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", textTransform: "none", fontWeight: 600, px: 3, "&:hover": { background: "rgba(239,68,68,0.25)" } }}>
            Logout
          </Button>
        </Box>
      </Box>
    </Box>
  );

  const skillList = profile?.skills?.split(",").filter(Boolean) || [];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: T.bg, fontFamily: T.font }}>
      <AppSidebar />
      <Box sx={{ flex: 1, ml: "72px", overflowY: "auto", p: 4,
        "&::-webkit-scrollbar": { width: 4 },
        "&::-webkit-scrollbar-thumb": { background: "rgba(255,255,255,0.1)", borderRadius: 4 },
      }}>
        <motion.div variants={pageVariants} initial="initial" animate="animate">

          {/* Cover + Avatar */}
          <Box sx={{ position: "relative", mb: 8 }}>
            <Box sx={{ height: 160, borderRadius: "20px", background: "linear-gradient(135deg, #0f2460 0%, #1e3a8a 50%, #1d4ed8 100%)", overflow: "hidden", position: "relative" }}>
              <Box sx={{ position: "absolute", inset: 0, background: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
            </Box>
            <Box sx={{ position: "absolute", bottom: -48, left: 32, display: "flex", alignItems: "flex-end", gap: 2 }}>
              <Avatar sx={{ width: 96, height: 96, fontSize: "2rem", fontWeight: 800, background: getAvatarGradient(user?.firstName), border: "4px solid #0A0F1E", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </Avatar>
            </Box>
            <Box sx={{ position: "absolute", top: 16, right: 16, display: "flex", gap: 1 }}>
              <Button startIcon={<EditIcon />} onClick={() => setEditOpen(true)}
                sx={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)", color: "#fff", borderRadius: "10px", textTransform: "none", fontWeight: 600, fontSize: "0.8rem", border: "1px solid rgba(255,255,255,0.2)", "&:hover": { background: "rgba(255,255,255,0.25)" } }}>
                Edit
              </Button>
              <Button startIcon={<LogoutIcon />} onClick={handleLogout}
                sx={{ background: "rgba(239,68,68,0.2)", backdropFilter: "blur(10px)", color: "#FCA5A5", borderRadius: "10px", textTransform: "none", fontWeight: 600, fontSize: "0.8rem", border: "1px solid rgba(239,68,68,0.3)", "&:hover": { background: "rgba(239,68,68,0.3)" } }}>
                Logout
              </Button>
            </Box>
          </Box>

          {/* Name + Info */}
          <Box sx={{ mb: 4 }}>
            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
              <Typography variant="h4" sx={{ color: T.textPrimary, fontWeight: 800 }}>
                {user?.firstName} {user?.lastName}
              </Typography>
              {profile?.isVerified && <VerifiedIcon sx={{ color: T.primary, fontSize: 22 }} />}
            </Box>
            <Typography sx={{ color: T.textSecondary, fontSize: "0.95rem", mb: 1 }}>
              {user?.userType === "ALUMNI" ? `${profile?.industry || "Alumni"} · Class of ${profile?.graduationYear || ""}` : `${profile?.department || "Student"} · Batch ${profile?.yearOfJoining || ""}`}
            </Typography>
            <Typography sx={{ color: T.textMuted, fontSize: "0.875rem" }}>{user?.email}</Typography>
            {profile?.linkedinUrl && (
              <Box display="flex" alignItems="center" gap={0.5} mt={1}>
                <LinkedInIcon sx={{ color: "#0A66C2", fontSize: 18 }} />
                <Typography component="a" href={profile.linkedinUrl} target="_blank" sx={{ color: "#60A5FA", fontSize: "0.85rem", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
                  LinkedIn Profile
                </Typography>
              </Box>
            )}
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
            {/* About */}
            {user?.userType === "ALUMNI" && profile?.bio && (
              <GlassCard sx={{ gridColumn: "1 / -1" }}>
                <SLabel>About</SLabel>
                <Typography sx={{ color: T.textPrimary, lineHeight: 1.7, fontSize: "0.9rem" }}>{profile.bio}</Typography>
              </GlassCard>
            )}

            {/* Skills */}
            {skillList.length > 0 && (
              <GlassCard>
                <SLabel>Skills</SLabel>
                <Box display="flex" flexWrap="wrap" gap={0.75}>
                  {skillList.map((s) => (
                    <Chip key={s} label={s.trim()} size="small"
                      sx={{ background: "rgba(37,99,235,0.15)", color: "#93C5FD", border: "1px solid rgba(37,99,235,0.3)", fontSize: "0.78rem" }} />
                  ))}
                </Box>
              </GlassCard>
            )}

            {/* Received Requests */}
            <GlassCard>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <ConnectIcon sx={{ color: T.primary, fontSize: 20 }} />
                <SLabel>Received Requests</SLabel>
                {receivedRequests.length > 0 && (
                  <Chip label={receivedRequests.length} size="small" sx={{ background: T.primary, color: "#fff", fontSize: "0.7rem", height: 18, ml: "auto" }} />
                )}
              </Box>
              {receivedRequests.length === 0 ? (
                <Typography sx={{ color: T.textMuted, fontSize: "0.85rem" }}>No pending requests.</Typography>
              ) : (
                <motion.div variants={listVariants} initial="initial" animate="animate">
                  {receivedRequests.map((req) => (
                    <motion.div key={req.id} variants={itemVariants}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 1.5, borderBottom: `1px solid ${T.border}` }}>
                        <Box>
                          <Typography sx={{ color: T.textPrimary, fontWeight: 600, fontSize: "0.875rem" }}>{req.sender.firstName} {req.sender.lastName}</Typography>
                          <Typography sx={{ color: T.textMuted, fontSize: "0.75rem" }}>Wants to connect</Typography>
                        </Box>
                        <Box display="flex" gap={1}>
                          <Button size="small" onClick={() => handleAccept(req.id)}
                            sx={{ background: T.successSoft, color: T.success, borderRadius: "8px", textTransform: "none", fontWeight: 600, fontSize: "0.75rem", "&:hover": { background: "rgba(16,185,129,0.25)" } }}>
                            Accept
                          </Button>
                          <Button size="small" onClick={() => handleReject(req.id)}
                            sx={{ background: T.dangerSoft, color: T.danger, borderRadius: "8px", textTransform: "none", fontWeight: 600, fontSize: "0.75rem", "&:hover": { background: "rgba(239,68,68,0.25)" } }}>
                            Reject
                          </Button>
                        </Box>
                      </Box>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </GlassCard>

            {/* Sent Pending */}
            <GlassCard>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <PendingIcon sx={{ color: T.warning, fontSize: 20 }} />
                <SLabel>Pending Sent</SLabel>
              </Box>
              {sentPending.length === 0 ? (
                <Typography sx={{ color: T.textMuted, fontSize: "0.85rem" }}>No pending requests.</Typography>
              ) : (
                <motion.div variants={listVariants} initial="initial" animate="animate">
                  {sentPending.map((req) => (
                    <motion.div key={req.id} variants={itemVariants}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 1.5, borderBottom: `1px solid ${T.border}` }}>
                        <Box>
                          <Typography sx={{ color: T.textPrimary, fontWeight: 600, fontSize: "0.875rem" }}>{req.receiver.firstName} {req.receiver.lastName}</Typography>
                          <Chip label="Pending" size="small" sx={{ background: T.warningSoft, color: T.warning, fontSize: "0.68rem", height: 18, mt: 0.5 }} />
                        </Box>
                        <IconButton size="small" onClick={() => handleDelete(req.id)} sx={{ color: T.danger, "&:hover": { background: T.dangerSoft } }}>
                          <DeleteIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Box>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </GlassCard>
          </Box>

          {error && <Typography sx={{ color: T.danger, mt: 2, fontSize: "0.85rem" }}>{error}</Typography>}
        </motion.div>
      </Box>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm"
        PaperProps={{ sx: { background: "#0F1629", border: `1px solid ${T.border}`, borderRadius: "20px" } }}>
        <DialogTitle sx={{ background: T.gradientBlue, color: "#fff", fontWeight: 700 }}>Edit Profile</DialogTitle>
        <DialogContent sx={{ pt: "20px !important", background: "#0F1629" }}>
          {[
            ...(user?.userType === "ALUMNI"
              ? [{ label: "Industry", value: industry, set: setIndustry }, { label: "Skills (comma-separated)", value: skills, set: setSkills }]
              : [{ label: "Department", value: department, set: setDepartment }, { label: "Year of Joining", value: yearOfJoining, set: setYearOfJoining, type: "number" }]),
            { label: "LinkedIn URL", value: linkedinUrl, set: setLinkedinUrl },
          ].map(({ label, value, set, type }) => (
            <TextField key={label} fullWidth label={label} type={type || "text"} value={value} onChange={(e) => set(e.target.value)}
              sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: "12px", color: T.textPrimary, "& fieldset": { borderColor: T.border }, "&:hover fieldset": { borderColor: T.borderHover }, "&.Mui-focused fieldset": { borderColor: T.primary } }, "& .MuiInputLabel-root": { color: T.textSecondary }, "& .MuiInputLabel-root.Mui-focused": { color: T.primary } }}
              InputProps={{ style: { color: T.textPrimary } }}
            />
          ))}
          {error && <Typography sx={{ color: T.danger, fontSize: "0.85rem" }}>{error}</Typography>}
        </DialogContent>
        <DialogActions sx={{ p: 2, background: "#0F1629" }}>
          <Button onClick={() => setEditOpen(false)} sx={{ color: T.textSecondary, textTransform: "none" }}>Cancel</Button>
          <Button onClick={handleUpdate} sx={{ background: T.primary, color: "#fff", borderRadius: "10px", textTransform: "none", fontWeight: 600, "&:hover": { background: T.primaryHover } }}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
