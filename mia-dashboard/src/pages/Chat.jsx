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
      const res = await fetch("http://192.168.29.13:8000/chat", {
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

  // remove typing
  if (updated.length > 0 && updated[updated.length - 1]?.type === "typing") {
    updated.pop();
  }

  const action = data.action || {};

  // =========================
  // ⚡ ACTION HANDLING
  // =========================
  if (data.type === "action") {

    // 🟦 ORACLE MODE BLOCK
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

    // =========================
    // 🔥 MULTI-STEP
    // =========================
    if (action.status === "multi_action") {
      const steps = action.steps || [];

      const logMessages = [];

      steps.forEach((item, index) => {
        const result = item.result || {};
        const stepText = item.step || "Unknown step";

        // 🧠 STEP LOG
        logMessages.push({
          type: "mia",
          text: `[STEP ${index + 1}] ${stepText}`,
          time: new Date().toTimeString().slice(0, 8),
        });

        // TERMINAL
        if (result.output || result.error) {
          const content = result.output || result.error;

          setWindows((prev) => {
            const safePrev = Array.isArray(prev) ? prev : [];

            const exists = safePrev.some(
              (w) => w.type === "terminal" && w.content === content
            );

            if (exists) return safePrev;

            return [
              ...safePrev,
              {
                id: Date.now() + Math.random(),
                type: "terminal",
                content,
                position: {
                  x: 200 + Math.random() * 200,
                  y: 100 + Math.random() * 150,
                },
                size: {
                  width: 400,
                  height: 250,
                },
              },
            ];
          });
        }

        // BROWSER
        if (result.url) {
          window.open(result.url, "_blank");
        }
      });

      // ✅ FINAL COMPLETE MESSAGE
      logMessages.push({
        type: "mia",
        text: "✓ Execution complete",
        time: new Date().toTimeString().slice(0, 8),
      });

      return [...updated, ...logMessages];
    }

    // =========================
    // 🔹 SINGLE ACTION
    // =========================

    // TERMINAL
    if (action.output || action.error) {
      const content = action.output || action.error;

      setWindows((prev) => {
        const safePrev = Array.isArray(prev) ? prev : [];

        const exists = safePrev.some(
          (w) => w.type === "terminal" && w.content === content
        );

        if (exists) return safePrev;

        return [
          ...safePrev,
          {
            id: Date.now() + Math.random(),
            type: "terminal",
            content,
            position: {
              x: 200 + Math.random() * 200,
              y: 100 + Math.random() * 150,
            },
            size: {
              width: 400,
              height: 250,
            },
          },
        ];
      });
    }

    // BROWSER (🔥 IMPORTANT FIX)
    if (action.url) {
      window.open(action.url, "_blank");
    }

    return [
      ...updated,
      {
        type: "mia",
        text: action.message || "Action executed",
        time: new Date().toTimeString().slice(0, 8),
      },
    ];
  }

  // =========================
  // 🧠 AI RESPONSE
  // =========================
  if (data.type === "ai") {
    return [
      ...updated,
      {
        type: "mia",
        text: data.message || "No response",
        time: new Date().toTimeString().slice(0, 8),
      },
    ];
  }

  // =========================
  // FALLBACK
  // =========================
  return updated;
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
        gridTemplateColumns: "180px 1fr 165px", // FIXED
        gridTemplateRows: "1fr 60px",
        height: "calc(100vh - 48px)",
        color: "#cce8f4",
        fontFamily: "Exo 2",
        background: "#020c14",
        overflow: "hidden", // ✅ IMPORTANT
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
      <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px", gap: "8px", display: "flex", flexDirection: "column" }}>
          {(messages || []).map((msg, i) => {
            const isStep = msg.text?.includes("STEP");
            const isComplete = msg.text?.includes("EXECUTION COMPLETE");
            const isDivider = msg.text?.includes("────");
            if (msg.type === "typing") {
              return (
                <div key={i} style={{ marginBottom: "6px" }}>
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
                    maxWidth: "72%",
                    padding: "10px 12px",
                    fontSize: "11px",
                    lineHeight: "1.6",
                    border: isStep
                      ? "1px solid #00f0ff55"
                      : isComplete
                      ? "1px solid #00ff9c"
                      : isDivider
                      ? "none"
                      : `1px solid ${msg.type === "mia" ? accent : "#0a84ff"}`,
                    borderLeft: msg.type === "mia" && !isStep && !isComplete
                      ? `2px solid ${accent}`
                      : undefined,
                    borderRight: msg.type === "user"
                      ? "2px solid #0a84ff"
                      : undefined,
                    background: isStep
                      ? "rgba(0, 20, 40, 0.6)"
                      : isComplete
                      ? "rgba(0, 40, 20, 0.6)"
                      : isDivider
                      ? "transparent"
                      : msg.type === "mia"
                      ? "#041525"
                      : "rgba(10,132,255,0.08)",
                    color: isComplete
                      ? "#00ff9c"
                      : isStep
                      ? "#00f0ff"
                      : msg.type === "mia"
                      ? "#cce8f4"
                      : "#a8d4ff",
                    clipPath: isStep || isComplete
                      ? "none"
                      : msg.type === "mia"
                      ? "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)"
                      : "polygon(6px 0, 100% 0, 100% 100%, 0 100%, 0 6px)",
                    boxShadow:
                      msg.type === "mia"
                      ? `0 0 8px ${accent}22`
                      : "0 0 6px rgba(10,132,255,0.2)",
                  }}
                >
                  <div style={{ fontSize: "7px", color: "#4a7a96", marginBottom: "4px", letterSpacing: "0.08em" }}>
                    {msg.type === "mia" ? `MIA · ${mode}` : "YOU"} • {(msg.time || "--:--:--")}
                  </div>
                  {isDivider ? (
                    <div style={{ textAlign: "center", opacity: 0.3 }}>
                      {msg.text}
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MEMORY PANEL */}
      <div style={{ 
          borderLeft: "1px solid rgba(0,245,255,0.2)",
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}>
      <div style={{ fontSize: "10px", color: "#4a7a96", marginBottom: "6px" }}>
      // RADAR
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
          <svg width="120" height="120">
            <circle cx="60" cy="60" r="55" fill="none" stroke="rgba(0,245,255,0.15)" />
            <circle cx="60" cy="60" r="35" fill="none" stroke="rgba(0,245,255,0.1)" />
            <circle cx="60" cy="60" r="15" fill="none" stroke="rgba(0,245,255,0.1)" />

            {/* Crosshair */}
            <line x1="60" y1="5" x2="60" y2="115" stroke="rgba(0,245,255,0.1)" />
            <line x1="5" y1="60" x2="115" y2="60" stroke="rgba(0,245,255,0.1)" />

            {/* Sweep */}
            <g style={{ transformOrigin: "60px 60px", animation: "radarSpin 3s linear infinite" }}>
              <path d="M60 60 L60 5 A55 55 0 0 1 110 80 Z" fill={`${accent}33`} />
            </g>

            {/* Blips */}
            <circle cx="80" cy="40" r="2" fill={accent} />
            <circle cx="40" cy="80" r="2" fill={accent} />
          </svg>
        </div>
          {/* MEMORY PANEL */}
          <div
            style={{
              borderLeft: "1px solid rgba(0,245,255,0.2)",
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* HEADER */}
            <div
              style={{
                fontSize: "10px",
                color: "#4a7a96",
                marginBottom: "6px",
                borderBottom: "1px solid rgba(0,245,255,0.15)",
                paddingBottom: "4px",
              }}
            >
              // MEMORY LOG
            </div>

              {/* LIST */}
              <div style={{ overflowY: "auto", flex: 1 }}>
                {(messages || [])
                  .slice(-8)
                  .reverse()
                  .map((m, i) => {
                    return (
                      <div
                        key={i}
                        style={{
                          fontSize: "9px",
                          marginTop: "6px",
                          opacity: 0.75,
                          display: "flex",
                          gap: "4px",
                          borderBottom: "1px solid rgba(0,245,255,0.05)",
                          paddingBottom: "4px",
                        }}
                      >
                        <span style={{ color: accent }}>›</span>
                        <span>
                          {m?.type === "user"
                            ? `Query: ${m.text.slice(0, 20)}`
                            : `MIA: ${m.text.slice(0, 20)}`}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
        </div>

      {/* INPUT BAR */}
      <div
        style={{
          gridColumn: "1 / -1",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          borderTop: `1px solid ${accent}`,
          padding: "0 14px",
          background: "rgba(2,12,20,0.9)",

          boxShadow: `0 -2px 10px ${accent}11`,
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
            fontSize: "12px",
            caretColor: accent,
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            border: `1px solid ${accent}`,
            background: "transparent",
            color: accent,
            padding: "6px 14px",
            cursor: "pointer",
            fontSize: "10px",
            letterSpacing: "0.1em",
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

          @keyframes radarSpin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
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
                active={activeWindow === win.id}
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
                active={activeWindow === win.id}
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