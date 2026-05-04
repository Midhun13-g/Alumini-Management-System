import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Box, TextField, InputAdornment, Avatar, Button, Typography,
  List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent,
  IconButton, Chip, CircularProgress, Divider, Skeleton,
} from "@mui/material";
import {
  Search as SearchIcon, Person as PersonIcon, ArrowBack as ArrowBackIcon,
  Chat as MessageIcon, School as SchoolIcon, Psychology as MentorIcon,
  Verified as VerifiedIcon, Close as CloseIcon,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import MessagePage from "./MessagePage";
import { motion, AnimatePresence } from "framer-motion";
import { mentorshipAPI } from "../services/api";
import AppSidebar from "../components/AppSidebar";
import { T, glass, pageVariants, listVariants, itemVariants } from "../theme";

const avatarColors = [
  "linear-gradient(135deg,#1e3a8a,#2563EB)",
  "linear-gradient(135deg,#065f46,#10B981)",
  "linear-gradient(135deg,#7c2d12,#F5A623)",
  "linear-gradient(135deg,#4c1d95,#8B5CF6)",
  "linear-gradient(135deg,#831843,#EC4899)",
];
const getAvatarGradient = (name = "") =>
  avatarColors[(name.charCodeAt(0) || 0) % avatarColors.length];

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [connectionProfile, setConnectionProfile] = useState(null);
  const [connLoading, setConnLoading] = useState(true);
  const searchTimerRef = useRef(null);

  const fetchConnections = async () => {
    if (!user) return;
    try {
      const res = await axios.get("http://localhost:8080/api/connect/all", {
        params: { userId: user.userId },
        headers: { Authorization: `Bearer ${token}` },
      });
      setConnections(res.data);
    } catch (err) { console.error(err); }
    finally { setConnLoading(false); }
  };

  useEffect(() => { fetchConnections(); }, [user]); // eslint-disable-line

  const handleSearch = (e) => {
    const q = e.target.value;
    setSearch(q);
    if (!q) { setShowResults(false); setResults([]); return; }
    setShowResults(true);
    if (q.length < 2) return;
    clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:8080/api/alumni/search", {
          params: { q }, headers: { Authorization: `Bearer ${token}` },
        });
        const merged = res.data.filter((a) => a.user.id !== user.userId).map((a) => {
          const conn = connections.find(
            (c) => (c.sender.id === user.userId && c.receiver.id === a.user.id) ||
                   (c.receiver.id === user.userId && c.sender.id === a.user.id)
          );
          return { ...a, connectionStatus: conn?.status || "NONE", connectionId: conn?.id };
        });
        setResults(merged);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }, 400);
  };

  const openProfile = async (alumni) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/alumni/${alumni.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedProfile({ ...res.data, connectionStatus: alumni.connectionStatus, connectionId: alumni.connectionId });
      setShowResults(false);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const openConnectionProfile = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/alumni/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConnectionProfile(res.data);
    } catch (err) { console.error(err); }
  };

  const handleConnect = async (id, e) => {
    e.stopPropagation();
    try {
      await axios.post("http://localhost:8080/api/connect", { receiverId: id },
        { headers: { Authorization: `Bearer ${token}` } });
      await fetchConnections();
      setShowResults(false);
    } catch (err) { console.error(err); }
  };

  const renderConnBtn = (alumni) => {
    const base = { borderRadius: "10px", textTransform: "none", fontWeight: 600, fontSize: "0.78rem", px: 1.5, py: 0.5 };
    if (alumni.connectionStatus === "PENDING")
      return <Chip label="Pending" size="small" sx={{ background: T.warningSoft, color: T.warning, fontWeight: 600, fontSize: "0.72rem" }} />;
    if (alumni.connectionStatus === "ACCEPTED")
      return <Chip label="Connected" size="small" sx={{ background: T.successSoft, color: T.success, fontWeight: 600, fontSize: "0.72rem" }} />;
    return (
      <Button size="small" onClick={(e) => handleConnect(alumni.user.id, e)}
        sx={{ ...base, background: T.primary, color: "#fff", "&:hover": { background: T.primaryHover } }}>
        Connect
      </Button>
    );
  };

  if (!user) return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh" sx={{ background: T.bg }}>
      <Typography color={T.textSecondary}>Please log in.</Typography>
    </Box>
  );

  // Admin has no network page — redirect to dashboard
  if (user.role === "ADMIN") {
    navigate("/admin");
    return null;
  }

  const acceptedConns = connections.filter((c) => c.status === "ACCEPTED");

  const chatListPanel = (
    <Box sx={{
      width: 340, flexShrink: 0,
      background: "rgba(255,255,255,0.02)",
      borderRight: `1px solid ${T.border}`,
      height: "100vh", overflowY: "auto", position: "relative",
      display: "flex", flexDirection: "column",
    }}>
      {/* Search */}
      <Box sx={{ p: 2, borderBottom: `1px solid ${T.border}` }}>
        <TextField
          fullWidth placeholder="Search alumni…"
          value={search} onChange={handleSearch}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          onFocus={() => search.length > 0 && setShowResults(true)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: T.textMuted, fontSize: 18 }} /></InputAdornment>,
            sx: {
              background: "rgba(255,255,255,0.05)", borderRadius: "12px",
              color: T.textPrimary, fontSize: "0.875rem",
              "& fieldset": { border: `1px solid ${T.border}` },
              "&:hover fieldset": { borderColor: T.borderHover },
              "&.Mui-focused fieldset": { borderColor: T.primary },
            },
          }}
          inputProps={{ style: { color: T.textPrimary, padding: "10px 12px" } }}
        />
        {/* Search Results Dropdown */}
        <AnimatePresence>
          {showResults && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              style={{
                position: "absolute", top: 72, left: 12, right: 12, zIndex: 50,
                background: "#131929", border: `1px solid ${T.border}`,
                borderRadius: 14, boxShadow: T.shadow, maxHeight: 360, overflowY: "auto",
              }}>
              {loading ? (
                <Box p={2}><CircularProgress size={20} sx={{ color: T.primary }} /></Box>
              ) : results.length > 0 ? (
                <List disablePadding>
                  {results.map((a) => (
                    <ListItem key={a.id} onClick={() => openProfile(a)}
                      sx={{ cursor: "pointer", py: 1.5, px: 2, "&:hover": { background: "rgba(255,255,255,0.05)" }, borderBottom: `1px solid ${T.border}` }}>
                      <Avatar sx={{ background: getAvatarGradient(a.user?.firstName), width: 36, height: 36, mr: 1.5, fontSize: "0.85rem", fontWeight: 700 }}>
                        {a.user?.firstName?.[0]}{a.user?.lastName?.[0]}
                      </Avatar>
                      <ListItemText
                        primary={`${a.user?.firstName} ${a.user?.lastName}`}
                        secondary={a.industry || "Alumni"}
                        primaryTypographyProps={{ color: T.textPrimary, fontWeight: 600, fontSize: "0.875rem" }}
                        secondaryTypographyProps={{ color: T.textSecondary, fontSize: "0.75rem" }}
                      />
                      {renderConnBtn(a)}
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box p={2}><Typography color={T.textMuted} fontSize="0.85rem">No results for "{search}"</Typography></Box>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Box>

      {/* Network List */}
      <Box sx={{ px: 2, pt: 2, pb: 1 }}>
        <Typography sx={{ color: T.textSecondary, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Your Network · {acceptedConns.length}
        </Typography>
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto" }}>
        {connLoading ? (
          [1,2,3].map((i) => (
            <Box key={i} sx={{ px: 2, py: 1.5, display: "flex", alignItems: "center", gap: 1.5 }}>
              <Skeleton variant="circular" width={40} height={40} sx={{ bgcolor: "rgba(255,255,255,0.06)" }} />
              <Box flex={1}><Skeleton width="60%" height={14} sx={{ bgcolor: "rgba(255,255,255,0.06)" }} /><Skeleton width="40%" height={12} sx={{ bgcolor: "rgba(255,255,255,0.04)", mt: 0.5 }} /></Box>
            </Box>
          ))
        ) : acceptedConns.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <SchoolIcon sx={{ color: T.textMuted, fontSize: 36, mb: 1 }} />
            <Typography color={T.textMuted} fontSize="0.85rem">No connections yet.</Typography>
            <Typography color={T.textMuted} fontSize="0.78rem">Search above to connect.</Typography>
          </Box>
        ) : (
          <motion.div variants={listVariants} initial="initial" animate="animate">
            {acceptedConns.map((conn) => {
              const other = conn.sender.id === user.userId ? conn.receiver : conn.sender;
              const isActive = selectedConnection?.id === conn.id;
              return (
                <motion.div key={conn.id} variants={itemVariants}>
                  <Box
                    onClick={() => setSelectedConnection(conn)}
                    sx={{
                      px: 2, py: 1.5, display: "flex", alignItems: "center", gap: 1.5,
                      cursor: "pointer", transition: "all 0.15s",
                      background: isActive ? "rgba(37,99,235,0.12)" : "transparent",
                      borderLeft: isActive ? `3px solid ${T.primary}` : "3px solid transparent",
                      "&:hover": { background: "rgba(255,255,255,0.04)" },
                    }}
                  >
                    <Avatar sx={{ background: getAvatarGradient(other.firstName), width: 40, height: 40, fontSize: "0.85rem", fontWeight: 700, flexShrink: 0 }}>
                      {other.firstName?.[0]}{other.lastName?.[0]}
                    </Avatar>
                    <Box flex={1} minWidth={0}>
                      <Typography sx={{ color: T.textPrimary, fontWeight: 600, fontSize: "0.875rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {other.firstName} {other.lastName}
                      </Typography>
                      <Typography sx={{ color: T.textSecondary, fontSize: "0.75rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {other.email}
                      </Typography>
                    </Box>
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); setSelectedConnection(conn); }}
                      sx={{ color: T.primary, "&:hover": { background: "rgba(37,99,235,0.15)" } }}>
                      <MessageIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Box>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", height: "100vh", background: T.bg, fontFamily: T.font }}>
      <AppSidebar />
      <Box sx={{ display: "flex", flex: 1, marginLeft: "72px", overflow: "hidden" }}>
        {chatListPanel}

        {/* Main area */}
        <Box sx={{ flex: 1, overflow: "hidden" }}>
          <AnimatePresence mode="wait">
            {selectedConnection ? (
              <motion.div key="chat" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} style={{ height: "100%" }}>
                <MessagePage connection={selectedConnection} onBack={() => setSelectedConnection(null)} token={token} currentUserId={user.userId} />
              </motion.div>
            ) : (
              <motion.div key="welcome" variants={pageVariants} initial="initial" animate="animate"
                style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40 }}>
                <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 120, delay: 0.1 }}>
                  <Box sx={{
                    width: 96, height: 96, borderRadius: "24px", background: T.gradientBlue,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 8px 32px rgba(37,99,235,0.4)", mb: 3,
                  }}>
                    <SchoolIcon sx={{ fontSize: 48, color: "#fff" }} />
                  </Box>
                </motion.div>
                <Typography variant="h3" sx={{ color: T.textPrimary, fontWeight: 800, textAlign: "center", mb: 1.5, letterSpacing: "-0.5px" }}>
                  Alumni Network
                </Typography>
                <Typography sx={{ color: T.textSecondary, textAlign: "center", maxWidth: 480, lineHeight: 1.7, mb: 3 }}>
                  Reconnect with peers, unlock career opportunities, and grow your professional network.
                </Typography>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
                  {[
                    { label: `${acceptedConns.length} Connections`, color: T.primary },
                    { label: "Search Alumni →", color: T.accent },
                  ].map((b) => (
                    <Box key={b.label} sx={{ px: 3, py: 1, borderRadius: "10px", border: `1px solid ${b.color}33`, color: b.color, fontSize: "0.875rem", fontWeight: 600 }}>
                      {b.label}
                    </Box>
                  ))}
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </Box>

      {/* Profile Dialog */}
      <Dialog open={!!selectedProfile} onClose={() => setSelectedProfile(null)} fullWidth maxWidth="sm"
        PaperProps={{ sx: { background: "#0F1629", border: `1px solid ${T.border}`, borderRadius: "20px" } }}>
        <DialogTitle sx={{ background: T.gradientBlue, color: "#fff", display: "flex", alignItems: "center", gap: 1, fontWeight: 700 }}>
          <IconButton onClick={() => setSelectedProfile(null)} sx={{ color: "#fff", mr: 1 }}><ArrowBackIcon /></IconButton>
          Profile Details
        </DialogTitle>
        <DialogContent sx={{ p: 3, background: "#0F1629" }}>
          {selectedProfile && (
            <>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Avatar sx={{ background: getAvatarGradient(selectedProfile.user?.firstName), width: 64, height: 64, fontSize: "1.4rem", fontWeight: 700, mr: 2 }}>
                  {selectedProfile.user?.firstName?.[0]}{selectedProfile.user?.lastName?.[0]}
                </Avatar>
                <Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="h6" sx={{ color: T.textPrimary, fontWeight: 700 }}>
                      {selectedProfile.user?.firstName} {selectedProfile.user?.lastName}
                    </Typography>
                    {selectedProfile.isVerified && <VerifiedIcon sx={{ color: T.primary, fontSize: 18 }} />}
                  </Box>
                  <Typography sx={{ color: T.textSecondary, fontSize: "0.875rem" }}>{selectedProfile.industry}</Typography>
                </Box>
              </Box>
              <Divider sx={{ borderColor: T.border, mb: 2 }} />
              {[
                { label: "Bio", value: selectedProfile.bio || "No bio provided" },
                { label: "Contact", value: selectedProfile.user?.email },
              ].map(({ label, value }) => (
                <Box key={label} sx={{ mb: 2 }}>
                  <Typography sx={{ color: T.textSecondary, fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", mb: 0.5 }}>{label}</Typography>
                  <Typography sx={{ color: T.textPrimary, fontSize: "0.875rem", lineHeight: 1.6 }}>{value}</Typography>
                </Box>
              ))}
              {selectedProfile.skills && (
                <Box sx={{ mb: 2 }}>
                  <Typography sx={{ color: T.textSecondary, fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", mb: 1 }}>Skills</Typography>
                  <Box display="flex" flexWrap="wrap" gap={0.75}>
                    {selectedProfile.skills.split(",").map((s) => (
                      <Chip key={s} label={s.trim()} size="small"
                        sx={{ background: "rgba(37,99,235,0.15)", color: "#93C5FD", border: "1px solid rgba(37,99,235,0.3)", fontSize: "0.75rem" }} />
                    ))}
                  </Box>
                </Box>
              )}
              <Box sx={{ display: "flex", gap: 1.5, mt: 3, flexWrap: "wrap" }}>
                {renderConnBtn(selectedProfile)}
                {user.userType === "STUDENT" && (
                  <Button size="small" startIcon={<MentorIcon />}
                    onClick={async () => {
                      try { await mentorshipAPI.sendRequest(selectedProfile.user.id, ""); alert("Mentorship request sent!"); }
                      catch (err) { alert(err.response?.data || "Request failed"); }
                    }}
                    sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 600, fontSize: "0.78rem", background: "rgba(245,166,35,0.15)", color: T.accent, border: `1px solid rgba(245,166,35,0.3)`, "&:hover": { background: "rgba(245,166,35,0.25)" } }}>
                    Request Mentorship
                  </Button>
                )}
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Connection Profile Dialog */}
      <Dialog open={!!connectionProfile} onClose={() => setConnectionProfile(null)} fullWidth maxWidth="sm"
        PaperProps={{ sx: { background: "#0F1629", border: `1px solid ${T.border}`, borderRadius: "20px" } }}>
        <DialogTitle sx={{ background: T.gradientBlue, color: "#fff", display: "flex", alignItems: "center", gap: 1, fontWeight: 700 }}>
          <IconButton onClick={() => setConnectionProfile(null)} sx={{ color: "#fff", mr: 1 }}><CloseIcon /></IconButton>
          Connection Profile
        </DialogTitle>
        <DialogContent sx={{ p: 3, background: "#0F1629" }}>
          {connectionProfile && (
            <>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Avatar sx={{ background: getAvatarGradient(connectionProfile.user?.firstName), width: 64, height: 64, fontSize: "1.4rem", fontWeight: 700, mr: 2 }}>
                  {connectionProfile.user?.firstName?.[0]}{connectionProfile.user?.lastName?.[0]}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ color: T.textPrimary, fontWeight: 700 }}>
                    {connectionProfile.user?.firstName} {connectionProfile.user?.lastName}
                  </Typography>
                  <Typography sx={{ color: T.textSecondary, fontSize: "0.875rem" }}>{connectionProfile.industry}</Typography>
                </Box>
              </Box>
              <Divider sx={{ borderColor: T.border, mb: 2 }} />
              {connectionProfile.skills && (
                <Box sx={{ mb: 2 }}>
                  <Typography sx={{ color: T.textSecondary, fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", mb: 1 }}>Skills</Typography>
                  <Box display="flex" flexWrap="wrap" gap={0.75}>
                    {connectionProfile.skills.split(",").map((s) => (
                      <Chip key={s} label={s.trim()} size="small"
                        sx={{ background: "rgba(37,99,235,0.15)", color: "#93C5FD", border: "1px solid rgba(37,99,235,0.3)", fontSize: "0.75rem" }} />
                    ))}
                  </Box>
                </Box>
              )}
              <Box sx={{ mb: 1 }}>
                <Typography sx={{ color: T.textSecondary, fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", mb: 0.5 }}>Contact</Typography>
                <Typography sx={{ color: T.textPrimary, fontSize: "0.875rem" }}>{connectionProfile.user?.email}</Typography>
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
