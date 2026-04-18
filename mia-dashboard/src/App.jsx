import { useState, useEffect, useRef } from "react";
import axios from "axios";

import Dashboard from "./pages/Dashboard";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [mode, setMode] = useState("oracle");

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

      setChat([
        ...newChat,
        { role: "mia", text: res.data.response },
      ]);
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
    />
  );
}

export default App;