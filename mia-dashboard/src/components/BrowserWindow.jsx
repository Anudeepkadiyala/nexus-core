import { useState, useEffect } from "react";

export default function BrowserWindow({ win, onClose, accent, zIndex, onFocus }) {
  const [position, setPosition] = useState(win.position);
  const [size, setSize] = useState(win.size);

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
        border: `1px solid ${accent}`,
        boxShadow: `0 0 20px ${accent}55`,
        zIndex: zIndex,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: "6px",
          borderBottom: `1px solid ${accent}`,
          display: "flex",
          justifyContent: "space-between",
          color: accent,
          fontSize: "10px",
        }}
      >
        🌐 {win.url}

        <button onClick={onClose}>✕</button>
      </div>

      {/* CONTENT */}
      <iframe
        src={win.url}
        style={{
          flex: 1,
          border: "none",
        }}
      />
    </div>
  );
}