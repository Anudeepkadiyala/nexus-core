import { useState, useEffect } from "react";

export default function TerminalWindow({ win, onClose, accent, zIndex, onFocus, onUpdate, active }) {
  const [position, setPosition] = useState(
  win.position || {
    x: 200,
    y: 100,
  }
);

  const [size, setSize] = useState(
  win.size || {
    width: 400,
    height: 250,
  }
);

  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const [isMaximized, setIsMaximized] = useState(false);
  const [prevState, setPrevState] = useState(null);

  const [startSize, setStartSize] = useState({ width: 0, height: 0 });
  const [startMouse, setStartMouse] = useState({ x: 0, y: 0 });

  // 🖱 DRAG
  const handleMouseDown = (e) => {
    setDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });

    setPosition((prev) => ({
      x: prev.x + e.movementX,
      y: prev.y + e.movementY,
    }));
  };

  // 📐 RESIZE START
  const handleResizeStart = (e) => {
    e.stopPropagation();
    setResizing(true);
    setStartSize(size);
    setStartMouse({
      x: e.clientX,
      y: e.clientY,
    });
  };

  // 🖱 MOVE
  const handleMouseMove = (e) => {
    if (dragging && !isMaximized) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    }

    if (resizing) {
      const dx = e.clientX - startMouse.x;
      const dy = e.clientY - startMouse.y;

      setSize({
        width: Math.max(300, startSize.width + dx),
        height: Math.max(200, startSize.height + dy),
      });
    }
  };

  // 🖱 RELEASE
  const handleMouseUp = () => {
    setDragging(false);
    setResizing(false);

    // 🧲 SNAP
    if (position.x < 50) {
      setPosition({ x: 0, y: 0 });
      setSize({
        width: window.innerWidth / 2,
        height: window.innerHeight,
      });
    } else if (position.x + size.width > window.innerWidth - 50) {
      setPosition({ x: window.innerWidth / 2, y: 0 });
      setSize({
        width: window.innerWidth / 2,
        height: window.innerHeight,
      });
    } else if (position.y < 50) {
      toggleMaximize();
    }
  };

  // 🔲 MAXIMIZE
  const toggleMaximize = () => {
    if (!isMaximized) {
      setPrevState({ position, size });

      setPosition({ x: 0, y: 0 });
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      setIsMaximized(true);
    } else {
      if (prevState) {
        setPosition(prevState.position);
        setSize(prevState.size);
      }
      setIsMaximized(false);
    }
  };

  // 🎯 EVENTS
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  });

useEffect(() => {
  onUpdate({
    ...win,
    position,
    size,
  });
}, [position, size]);

  return (
    <div
      onMouseDown={onFocus}
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        background: "#020c14",
        border: active
          ? `1px solid ${accent}`
          : "1px solid rgba(0,245,255,0.2)",

        boxShadow: active
          ? `0 0 20px ${accent}, 0 0 40px ${accent}55`
          : "0 0 10px rgba(0,0,0,0.6)",

        opacity: active ? 1 : 0.85,

        zIndex: zIndex || 9999,
        display: "flex",
        flexDirection: "column",

        transition: "box-shadow 0.2s, opacity 0.2s", // 🔥 SMOOTH FEEL
        userSelect: "none",
      }}
    >
      {/* HEADER */}
      <div
        onMouseDown={(e) => {
          onFocus();
          if (!isMaximized) handleMouseDown(e);
        }}
        style={{
          cursor: "move",
          padding: "6px 8px",
          borderBottom: `1px solid ${accent}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: accent,
          fontSize: "10px",

          background: active
            ? "rgba(0,245,255,0.08)"
            : "rgba(0,0,0,0.3)",
        }}
      >
        <span>TERMINAL</span>

        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={toggleMaximize}
            onMouseEnter={(e) => (e.target.style.background = accent)}
            onMouseLeave={(e) => (e.target.style.background = "transparent")}
            style={{
              background: "transparent",
              border: `1px solid ${accent}`,
              color: accent,
              cursor: "pointer",
              padding: "2px 6px",
              fontSize: "10px",
              transition: "all 0.2s ease",
            }}
          >
            {isMaximized ? "⧉" : "⬜"}
          </button>

          <button
            onClick={onClose}
            onMouseEnter={(e) => (e.target.style.background = accent)}
            onMouseLeave={(e) => (e.target.style.background = "transparent")}
            style={{
              background: "transparent",
              border: `1px solid ${accent}`,
              color: accent,
              cursor: "pointer",
              padding: "2px 6px",
              fontSize: "10px",
              transition: "all 0.2s ease",
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div
        style={{
          flex: 1,
          padding: "10px",
          fontSize: "12px",
          color: "#00ff9c",
          overflow: "auto",
          fontFamily: "monospace",
        }}
      >
        <pre style={{ whiteSpace: "pre-wrap" }}>{win.content}</pre>
      </div>

      {/* RESIZE HANDLE */}
      <div
        onMouseDown={(e) => {
          onFocus();
          handleResizeStart(e);   // ✅ FIXED
        }}
        onMouseEnter={(e) => {
          e.target.style.background = accent;
        }}
        onMouseLeave={(e) => {
          e.target.style.background = active ? accent : `${accent}55`;
        }}
        style={{
          width: "15px",
          height: "15px",
          background: active ? `${accent}` : `${accent}55`,
          boxShadow: active ? `0 0 6px ${accent}` : "none",
          position: "absolute",
          right: 0,
          bottom: 0,
          cursor: "nwse-resize",
        }}
      />
    </div>
  );
}