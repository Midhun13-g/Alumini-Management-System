import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  styled,
  alpha,
  CircularProgress,
} from "@mui/material";
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowForward as ArrowForwardIcon,
  ConnectWithoutContact as ConnectIcon,
  HourglassEmpty as PendingIcon,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// --- Color Palette (same as HomePage) ---
const colors = {
  primary: "#2a2d32ff",
  primaryLight: "#8594a4ff",
  secondary: "#f5f7faff",
  accent: "#00d4b8ff",
  accentLight: "#e6fffcff",
  success: "#22c55eff",
  warning: "#f59e0bff",
  muted: "#94a3b8ff",
  white: "#ffffff",
  lightGray: "#e2e8f0ff",
  shadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
  shadowHover: "0 6px 24px rgba(0, 0, 0, 0.12)",
};

// --- Styled Components ---
const Container = styled(Box)({
  display: "flex",
  minHeight: "100vh",
  backgroundColor: colors.secondary,
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
  right: 0,
  boxShadow: colors.shadow,
});

const MainContent = styled(Box)({
  flex: 1,
  padding: "32px",
  marginRight: 80,
  overflowY: "auto",
});

const ProfileCard = styled(Paper)({
  padding: "24px",
  marginBottom: "24px",
  borderRadius: 12,
  backgroundColor: colors.white,
  boxShadow: colors.shadow,
  transition: "all 0.2s ease",
  width: "100%", // Full width
  "&:hover": {
    boxShadow: colors.shadowHover,
  },
});

const RequestCard = styled(Paper)({
  padding: "24px",
  borderRadius: 12,
  backgroundColor: colors.white,
  boxShadow: colors.shadow,
  transition: "all 0.2s ease",
  width: "100%", // Full width
  "&:hover": {
    boxShadow: colors.shadowHover,
  },
});

const RequestsContainer = styled(Box)({
  display: "flex",
  gap: "24px",
  flexWrap: "wrap", // Allow wrapping for smaller screens
  "& > *": {
    flex: "1 1 calc(50% - 12px)", // Side-by-side, accounting for gap
    minWidth: 300, // Minimum width for readability
  },
});

const GradientAvatar = styled(Avatar)({
  background: `linear-gradient(45deg, ${colors.primary}, ${colors.primaryLight})`,
  color: colors.white,
  width: 80,
  height: 80,
  marginRight: "16px",
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

const ActionButton = styled(Button)({
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

const RejectButton = styled(Button)({
  borderColor: colors.warning,
  color: colors.warning,
  borderRadius: 16,
  padding: "6px 16px",
  fontSize: "0.85rem",
  fontWeight: 500,
  textTransform: "none",
  fontFamily: "'Inter', 'Poppins', sans-serif",
  "&:hover": {
    backgroundColor: alpha(colors.warning, 0.1),
    borderColor: colors.warning,
  },
});

const LogoutButton = styled(Button)({
  background: colors.primaryLight,
  color: colors.white,
  borderRadius: 16,
  padding: "6px 16px",
  fontSize: "0.85rem",
  fontWeight: 500,
  textTransform: "none",
  fontFamily: "'Inter', 'Poppins', sans-serif",
  "&:hover": {
    backgroundColor: alpha(colors.primaryLight, 0.9),
    boxShadow: colors.shadow,
  },
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

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
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
  marginBottom: "12px",
});

const ListItemStyled = styled(ListItem)({
  borderRadius: 10,
  margin: "6px 0",
  padding: "10px 12px",
  "&:hover": {
    backgroundColor: alpha(colors.accentLight, 0.2),
  },
});

const SectionTitle = styled(Typography)({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontWeight: 600,
  fontSize: "1.1rem",
  fontFamily: "'Inter', 'Poppins', sans-serif",
  marginBottom: "12px",
});

// --- Main Component ---
export default function ProfilePage() {
  const { user } = useAuth();
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
  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const profileApi =
    user?.userType === "ALUMNI"
      ? "http://localhost:8080/api/alumni/my"
      : "http://localhost:8080/api/student/my";

  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get(profileApi, axiosConfig);
        setProfile(res.data);

        if (user.userType === "ALUMNI") {
          setIndustry(res.data.industry || "");
          setSkills(res.data.skills || "");
          setLinkedinUrl(res.data.linkedinUrl || "");
        } else {
          setDepartment(res.data.department || "");
          setYearOfJoining(res.data.yearOfJoining || "");
          setLinkedinUrl(res.data.linkedinUrl || "");
        }
      } catch (err) {
        console.error("Profile fetch failed:", err);
        setError("Failed to fetch profile.");
      } finally {
        setLoading(false);
      }
    };

    const fetchReceivedRequests = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/connect/received/pending",
          axiosConfig
        );
        setReceivedRequests(res.data);
      } catch (err) {
        console.error("Received requests fetch failed:", err);
      }
    };

    const fetchSentPending = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/connect/sent/pending",
          axiosConfig
        );
        setSentPending(res.data);
      } catch (err) {
        console.error("Sent pending fetch failed:", err);
      }
    };

    fetchProfile();
    fetchReceivedRequests();
    fetchSentPending();
  }, [token, profileApi, user?.userType]);

  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);

  const handleUpdate = async () => {
    try {
      const body =
        user.userType === "ALUMNI"
          ? { industry, skills, linkedinUrl }
          : { department, yearOfJoining, linkedinUrl };

      const res = await axios.put(profileApi, body, axiosConfig);
      setProfile(res.data);
      setEditOpen(false);
      setError(null);
    } catch (err) {
      console.error("Update failed:", err);
      setError("Failed to update profile.");
    }
  };

  const handleDeletePending = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/connect/${id}`, axiosConfig);
      setSentPending((prev) => prev.filter((req) => req.id !== id));
    } catch (err) {
      console.error("Delete pending failed:", err);
      setError("Failed to delete pending request.");
    }
  };

  const handleAcceptRequest = async (id) => {
    try {
      await axios.post(
        `http://localhost:8080/api/connect/accept/${id}`,
        {},
        axiosConfig
      );
      setReceivedRequests((prev) => prev.filter((req) => req.id !== id));
      setError(null);
    } catch (err) {
      console.error("Accept request failed:", err);
      setError("Failed to accept request.");
    }
  };

  const handleRejectRequest = async (id) => {
    try {
      await axios.post(
        `http://localhost:8080/api/connect/reject/${id}`,
        {},
        axiosConfig
      );
      setReceivedRequests((prev) => prev.filter((req) => req.id !== id));
    } catch (err) {
      console.error("Reject request failed:", err);
      setError("Failed to reject request.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user || !profile || loading) {
    return (
      <Container>
        <MainContent>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
            <CircularProgress size={32} sx={{ color: colors.accent }} />
          </Box>
        </MainContent>
        <Sidebar>
          <ProfileButton onClick={() => navigate("/home")} aria-label="Go to home">
            <ArrowForwardIcon />
          </ProfileButton>
        </Sidebar>
      </Container>
    );
  }

  return (
    <Container>
      <MainContent>
        <Box sx={{ width: "100%" }}>
          {/* Profile Info */}
          <ProfileCard elevation={0}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0 }}>
                <GradientAvatar>
                  <PersonIcon sx={{ fontSize: 40 }} />
                </GradientAvatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="h5"
                    fontWeight={600}
                    fontFamily="'Inter', 'Poppins', sans-serif"
                    sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                  >
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography
                    variant="body2"
                    color={colors.muted}
                    fontFamily="'Inter', 'Poppins', sans-serif"
                    sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                  >
                    {user.email}
                  </Typography>
                </Box>
                <IconButton onClick={handleEditOpen} sx={{ color: colors.accent }}>
                  <EditIcon />
                </IconButton>
              </Box>
            </Box>
            {user.userType === "ALUMNI" ? (
              <>
                <Typography variant="body1" fontFamily="'Inter', 'Poppins', sans-serif" sx={{ mb: 1 }}>
                  <strong>Industry:</strong> {profile.industry || "Not specified"}
                </Typography>
                <Typography variant="body1" fontFamily="'Inter', 'Poppins', sans-serif" sx={{ mb: 1 }}>
                  <strong>Skills:</strong> {profile.skills || "Not specified"}
                </Typography>
                <Typography variant="body1" fontFamily="'Inter', 'Poppins', sans-serif" sx={{ mb: 1 }}>
                  <strong>LinkedIn:</strong> {profile.linkedinUrl || "Not specified"}
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="body1" fontFamily="'Inter', 'Poppins', sans-serif" sx={{ mb: 1 }}>
                  <strong>Department:</strong> {profile.department || "Not specified"}
                </Typography>
                <Typography variant="body1" fontFamily="'Inter', 'Poppins', sans-serif" sx={{ mb: 1 }}>
                  <strong>Year of Joining:</strong> {profile.yearOfJoining || "Not specified"}
                </Typography>
                <Typography variant="body1" fontFamily="'Inter', 'Poppins', sans-serif" sx={{ mb: 1 }}>
                  <strong>LinkedIn:</strong> {profile.linkedinUrl || "Not specified"}
                </Typography>
              </>
            )}
            {error && (
              <Typography color="error" variant="body2" fontFamily="'Inter', 'Poppins', sans-serif" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
            <LogoutButton sx={{ mt: 2 }} onClick={handleLogout}>
              Logout
            </LogoutButton>
          </ProfileCard>

          {/* Received and Pending Connections Side by Side */}
          <RequestsContainer>
            <RequestCard elevation={0}>
              <SectionTitle variant="h6">
                <ConnectIcon sx={{ color: colors.accent }} />
                Received Requests
              </SectionTitle>
              {receivedRequests.length === 0 ? (
                <Typography variant="body2" color={colors.muted} fontFamily="'Inter', 'Poppins', sans-serif">
                  No received requests.
                </Typography>
              ) : (
                <List>
                  {receivedRequests.map((req) => (
                    <ListItemStyled key={req.id}>
                      <ListItemText
                        primary={`${req.sender.firstName} ${req.sender.lastName}`}
                        secondary="Pending"
                        primaryTypographyProps={{ fontWeight: 600, fontFamily: "'Inter', 'Poppins', sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                        secondaryTypographyProps={{ color: colors.muted, fontFamily: "'Inter', 'Poppins', sans-serif" }}
                      />
                      <ListItemSecondaryAction>
                        <ActionButton
                          size="small"
                          sx={{ mr: 1 }}
                          onClick={() => handleAcceptRequest(req.id)}
                        >
                          Accept
                        </ActionButton>
                        <RejectButton
                          variant="outlined"
                          size="small"
                          onClick={() => handleRejectRequest(req.id)}
                        >
                          Reject
                        </RejectButton>
                      </ListItemSecondaryAction>
                    </ListItemStyled>
                  ))}
                </List>
              )}
            </RequestCard>

            <RequestCard elevation={0}>
              <SectionTitle variant="h6">
                <PendingIcon sx={{ color: colors.accent }} />
                Pending Connections
              </SectionTitle>
              {sentPending.length === 0 ? (
                <Typography variant="body2" color={colors.muted} fontFamily="'Inter', 'Poppins', sans-serif">
                  No pending connections.
                </Typography>
              ) : (
                <List>
                  {sentPending.map((req) => (
                    <ListItemStyled key={req.id}>
                      <ListItemText
                        primary={`${req.receiver.firstName} ${req.receiver.lastName}`}
                        secondary="Pending"
                        primaryTypographyProps={{ fontWeight: 600, fontFamily: "'Inter', 'Poppins', sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                        secondaryTypographyProps={{ color: colors.muted, fontFamily: "'Inter', 'Poppins', sans-serif" }}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => handleDeletePending(req.id)}
                          sx={{ color: colors.warning }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItemStyled>
                  ))}
                </List>
              )}
            </RequestCard>
          </RequestsContainer>
        </Box>
      </MainContent>

      {/* Sidebar */}
      <Sidebar>
        <ProfileButton onClick={() => navigate("/home")} aria-label="Go to home">
          <ArrowForwardIcon />
        </ProfileButton>
      </Sidebar>

      {/* Edit Dialog */}
      <ProfileDialog
        open={editOpen}
        onClose={handleEditClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogHeader>
          <IconButton
            onClick={handleEditClose}
            sx={{ color: colors.white, mr: 1 }}
          >
            <ArrowForwardIcon />
          </IconButton>
          Edit Profile
        </DialogHeader>
        <DialogContent sx={{ p: "24px", background: colors.secondary }}>
          {user.userType === "ALUMNI" ? (
            <>
              <StyledTextField
                autoFocus
                label="Industry"
                fullWidth
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              />
              <StyledTextField
                label="Skills"
                fullWidth
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
              <StyledTextField
                label="LinkedIn URL"
                fullWidth
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
              />
            </>
          ) : (
            <>
              <StyledTextField
                autoFocus
                label="Department"
                fullWidth
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
              <StyledTextField
                label="Year of Joining"
                type="number"
                fullWidth
                value={yearOfJoining}
                onChange={(e) => setYearOfJoining(e.target.value)}
              />
              <StyledTextField
                label="LinkedIn URL"
                fullWidth
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
              />
            </>
          )}
          {error && (
            <Typography color="error" variant="body2" fontFamily="'Inter', 'Poppins', sans-serif" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: "16px 24px" }}>
          <Button
            onClick={handleEditClose}
            sx={{ color: colors.muted, fontFamily: "'Inter', 'Poppins', sans-serif" }}
          >
            Cancel
          </Button>
          <ActionButton onClick={handleUpdate}>
            Save
          </ActionButton>
        </DialogActions>
      </ProfileDialog>
    </Container>
  );
}