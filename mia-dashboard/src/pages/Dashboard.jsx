import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import CorePanel from "../components/CorePanel";
import RightPanel from "../components/RightPanel";
import ActionOverlay from "../components/ActionOverlay";

export default function Dashboard(props) {

const handleCloseOverlay = () => {
  if (props.action) {
    props.setAction?.(null);
  }
};

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
          <RightPanel action={props.action} /> {/* 🔥 NEW */}
        </div>

      </div>
      <ActionOverlay action={props.action} onClose={handleCloseOverlay} />
    </div>
  );
}