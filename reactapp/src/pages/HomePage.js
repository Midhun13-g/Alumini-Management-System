import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  InputAdornment,
  Avatar,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  styled,
  alpha,
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  Search as SearchIcon,
  Person as PersonIcon,
  ArrowBack as ArrowBackIcon,
  Message as MessageIcon,
  Home as HomeIcon,
  Email as EmailIcon,
  Work as WorkIcon,
  Psychology as SkillsIcon,
  Info as InfoIcon,
  School as SchoolIcon,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import MessagePage from "./MessagePage";
import { motion, AnimatePresence } from "framer-motion";

// --- Updated Color Palette ---
const colors = {
  primary: "#2a2d32ff", // Dark slate for primary elements
  primaryLight: "#8594a4ff", // Light slate for secondary elements
  secondary: "#f5f7faff", // Light neutral for backgrounds
  accent: "#00d4b8ff", // Vibrant teal for highlights
  accentLight: "#e6fffcff", // Light teal for hover states
  success: "#22c55eff", // Green for success states
  warning: "#f59e0bff", // Amber for warnings
  muted: "#94a3b8ff", // Softer slate for secondary text
  white: "#ffffff",
  lightGray: "#e2e8f0ff", // Light gray for subtle backgrounds
  shadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
  shadowHover: "0 6px 24px rgba(0, 0, 0, 0.12)",
  gradientBg: "linear-gradient(180deg, #f5f7faff, #e2e8f0ff)",
  welcomeGradient: "linear-gradient(135deg, rgba(42, 45, 50, 0.7), rgba(133, 148, 164, 0.3))",
};

// --- Modern Styled Components ---
const Container = styled(Box)({
  display: "flex",
  height: "100vh",
  backgroundColor: colors.white,
  fontFamily: "'Inter', 'Poppins', sans-serif",
});

const Sidebar = styled(Box)({
  width: 80,
  background: colors.primary,
  color: colors.white,
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  paddingTop: "24px",
  position: "fixed",
  top: 0,
  left: 0,
  boxShadow: colors.shadow,
  transition: "all 0.3s ease",
});

const MainContent = styled(Box)({
  flex: 1,
  display: "flex",
  marginLeft: 80,
  overflow: "hidden",
  background: colors.secondary,
});

const ChatList = styled(Box)({
  width: 380,
  background: colors.white,
  borderRight: `1px solid ${alpha(colors.muted, 0.15)}`,
  height: "100vh",
  overflowY: "auto",
  padding: "12px 0",
  position: "relative",
  fontFamily: "'Inter', 'Poppins', sans-serif",
});

const ChatArea = styled(motion.div)({
  flex: 1,
  height: "100vh",
  background: colors.gradientBg,
});

const WelcomeSection = styled(motion.div)({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  backgroundImage: `url(/bg2.jpg)`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  color: colors.white,
  padding: "40px",
  gap: "20px",
  position: "relative",
  "&:before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: colors.welcomeGradient,
    zIndex: 1,
  },
  "& > *": {
    position: "relative",
    zIndex: 2,
    textAlign: "left",
    maxWidth: 600,
    width: "100%",
  },
});

const SearchField = styled(TextField)({
  width: "calc(100% - 24px)",
  margin: "12px",
  "& .MuiOutlinedInput-root": {
    backgroundColor: colors.white,
    borderRadius: 12,
    "& fieldset": {
      border: `1px solid ${alpha(colors.muted, 0.2)}`,
    },
    "&:hover": {
      backgroundColor: alpha(colors.lightGray, 0.3),
    },
    "&.Mui-focused": {
      backgroundColor: colors.white,
      "& fieldset": {
        borderColor: colors.accent,
      },
    },
  },
  "& .MuiInputBase-input": {
    padding: "10px 14px",
    fontFamily: "'Inter', 'Poppins', sans-serif",
    fontWeight: 400,
    color: colors.primary,
  },
});

const SearchResultsContainer = styled(motion.div)({
  position: "absolute",
  top: "64px",
  left: "12px",
  right: "12px",
  zIndex: 10,
  backgroundColor: colors.white,
  borderRadius: 12,
  boxShadow: colors.shadowHover,
  maxHeight: "calc(100vh - 120px)",
  overflowY: "auto",
  padding: "12px",
});

const ResultItem = styled(ListItem)({
  cursor: "pointer",
  borderRadius: 10,
  margin: "6px 0",
  backgroundColor: colors.white,
  transition: "all 0.2s ease",
  padding: "10px 12px",
  "&:hover": {
    backgroundColor: alpha(colors.accentLight, 0.2),
    transform: "translateY(-2px)",
  },
});

const ConnectionCard = styled(Box)({
  padding: "10px 14px",
  margin: "6px 12px",
  borderRadius: 10,
  backgroundColor: colors.white,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  transition: "all 0.2s ease",
  boxShadow: colors.shadow,
  "&:hover": {
    backgroundColor: alpha(colors.accentLight, 0.1),
    transform: "translateY(-2px)",
  },
  gap: "12px", // Add spacing between elements
  flexWrap: "nowrap", // Prevent wrapping to keep layout consistent
});

const ProfileButton = styled(IconButton)({
  width: 52,
  height: 52,
  borderRadius: "50%",
  backgroundColor: alpha(colors.white, 0.15),
  color: colors.white,
  marginBottom: "12px",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: alpha(colors.accent, 0.2),
    transform: "scale(1.05)",
  },
});

const ConnectButton = styled(Button)({
  background: colors.accent,
  color: colors.white,
  borderRadius: 16,
  padding: "6px 16px",
  fontSize: "0.85rem",
  fontWeight: 500,
  textTransform: "none",
  fontFamily: "'Inter', 'Poppins', sans-serif",
  "&:hover": {
    backgroundColor: alpha(colors.accent, 0.9),
    boxShadow: colors.shadow,
  },
});

const MessageButton = styled(Button)({
  background: colors.primaryLight,
  color: colors.white,
  borderRadius: 16,
  padding: "6px 16px",
  fontSize: "0.85rem",
  fontWeight: 500,
  textTransform: "none",
  fontFamily: "'Inter', 'Poppins', sans-serif",
  width: "120px", // Fixed width for consistency
  flexShrink: 0, // Prevent shrinking
  "&:hover": {
    backgroundColor: alpha(colors.primaryLight, 0.9),
    boxShadow: colors.shadow,
  },
});

const StatusButton = styled(Button)({
  borderRadius: 12,
  padding: "4px 10px",
  fontSize: "0.75rem",
  fontWeight: 500,
  textTransform: "none",
  fontFamily: "'Inter', 'Poppins', sans-serif",
});

const PendingButton = styled(StatusButton)({
  backgroundColor: alpha(colors.warning, 0.1),
  color: colors.warning,
  "&:hover": {
    backgroundColor: alpha(colors.warning, 0.2),
  },
});

const ConnectedButton = styled(StatusButton)({
  backgroundColor: alpha(colors.success, 0.1),
  color: colors.success,
  "&:hover": {
    backgroundColor: alpha(colors.success, 0.2),
  },
});

const SectionTitle = styled(Typography)({
  color: colors.primary,
  fontWeight: 600,
  fontSize: "1.1rem",
  margin: "12px",
  padding: "0 12px",
  fontFamily: "'Inter', 'Poppins', sans-serif",
});

const GradientAvatar = styled(Avatar)({
  background: `linear-gradient(45deg, ${colors.primary}, ${colors.primaryLight})`,
  color: colors.white,
  marginRight: "10px",
  width: 44,
  height: 44,
});

const ProfileDialog = styled(Dialog)({
  "& .MuiPaper-root": {
    borderRadius: 16,
    backgroundColor: colors.white,
    boxShadow: colors.shadowHover,
  },
});

const DialogHeader = styled(DialogTitle)({
  background: colors.primary,
  color: colors.white,
  padding: "16px 24px",
  display: "flex",
  alignItems: "center",
  fontFamily: "'Inter', 'Poppins', sans-serif",
  fontWeight: 600,
  fontSize: "1.2rem",
});

const InfoSection = styled(Box)({
  margin: "12px 0",
  padding: "12px 20px",
  borderRadius: 10,
  backgroundColor: alpha(colors.lightGray, 0.05),
  transition: "background-color 0.2s ease",
});

// --- Animation Variants ---
const sidebarVariants = {
  initial: { x: -80 },
  animate: { x: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { x: -80, transition: { duration: 0.4, ease: "easeIn" } },
};

const chatListVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const welcomeVariants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.6, type: "spring", stiffness: 100 } },
};

const chatAreaVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const searchResultsVariants = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3, ease: "easeIn" } },
};

// --- Main Component ---
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

  // 🔹 Fetch all connections
  const fetchConnections = async () => {
    if (!user) return;
    try {
      const res = await axios.get("http://localhost:8080/api/connect/all", {
        params: { userId: user.userId },
        headers: { Authorization: `Bearer ${token}` },
      });
      setConnections(res.data);
    } catch (err) {
      console.error("Error fetching connections:", err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, [user]);

  // 🔹 Search Alumni with improved connection status logic
  const handleSearch = async (e) => {
    const q = e.target.value;
    setSearch(q);
    
    if (q.length === 0) {
      setShowResults(false);
      setResults([]);
      return;
    }
    
    setShowResults(true);
    
    if (q.length < 2) return;
    
    setLoading(true);

    try {
      const res = await axios.get("http://localhost:8080/api/alumni/search", {
        params: { q },
        headers: { Authorization: `Bearer ${token}` },
      });

      let filtered = res.data.filter((a) => a.user.id !== user.userId);

      const merged = filtered.map((a) => {
        const conn = connections.find(
          (c) =>
            (c.sender.id === user.userId && c.receiver.id === a.user.id) ||
            (c.receiver.id === user.userId && c.sender.id === a.user.id)
        );
        
        let connectionStatus = "NONE";
        if (conn) {
          connectionStatus = conn.status;
        }
        
        return {
          ...a,
          connectionStatus,
          connectionId: conn?.id,
        };
      });

      setResults(merged);
    } catch (err) {
      console.error("Error searching alumni:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Open profile dialog from search results
  const openProfile = async (alumni) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/alumni/${alumni.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedProfile({
        ...res.data,
        connectionStatus: alumni.connectionStatus,
        connectionId: alumni.connectionId,
      });
      setShowResults(false);
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Open connection profile dialog
  const openConnectionProfile = async (userId) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/alumni/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConnectionProfile(res.data);
    } catch (err) {
      console.error("Error fetching connection profile:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Send connect request
  const handleConnect = async (id, e) => {
    e.stopPropagation();
    try {
      await axios.post(
        "http://localhost:8080/api/connect",
        { receiverId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchConnections();
      if (search.length > 1) {
        handleSearch({ target: { value: search } });
      }
      setShowResults(false);
    } catch (err) {
      console.error("Error sending connect request:", err);
    }
  };

  // 🔹 Handle connection click for messaging
  const handleConnectionClick = (conn) => {
    setSelectedConnection(conn);
  };

  // 🔹 Render connection status button
  const renderConnectionStatus = (alumni) => {
    switch (alumni.connectionStatus) {
      case "PENDING":
        return (
          <PendingButton size="small" disabled>
            Pending
          </PendingButton>
        );
      case "ACCEPTED":
        return (
          <ConnectedButton size="small" disabled>
            Connected
          </ConnectedButton>
        );
      default:
        return (
          <ConnectButton
            size="small"
            onClick={(e) => handleConnect(alumni.user.id, e)}
          >
            Connect
          </ConnectButton>
        );
    }
  };

  // If not logged in
  if (!user)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h5" color={colors.muted} fontFamily="'Inter', 'Poppins', sans-serif">
          Please log in to view alumni network
        </Typography>
      </Box>
    );

  // If a connection is selected → show MessagePage instead
  if (selectedConnection) {
    return (
      <Container>
        {/* <motion.div
          variants={sidebarVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        > */}
          <Sidebar>
            <ProfileButton
              onClick={() => navigate("/profile")}
              aria-label="Go to profile"
            >
              <PersonIcon />
            </ProfileButton>
          </Sidebar>
        {/* </motion.div> */}
        <MainContent>
          <motion.div variants={chatListVariants} initial="initial" animate="animate">
            <ChatList>
              <SearchField
                placeholder="Search alumni..."
                value={search}
                onChange={handleSearch}
                onBlur={() => setTimeout(() => setShowResults(false), 200)}
                onFocus={() => search.length > 0 && setShowResults(true)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: colors.muted }} />
                    </InputAdornment>
                  ),
                }}
              />
              <AnimatePresence>
                {showResults && (
                  <SearchResultsContainer
                    variants={searchResultsVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    {loading ? (
                      <Box display="flex" justifyContent="center" p={1}>
                        <CircularProgress size={24} sx={{ color: colors.accent }} />
                      </Box>
                    ) : results.length > 0 ? (
                      <List disablePadding>
                        {results.map((alumni) => (
                          <ResultItem
                            key={alumni.id}
                            onClick={() => openProfile(alumni)}
                          >
                            <GradientAvatar>
                              <PersonIcon />
                            </GradientAvatar>
                            <ListItemText
                              primary={`${alumni.user?.firstName} ${alumni.user?.lastName}`}
                              secondary={alumni.industry || "Industry not specified"}
                              primaryTypographyProps={{ fontWeight: 600, fontFamily: "'Inter', 'Poppins', sans-serif" }}
                              secondaryTypographyProps={{ color: colors.muted, fontFamily: "'Inter', 'Poppins', sans-serif" }}
                            />
                            {renderConnectionStatus(alumni)}
                          </ResultItem>
                        ))}
                      </List>
                    ) : search.length > 1 && (
                      <Box p={1} textAlign="center">
                        <Typography color={colors.muted} variant="body2" fontFamily="'Inter', 'Poppins', sans-serif">
                          No results found for "{search}"
                        </Typography>
                      </Box>
                    )}
                  </SearchResultsContainer>
                )}
              </AnimatePresence>
              <SectionTitle variant="h6" fontFamily="'Playfair Display', 'Giaza', serif">Your Network</SectionTitle>
              {connections
                .filter((conn) => conn.status === "ACCEPTED")
                .map((conn) => {
                  const other = conn.sender.id === user.userId ? conn.receiver : conn.sender;
                  return (
                    <ConnectionCard
                      key={conn.id}
                      onClick={() => openConnectionProfile(other.id)}
                    >
                      <Box display="flex" alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
                        <GradientAvatar>
                          <PersonIcon />
                        </GradientAvatar>
                        <Box ml={1} sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            fontFamily="'Inter', 'Poppins', sans-serif"
                            sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                          >
                            {other.firstName} {other.lastName}
                          </Typography>
                          <Typography
                            variant="body2"
                            color={colors.muted}
                            fontFamily="'Inter', 'Poppins', sans-serif"
                            sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                          >
                            {other.email}
                          </Typography>
                        </Box>
                      </Box>
                      <MessageButton
                        size="small"
                        startIcon={<MessageIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConnectionClick(conn);
                        }}
                      >
                        Message
                      </MessageButton>
                    </ConnectionCard>
                  );
                })}
              {connections.filter((conn) => conn.status === "ACCEPTED").length === 0 && (
                <Box textAlign="center" p={2}>
                  <Typography color={colors.muted} variant="body2" fontFamily="'Inter', 'Poppins', sans-serif">
                    No connections yet
                  </Typography>
                  <Typography color={colors.muted} variant="body2" fontFamily="'Inter', 'Poppins', sans-serif">
                    Search above to start connecting.
                  </Typography>
                </Box>
              )}
            </ChatList>
          </motion.div>
          <ChatArea variants={chatAreaVariants} initial="initial" animate="animate">
            <MessagePage
              connection={selectedConnection}
              onBack={() => setSelectedConnection(null)}
              token={token}
              currentUserId={user.userId}
            />
          </ChatArea>
        </MainContent>
      </Container>
    );
  }

  return (
    <Container>
      {/* <motion.div
        variants={sidebarVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      > */}
        <Sidebar>
          <ProfileButton
            onClick={() => navigate("/profile")}
            aria-label="Go to profile"
          >
            <PersonIcon />
          </ProfileButton>
        </Sidebar>
      {/* </motion.div> */}
      <MainContent>
        <motion.div variants={chatListVariants} initial="initial" animate="animate">
          <ChatList>
            <SearchField
              placeholder="Search alumni..."
              value={search}
              onChange={handleSearch}
              onBlur={() => setTimeout(() => setShowResults(false), 200)}
              onFocus={() => search.length > 0 && setShowResults(true)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: colors.muted }} />
                  </InputAdornment>
                ),
              }}
            />
            <AnimatePresence>
              {showResults && (
                <SearchResultsContainer
                  variants={searchResultsVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  {loading ? (
                    <Box display="flex" justifyContent="center" p={1}>
                      <CircularProgress size={24} sx={{ color: colors.accent }} />
                    </Box>
                  ) : results.length > 0 ? (
                    <List disablePadding>
                      {results.map((alumni) => (
                        <ResultItem
                          key={alumni.id}
                          onClick={() => openProfile(alumni)}
                        >
                          <GradientAvatar>
                            <PersonIcon />
                          </GradientAvatar>
                          <ListItemText
                            primary={`${alumni.user?.firstName} ${alumni.user?.lastName}`}
                            secondary={alumni.industry || "Industry not specified"}
                            primaryTypographyProps={{ fontWeight: 600, fontFamily: "'Inter', 'Poppins', sans-serif" }}
                            secondaryTypographyProps={{ color: colors.muted, fontFamily: "'Inter', 'Poppins', sans-serif" }}
                          />
                          {renderConnectionStatus(alumni)}
                        </ResultItem>
                      ))}
                    </List>
                  ) : search.length > 1 && (
                    <Box p={1} textAlign="center">
                      <Typography color={colors.muted} variant="body2" fontFamily="'Inter', 'Poppins', sans-serif">
                        No results found for "{search}"
                      </Typography>
                    </Box>
                  )}
                </SearchResultsContainer>
              )}
            </AnimatePresence>
            <SectionTitle variant="h6">Your Network</SectionTitle>
            {connections
              .filter((conn) => conn.status === "ACCEPTED")
              .map((conn) => {
                const other = conn.sender.id === user.userId ? conn.receiver : conn.sender;
                return (
                  <ConnectionCard
                    key={conn.id}
                    onClick={() => openConnectionProfile(other.id)}
                  >
                    <Box display="flex" alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
                      <GradientAvatar>
                        <PersonIcon />
                      </GradientAvatar>
                      <Box ml={1} sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          fontFamily="'Inter', 'Poppins', sans-serif"
                          sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                        >
                          {other.firstName} {other.lastName}
                        </Typography>
                        <Typography
                          variant="body2"
                          color={colors.muted}
                          fontFamily="'Inter', 'Poppins', sans-serif"
                          sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                        >
                          {other.email}
                        </Typography>
                      </Box>
                    </Box>
                    <MessageButton
                      size="small"
                      startIcon={<MessageIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConnectionClick(conn);
                      }}
                    >
                      Message
                    </MessageButton>
                  </ConnectionCard>
                );
              })}
            {connections.filter((conn) => conn.status === "ACCEPTED").length === 0 && (
              <Box textAlign="center" p={2}>
                <Typography color={colors.muted} variant="body2" fontFamily="'Inter', 'Poppins', sans-serif">
                  No connections yet
                </Typography>
                <Typography color={colors.muted} variant="body2" fontFamily="'Inter', 'Poppins', sans-serif">
                  Search above to start connecting.
                </Typography>
              </Box>
            )}
          </ChatList>
        </motion.div>
        <WelcomeSection variants={welcomeVariants} initial="initial" animate="animate">
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
          >
            {/* <SchoolIcon sx={{ fontSize: 72, color: colors.white }} /> */}
          </motion.div>
          <Typography
            variant="h3"
            fontWeight={700}
            color={alpha(colors.white, 0.8)}
            fontFamily="'Playfair Display', 'Giaza', serif"
            sx={{ letterSpacing: "-0.5px", lineHeight: 1.1 }}
          >
            Allur'em
          </Typography>
          <Typography
            variant="h6"
            fontWeight={500}
            color={colors.white}
            fontFamily="'Playfair Display', 'Giaza', serif"
            sx={{ letterSpacing: "-0.25px", lineHeight: 1.2 }}
          >
            Connect with your alumni network
          </Typography>
          <Typography
            variant="body1"
            color={colors.white}
            fontFamily="'Inter', 'Poppins', sans-serif"
            sx={{ lineHeight: 1.4, mb: 1 }}
          >
            Reconnect with peers, unlock career opportunities, and share your story in a vibrant community.
          </Typography>
          <Typography
            variant="body2"
            color={alpha(colors.white, 0.8)}
            fontFamily="'Inter', 'Poppins', sans-serif"
            sx={{ fontStyle: "italic", letterSpacing: "0.5px", lineHeight: 1.3 }}
          >
            "Your network is your strength – build it today."
          </Typography>
        </WelcomeSection>
      </MainContent>

      {/* Enhanced Profile Dialog from Search */}
      <ProfileDialog
        open={!!selectedProfile}
        onClose={() => setSelectedProfile(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogHeader>
          <IconButton
            onClick={() => setSelectedProfile(null)}
            sx={{ color: colors.white, mr: 1 }}
          >
            <ArrowBackIcon />
          </IconButton>
          Profile Details
        </DialogHeader>
        <DialogContent sx={{ p: "24px", background: colors.secondary }}>
          {selectedProfile && (
            <>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <GradientAvatar sx={{ mr: 2, width: 64, height: 64 }}>
                  <PersonIcon sx={{ fontSize: 32 }} />
                </GradientAvatar>
                <Box>
                  <Typography variant="h5" fontWeight={600} fontFamily="'Inter', 'Poppins', sans-serif">
                    {selectedProfile.user?.firstName} {selectedProfile.user?.lastName}
                  </Typography>
                  <Typography variant="body2" color={colors.muted} fontFamily="'Inter', 'Poppins', sans-serif">
                    {selectedProfile.industry || "Industry not specified"}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ mb: 2, borderColor: alpha(colors.muted, 0.2) }} />
              <InfoSection>
                <Typography variant="subtitle1" fontWeight={600} color={colors.primary} fontFamily="'Inter', 'Poppins', sans-serif">
                  Bio
                </Typography>
                <Typography variant="body2" color={colors.muted} fontFamily="'Inter', 'Poppins', sans-serif" sx={{ lineHeight: 1.6 }}>
                  {selectedProfile.bio || "No bio provided"}
                </Typography>
              </InfoSection>
              <InfoSection>
                <Typography variant="subtitle1" fontWeight={600} color={colors.primary} fontFamily="'Inter', 'Poppins', sans-serif">
                  Skills
                </Typography>
                <Typography variant="body2" color={colors.muted} fontFamily="'Inter', 'Poppins', sans-serif" sx={{ lineHeight: 1.6 }}>
                  {selectedProfile.skills || "No skills specified"}
                </Typography>
              </InfoSection>
              <InfoSection>
                <Typography variant="subtitle1" fontWeight={600} color={colors.primary} fontFamily="'Inter', 'Poppins', sans-serif">
                  Contact
                </Typography>
                <Typography variant="body2" color={colors.muted} fontFamily="'Inter', 'Poppins', sans-serif" sx={{ lineHeight: 1.6 }}>
                  {selectedProfile.user?.email || "Email not available"}
                </Typography>
              </InfoSection>
              {selectedProfile.connectionStatus && (
                <Box sx={{ mt: 2, textAlign: "center" }}>
                  {renderConnectionStatus(selectedProfile)}
                </Box>
              )}
            </>
          )}
        </DialogContent>
      </ProfileDialog>

      {/* Enhanced Connection Profile Dialog */}
      <ProfileDialog
        open={!!connectionProfile}
        onClose={() => setConnectionProfile(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogHeader>
          <IconButton
            onClick={() => setConnectionProfile(null)}
            sx={{ color: colors.white, mr: 1 }}
          >
            <ArrowBackIcon />
          </IconButton>
          Connection Details
        </DialogHeader>
        <DialogContent sx={{ p: "24px", background: colors.secondary }}>
          {connectionProfile && (
            <>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <GradientAvatar sx={{ mr: 2, width: 64, height: 64 }}>
                  <PersonIcon sx={{ fontSize: 32 }} />
                </GradientAvatar>
                <Box>
                  <Typography variant="h5" fontWeight={600} fontFamily="'Inter', 'Poppins', sans-serif">
                    {connectionProfile.user?.firstName} {connectionProfile.user?.lastName}
                  </Typography>
                  <Typography variant="body2" color={colors.muted} fontFamily="'Inter', 'Poppins', sans-serif">
                    {connectionProfile.industry || "Industry not specified"}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ mb: 2, borderColor: alpha(colors.muted, 0.2) }} />
              <InfoSection>
                <Typography variant="subtitle1" fontWeight={600} color={colors.primary} fontFamily="'Inter', 'Poppins', sans-serif">
                  Bio
                </Typography>
                <Typography variant="body2" color={colors.muted} fontFamily="'Inter', 'Poppins', sans-serif" sx={{ lineHeight: 1.6 }}>
                  {connectionProfile.bio || "No bio provided"}
                </Typography>
              </InfoSection>
              <InfoSection>
                <Typography variant="subtitle1" fontWeight={600} color={colors.primary} fontFamily="'Inter', 'Poppins', sans-serif">
                  Skills
                </Typography>
                <Typography variant="body2" color={colors.muted} fontFamily="'Inter', 'Poppins', sans-serif" sx={{ lineHeight: 1.6 }}>
                  {connectionProfile.skills || "No skills specified"}
                </Typography>
              </InfoSection>
              <InfoSection>
                <Typography variant="subtitle1" fontWeight={600} color={colors.primary} fontFamily="'Inter', 'Poppins', sans-serif">
                  Contact
                </Typography>
                <Typography variant="body2" color={colors.muted} fontFamily="'Inter', 'Poppins', sans-serif" sx={{ lineHeight: 1.6 }}>
                  {connectionProfile.user?.email || "Email not available"}
                </Typography>
              </InfoSection>
            </>
          )}
        </DialogContent>
      </ProfileDialog>
    </Container>
  );
}