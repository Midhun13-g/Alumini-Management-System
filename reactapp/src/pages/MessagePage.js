import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  styled,
  alpha,
} from "@mui/material";
import {
  ArrowForward as ArrowForwardIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";

// --- Color Palette (same as HomePage and ProfilePage, with beige for header) ---
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
  beige: "#f5f5dcff", // Light beige for header
};

// --- Styled Components ---
const Container = styled(Box)({
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  backgroundColor: colors.secondary,
  fontFamily: "'Inter', 'Poppins', sans-serif",
});

const Header = styled(motion.div)({
  display: "flex",
  alignItems: "center",
  background: colors.beige,
  color: colors.primary,
  padding: "12px 16px",
  boxShadow: colors.shadow,
  fontFamily: "'Inter', 'Poppins', sans-serif",
});

const MessageArea = styled(Box)({
  flex: 1,
  overflowY: "auto",
  padding: "16px",
  background: colors.secondary,
});

const MessageBubble = styled(Box)(({ isMine }) => ({
  maxWidth: "70%",
  padding: "8px 12px",
  borderRadius: 12,
  boxShadow: colors.shadow,
  position: "relative",
  background: isMine ? colors.accent : colors.warning,
  color: isMine ? colors.white : colors.primary,
  marginBottom: "12px",
  borderBottomRightRadius: isMine ? 0 : 12,
  borderBottomLeftRadius: isMine ? 12 : 0,
}));

const InputArea = styled(Box)({
  display: "flex",
  alignItems: "center",
  background: colors.white,
  padding: "12px 16px",
  borderTop: `1px solid ${alpha(colors.muted, 0.2)}`,
});

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    borderRadius: 12,
    background: colors.lightGray,
    "& fieldset": {
      border: "none",
    },
    "&:hover": {
      backgroundColor: alpha(colors.lightGray, 0.7),
    },
    "&.Mui-focused": {
      backgroundColor: colors.white,
    },
  },
  "& .MuiInputBase-input": {
    padding: "10px 14px",
    fontFamily: "'Inter', 'Poppins', sans-serif",
    fontWeight: 400,
    color: colors.primary,
  },
  flex: 1,
  marginRight: "12px",
});

const SendButton = styled(Button)({
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

// --- Animation Variants ---
const headerVariants = {
  initial: { y: -50 },
  animate: { y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const messageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

// --- Main Component ---
const MessagePage = ({ connection, onBack, token, currentUserId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch chat history with polling
  useEffect(() => {
    if (!connection || !token) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/messages/${connection.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to load messages:", err.response?.data || err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [connection, token]);

  // Send new message
  const handleSend = async () => {
    if (!newMessage.trim() || !token) return;

    try {
      const res = await axios.post(
        `http://localhost:8080/api/messages/${connection.id}`,
        { senderId: currentUserId, content: newMessage },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message:", err.response?.data || err);
    }
  };

  return (
    <Container>
      {/* Header */}
      <Header variants={headerVariants} initial="initial" animate="animate">
        <IconButton onClick={onBack} sx={{ color: colors.primary, mr: 2 }}>
          <ArrowForwardIcon />
        </IconButton>
        <Typography
          variant="h6"
          fontWeight={600}
          fontFamily="'Inter', 'Poppins', sans-serif'"
          sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
        >
          {connection.sender.id === currentUserId
            ? `${connection.receiver.firstName} ${connection.receiver.lastName}`
            : `${connection.sender.firstName} ${connection.sender.lastName}`}
        </Typography>
      </Header>

      {/* Messages */}
      <MessageArea>
        {messages.map((msg) => {
          const isMine = msg.senderId === currentUserId;
          return (
            <motion.div
              key={msg.id}
              variants={messageVariants}
              initial="initial"
              animate="animate"
              style={{ display: "flex", justifyContent: isMine ? "flex-end" : "flex-start" }}
            >
              <MessageBubble isMine={isMine}>
                <Typography
                  variant="body2"
                  fontFamily="'Inter', 'Poppins', sans-serif'"
                  sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
                >
                  {msg.content}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    position: "absolute",
                    bottom: 4,
                    right: 8,
                    color: isMine ? alpha(colors.white, 0.7) : colors.muted,
                  }}
                  fontFamily="'Inter', 'Poppins', sans-serif'"
                >
                  {msg.createdAt
                    ? new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </Typography>
              </MessageBubble>
            </motion.div>
          );
        })}
        <div ref={messagesEndRef} />
      </MessageArea>

      {/* Input */}
      <InputArea>
        <StyledTextField
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <SendButton onClick={handleSend} startIcon={<SendIcon />}>
          Send
        </SendButton>
      </InputArea>
    </Container>
  );
};

export default MessagePage;