import React, { useState, useEffect } from "react";
import {
  Box, Typography, Button, Chip, CircularProgress, Tabs, Tab,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, List, ListItem, ListItemText, Divider,
} from "@mui/material";
import { Work as WorkIcon, Business as BizIcon, Add as AddIcon, Send as ApplyIcon } from "@mui/icons-material";
import { motion } from "framer-motion";
import { jobsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AppSidebar from "../components/AppSidebar";
import { T, pageVariants, cardVariants, listVariants } from "../theme";

export default function JobsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const [applyOpen, setApplyOpen] = useState(null);
  const [resumeLink, setResumeLink] = useState("");
  const [form, setForm] = useState({ title: "", company: "", description: "", skillsRequired: "" });

  const isAlumni = user?.userType === "ALUMNI";
  const isStudent = user?.userType === "STUDENT";

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    const calls = [jobsAPI.getAll()];
    if (isAlumni) calls.push(jobsAPI.getMy(), jobsAPI.getApplications());
    Promise.all(calls).then(([all, my, apps]) => {
      setJobs(all.data);
      if (my) setMyJobs(my.data);
      if (apps) setApplications(apps.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, [user, navigate, isAlumni]);

  const handleCreate = async () => {
    try {
      const res = await jobsAPI.create(form);
      setMyJobs((p) => [res.data, ...p]); setJobs((p) => [res.data, ...p]);
      setCreateOpen(false); setForm({ title: "", company: "", description: "", skillsRequired: "" });
    } catch (err) { alert(err.response?.data || "Failed"); }
  };

  const handleApply = async () => {
    try { await jobsAPI.apply(applyOpen, resumeLink); setApplyOpen(null); setResumeLink(""); alert("Application submitted!"); }
    catch (err) { alert(err.response?.data || "Failed"); }
  };

  if (loading) return (
    <Box sx={{ display: "flex", height: "100vh", background: T.bg }}>
      <AppSidebar />
      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", ml: "72px" }}>
        <CircularProgress sx={{ color: T.primary }} />
      </Box>
    </Box>
  );

  const JobCard = ({ job }) => (
    <motion.div variants={cardVariants} whileHover="hover">
      <Box sx={{
        background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)",
        border: `1px solid ${T.border}`, borderRadius: "16px", p: 3,
        display: "flex", flexDirection: "column", gap: 2, height: "100%",
        transition: "border-color 0.2s", "&:hover": { borderColor: T.borderHover },
      }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box sx={{ width: 44, height: 44, borderRadius: "10px", background: "rgba(37,99,235,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <WorkIcon sx={{ color: T.primary, fontSize: 22 }} />
          </Box>
          <Chip label="Hiring" size="small" sx={{ background: T.successSoft, color: T.success, fontWeight: 600, fontSize: "0.7rem" }} />
        </Box>
        <Box flex={1}>
          <Typography sx={{ color: T.textPrimary, fontWeight: 700, fontSize: "1rem", mb: 0.5 }}>{job.title}</Typography>
          <Box display="flex" alignItems="center" gap={0.5} mb={1.5}>
            <BizIcon sx={{ fontSize: 14, color: T.textMuted }} />
            <Typography sx={{ color: T.textSecondary, fontSize: "0.85rem" }}>{job.company}</Typography>
          </Box>
          <Typography sx={{ color: T.textSecondary, fontSize: "0.82rem", lineHeight: 1.6, mb: 1.5 }}>{job.description}</Typography>
          {job.skillsRequired && (
            <Box display="flex" flexWrap="wrap" gap={0.5}>
              {job.skillsRequired.split(",").map((s) => (
                <Chip key={s} label={s.trim()} size="small"
                  sx={{ background: "rgba(37,99,235,0.12)", color: "#93C5FD", border: "1px solid rgba(37,99,235,0.25)", fontSize: "0.7rem" }} />
              ))}
            </Box>
          )}
        </Box>
        {isStudent && (
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button fullWidth startIcon={<ApplyIcon />} onClick={() => setApplyOpen(job.id)}
              sx={{ background: T.gradientBlue, color: "#fff", borderRadius: "10px", textTransform: "none", fontWeight: 700, py: 1, boxShadow: "0 4px 12px rgba(37,99,235,0.3)" }}>
              Apply Now
            </Button>
          </motion.div>
        )}
      </Box>
    </motion.div>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: T.bg, fontFamily: T.font }}>
      <AppSidebar />
      <Box sx={{ flex: 1, ml: "72px", p: 4, overflowY: "auto" }}>
        <motion.div variants={pageVariants} initial="initial" animate="animate">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Box>
              <Typography variant="h4" sx={{ color: T.textPrimary, fontWeight: 800, mb: 0.5 }}>Jobs & Referrals</Typography>
              <Typography sx={{ color: T.textSecondary, fontSize: "0.9rem" }}>{jobs.length} open positions</Typography>
            </Box>
            {isAlumni && (
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}
                  sx={{ background: T.gradientBlue, color: "#fff", borderRadius: "12px", textTransform: "none", fontWeight: 700, px: 3, py: 1.25, boxShadow: "0 4px 16px rgba(37,99,235,0.35)" }}>
                  Post Job
                </Button>
              </motion.div>
            )}
          </Box>

          {isAlumni && (
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3, "& .MuiTab-root": { color: T.textSecondary, textTransform: "none", fontWeight: 600 }, "& .Mui-selected": { color: T.textPrimary }, "& .MuiTabs-indicator": { background: T.primary } }}>
              <Tab label="All Jobs" />
              <Tab label={`My Postings (${myJobs.length})`} />
              <Tab label={`Applications (${applications.length})`} />
            </Tabs>
          )}

          {(tab === 0 || isStudent) && (
            <motion.div variants={listVariants} initial="initial" animate="animate"
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
              {jobs.map((job) => <JobCard key={job.id} job={job} />)}
              {jobs.length === 0 && <Typography sx={{ color: T.textMuted }}>No jobs posted yet.</Typography>}
            </motion.div>
          )}

          {tab === 1 && isAlumni && (
            <motion.div variants={listVariants} initial="initial" animate="animate"
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
              {myJobs.map((job) => <JobCard key={job.id} job={job} />)}
              {myJobs.length === 0 && <Typography sx={{ color: T.textMuted }}>No jobs posted yet.</Typography>}
            </motion.div>
          )}

          {tab === 2 && isAlumni && (
            <Box sx={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${T.border}`, borderRadius: "16px", overflow: "hidden" }}>
              <List disablePadding>
                {applications.map((app, i) => (
                  <React.Fragment key={app.id}>
                    <ListItem sx={{ py: 2, px: 3 }}>
                      <ListItemText
                        primary={`${app.student.firstName} ${app.student.lastName}`}
                        secondary={`${app.job.title} @ ${app.job.company}${app.resumeLink ? " · " + app.resumeLink : ""}`}
                        primaryTypographyProps={{ color: T.textPrimary, fontWeight: 600, fontSize: "0.9rem" }}
                        secondaryTypographyProps={{ color: T.textSecondary, fontSize: "0.8rem" }}
                      />
                      <Chip label={app.status} size="small" sx={{ background: T.warningSoft, color: T.warning, fontWeight: 600 }} />
                    </ListItem>
                    {i < applications.length - 1 && <Divider sx={{ borderColor: T.border }} />}
                  </React.Fragment>
                ))}
                {applications.length === 0 && (
                  <ListItem><ListItemText primary="No applications yet." primaryTypographyProps={{ color: T.textMuted }} /></ListItem>
                )}
              </List>
            </Box>
          )}
        </motion.div>
      </Box>

      {/* Create Dialog */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} fullWidth maxWidth="sm"
        PaperProps={{ sx: { background: "#0F1629", border: `1px solid ${T.border}`, borderRadius: "20px" } }}>
        <DialogTitle sx={{ background: T.gradientBlue, color: "#fff", fontWeight: 700 }}>Post a Job</DialogTitle>
        <DialogContent sx={{ pt: "20px !important", background: "#0F1629" }}>
          {[{ label: "Job Title", key: "title" }, { label: "Company", key: "company" }, { label: "Description", key: "description", multiline: true, rows: 3 }, { label: "Skills Required (comma-separated)", key: "skillsRequired" }].map(({ label, key, multiline, rows }) => (
            <TextField key={key} fullWidth label={label} multiline={multiline} rows={rows} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: "12px", "& fieldset": { borderColor: T.border }, "&.Mui-focused fieldset": { borderColor: T.primary } }, "& .MuiInputLabel-root": { color: T.textSecondary }, "& .MuiInputLabel-root.Mui-focused": { color: T.primary } }}
              InputProps={{ style: { color: T.textPrimary } }}
            />
          ))}
        </DialogContent>
        <DialogActions sx={{ p: 2, background: "#0F1629" }}>
          <Button onClick={() => setCreateOpen(false)} sx={{ color: T.textSecondary, textTransform: "none" }}>Cancel</Button>
          <Button onClick={handleCreate} sx={{ background: T.primary, color: "#fff", borderRadius: "10px", textTransform: "none", fontWeight: 700, "&:hover": { background: T.primaryHover } }}>Post</Button>
        </DialogActions>
      </Dialog>

      {/* Apply Dialog */}
      <Dialog open={!!applyOpen} onClose={() => setApplyOpen(null)} fullWidth maxWidth="xs"
        PaperProps={{ sx: { background: "#0F1629", border: `1px solid ${T.border}`, borderRadius: "20px" } }}>
        <DialogTitle sx={{ background: T.gradientBlue, color: "#fff", fontWeight: 700 }}>Apply for Job</DialogTitle>
        <DialogContent sx={{ pt: "20px !important", background: "#0F1629" }}>
          <TextField fullWidth label="Resume Link (optional)" value={resumeLink} onChange={(e) => setResumeLink(e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", "& fieldset": { borderColor: T.border }, "&.Mui-focused fieldset": { borderColor: T.primary } }, "& .MuiInputLabel-root": { color: T.textSecondary } }}
            InputProps={{ style: { color: T.textPrimary } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, background: "#0F1629" }}>
          <Button onClick={() => setApplyOpen(null)} sx={{ color: T.textSecondary, textTransform: "none" }}>Cancel</Button>
          <Button onClick={handleApply} sx={{ background: T.primary, color: "#fff", borderRadius: "10px", textTransform: "none", fontWeight: 700, "&:hover": { background: T.primaryHover } }}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
