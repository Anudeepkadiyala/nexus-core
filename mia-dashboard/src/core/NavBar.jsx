import { useEffect, useState } from "react";

export default function NavBar({ page, setPage, mode }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const t = new Date().toTimeString().slice(0, 8);
      setTime(t);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: "dash", label: "DASHBOARD" },
    { id: "chat", label: "CHAT" },
    { id: "globe", label: "GLOBE" },
    { id: "memory", label: "MEMORY" },
    { id: "voice", label: "VOICE" },
  ];

  return (
    <div
      style={{
        height: "48px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        borderBottom: "1px solid rgba(0,245,255,0.2)",
        background: "rgba(2,12,20,0.95)",
        backdropFilter: "blur(6px)",
        fontFamily: "Orbitron, monospace",
      }}
    >
      {/* LEFT LOGO */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "#00f5ff",
            boxShadow: "0 0 8px #00f5ff",
            animation: "blink 1.4s infinite",
          }}
        />
        <span
          style={{
            color: "#00f5ff",
            fontWeight: "900",
            letterSpacing: "0.3em",
          }}
        >
          M.I.A
        </span>
      </div>

      {/* CENTER TABS */}
      <div style={{ display: "flex", gap: "6px" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setPage(tab.id)}
            style={{
              padding: "6px 12px",
              fontSize: "10px",
              letterSpacing: "0.15em",
              border: page === tab.id ? "1px solid #00f5ff" : "1px solid transparent",
              background: page === tab.id ? "rgba(0,245,255,0.1)" : "transparent",
              color: page === tab.id ? "#00f5ff" : "#4a7a96",
              cursor: "pointer",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* RIGHT SIDE */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span
          style={{
            border: "1px solid #00f5ff",
            padding: "2px 8px",
            borderRadius: "20px",
            fontSize: "10px",
            color: "#00f5ff",
            background: "rgba(0,245,255,0.1)",
          }}
        >
          ● ONLINE
        </span>

        <span style={{ fontSize: "10px", color: "#4a7a96" }}>
          {time}
        </span>
      </div>

      {/* BLINK ANIMATION */}
      <style>
        {`
          @keyframes blink {
            0%,100% { opacity: 1; }
            50% { opacity: 0.2; }
          }
        `}
      </style>
    </div>
  );
}