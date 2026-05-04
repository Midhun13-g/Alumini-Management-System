import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Tooltip } from "@mui/material";
import {
  Home as HomeIcon, Person as PersonIcon, Event as EventIcon,
  Work as WorkIcon, Psychology as MentorIcon,
  AdminPanelSettings as AdminIcon, School as LogoIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { T } from "../theme";

export default function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { path: "/home",       icon: <HomeIcon />,    label: "Home" },
    { path: "/profile",    icon: <PersonIcon />,  label: "Profile" },
    { path: "/events",     icon: <EventIcon />,   label: "Events" },
    { path: "/jobs",       icon: <WorkIcon />,    label: "Jobs" },
    { path: "/mentorship", icon: <MentorIcon />,  label: "Mentorship" },
    ...(user?.role === "ADMIN" ? [{ path: "/admin", icon: <AdminIcon />, label: "Admin" }] : []),
  ];

  return (
    <Box sx={{
      width: 72, background: "rgba(255,255,255,0.03)",
      backdropFilter: "blur(20px)",
      borderRight: `1px solid ${T.border}`,
      height: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", pt: 2, pb: 2,
      position: "fixed", top: 0, left: 0, zIndex: 200,
      gap: 0.5,
    }}>
      {/* Logo */}
      <Box sx={{
        width: 44, height: 44, borderRadius: "12px",
        background: T.gradientBlue,
        display: "flex", alignItems: "center", justifyContent: "center",
        mb: 3, boxShadow: "0 4px 16px rgba(37,99,235,0.4)",
      }}>
        <LogoIcon sx={{ color: "#fff", fontSize: 22 }} />
      </Box>

      {navItems.map(({ path, icon, label }) => {
        const active = location.pathname === path;
        return (
          <Tooltip key={path} title={label} placement="right">
            <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
              <Box
                onClick={() => navigate(path)}
                sx={{
                  width: 44, height: 44, borderRadius: "12px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", mb: 0.5,
                  background: active ? T.gradientBlue : "transparent",
                  color: active ? "#fff" : T.textSecondary,
                  boxShadow: active ? "0 4px 16px rgba(37,99,235,0.35)" : "none",
                  border: active ? "none" : `1px solid transparent`,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    background: active ? T.gradientBlue : "rgba(255,255,255,0.07)",
                    color: "#fff",
                    border: `1px solid ${T.border}`,
                  },
                }}
              >
                {React.cloneElement(icon, { sx: { fontSize: 20 } })}
              </Box>
            </motion.div>
          </Tooltip>
        );
      })}
    </Box>
  );
}
