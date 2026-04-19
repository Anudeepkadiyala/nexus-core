import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import CorePanel from "../components/CorePanel";
import RightPanel from "../components/RightPanel";
import ActionOverlay from "../components/ActionOverlay";

export default function Dashboard(props) {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      
      <TopBar mode={props.mode} setMode={props.setMode} />

      <div style={{ flex: 1, display: "flex" }}>
        
        <Sidebar />

        {/* CENTER */}
        <div
          style={{
            flex: 2,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <CorePanel
            chat={props.chat}
            chatEndRef={props.chatEndRef}
            message={props.message}
            setMessage={props.setMessage}
            sendMessage={props.sendMessage}
            handleKeyPress={props.handleKeyPress}
          />
        </div>

        {/* RIGHT PANEL */}
        <div style={{ width: "400px", display: "flex" }}>
          <RightPanel /> {/* ✅ CLEAN */}
        </div>

      </div>

      {/* 🔥 WINDOWS (SAFE FILTER) */}
      {(props.windows || [])
        .filter((win) => !(props.minimized || []).includes(win.id))
        .map((win, index) => (
            <ActionOverlay
            key={win.id}
            action={win}
            zIndex={props.activeWindow === win.id ? 10000 : 9000 + index}
            onFocus={() => props.setActiveWindow(win.id)}
            onMinimize={() =>
                props.setMinimized((prev) => [...prev, win.id])
            }
            onClose={() =>
                props.setWindows((prev) =>
                prev.filter((w) => w.id !== win.id)
                )
            }
            />
        ))}

      {/* 🔥 DOCK */}
      <div
        style={{
          position: "fixed",
          bottom: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "10px",
          background: "rgba(0,0,0,0.6)",
          padding: "10px",
          borderRadius: "10px",
          border: "1px solid #00f0ff",
          zIndex: 20000,
        }}
      >
        {(props.minimized || []).map((id) => {
            const win = (props.windows || []).find((w) => w.id === id);
          if (!win) return null;

          return (
            <button
              key={id}
              onClick={() =>
                props.setMinimized((prev) =>
                  prev.filter((m) => m !== id)
                )
              }
              style={{
                background: "#00f0ff22",
                border: "1px solid #00f0ff",
                color: "#00f0ff",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              💻
            </button>
          );
        })}
      </div>

    </div>
  );
}