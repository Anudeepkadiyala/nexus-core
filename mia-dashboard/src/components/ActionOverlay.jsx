import { useState, useEffect } from "react";

export default function ActionOverlay({ action, onClose, onMinimize, zIndex, onFocus }) {
  const [position, setPosition] = useState({
    x: 200 + Math.random() * 200,
    y: 100 + Math.random() * 150,
  });

  const [size, setSize] = useState({
    width: 600,
    height: 400,
  });

  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);

  const [offset, setOffset] = useState({ x: 0, y: 0 });

  if (!action) return null;

  const isBrowser = action.url;
  const isTerminal = action.output || action.error;

  // =========================
  // 🖱️ DRAG
  // =========================
  const handleMouseDown = (e) => {
    onFocus(); // 🔥 bring to front
    setDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  // =========================
  // 📐 RESIZE
  // =========================
  const handleResizeStart = (e) => {
    e.stopPropagation();
    onFocus(); // 🔥 bring to front
    setResizing(true);
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    }

    if (resizing) {
      setSize({
        width: Math.max(300, e.clientX - position.x),
        height: Math.max(200, e.clientY - position.y),
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
    setResizing(false);

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // 🧲 LEFT SNAP
    if (position.x < 50) {
        setPosition({ x: 0, y: 0 });
        setSize({
        width: screenWidth / 2,
        height: screenHeight,
        });
        return;
    }

    // 🧲 RIGHT SNAP
    if (position.x + size.width > screenWidth - 50) {
        setPosition({ x: screenWidth / 2, y: 0 });
        setSize({
        width: screenWidth / 2,
        height: screenHeight,
        });
        return;
    }

    // 🧲 TOP SNAP (MAXIMIZE)
    if (position.y < 50) {
        setPosition({ x: 0, y: 0 });
        setSize({
        width: screenWidth,
        height: screenHeight,
        });
        return;
    }
    };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  });

  // =========================
  // 🌐 BROWSER MODE
  // =========================
  useEffect(() => {
    if (isBrowser) {
      const isFullscreen =
        window.innerHeight === screen.height &&
        window.innerWidth === screen.width;

      if (isFullscreen) {
        window.open(action.url, "_blank");
      } else {
        window.open(
          action.url,
          "_blank",
          "width=1200,height=800,left=200,top=100"
        );
      }

      onClose();
    }
  }, [action]);

  // =========================
  // 💻 TERMINAL MODE
  // =========================
  if (isTerminal) {
    return (
      <div
        onMouseDown={onFocus} // 🔥 focus when clicked anywhere
        style={{
          position: "fixed",
          left: position.x,
          top: position.y,
          width: size.width,
          height: size.height,
          background: "rgba(0, 10, 25, 0.95)",
          border: "1px solid #00f0ff",
          boxShadow: "0 0 25px #00f0ff55",
          backdropFilter: "blur(10px)",
          zIndex: zIndex || 9999, // 🔥 dynamic layering
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* HEADER */}
        <div
            onMouseDown={handleMouseDown}
            style={{
                cursor: "move",
                padding: "8px",
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px solid #00f0ff33",
                color: "#00f0ff",
            }}
            >
            <span>💻 TERMINAL</span>

            <div style={{ display: "flex", gap: "5px" }}>
                
                {/* MINIMIZE */}
                <button
                onClick={onMinimize}
                style={{
                    background: "transparent",
                    border: "1px solid #00f0ff",
                    color: "#00f0ff",
                    cursor: "pointer",
                    padding: "2px 6px",
                }}
                >
                —
                </button>

                {/* CLOSE */}
                <button
                onClick={onClose}
                style={{
                    background: "transparent",
                    border: "1px solid #00f0ff",
                    color: "#00f0ff",
                    cursor: "pointer",
                    padding: "2px 8px",
                }}
                >
                ✕
                </button>
            </div>
        </div>

        {/* OUTPUT */}
        <div
          style={{
            flex: 1,
            overflow: "auto",
            fontFamily: "monospace",
            fontSize: "12px",
            color: "#00ff9c",
            background: "black",
            padding: "10px",
          }}
        >
          {action.output && (
            <pre style={{ whiteSpace: "pre-wrap" }}>
              {action.output}
            </pre>
          )}

          {action.error && (
            <pre style={{ color: "red", whiteSpace: "pre-wrap" }}>
              {action.error}
            </pre>
          )}
        </div>

        {/* RESIZE HANDLE */}
        <div
          onMouseDown={handleResizeStart}
          style={{
            width: "15px",
            height: "15px",
            background: "#00f0ff",
            position: "absolute",
            right: 0,
            bottom: 0,
            cursor: "nwse-resize",
          }}
        />
      </div>
    );
  }

  return null;
}