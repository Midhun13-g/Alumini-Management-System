import React, { useState, useEffect } from "react";
import {
  Box, Typography, Button, Chip, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
} from "@mui/material";
import { Event as EventIcon, LocationOn as LocationIcon, Add as AddIcon, CheckCircle as CheckIcon } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { eventsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AppSidebar from "../components/AppSidebar";
import { T, pageVariants, cardVariants, listVariants } from "../theme";

export default function EventsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [myRegs, setMyRegs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", dateTime: "", location: "" });

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    Promise.all([eventsAPI.getAll(), eventsAPI.getMy()])
      .then(([e, m]) => { setEvents(e.data); setMyRegs(m.data.map((r) => r.event.id)); })
      .catch(console.error).finally(() => setLoading(false));
  }, [user, navigate]);

  const handleRegister = async (id) => {
    try { await eventsAPI.register(id); setMyRegs((p) => [...p, id]); }
    catch (err) { alert(err.response?.data || "Failed"); }
  };

  const handleCreate = async () => {
    try {
      const res = await eventsAPI.create({ ...form, dateTime: new Date(form.dateTime).toISOString() });
      setEvents((p) => [res.data, ...p]); setCreateOpen(false);
      setForm({ title: "", description: "", dateTime: "", location: "" });
    } catch (err) { alert(err.response?.data || "Failed"); }
  };

  const canCreate = user?.userType === "ALUMNI" || user?.role === "ADMIN";

  if (loading) return (
    <Box sx={{ display: "flex", height: "100vh", background: T.bg }}>
      <AppSidebar />
      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", ml: "72px" }}>
        <CircularProgress sx={{ color: T.primary }} />
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: T.bg, fontFamily: T.font }}>
      <AppSidebar />
      <Box sx={{ flex: 1, ml: "72px", p: 4, overflowY: "auto" }}>
        <motion.div variants={pageVariants} initial="initial" animate="animate">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Box>
              <Typography variant="h4" sx={{ color: T.textPrimary, fontWeight: 800, mb: 0.5 }}>Events</Typography>
              <Typography sx={{ color: T.textSecondary, fontSize: "0.9rem" }}>{events.length} upcoming events</Typography>
            </Box>
            {canCreate && (
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}
                  sx={{ background: T.gradientBlue, color: "#fff", borderRadius: "12px", textTransform: "none", fontWeight: 700, px: 3, py: 1.25, boxShadow: "0 4px 16px rgba(37,99,235,0.35)", "&:hover": { boxShadow: "0 6px 24px rgba(37,99,235,0.5)" } }}>
                  Create Event
                </Button>
              </motion.div>
            )}
          </Box>

          <motion.div variants={listVariants} initial="initial" animate="animate"
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
            <AnimatePresence>
              {events.map((event) => {
                const registered = myRegs.includes(event.id);
                const date = new Date(event.dateTime);
                return (
                  <motion.div key={event.id} variants={cardVariants} whileHover="hover" layout>
                    <Box sx={{
                      background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)",
                      border: `1px solid ${T.border}`, borderRadius: "16px", p: 3,
                      display: "flex", flexDirection: "column", gap: 2, height: "100%",
                      transition: "border-color 0.2s", "&:hover": { borderColor: T.borderHover },
                    }}>
                      {/* Date badge */}
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <Box sx={{ background: "rgba(37,99,235,0.15)", border: "1px solid rgba(37,99,235,0.3)", borderRadius: "10px", px: 1.5, py: 0.75, textAlign: "center", minWidth: 52 }}>
                          <Typography sx={{ color: T.primary, fontSize: "1.2rem", fontWeight: 800, lineHeight: 1 }}>{date.getDate()}</Typography>
                          <Typography sx={{ color: "#93C5FD", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase" }}>{date.toLocaleString("default", { month: "short" })}</Typography>
                        </Box>
                        {registered && <Chip icon={<CheckIcon sx={{ fontSize: "14px !important" }} />} label="Registered" size="small" sx={{ background: T.successSoft, color: T.success, fontWeight: 600, fontSize: "0.72rem" }} />}
                      </Box>

                      <Box flex={1}>
                        <Typography sx={{ color: T.textPrimary, fontWeight: 700, fontSize: "1rem", mb: 1 }}>{event.title}</Typography>
                        <Typography sx={{ color: T.textSecondary, fontSize: "0.85rem", lineHeight: 1.6, mb: 1.5 }}>{event.description}</Typography>
                        {event.location && (
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <LocationIcon sx={{ fontSize: 14, color: T.textMuted }} />
                            <Typography sx={{ color: T.textMuted, fontSize: "0.78rem" }}>{event.location}</Typography>
                          </Box>
                        )}
                      </Box>

                      {!registered && (
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button fullWidth onClick={() => handleRegister(event.id)}
                            sx={{ background: T.gradientBlue, color: "#fff", borderRadius: "10px", textTransform: "none", fontWeight: 700, py: 1, boxShadow: "0 4px 12px rgba(37,99,235,0.3)", "&:hover": { boxShadow: "0 6px 20px rgba(37,99,235,0.5)" } }}>
                            Register Now
                          </Button>
                        </motion.div>
                      )}
                    </Box>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </Box>

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} fullWidth maxWidth="sm"
        PaperProps={{ sx: { background: "#0F1629", border: `1px solid ${T.border}`, borderRadius: "20px" } }}>
        <DialogTitle sx={{ background: T.gradientBlue, color: "#fff", fontWeight: 700 }}>Create Event</DialogTitle>
        <DialogContent sx={{ pt: "20px !important", background: "#0F1629" }}>
          {[
            { label: "Title", key: "title" }, { label: "Description", key: "description", multiline: true, rows: 3 },
            { label: "Date & Time", key: "dateTime", type: "datetime-local" }, { label: "Location", key: "location" },
          ].map(({ label, key, multiline, rows, type }) => (
            <TextField key={key} fullWidth label={label} type={type || "text"} multiline={multiline} rows={rows}
              InputLabelProps={type === "datetime-local" ? { shrink: true } : undefined}
              value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: "12px", color: T.textPrimary, "& fieldset": { borderColor: T.border }, "&.Mui-focused fieldset": { borderColor: T.primary } }, "& .MuiInputLabel-root": { color: T.textSecondary }, "& .MuiInputLabel-root.Mui-focused": { color: T.primary } }}
              InputProps={{ style: { color: T.textPrimary } }}
            />
          ))}
        </DialogContent>
        <DialogActions sx={{ p: 2, background: "#0F1629" }}>
          <Button onClick={() => setCreateOpen(false)} sx={{ color: T.textSecondary, textTransform: "none" }}>Cancel</Button>
          <Button onClick={handleCreate} sx={{ background: T.primary, color: "#fff", borderRadius: "10px", textTransform: "none", fontWeight: 700, "&:hover": { background: T.primaryHover } }}>Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
