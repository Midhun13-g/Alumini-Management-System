import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box, TextField, InputAdornment, Avatar, Button, Grid, Typography,
  List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, IconButton, Fade, styled
} from "@mui/material";
import {
  Search as SearchIcon, Person as PersonIcon, ArrowBack as ArrowBackIcon
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// ⬇️ NEW IMPORT
import MessagePage from "./MessagePage"; 

// --- Styled Components ---
const Container = styled(Box)({ display: "flex", padding: 40, maxWidth: 1200, margin: "0 auto" });
const Sidebar = styled(Box)({
  width: 60,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  borderRight: "1px solid #ccc",
  backgroundColor: "rgba(255,255,255,0.1)",
  borderRadius: 8,
  mr: 3,
});
const MainContent = styled(Box)({ flex: 1 });
const SearchField = styled(TextField)({ width: "100%", mb: 3 });
const ResultItem = styled(ListItem)({
  cursor: "pointer",
  borderRadius: 12,
  mb: 1,
  "&:hover": { backgroundColor: "#f0f0f0" },
});
const ConnectionCard = styled(Box)({
  p: 2,
  mb: 2,
  borderRadius: 12,
  border: "1px solid #ccc",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(false);

  // ⬇️ NEW STATE
  const [selectedConnection, setSelectedConnection] = useState(null);

  // 🔹 Fetch all connections
  const fetchConnections = async () => {
    if (!user) return;
    try {
      const res = await axios.get("http://localhost:8080/api/connect/all", {
        params: { userId: user.id },
        headers: { Authorization: `Bearer ${token}` },
      });
      setConnections(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, [user]);

  // 🔹 Search Alumni
  const handleSearch = async (e) => {
    const q = e.target.value;
    setSearch(q);
    if (q.length < 2) return setResults([]);
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/api/alumni/search", {
        params: { q },
        headers: { Authorization: `Bearer ${token}` },
      });

      let filtered = res.data.filter(a => a.user.id !== user.id);

      const merged = filtered.map(a => {
        const conn = connections.find(c =>
          (c.sender.id === user.id && c.receiver.id === a.user.id) ||
          (c.receiver.id === user.id && c.sender.id === a.user.id)
        );
        return {
          ...a,
          connectionStatus: conn ? conn.status : "NONE",
        };
      });

      setResults(merged);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Open profile dialog
  const openProfile = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/alumni/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedProfile(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Send connect request
  const handleConnect = async (id) => {
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
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return <Typography>Please log in to view alumni network</Typography>;

  // ⬇️ NEW: If a connection is selected → show MessagePage instead
  if (selectedConnection) {
    return (
      <MessagePage
        connection={selectedConnection}
        onBack={() => setSelectedConnection(null)}
        token={token}
        currentUserId={user.userId}
      />
    );
  }

  return (
    <Container>
      {/* --- Left Sidebar --- */}
      <Sidebar>
        <IconButton
          onClick={() => navigate("/profile")}
          sx={{ width: 50, height: 50, borderRadius: "50%", backgroundColor: "#4299e1", color: "#fff" }}
          aria-label="Go to profile"
        >
          <ArrowBackIcon />
        </IconButton>
      </Sidebar>

      {/* --- Main Content --- */}
      <MainContent>
        {/* Search */}
        <SearchField
          placeholder="Search alumni..."
          value={search}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {/* Search Results */}
        {results.length > 0 && (
          <Box mt={2}>
            <Typography variant="h6">Search Results</Typography>
            <Fade in={results.length > 0}>
              <List>
                {results.map((alumni) => (
                  <ResultItem key={alumni.id} onClick={() => openProfile(alumni.id)}>
                    <Avatar sx={{ mr: 2 }}><PersonIcon /></Avatar>
                    <ListItemText
                      primary={`${alumni.user?.firstName} ${alumni.user?.lastName}`}
                      secondary={alumni.industry || "No industry"}
                    />
                    {alumni.connectionStatus === "PENDING" ? (
                      <Button disabled size="small">Pending</Button>
                    ) : alumni.connectionStatus === "ACCEPTED" ? (
                      <Button disabled size="small" color="success">Connected</Button>
                    ) : (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={(e) => { e.stopPropagation(); handleConnect(alumni.user.id); }}
                      >
                        Connect
                      </Button>
                    )}
                  </ResultItem>
                ))}
              </List>
            </Fade>
          </Box>
        )}

        {/* Connections Section */}
        {connections
  .filter(conn => conn.status === "ACCEPTED")
  .map(conn => {
    // determine the "other" user
    const other =
      conn.sender.id === user.userId ? conn.receiver : conn.sender;
console.log("user_id", user.userId, "other_id", other.id, "conn.sender.id", conn.sender.id, "conn.receiver.id", conn.receiver.id)
    return (
      <Grid item xs={12} md={6} key={conn.id}>
        <ConnectionCard>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar sx={{ mr: 2 }}><PersonIcon /></Avatar>
            <Box>
              <Typography variant="h6">
                {other.firstName} {other.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {other.email}
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => setSelectedConnection(conn)}
          >
            Message
          </Button>
        </ConnectionCard>
      </Grid>
    );
  })}


        {/* Profile Dialog */}
        <Dialog open={!!selectedProfile} onClose={() => setSelectedProfile(null)} fullWidth maxWidth="sm">
          <DialogTitle>
            <IconButton onClick={() => setSelectedProfile(null)}><ArrowBackIcon /></IconButton>
            Profile Details
          </DialogTitle>
          <DialogContent>
            {selectedProfile && (
              <>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar sx={{ mr: 2 }}><PersonIcon /></Avatar>
                  <Typography variant="h6">{selectedProfile.user?.firstName} {selectedProfile.user?.lastName}</Typography>
                </Box>
                <Typography>Industry: {selectedProfile.industry || "Not specified"}</Typography>
                <Typography>Skills: {selectedProfile.skills || "Not specified"}</Typography>
                <Typography>Email: {selectedProfile.user?.email || "N/A"}</Typography>
              </>
            )}
          </DialogContent>
        </Dialog>
      </MainContent>
    </Container>
  );
}
