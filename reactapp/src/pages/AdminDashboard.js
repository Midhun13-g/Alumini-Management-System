import React, { useState, useEffect, useMemo } from "react";
import {
  Box, Typography, Button, Chip, CircularProgress, Avatar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, InputAdornment, Tabs, Tab, Snackbar, Alert, Tooltip,
} from "@mui/material";
import {
  VerifiedUser as VerifyIcon, Delete as DeleteIcon,
  People as PeopleIcon, School as SchoolIcon, Person as PersonIcon,
  Link as LinkIcon, Search as SearchIcon, Block as BlockIcon,
  CheckCircle as ActiveIcon, Event as EventIcon, Work as WorkIcon,
  Refresh as RefreshIcon, AdminPanelSettings as AdminIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { adminAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AppSidebar from "../components/AppSidebar";
import { T, pageVariants } from "../theme";

const getAvatarGradient = (name = "") => {
  const c = ["linear-gradient(135deg,#1e3a8a,#2563EB)", "linear-gradient(135deg,#065f46,#10B981)", "linear-gradient(135deg,#7c2d12,#F5A623)", "linear-gradient(135deg,#4c1d95,#8B5CF6)"];
  return c[(name.charCodeAt(0) || 0) % c.length];
};

const cellSx = { borderBottom: `1px solid ${T.border}`, py: 1.5, color: T.textPrimary, fontSize: "0.85rem" };
const headSx = { background: "rgba(255,255,255,0.03)", color: T.textSecondary, fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: `1px solid ${T.border}`, py: 1.5 };

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [toast, setToast] = useState({ open: false, msg: "", severity: "success" });

  const showToast = (msg, severity = "success") => setToast({ open: true, msg, severity });

  const loadAll = async () => {
    setLoading(true);
    try {
      const [s, u, e, j, c] = await Promise.all([
        adminAPI.getStats(), adminAPI.getUsers(),
        adminAPI.getEvents(), adminAPI.getJobs(), adminAPI.getConnections(),
      ]);
      setStats(s.data); setUsers(u.data);
      setEvents(e.data); setJobs(j.data); setConnections(c.data);
    } catch (err) {
      showToast("Failed to load data: " + (err.response?.status === 401 ? "Session expired, please log in again." : err.message), "error");
      if (err.response?.status === 401) { logout(); navigate("/login"); }
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (!user || user.role !== "ADMIN") { navigate("/login"); return; }
    loadAll();
  }, [user]); // eslint-disable-line

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user and all their data? This cannot be undone.")) return;
    try {
      await adminAPI.deleteUser(id);
      setUsers((p) => p.filter((u) => u.id !== id));
      showToast("User deleted successfully.");
    } catch (err) { showToast("Delete failed: " + (err.response?.data || err.message), "error"); }
  };

  const handleToggleActive = async (id, currentActive) => {
    try {
      const res = await adminAPI.toggleUser(id);
      setUsers((p) => p.map((u) => u.id === id ? { ...u, active: res.data.active } : u));
      showToast(`User ${res.data.active ? "activated" : "deactivated"}.`);
    } catch (err) { showToast("Toggle failed: " + (err.response?.data || err.message), "error"); }
  };

  const handleVerify = async (userId) => {
    try {
      await adminAPI.verifyAlumni(userId);
      setUsers((p) => p.map((u) => u.id === userId ? { ...u, _verified: true } : u));
      showToast("Alumni verified.");
    } catch (err) { showToast("Verify failed: " + (err.response?.data || err.message), "error"); }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await adminAPI.deleteEvent(id);
      setEvents((p) => p.filter((e) => e.id !== id));
      showToast("Event deleted.");
    } catch (err) { showToast("Failed: " + (err.response?.data || err.message), "error"); }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm("Delete this job post?")) return;
    try {
      await adminAPI.deleteJob(id);
      setJobs((p) => p.filter((j) => j.id !== id));
      showToast("Job deleted.");
    } catch (err) { showToast("Failed: " + (err.response?.data || err.message), "error"); }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchType = filterType === "ALL" || u.userType === filterType;
      const q = search.toLowerCase();
      const matchSearch = !q || `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(q);
      return matchType && matchSearch;
    });
  }, [users, search, filterType]);

  if (loading) return (
    <Box sx={{ display: "flex", height: "100vh", background: T.bg }}>
      <AppSidebar />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", ml: "72px", gap: 2 }}>
        <CircularProgress sx={{ color: T.primary }} />
        <Typography sx={{ color: T.textSecondary, fontSize: "0.9rem" }}>Loading admin data…</Typography>
      </Box>
    </Box>
  );

  const statCards = [
    { label: "Total Users",   value: stats?.totalUsers,       icon: <PeopleIcon />, color: T.primary,  glow: "rgba(37,99,235,0.3)" },
    { label: "Alumni",        value: stats?.totalAlumni,      icon: <SchoolIcon />, color: T.accent,   glow: "rgba(245,166,35,0.3)" },
    { label: "Students",      value: stats?.totalStudents,    icon: <PersonIcon />, color: T.success,  glow: "rgba(16,185,129,0.3)" },
    { label: "Connections",   value: stats?.totalConnections, icon: <LinkIcon />,   color: "#8B5CF6",  glow: "rgba(139,92,246,0.3)" },
    { label: "Events",        value: stats?.totalEvents,      icon: <EventIcon />,  color: "#EC4899",  glow: "rgba(236,72,153,0.3)" },
    { label: "Job Posts",     value: stats?.totalJobs,        icon: <WorkIcon />,   color: "#F59E0B",  glow: "rgba(245,158,11,0.3)" },
  ];

  const GlassTable = ({ children }) => (
    <Box sx={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)", border: `1px solid ${T.border}`, borderRadius: "16px", overflow: "hidden" }}>
      {children}
    </Box>
  );

  const DelBtn = ({ onClick }) => (
    <Tooltip title="Delete">
      <Button size="small" onClick={onClick} startIcon={<DeleteIcon sx={{ fontSize: "13px !important" }} />}
        sx={{ background: "rgba(239,68,68,0.1)", color: T.danger, borderRadius: "8px", textTransform: "none", fontWeight: 600, fontSize: "0.72rem", minWidth: 0, px: 1.5, "&:hover": { background: "rgba(239,68,68,0.22)" } }}>
        Delete
      </Button>
    </Tooltip>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: T.bg, fontFamily: T.font }}>
      <AppSidebar />
      <Box sx={{ flex: 1, ml: "72px", p: 4, overflowY: "auto", "&::-webkit-scrollbar": { width: 4 }, "&::-webkit-scrollbar-thumb": { background: "rgba(255,255,255,0.1)", borderRadius: 4 } }}>
        <motion.div variants={pageVariants} initial="initial" animate="animate">

          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box sx={{ width: 44, height: 44, borderRadius: "12px", background: T.gradientBlue, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(37,99,235,0.4)" }}>
                <AdminIcon sx={{ color: "#fff", fontSize: 22 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ color: T.textPrimary, fontWeight: 800, lineHeight: 1.1 }}>Admin Dashboard</Typography>
                <Typography sx={{ color: T.textSecondary, fontSize: "0.85rem" }}>Platform management & oversight</Typography>
              </Box>
            </Box>
            <Tooltip title="Refresh data">
              <Button onClick={loadAll} startIcon={<RefreshIcon />}
                sx={{ background: "rgba(255,255,255,0.06)", color: T.textSecondary, borderRadius: "10px", textTransform: "none", fontWeight: 600, border: `1px solid ${T.border}`, "&:hover": { background: "rgba(255,255,255,0.1)", color: T.textPrimary } }}>
                Refresh
              </Button>
            </Tooltip>
          </Box>

          {/* Stats Grid */}
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 2, mb: 4 }}>
            {statCards.map((s) => (
              <motion.div key={s.label} whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.18 }}>
                <Box sx={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)", border: `1px solid ${T.border}`, borderRadius: "14px", p: 2.5, position: "relative", overflow: "hidden", cursor: "default",
                  "&::before": { content: '""', position: "absolute", top: 0, left: 0, right: 0, height: 3, background: s.color, borderRadius: "14px 14px 0 0" } }}>
                  <Box sx={{ color: s.color, mb: 1, filter: `drop-shadow(0 0 6px ${s.glow})` }}>{s.icon}</Box>
                  <Typography sx={{ color: T.textPrimary, fontSize: "1.8rem", fontWeight: 800, lineHeight: 1 }}>{s.value ?? "—"}</Typography>
                  <Typography sx={{ color: T.textSecondary, fontSize: "0.75rem", fontWeight: 600, mt: 0.5 }}>{s.label}</Typography>
                </Box>
              </motion.div>
            ))}
          </Box>

          {/* Tabs */}
          <Tabs value={tab} onChange={(_, v) => { setTab(v); setSearch(""); setFilterType("ALL"); }} sx={{ mb: 3,
            "& .MuiTab-root": { color: T.textSecondary, textTransform: "none", fontWeight: 600, fontSize: "0.875rem" },
            "& .Mui-selected": { color: T.textPrimary },
            "& .MuiTabs-indicator": { background: T.primary, height: 3, borderRadius: 2 },
          }}>
            <Tab label={`Users (${users.length})`} />
            <Tab label={`Events (${events.length})`} />
            <Tab label={`Jobs (${jobs.length})`} />
            <Tab label={`Connections (${connections.length})`} />
          </Tabs>

          <AnimatePresence mode="wait">

            {/* ── USERS TAB ── */}
            {tab === 0 && (
              <motion.div key="users" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {/* Filters */}
                <Box display="flex" gap={2} mb={2} flexWrap="wrap" alignItems="center">
                  <TextField size="small" placeholder="Search by name or email…" value={search} onChange={(e) => setSearch(e.target.value)}
                    InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: T.textMuted, fontSize: 18 }} /></InputAdornment>,
                      sx: { background: "rgba(255,255,255,0.05)", borderRadius: "10px", color: T.textPrimary, "& fieldset": { borderColor: T.border }, "&:hover fieldset": { borderColor: T.borderHover }, "& .Mui-focused fieldset": { borderColor: T.primary } } }}
                    inputProps={{ style: { color: T.textPrimary, padding: "8px 12px" } }}
                    sx={{ minWidth: 280 }}
                  />
                  <Box display="flex" gap={1}>
                    {["ALL", "ALUMNI", "STUDENT", "ADMIN"].map((t) => (
                      <Chip key={t} label={t} onClick={() => setFilterType(t)} size="small"
                        sx={{ cursor: "pointer", fontWeight: 700, fontSize: "0.72rem",
                          background: filterType === t ? T.primary : "rgba(255,255,255,0.06)",
                          color: filterType === t ? "#fff" : T.textSecondary,
                          border: `1px solid ${filterType === t ? T.primary : T.border}`,
                          "&:hover": { background: filterType === t ? T.primaryHover : "rgba(255,255,255,0.1)" } }} />
                    ))}
                  </Box>
                  <Typography sx={{ color: T.textMuted, fontSize: "0.8rem", ml: "auto" }}>
                    {filteredUsers.length} of {users.length} users
                  </Typography>
                </Box>

                <GlassTable>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          {["User", "Email", "Type", "Status", "Actions"].map((h) => (
                            <TableCell key={h} sx={headSx}>{h}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredUsers.map((u) => (
                          <TableRow key={u.id} sx={{ "&:hover": { background: "rgba(255,255,255,0.02)" } }}>
                            <TableCell sx={cellSx}>
                              <Box display="flex" alignItems="center" gap={1.5}>
                                <Avatar sx={{ background: getAvatarGradient(u.firstName), width: 34, height: 34, fontSize: "0.78rem", fontWeight: 700 }}>
                                  {u.firstName?.[0]}{u.lastName?.[0]}
                                </Avatar>
                                <Box>
                                  <Typography sx={{ color: T.textPrimary, fontWeight: 600, fontSize: "0.875rem" }}>{u.firstName} {u.lastName}</Typography>
                                  <Typography sx={{ color: T.textMuted, fontSize: "0.72rem" }}>ID: {u.id}</Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell sx={{ ...cellSx, color: T.textSecondary }}>{u.email}</TableCell>
                            <TableCell sx={cellSx}>
                              <Chip label={u.userType} size="small" sx={{
                                background: u.userType === "ALUMNI" ? "rgba(245,166,35,0.15)" : u.userType === "ADMIN" ? "rgba(139,92,246,0.15)" : "rgba(37,99,235,0.15)",
                                color: u.userType === "ALUMNI" ? T.accent : u.userType === "ADMIN" ? "#A78BFA" : "#93C5FD",
                                fontWeight: 700, fontSize: "0.7rem", border: "1px solid",
                                borderColor: u.userType === "ALUMNI" ? "rgba(245,166,35,0.3)" : u.userType === "ADMIN" ? "rgba(139,92,246,0.3)" : "rgba(37,99,235,0.3)",
                              }} />
                            </TableCell>
                            <TableCell sx={cellSx}>
                              <Chip label={u.active ? "Active" : "Inactive"} size="small"
                                sx={{ background: u.active ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)", color: u.active ? T.success : T.danger, fontWeight: 700, fontSize: "0.7rem", border: `1px solid ${u.active ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}` }} />
                            </TableCell>
                            <TableCell sx={cellSx}>
                              <Box display="flex" gap={0.75} flexWrap="wrap">
                                {u.userType === "ALUMNI" && (
                                  <Tooltip title="Mark as verified">
                                    <Button size="small" onClick={() => handleVerify(u.id)} startIcon={<VerifyIcon sx={{ fontSize: "13px !important" }} />}
                                      sx={{ background: "rgba(16,185,129,0.1)", color: T.success, borderRadius: "8px", textTransform: "none", fontWeight: 600, fontSize: "0.72rem", px: 1.5, "&:hover": { background: "rgba(16,185,129,0.22)" } }}>
                                      Verify
                                    </Button>
                                  </Tooltip>
                                )}
                                {u.userType !== "ADMIN" && (
                                  <Tooltip title={u.active ? "Deactivate user" : "Activate user"}>
                                    <Button size="small" onClick={() => handleToggleActive(u.id, u.active)}
                                      startIcon={u.active ? <BlockIcon sx={{ fontSize: "13px !important" }} /> : <ActiveIcon sx={{ fontSize: "13px !important" }} />}
                                      sx={{ background: u.active ? "rgba(245,158,11,0.1)" : "rgba(16,185,129,0.1)", color: u.active ? T.warning : T.success, borderRadius: "8px", textTransform: "none", fontWeight: 600, fontSize: "0.72rem", px: 1.5, "&:hover": { background: u.active ? "rgba(245,158,11,0.22)" : "rgba(16,185,129,0.22)" } }}>
                                      {u.active ? "Deactivate" : "Activate"}
                                    </Button>
                                  </Tooltip>
                                )}
                                {u.userType !== "ADMIN" && <DelBtn onClick={() => handleDeleteUser(u.id)} />}
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                        {filteredUsers.length === 0 && (
                          <TableRow><TableCell colSpan={5} sx={{ ...cellSx, textAlign: "center", color: T.textMuted, py: 4 }}>No users match your search.</TableCell></TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </GlassTable>
              </motion.div>
            )}

            {/* ── EVENTS TAB ── */}
            {tab === 1 && (
              <motion.div key="events" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <GlassTable>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          {["Title", "Date", "Location", "Created By", "Action"].map((h) => (
                            <TableCell key={h} sx={headSx}>{h}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {events.map((e) => (
                          <TableRow key={e.id} sx={{ "&:hover": { background: "rgba(255,255,255,0.02)" } }}>
                            <TableCell sx={{ ...cellSx, fontWeight: 600 }}>{e.title}</TableCell>
                            <TableCell sx={{ ...cellSx, color: T.textSecondary }}>{new Date(e.dateTime).toLocaleDateString()}</TableCell>
                            <TableCell sx={{ ...cellSx, color: T.textSecondary }}>{e.location || "—"}</TableCell>
                            <TableCell sx={{ ...cellSx, color: T.textSecondary }}>{e.createdBy?.firstName} {e.createdBy?.lastName}</TableCell>
                            <TableCell sx={cellSx}><DelBtn onClick={() => handleDeleteEvent(e.id)} /></TableCell>
                          </TableRow>
                        ))}
                        {events.length === 0 && (
                          <TableRow><TableCell colSpan={5} sx={{ ...cellSx, textAlign: "center", color: T.textMuted, py: 4 }}>No events found.</TableCell></TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </GlassTable>
              </motion.div>
            )}

            {/* ── JOBS TAB ── */}
            {tab === 2 && (
              <motion.div key="jobs" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <GlassTable>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          {["Title", "Company", "Skills", "Posted By", "Action"].map((h) => (
                            <TableCell key={h} sx={headSx}>{h}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {jobs.map((j) => (
                          <TableRow key={j.id} sx={{ "&:hover": { background: "rgba(255,255,255,0.02)" } }}>
                            <TableCell sx={{ ...cellSx, fontWeight: 600 }}>{j.title}</TableCell>
                            <TableCell sx={{ ...cellSx, color: T.textSecondary }}>{j.company}</TableCell>
                            <TableCell sx={cellSx}>
                              <Box display="flex" flexWrap="wrap" gap={0.5}>
                                {j.skillsRequired?.split(",").slice(0, 3).map((s) => (
                                  <Chip key={s} label={s.trim()} size="small" sx={{ background: "rgba(37,99,235,0.12)", color: "#93C5FD", fontSize: "0.65rem", height: 20 }} />
                                ))}
                              </Box>
                            </TableCell>
                            <TableCell sx={{ ...cellSx, color: T.textSecondary }}>{j.postedBy?.firstName} {j.postedBy?.lastName}</TableCell>
                            <TableCell sx={cellSx}><DelBtn onClick={() => handleDeleteJob(j.id)} /></TableCell>
                          </TableRow>
                        ))}
                        {jobs.length === 0 && (
                          <TableRow><TableCell colSpan={5} sx={{ ...cellSx, textAlign: "center", color: T.textMuted, py: 4 }}>No jobs found.</TableCell></TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </GlassTable>
              </motion.div>
            )}

            {/* ── CONNECTIONS TAB ── */}
            {tab === 3 && (
              <motion.div key="connections" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <GlassTable>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          {["From", "To", "Status", "Date"].map((h) => (
                            <TableCell key={h} sx={headSx}>{h}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {connections.map((c) => (
                          <TableRow key={c.id} sx={{ "&:hover": { background: "rgba(255,255,255,0.02)" } }}>
                            <TableCell sx={cellSx}>
                              <Box display="flex" alignItems="center" gap={1}>
                                <Avatar sx={{ background: getAvatarGradient(c.sender?.firstName), width: 28, height: 28, fontSize: "0.7rem", fontWeight: 700 }}>
                                  {c.sender?.firstName?.[0]}{c.sender?.lastName?.[0]}
                                </Avatar>
                                <Typography sx={{ color: T.textPrimary, fontSize: "0.85rem", fontWeight: 600 }}>{c.sender?.firstName} {c.sender?.lastName}</Typography>
                              </Box>
                            </TableCell>
                            <TableCell sx={cellSx}>
                              <Box display="flex" alignItems="center" gap={1}>
                                <Avatar sx={{ background: getAvatarGradient(c.receiver?.firstName), width: 28, height: 28, fontSize: "0.7rem", fontWeight: 700 }}>
                                  {c.receiver?.firstName?.[0]}{c.receiver?.lastName?.[0]}
                                </Avatar>
                                <Typography sx={{ color: T.textPrimary, fontSize: "0.85rem", fontWeight: 600 }}>{c.receiver?.firstName} {c.receiver?.lastName}</Typography>
                              </Box>
                            </TableCell>
                            <TableCell sx={cellSx}>
                              <Chip label={c.status} size="small" sx={{
                                background: c.status === "ACCEPTED" ? "rgba(16,185,129,0.12)" : c.status === "PENDING" ? "rgba(245,158,11,0.12)" : "rgba(239,68,68,0.12)",
                                color: c.status === "ACCEPTED" ? T.success : c.status === "PENDING" ? T.warning : T.danger,
                                fontWeight: 700, fontSize: "0.7rem",
                              }} />
                            </TableCell>
                            <TableCell sx={{ ...cellSx, color: T.textSecondary }}>
                              {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—"}
                            </TableCell>
                          </TableRow>
                        ))}
                        {connections.length === 0 && (
                          <TableRow><TableCell colSpan={4} sx={{ ...cellSx, textAlign: "center", color: T.textMuted, py: 4 }}>No connections found.</TableCell></TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </GlassTable>
              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>
      </Box>

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity={toast.severity} onClose={() => setToast((p) => ({ ...p, open: false }))}
          sx={{ background: toast.severity === "success" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", color: toast.severity === "success" ? T.success : T.danger, border: `1px solid ${toast.severity === "success" ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`, backdropFilter: "blur(20px)" }}>
          {toast.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
