import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

const MessagePage = ({ connection, onBack, token, currentUserId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
console.log("connection", connection.sender.id);
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

    // fetch immediately
    fetchMessages();

    // poll every 2 seconds
    const interval = setInterval(fetchMessages, 2000);

    // cleanup on unmount
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

      // Show sent message instantly
      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message:", err.response?.data || err);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <motion.div
        className="flex items-center bg-green-600 text-white px-4 py-3 shadow-md"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
      >
        <button onClick={onBack} className="mr-3">
          <ArrowLeft size={24} />
        </button>
        {/* console.log("connection", connection.sender.firstName, currentUserId, connection.sender.id, connection.receiver.id); */}
        <h2 className="text-lg font-semibold">
          {connection.sender.id===currentUserId ? connection.receiver.firstName+' '+connection.receiver.lastName: connection.sender.firstName+' '+connection.sender.lastName}{" "}
        </h2>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => {
          const isMine = msg.senderId === currentUserId;
          return (
            <div
              key={msg.id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl shadow-md text-sm relative ${
                  isMine
                    ? "bg-green-500 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none"
                }`}
              >
                <p>{msg.content}</p>
                <span
                  className={`text-xs absolute bottom-1 right-2 ${
                    isMine ? "text-gray-200" : "text-gray-400"
                  }`}
                >
                  {msg.createdAt
                    ? new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex items-center bg-white p-3 border-t">
        <input
          type="text"
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 outline-none"
        />
        <button
          onClick={handleSend}
          className="ml-3 bg-green-600 text-white px-4 py-2 rounded-full shadow-md"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MessagePage;
