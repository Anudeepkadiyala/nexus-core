import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import CorePanel from "../components/CorePanel";
import RightPanel from "../components/RightPanel";

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
          <RightPanel />
        </div>

      </div>
    </div>
  );
}