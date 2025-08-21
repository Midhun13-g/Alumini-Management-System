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

// --- Enhanced Color Palette ---
const colors = {
  primary: "#0D6EFD",
  primaryLight: "#5EA8FF",
  secondary: "#F0F4F8",
  accent: "#FFC107",
  accentLight: "#FFF3CD",
  success: "#198754",
  warning: "#FD7E14",
  muted: "#6C757D",
  white: "#FFFFFF",
  lightGray: "#E9ECEF",
  shadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  shadowHover: "0 6px 20px rgba(0, 0, 0, 0.15)",
  gradientBg: "linear-gradient(to bottom, #F0F4F8, #E9ECEF)",
};

// --- Enhanced Styled Components ---
const Container = styled(Box)({
  display: "flex",
  height: "100vh",
  backgroundColor: colors.white,
});

const Sidebar = styled(Box)({
  width: 72,
  background: colors.primary,
  color: colors.white,
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  paddingTop: "16px",
  position: "fixed",
  top: 0,
  left: 0,
  boxShadow: colors.shadow,
});

const MainContent = styled(Box)({
  flex: 1,
  display: "flex",
  marginLeft: 72,
  overflow: "hidden",
});

const ChatList = styled(Box)({
  width: 360,
  background: colors.white,
  borderRight: `1px solid ${alpha(colors.muted, 0.2)}`,
  height: "100vh",
  overflowY: "auto",
  padding: "8px 0",
  position: "relative",
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
  background: colors.gradientBg,
  color: colors.muted,
  textAlign: "center",
  padding: "32px",
  gap: "16px",
});

const SearchField = styled(TextField)({
  width: "calc(100% - 16px)",
  margin: "8px",
  "& .MuiOutlinedInput-root": {
    backgroundColor: colors.white,
    borderRadius: 8,
    "& fieldset": {
      border: `1px solid ${alpha(colors.muted, 0.2)}`,
    },
    "&:hover": {
      backgroundColor: alpha(colors.lightGray, 0.5),
    },
  },
  "& .MuiInputBase-input": {
    padding: "8px 12px",
  },
});

const SearchResultsContainer = styled(motion.div)({
  position: "absolute",
  top: "56px",
  left: "8px",
  right: "8px",
  zIndex: 10,
  backgroundColor: colors.white,
  borderRadius: 8,
  boxShadow: colors.shadowHover,
  maxHeight: "calc(100vh - 100px)",
  overflowY: "auto",
  padding: "8px",
});

const ResultItem = styled(ListItem)({
  cursor: "pointer",
  borderRadius: 8,
  margin: "4px 0",
  backgroundColor: colors.white,
  transition: "background-color 0.2s",
  padding: "8px",
  "&:hover": {
    backgroundColor: alpha(colors.accentLight, 0.2),
  },
});

const ConnectionCard = styled(Box)({
  padding: "8px 12px",
  margin: "4px 8px",
  borderRadius: 8,
  backgroundColor: colors.white,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  transition: "background-color 0.2s",
  "&:hover": {
    backgroundColor: alpha(colors.accentLight, 0.1),
  },
});

const ProfileButton = styled(IconButton)({
  width: 48,
  height: 48,
  borderRadius: "50%",
  backgroundColor: alpha(colors.white, 0.2),
  color: colors.white,
  marginBottom: "8px",
  "&:hover": {
    backgroundColor: alpha(colors.white, 0.3),
  },
});

const ConnectButton = styled(Button)({
  background: colors.accent,
  color: colors.white,
  borderRadius: 20,
  padding: "4px 12px",
  fontSize: "0.8rem",
  textTransform: "none",
  "&:hover": {
    backgroundColor: alpha(colors.accent, 0.9),
  },
});

const MessageButton = styled(Button)({
  background: colors.primaryLight,
  color: colors.white,
  borderRadius: 20,
  padding: "4px 12px",
  fontSize: "0.8rem",
  textTransform: "none",
  "&:hover": {
    backgroundColor: alpha(colors.primaryLight, 0.9),
  },
});

const StatusButton = styled(Button)({
  borderRadius: 12,
  padding: "2px 8px",
  fontSize: "0.7rem",
  textTransform: "none",
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
  margin: "8px",
  padding: "0 8px",
});

const GradientAvatar = styled(Avatar)({
  background: colors.primary,
  color: colors.white,
  marginRight: "8px",
});

const ProfileDialog = styled(Dialog)({
  "& .MuiPaper-root": {
    borderRadius: 16,
  },
  padEnding: "16px",
});

const DialogHeader = styled(DialogTitle)({
  background: colors.primary,
  color: colors.white,
  padding: "8px 16px",
});

const InfoSection = styled(Box)({
  margin: "8px 0",
  padding: "8px 16px",
  borderRadius: 8,
  backgroundColor: alpha(colors.lightGray, 0.1),
});

// --- Animation Variants ---
const sidebarVariants = {
  initial: { x: -72 },
  animate: { x: 0, transition: { duration: 0.3 } },
  exit: { x: -72, transition: { duration: 0.3 } },
};

const chatListVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
};

const welcomeVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.5, type: "spring", stiffness: 120 } },
};

const chatAreaVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

const searchResultsVariants = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3 } },
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

      // Enhanced connection status logic
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
        <Typography variant="h5" color={colors.muted}>
          Please log in to view alumni network
        </Typography>
      </Box>
    );

  // If a connection is selected → show MessagePage instead
  if (selectedConnection) {
    return (
      <Container>
        <motion.div
          variants={sidebarVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <Sidebar>
            {/* <SchoolIcon sx={{ fontSize: 64}} /> */}
            {/* <br></br> */}
            <ProfileButton
              onClick={() => navigate("/profile")}
              aria-label="Go to profile"
            >
              <PersonIcon />
            </ProfileButton>
            {/* <ProfileButton
              onClick={() => navigate("/dashboard")}
              aria-label="Go to dashboard"
            >
              <HomeIcon />
            </ProfileButton> */}
          </Sidebar>
        </motion.div>
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
                            <GradientAvatar sx={{ width: 40, height: 40 }}>
                              <PersonIcon />
                            </GradientAvatar>
                            <ListItemText
                              primary={`${alumni.user?.firstName} ${alumni.user?.lastName}`}
                              secondary={alumni.industry || "Industry not specified"}
                              primaryTypographyProps={{ fontWeight: 600 }}
                              secondaryTypographyProps={{ color: colors.muted }}
                            />
                            {renderConnectionStatus(alumni)}
                          </ResultItem>
                        ))}
                      </List>
                    ) : search.length > 1 && (
                      <Box p={1} textAlign="center">
                        <Typography color={colors.muted} variant="body2">
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
                      <Box display="flex" alignItems="center" flexGrow={1}>
                        <GradientAvatar sx={{ width: 40, height: 40 }}>
                          <PersonIcon />
                        </GradientAvatar>
                        <Box ml={1}>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {other.firstName} {other.lastName}
                          </Typography>
                          <Typography variant="body2" color={colors.muted}>
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
                <Box textAlign="center" p={1}>
                  <Typography color={colors.muted} variant="body2">
                    No connections yet
                  </Typography>
                  <Typography color={colors.muted} variant="body2">
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
      <motion.div
        variants={sidebarVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Sidebar>
          {/* <SchoolIcon sx={{ fontSize: 64 }} /> */}
          {/* <br></br> */}
          {/* <hr></hr> */}
          <ProfileButton
            onClick={() => navigate("/profile")}
            aria-label="Go to profile"
          >
            <PersonIcon />
          </ProfileButton>
          {/* <ProfileButton
            onClick={() => navigate("/dashboard")}
            aria-label="Go to dashboard"
          >
            <HomeIcon />
          </ProfileButton> */}
        </Sidebar>
      </motion.div>
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
                          <GradientAvatar sx={{ width: 40, height: 40 }}>
                            <PersonIcon />
                          </GradientAvatar>
                          <ListItemText
                            primary={`${alumni.user?.firstName} ${alumni.user?.lastName}`}
                            secondary={alumni.industry || "Industry not specified"}
                            primaryTypographyProps={{ fontWeight: 600 }}
                            secondaryTypographyProps={{ color: colors.muted }}
                          />
                          {renderConnectionStatus(alumni)}
                        </ResultItem>
                      ))}
                    </List>
                  ) : search.length > 1 && (
                    <Box p={1} textAlign="center">
                      <Typography color={colors.muted} variant="body2">
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
                    <Box display="flex" alignItems="center" flexGrow={1}>
                      <GradientAvatar sx={{ width: 40, height: 40 }}>
                        <PersonIcon />
                      </GradientAvatar>
                      <Box ml={1}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {other.firstName} {other.lastName}
                        </Typography>
                        <Typography variant="body2" color={colors.muted}>
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
              <Box textAlign="center" p={1}>
                <Typography color={colors.muted} variant="body2">
                  No connections yet
                </Typography>
                <Typography color={colors.muted} variant="body2">
                  Search above to start connecting.
                </Typography>
              </Box>
            )}
          </ChatList>
        </motion.div>
        <WelcomeSection variants={welcomeVariants} initial="initial" animate="animate">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <SchoolIcon sx={{ fontSize: 64, color: colors.primary }} />
          </motion.div>
          <Typography variant="h4" fontWeight={600} color={colors.primary}>
            Welcome to Alumni Connect
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Reconnect with old friends, explore career opportunities, and share your journey.
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, fontStyle: "italic" }}>
            "The network is the net worth – start building yours today!"
          </Typography>
        </WelcomeSection>
      </MainContent>

      {/* Enhanced Profile Dialog from Search */}
      <ProfileDialog
        open={!!selectedProfile}
        onClose={() => setSelectedProfile(null)}
        fullWidth
        maxWidth="sm"
        // padding="16px"
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
        <br></br>
        <DialogContent sx={{ p: 2 }} padding="16px" margin="16px">
          {selectedProfile && (
            <>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <GradientAvatar sx={{ mr: 2, width: 60, height: 60 }}>
                  <PersonIcon />
                </GradientAvatar>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    {selectedProfile.user?.firstName} {selectedProfile.user?.lastName}
                  </Typography>
                  <Typography variant="body2" color={colors.muted}>
                    {selectedProfile.industry || "Industry not specified"}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ mb: 1 }} />
              <InfoSection>
                <Typography variant="subtitle1" fontWeight={600} color={colors.primary}>
                  Bio
                </Typography>
                <Typography variant="body2" color={colors.muted}>
                  {selectedProfile.bio || "No bio provided"}
                </Typography>
              </InfoSection>
              <InfoSection>
                <Typography variant="subtitle1" fontWeight={600} color={colors.primary}>
                  Skills
                </Typography>
                <Typography variant="body2" color={colors.muted}>
                  {selectedProfile.skills || "No skills specified"}
                </Typography>
              </InfoSection>
              <InfoSection>
                <Typography variant="subtitle1" fontWeight={600} color={colors.primary}>
                  Contact
                </Typography>
                <Typography variant="body2" color={colors.muted}>
                  {selectedProfile.user?.email || "Email not available"}
                </Typography>
              </InfoSection>
              {selectedProfile.connectionStatus && (
                <Box sx={{ mt: 1, textAlign: "center" }}>
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
        <DialogContent sx={{ p: 2 }}>
          {connectionProfile && (
            <>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <GradientAvatar sx={{ mr: 2, width: 60, height: 60 }}>
                  <PersonIcon />
                </GradientAvatar>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    {connectionProfile.user?.firstName} {connectionProfile.user?.lastName}
                  </Typography>
                  <Typography variant="body2" color={colors.muted}>
                    {connectionProfile.industry || "Industry not specified"}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ mb: 1 }} />
              <InfoSection>
                <Typography variant="subtitle1" fontWeight={600} color={colors.primary}>
                  Bio
                </Typography>
                <Typography variant="body2" color={colors.muted}>
                  {connectionProfile.bio || "No bio provided"}
                </Typography>
              </InfoSection>
              <InfoSection>
                <Typography variant="subtitle1" fontWeight={600} color={colors.primary}>
                  Skills
                </Typography>
                <Typography variant="body2" color={colors.muted}>
                  {connectionProfile.skills || "No skills specified"}
                </Typography>
              </InfoSection>
              <InfoSection>
                <Typography variant="subtitle1" fontWeight={600} color={colors.primary}>
                  Contact
                </Typography>
                <Typography variant="body2" color={colors.muted}>
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