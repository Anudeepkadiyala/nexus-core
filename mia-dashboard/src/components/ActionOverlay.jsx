import { useState } from "react";

export default function ActionOverlay({ action, onClose }) {
  if (!action) return null;

  const isBrowser = action.url; // detect browser action

  return (
    <div
      style={{
        position: "fixed",
        top: "80px",
        right: "40px",
        width: "600px",
        height: "450px",
        background: "rgba(0, 10, 25, 0.85)",
        border: "1px solid #00f0ff",
        boxShadow: "0 0 25px #00f0ff55",
        backdropFilter: "blur(10px)",
        zIndex: 9999,
        padding: "10px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h4 style={{ color: "#00f0ff" }}>
          {isBrowser ? "🌐 BROWSER" : "⚡ ACTION"}
        </h4>

        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "1px solid #00f0ff",
            color: "#00f0ff",
            cursor: "pointer",
            padding: "4px 10px",
          }}
        >
          CLOSE
        </button>
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, marginTop: "10px" }}>
        {isBrowser ? (
          <iframe
            src={action.url}
            title="browser"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              borderRadius: "5px",
            }}
          />
        ) : (
          <pre style={{ fontSize: "12px" }}>
            {JSON.stringify(action, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}