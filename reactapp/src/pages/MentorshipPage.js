import React, { useState, useEffect } from "react";
import { Box, Typography, Chip, CircularProgress, Button, List, ListItem, ListItemText, Divider, Avatar } from "@mui/material";
import { Psychology as MentorIcon, CheckCircle as AcceptIcon, Cancel as RejectIcon } from "@mui/icons-material";
import { motion } from "framer-motion";
import { mentorshipAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AppSidebar from "../components/AppSidebar";
import { T, pageVariants, listVariants, itemVariants } from "../theme";

const getAvatarGradient = (name = "") => {
  const c = ["linear-gradient(135deg,#1e3a8a,#2563EB)", "linear-gradient(135deg,#065f46,#10B981)", "linear-gradient(135deg,#7c2d12,#F5A623)", "linear-gradient(135deg,#4c1d95,#8B5CF6)"];
  return c[(name.charCodeAt(0) || 0) % c.length];
};

const statusStyle = (s) => ({
  PENDING:  { bg: T.warningSoft,  color: T.warning },
  ACCEPTED: { bg: T.successSoft,  color: T.success },
  REJECTED: { bg: T.dangerSoft,   color: T.danger },
}[s] || { bg: "rgba(255,255,255,0.08)", color: T.textSecondary });

export default function MentorshipPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAlumni = user?.userType === "ALUMNI";

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    const call = isAlumni ? mentorshipAPI.getReceived() : mentorshipAPI.getSent();
    call.then((r) => { isAlumni ? setReceived(r.data) : setSent(r.data); })
      .catch(console.error).finally(() => setLoading(false));
  }, [user, navigate, isAlumni]);

  const handleAccept = async (id) => {
    await mentorshipAPI.accept(id);
    setReceived((p) => p.map((r) => r.id === id ? { ...r, status: "ACCEPTED" } : r));
  };
  const handleReject = async (id) => {
    await mentorshipAPI.reject(id);
    setReceived((p) => p.map((r) => r.id === id ? { ...r, status: "REJECTED" } : r));
  };

  if (loading) return (
    <Box sx={{ display: "flex", height: "100vh", background: T.bg }}>
      <AppSidebar />
      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", ml: "72px" }}>
        <CircularProgress sx={{ color: T.primary }} />
      </Box>
    </Box>
  );

  const list = isAlumni ? received : sent;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: T.bg, fontFamily: T.font }}>
      <AppSidebar />
      <Box sx={{ flex: 1, ml: "72px", p: 4, overflowY: "auto" }}>
        <motion.div variants={pageVariants} initial="initial" animate="animate">
          <Box mb={4}>
            <Typography variant="h4" sx={{ color: T.textPrimary, fontWeight: 800, mb: 0.5 }}>Mentorship</Typography>
            <Typography sx={{ color: T.textSecondary, fontSize: "0.9rem" }}>
              {isAlumni ? "Manage mentorship requests from students" : "Track your mentorship requests"}
            </Typography>
          </Box>

          {/* Stats row */}
          <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}>
            {[
              { label: "Total", value: list.length, color: T.primary },
              { label: "Pending", value: list.filter((r) => r.status === "PENDING").length, color: T.warning },
              { label: "Accepted", value: list.filter((r) => r.status === "ACCEPTED").length, color: T.success },
            ].map((s) => (
              <Box key={s.label} sx={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${T.border}`, borderRadius: "12px", px: 3, py: 2, minWidth: 100 }}>
                <Typography sx={{ color: s.color, fontSize: "1.6rem", fontWeight: 800 }}>{s.value}</Typography>
                <Typography sx={{ color: T.textSecondary, fontSize: "0.78rem", fontWeight: 600 }}>{s.label}</Typography>
              </Box>
            ))}
          </Box>

          <Box sx={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)", border: `1px solid ${T.border}`, borderRadius: "16px", overflow: "hidden" }}>
            <Box sx={{ px: 3, py: 2, borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 1 }}>
              <MentorIcon sx={{ color: T.primary, fontSize: 20 }} />
              <Typography sx={{ color: T.textPrimary, fontWeight: 700, fontSize: "0.95rem" }}>
                {isAlumni ? "Requests Received" : "Requests Sent"}
              </Typography>
            </Box>

            {list.length === 0 ? (
              <Box sx={{ p: 4, textAlign: "center" }}>
                <MentorIcon sx={{ color: T.textMuted, fontSize: 40, mb: 1 }} />
                <Typography sx={{ color: T.textMuted, fontSize: "0.9rem" }}>
                  {isAlumni ? "No mentorship requests yet." : "You haven't sent any requests. Visit an alumni profile to request mentorship."}
                </Typography>
              </Box>
            ) : (
              <motion.div variants={listVariants} initial="initial" animate="animate">
                <List disablePadding>
                  {list.map((req, i) => {
                    const person = isAlumni ? req.student : req.alumni;
                    const sc = statusStyle(req.status);
                    return (
                      <motion.div key={req.id} variants={itemVariants}>
                        <ListItem sx={{ px: 3, py: 2, alignItems: "flex-start" }}>
                          <Avatar sx={{ background: getAvatarGradient(person?.firstName), width: 44, height: 44, fontSize: "0.9rem", fontWeight: 700, mr: 2, mt: 0.5 }}>
                            {person?.firstName?.[0]}{person?.lastName?.[0]}
                          </Avatar>
                          <ListItemText
                            primary={
                              <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                                <Typography sx={{ color: T.textPrimary, fontWeight: 700, fontSize: "0.9rem" }}>
                                  {person?.firstName} {person?.lastName}
                                </Typography>
                                <Chip label={req.status} size="small" sx={{ background: sc.bg, color: sc.color, fontWeight: 700, fontSize: "0.68rem" }} />
                              </Box>
                            }
                            secondary={
                              <Typography sx={{ color: T.textSecondary, fontSize: "0.82rem", lineHeight: 1.5 }}>
                                {req.message || "No message provided"}
                              </Typography>
                            }
                          />
                          {isAlumni && req.status === "PENDING" && (
                            <Box display="flex" gap={1} ml={2} mt={0.5}>
                              <Button size="small" startIcon={<AcceptIcon />} onClick={() => handleAccept(req.id)}
                                sx={{ background: T.successSoft, color: T.success, borderRadius: "8px", textTransform: "none", fontWeight: 600, fontSize: "0.75rem", "&:hover": { background: "rgba(16,185,129,0.25)" } }}>
                                Accept
                              </Button>
                              <Button size="small" startIcon={<RejectIcon />} onClick={() => handleReject(req.id)}
                                sx={{ background: T.dangerSoft, color: T.danger, borderRadius: "8px", textTransform: "none", fontWeight: 600, fontSize: "0.75rem", "&:hover": { background: "rgba(239,68,68,0.25)" } }}>
                                Reject
                              </Button>
                            </Box>
                          )}
                        </ListItem>
                        {i < list.length - 1 && <Divider sx={{ borderColor: T.border, mx: 3 }} />}
                      </motion.div>
                    );
                  })}
                </List>
              </motion.div>
            )}
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
}
