import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Box, Typography, TextField, IconButton, Avatar, CircularProgress } from "@mui/material";
import { ArrowBack as BackIcon, Send as SendIcon } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { T } from "../theme";

const getAvatarGradient = (name = "") => {
  const colors = [
    "linear-gradient(135deg,#1e3a8a,#2563EB)",
    "linear-gradient(135deg,#065f46,#10B981)",
    "linear-gradient(135deg,#7c2d12,#F5A623)",
    "linear-gradient(135deg,#4c1d95,#8B5CF6)",
  ];
  return colors[(name.charCodeAt(0) || 0) % colors.length];
};

export default function MessagePage({ connection, onBack, token, currentUserId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const otherUser = connection.sender.id === currentUserId ? connection.receiver : connection.sender;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!connection || !token) return;
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/messages/${connection.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data);
      } catch (err) { console.error(err); }
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [connection, token]);

  const handleSend = async () => {
    if (!newMessage.trim() || sending) return;
    setSending(true);
    try {
      const res = await axios.post(
        `http://localhost:8080/api/messages/${connection.id}`,
        { senderId: currentUserId, content: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
    } catch (err) { console.error(err); }
    finally { setSending(false); }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", background: T.bg, fontFamily: T.font }}>
      {/* Header */}
      <Box sx={{
        display: "flex", alignItems: "center", gap: 2, px: 3, py: 2,
        background: "rgba(255,255,255,0.03)", borderBottom: `1px solid ${T.border}`,
        backdropFilter: "blur(20px)",
      }}>
        <IconButton onClick={onBack} sx={{ color: T.textSecondary, "&:hover": { color: T.textPrimary, background: "rgba(255,255,255,0.07)" } }}>
          <BackIcon />
        </IconButton>
        <Avatar sx={{ background: getAvatarGradient(otherUser.firstName), width: 40, height: 40, fontSize: "0.9rem", fontWeight: 700 }}>
          {otherUser.firstName?.[0]}{otherUser.lastName?.[0]}
        </Avatar>
        <Box>
          <Typography sx={{ color: T.textPrimary, fontWeight: 700, fontSize: "0.95rem" }}>
            {otherUser.firstName} {otherUser.lastName}
          </Typography>
          <Typography sx={{ color: T.success, fontSize: "0.72rem", fontWeight: 500 }}>● Online</Typography>
        </Box>
      </Box>

      {/* Messages */}
      <Box sx={{ flex: 1, overflowY: "auto", px: 3, py: 2, display: "flex", flexDirection: "column", gap: 1,
        "&::-webkit-scrollbar": { width: 4 },
        "&::-webkit-scrollbar-track": { background: "transparent" },
        "&::-webkit-scrollbar-thumb": { background: "rgba(255,255,255,0.1)", borderRadius: 4 },
      }}>
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isMine = msg.senderId === currentUserId;
            return (
              <motion.div key={msg.id}
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25 }}
                style={{ display: "flex", justifyContent: isMine ? "flex-end" : "flex-start" }}>
                <Box sx={{
                  maxWidth: "68%", px: 2, py: 1.25, borderRadius: isMine ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  background: isMine
                    ? "linear-gradient(135deg, #1D4ED8, #2563EB)"
                    : "rgba(255,255,255,0.07)",
                  border: isMine ? "none" : `1px solid ${T.border}`,
                  boxShadow: isMine ? "0 4px 16px rgba(37,99,235,0.3)" : "none",
                }}>
                  <Typography sx={{ color: "#fff", fontSize: "0.875rem", lineHeight: 1.5 }}>{msg.content}</Typography>
                  <Typography sx={{ color: isMine ? "rgba(255,255,255,0.55)" : T.textMuted, fontSize: "0.68rem", mt: 0.5, textAlign: "right" }}>
                    {msg.sentAt ? new Date(msg.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                  </Typography>
                </Box>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </Box>

      {/* Input */}
      <Box sx={{
        display: "flex", alignItems: "center", gap: 1.5, px: 3, py: 2,
        background: "rgba(255,255,255,0.03)", borderTop: `1px solid ${T.border}`,
      }}>
        <TextField
          fullWidth multiline maxRows={4}
          placeholder="Type a message…"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          InputProps={{
            sx: {
              background: "rgba(255,255,255,0.06)", borderRadius: "14px",
              color: T.textPrimary, fontSize: "0.875rem",
              "& fieldset": { border: `1px solid ${T.border}` },
              "&:hover fieldset": { borderColor: T.borderHover },
              "&.Mui-focused fieldset": { borderColor: T.primary },
            },
          }}
          inputProps={{ style: { color: T.textPrimary, padding: "10px 14px" } }}
        />
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <IconButton onClick={handleSend} disabled={!newMessage.trim() || sending}
            sx={{
              width: 44, height: 44, background: T.primary, color: "#fff", borderRadius: "12px",
              boxShadow: "0 4px 16px rgba(37,99,235,0.4)",
              "&:hover": { background: T.primaryHover },
              "&:disabled": { background: "rgba(255,255,255,0.08)", color: T.textMuted },
            }}>
            {sending ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : <SendIcon sx={{ fontSize: 18 }} />}
          </IconButton>
        </motion.div>
      </Box>
    </Box>
  );
}
