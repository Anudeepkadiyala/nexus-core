import { useState, useEffect, useRef } from "react";
import axios from "axios";

import Dashboard from "./pages/Dashboard";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [mode, setMode] = useState("oracle");

  const [windows, setWindows] = useState([]);
  const [activeWindow, setActiveWindow] = useState(null);
  const [minimized, setMinimized] = useState([]);

  const chatEndRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const newChat = [...chat, { role: "user", text: message }];
    setChat(newChat);

    try {
      setChat([
        ...newChat,
        { role: "mia", text: "Processing..." }
      ]);

      const res = await axios.post("http://192.168.29.13:8000/chat", {
        message: message,
        mode: mode,
      });

      const data = res.data;

      // 🔥 HANDLE BOTH TYPES
      if (data.type === "action") {
        setChat([
          ...newChat,
          { role: "mia", text: data.message }
        ]);

        setWindows((prev) => [
          ...prev,
          {
            id: Date.now(),
            ...data.action
          }
        ]); // store action
      } else {
        setChat([
          ...newChat,
          { role: "mia", text: data.message }
        ]);

        // do nothing (we don't clear windows anymore)
      }

    } catch (err) {
      setChat([
        ...newChat,
        { role: "mia", text: "⚠️ Error connecting to MIA" },
      ]);
    }

    setMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <Dashboard
      chat={chat}
      message={message}
      setMessage={setMessage}
      sendMessage={sendMessage}
      handleKeyPress={handleKeyPress}
      mode={mode}
      setMode={setMode}
      chatEndRef={chatEndRef}
      windows={windows}
      setWindows={setWindows}
      activeWindow={activeWindow}        // 🔥 NEW
      setActiveWindow={setActiveWindow}  // 🔥 NEW
      minimized={minimized}              // 🔥 NEW
      setMinimized={setMinimized}        // 🔥 NEW
    />
  );
}

export default App;