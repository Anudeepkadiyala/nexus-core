import { useState, useEffect, useRef } from "react";
import TerminalWindow from "../components/TerminalWindow";
import BrowserWindow from "../components/BrowserWindow";

export default function Chat({ mode, setMode }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [alert, setAlert] = useState(false);
  const [windows, setWindows] = useState([]);
  const [activeWindow, setActiveWindow] = useState(null);

  // ✅ NEW (FIX)
  const [externalUrl, setExternalUrl] = useState(null);

  const browserRef = useRef(null);
  const lastUrlRef = useRef(null);

  const modeColors = {
    ORACLE: "#00f5ff",
    COMMAND: "#f5a623",
    SYNTHESIS: "#bf5fff",
  };

  const accent = modeColors[mode] || "#00f5ff";

  // =========================
  // 🔥 FIX: HANDLE WINDOW HERE (ONLY ONCE)
  // =========================
  useEffect(() => {
    if (!externalUrl) return;

    if (browserRef.current && !browserRef.current.closed) {
      browserRef.current.location.href = externalUrl;
    } else {
      const newWindow = window.open(
        externalUrl,
        "_blank",
        "noopener,noreferrer,width=1200,height=800,left=200,top=100"
      );

      browserRef.current = newWindow;
    }
  }, [externalUrl]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input;

    const userMsg = {
      type: "user",
      text: userText,
      time: new Date().toTimeString().slice(0, 8),
    };

    setMessages((prev) => [
  ...(Array.isArray(prev) ? prev : []),
  userMsg,
]);
    setInput("");

    const known = ["run", "open", "search", "hello", "status"];
    if (!known.some((k) => userText.toLowerCase().includes(k))) {
      setAlert(true);
      setTimeout(() => setAlert(false), 3000);
    }

    setMessages((prev) => [
  ...(Array.isArray(prev) ? prev : []),
  {
    type: "typing",
    time: new Date().toTimeString().slice(0, 8),
  }
]);

    try {
      const res = fetch("http://192.168.29.13:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userText,
          mode: mode,
        }),
      });

      const data = await res.json();
      const action = data.action || null;

      setMessages((prev) => {
        const updated = Array.isArray(prev) ? [...prev] : [];
        if (updated.length > 0 && updated[updated.length - 1]?.type === "typing") {
            updated.pop();
            }

        // =========================
        // ⚡ ACTION HANDLING
        // =========================
        if (data.type === "action") {
          if (mode === "ORACLE") {
            return [
              ...updated,
              {
                type: "mia",
                text: "⚠ Execution blocked in ORACLE mode",
                time: new Date().toTimeString().slice(0, 8),
              },
            ];
          }

          // TERMINAL WINDOW
          if (action?.output || action?.error) {
            const newWindow = {
              id: Date.now() + Math.random(),
              type: "terminal",
              content: action.output || action.error,
              position: {
                x: 200 + Math.random() * 200,
                y: 100 + Math.random() * 150,
              },
              size: {
                width: 400,
                height: 250,
              },
            };

            setWindows((prev) => [...prev, newWindow]);
            return updated;
          }

          return updated;
        }

        if (mode === "COMMAND") {
        const timeNow = new Date().toTimeString().slice(0, 8);

        const openingMsg = {
            type: "mia",
            text: action?.message || "Processing...",
            time: timeNow,
        };
        
        // ✅ Stage 1: show "Opening..."
        setTimeout(() => {
            setMessages((prevMsgs) => [
  ...(Array.isArray(prevMsgs) ? prevMsgs : []),
  {
    type: "mia",
    text: action && action.url
      ? "Operation completed"
      : `${action?.app || "Application"} opened`,
    time: new Date().toTimeString().slice(0, 8),
  }
]);
        }, 0); // ⏱ delay

        return [...updated, openingMsg];
        }
      });
        
      // =========================
      // 🌐 FIXED URL HANDLING
      // =========================
      if (action && action.url && userText.toLowerCase().includes("search")) {
        const blockedSites = ["google", "youtube"];
        const isBlocked = blockedSites.some((site) =>
          action.url.includes(site)
        );

        if (isBlocked) {
          if (lastUrlRef.current === action.url) return;

          lastUrlRef.current = action.url;
          setExternalUrl(action.url); // ✅ SAFE TRIGGER
        } else {
          const newWindow = {
            id: Date.now() + Math.random(),
            type: "browser",
            url: action.url,
            position: { x: 300, y: 150 },
            size: { width: 600, height: 400 },
          };

          setWindows((prev) => [...prev, newWindow]);
        }
      }

    } catch (err) {
      setMessages((prev) => {
        const updated = Array.isArray(prev) ? [...prev] : [];
        if (updated.length > 0) updated.pop();

        return [
          ...updated,
          {
            type: "mia",
            text: "⚠ Backend error",
            time: new Date().toTimeString().slice(0, 8),
          },
        ];
      });
    }
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "180px 1fr 180px",
        gridTemplateRows: "1fr 60px",
        height: "calc(100vh - 48px)",
        color: "#cce8f4",
        fontFamily: "Exo 2",
      }}
    >
      {/* ALERT */}
      {alert && (
        <div
          style={{
            position: "absolute",
            top: "48px",
            left: 0,
            right: 0,
            padding: "6px",
            background: "rgba(255,0,0,0.2)",
            borderBottom: "1px solid red",
            textAlign: "center",
            fontSize: "10px",
            zIndex: 10,
          }}
        >
          ⚠ UNRECOGNIZED COMMAND
        </div>
      )}

      {/* LEFT PANEL */}
      <div style={{ borderRight: "1px solid rgba(0,245,255,0.2)", padding: "10px" }}>
        <div style={{ fontSize: "10px", color: "#4a7a96" }}>// MODE</div>

        {["ORACLE", "COMMAND", "SYNTHESIS"].map((m) => (
          <div
            key={m}
            onClick={() => setMode(m)}
            style={{
              padding: "6px",
              marginTop: "6px",
              border: m === mode ? `1px solid ${accent}` : "transparent",
              color: m === mode ? accent : "#4a7a96",
              cursor: "pointer",
            }}
          >
            {m}
          </div>
        ))}
      </div>

      {/* CHAT CORE */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, padding: "10px", overflowY: "auto" }}>
          {(messages || []).map((msg, i) => {
            if (msg.type === "typing") {
              return (
                <div key={i} style={{ marginBottom: "10px" }}>
                  <div
                    style={{
                      display: "flex",
                      gap: "4px",
                      padding: "8px",
                      border: `1px solid ${accent}`,
                      width: "60px",
                    }}
                  >
                    <div className="dot" />
                    <div className="dot" />
                    <div className="dot" />
                  </div>
                </div>
              );
            }

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent:
                    msg.type === "user" ? "flex-end" : "flex-start",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    maxWidth: "70%",
                    padding: "10px",
                    border: `1px solid ${
                      msg.type === "mia" ? accent : "#0a84ff"
                    }`,
                    background:
                      msg.type === "mia"
                        ? "#041525"
                        : "rgba(10,132,255,0.1)",
                    color:
                      msg.type === "mia" ? "#cce8f4" : "#a8d4ff",
                    clipPath:
                      msg.type === "mia"
                        ? "polygon(0 0, 95% 0, 100% 10%, 100% 100%, 0 100%)"
                        : "polygon(5% 0, 100% 0, 100% 100%, 0 100%, 0 10%)",
                  }}
                >
                  <div style={{ fontSize: "8px", color: "#4a7a96" }}>
                    {msg.type === "mia" ? `MIA · ${mode}` : "YOU"} • {(msg.time || "--:--:--")}
                  </div>
                  {msg.text}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MEMORY PANEL */}
      <div style={{ borderLeft: "1px solid rgba(0,245,255,0.2)", padding: "10px" }}>
        <div style={{ fontSize: "10px", color: "#4a7a96" }}>// MEMORY</div>

        {(messages || []).slice(-6).map((m, i) => (
          <div key={i} style={{ fontSize: "10px", marginTop: "6px" }}>
            › {((m && m.text) ? m.text.slice(0, 30) : "")}
          </div>
        ))}
      </div>

      {/* INPUT BAR */}
      <div
        style={{
          gridColumn: "1 / -1",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          borderTop: `1px solid ${accent}`,
          padding: "10px",
        }}
      >
        <span style={{ color: accent, fontSize: "10px" }}>
          MIA://{mode} &gt;
        </span>

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#cce8f4",
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            border: `1px solid ${accent}`,
            background: "transparent",
            color: accent,
            padding: "5px 12px",
            cursor: "pointer",
          }}
        >
          TRANSMIT
        </button>
      </div>

      {/* DOT ANIMATION */}
      <style>
        {`
          .dot {
            width: 5px;
            height: 5px;
            background: ${accent};
            border-radius: 50%;
            animation: bounce 1.2s infinite;
          }

          .dot:nth-child(2) { animation-delay: 0.2s; }
          .dot:nth-child(3) { animation-delay: 0.4s; }

          @keyframes bounce {
            0%,100% { transform: translateY(0); opacity: 0.4; }
            50% { transform: translateY(-5px); opacity: 1; }
          }
        `}
      </style>

        {/* WINDOWS */}
        {
        (windows || []).map((win) => {
        if (win.type === "terminal") {
            return (
            <TerminalWindow
                key={win.id}
                win={win}
                accent={accent}
                zIndex={activeWindow === win.id ? 10000 : 9000}
                onFocus={() => setActiveWindow(win.id)}
                onClose={() =>
                setWindows((prev) => prev.filter((w) => w.id !== win.id))
                }
                onUpdate={(updatedWin) =>
                setWindows((prev) =>
                    prev.map((w) => (w.id === updatedWin.id ? updatedWin : w))
                )
                }
            />
            );
        }

        if (win.type === "browser") {
            return (
            <BrowserWindow
                key={win.id}
                win={win}
                accent={accent}
                zIndex={activeWindow === win.id ? 10000 : 9000}
                onFocus={() => setActiveWindow(win.id)}
                onClose={() =>
                setWindows((prev) => prev.filter((w) => w.id !== win.id))
                }
            />
            );
        }

        return null;
        })}

    </div>
  );
}