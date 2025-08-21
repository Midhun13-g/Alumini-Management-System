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
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [industry, setIndustry] = useState(""); // Alumni only
  const [skills, setSkills] = useState("");     // Alumni only
  const [department, setDepartment] = useState(""); // Student only
  const [yearOfJoining, setYearOfJoining] = useState(""); // Student only
  const [linkedinUrl, setLinkedinUrl] = useState(""); // Both can use
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentPending, setSentPending] = useState([]);
  const [error, setError] = useState(null);

  // 🔑 attach JWT on every request
  const token = localStorage.getItem("token");
  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // 👇 Dynamic API endpoint depending on user type
  const profileApi =
    user?.userType === "ALUMNI"
      ? "http://localhost:8080/api/alumni/my"
      : "http://localhost:8080/api/student/my";

  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
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
  }, [token, profileApi, user?.userType]); // refresh when userType changes

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

  if (!user || !profile) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Typography variant="h6">Loading profile...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", padding: 4 }}>
      <Box sx={{ flex: 1, maxWidth: 800, margin: "0 auto" }}>
        {/* Profile Info */}
        <Paper sx={{ p: 4, mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <Avatar sx={{ width: 80, height: 80, mr: 3 }}>
              <PersonIcon fontSize="large" />
            </Avatar>
            <Box flex={1}>
              <Typography variant="h5">
                {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="body2">{user.email}</Typography>
            </Box>
            <IconButton onClick={handleEditOpen}>
              <EditIcon />
            </IconButton>
</Box>
            
          </Box>

          {/* Conditional rendering by user type */}
          {user.userType === "ALUMNI" ? (
            <>
              <Typography>
                <strong>Industry:</strong> {profile.industry || "Not specified"}
              </Typography>
              <Typography>
                <strong>Skills:</strong> {profile.skills || "Not specified"}
              </Typography>
              <Typography>
                <strong>LinkedIn:</strong> {profile.linkedinUrl || "Not specified"}
              </Typography>
            </>
          ) : (
            <>
              <Typography>
                <strong>Department:</strong> {profile.department || "Not specified"}
              </Typography>
              <Typography>
                <strong>Year of Joining:</strong> {profile.yearOfJoining || "Not specified"}
              </Typography>
              <Typography>
                <strong>LinkedIn:</strong> {profile.linkedinUrl || "Not specified"}
              </Typography>
            </>
          )}
          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleLogout}
            >
            Logout
          </Button>
        </Paper>

        {/* Received Requests */}
        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Received Requests
          </Typography>
          {receivedRequests.length === 0 ? (
            <Typography>No received requests.</Typography>
          ) : (
            <List>
              {receivedRequests.map((req) => (
                <ListItem
                  key={req.id}
                  secondaryAction={
                    <Box>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={() => handleAcceptRequest(req.id)}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={() => handleRejectRequest(req.id)}
                      >
                        Reject
                      </Button>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={`${req.sender.firstName} ${req.sender.lastName}`}
                    secondary="Pending"
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>

        {/* Sent Pending */}
        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Pending Connections
          </Typography>
          {sentPending.length === 0 ? (
            <Typography>No pending connections.</Typography>
          ) : (
            <List>
              {sentPending.map((req) => (
                <ListItem key={req.id}>
                  <ListItemText
                    primary={`${req.receiver.firstName} ${req.receiver.lastName}`}
                    secondary="Pending"
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleDeletePending(req.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </Paper>

        {/* Edit Dialog */}
        <Dialog open={editOpen} onClose={handleEditClose}>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogContent>
            {user.userType === "ALUMNI" ? (
              <>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Industry"
                  fullWidth
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                />
                <TextField
                  margin="dense"
                  label="Skills"
                  fullWidth
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
                <TextField
                  margin="dense"
                  label="LinkedIn URL"
                  fullWidth
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                />
              </>
            ) : (
              <>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Department"
                  fullWidth
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
                <TextField
                  margin="dense"
                  label="Year of Joining"
                  type="number"
                  fullWidth
                  value={yearOfJoining}
                  onChange={(e) => setYearOfJoining(e.target.value)}
                />
                <TextField
                  margin="dense"
                  label="LinkedIn URL"
                  fullWidth
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose}>Cancel</Button>
            <Button onClick={handleUpdate}>Save</Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* Sidebar */}
      <Box
        sx={{
          width: 80,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <IconButton onClick={() => navigate("/home")}>
          <ArrowBackIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
