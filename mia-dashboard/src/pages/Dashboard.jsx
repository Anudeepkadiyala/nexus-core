import { useEffect, useState } from "react";

export default function Dashboard() {
  const [latency, setLatency] = useState(138);
  const [memory, setMemory] = useState(64);
  const [session, setSession] = useState(0);

  // Session timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSession((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Simulated live metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(120 + Math.floor(Math.random() * 40));
      setMemory(60 + Math.floor(Math.random() * 10));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = () => {
    const m = String(Math.floor(session / 60)).padStart(2, "0");
    const s = String(session % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const cardStyle = {
    background: "#041525",
    border: "1px solid rgba(0,245,255,0.2)",
    padding: "12px",
    borderRadius: "4px",
    position: "relative",
  };

  const labelStyle = {
    fontSize: "10px",
    color: "#4a7a96",
    fontFamily: "Orbitron",
    marginBottom: "6px",
  };

  const valueStyle = {
    fontSize: "22px",
    color: "#00f5ff",
    fontFamily: "Orbitron",
    textShadow: "0 0 10px rgba(0,245,255,0.5)",
  };

  return (
    <div
      style={{
        padding: "14px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "10px",
        color: "#cce8f4",
      }}
    >
      {/* 🔥 TOP METRICS */}

      <div style={cardStyle}>
        <div style={labelStyle}>// NEURAL CORE</div>
        <div style={valueStyle}>98%</div>
        <div style={{ fontSize: "12px", color: "#4a7a96" }}>
          Fully operational
        </div>
      </div>

      <div style={cardStyle}>
        <div style={labelStyle}>// MEMORY USAGE</div>
        <div style={valueStyle}>{memory}%</div>
        <div style={{ fontSize: "12px", color: "#4a7a96" }}>
          847 entries indexed
        </div>
      </div>

      <div style={cardStyle}>
        <div style={labelStyle}>// UPLINK LATENCY</div>
        <div style={valueStyle}>{latency}ms</div>
        <div style={{ fontSize: "12px", color: "#4a7a96" }}>
          OpenAI bridge stable
        </div>
      </div>

      {/* 🔥 STATUS ROW */}

      <div style={cardStyle}>
        <div style={labelStyle}>// ACTIVE MODE</div>
        <div style={{ ...valueStyle, fontSize: "16px" }}>ORACLE</div>
      </div>

      <div style={cardStyle}>
        <div style={labelStyle}>// SERVER</div>
        <div style={{ ...valueStyle, fontSize: "16px" }}>ONLINE</div>
      </div>

      <div style={cardStyle}>
        <div style={labelStyle}>// SESSION TIME</div>
        <div style={{ ...valueStyle, fontSize: "16px" }}>
          {formatTime()}
        </div>
      </div>

      {/* 🔥 ACTIVITY LOG */}

      <div
        style={{
          ...cardStyle,
          gridColumn: "1 / -1",
        }}
      >
        <div style={labelStyle}>// RECENT ACTIVITY</div>

        {[
          "System boot complete",
          "OpenAI bridge connected",
          "SQLite memory verified",
          "Oracle mode initialized",
        ].map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "4px 0",
              borderBottom: "1px solid rgba(0,245,255,0.05)",
              fontSize: "12px",
            }}
          >
            <span>{item}</span>
            <span style={{ color: "#4a7a96" }}>
              {new Date().toTimeString().slice(0, 8)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}