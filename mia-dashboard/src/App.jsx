import { useState } from "react";
import NavBar from "./core/NavBar";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import Globe from "./pages/Globe";
import Memory from "./pages/Memory";
import Voice from "./pages/Voice";

import ParticleBackground from "./core/ParticleBackground";

function App() {
  const [page, setPage] = useState("dash");
  const [mode, setMode] = useState("ORACLE");

  const modeColors = {
    ORACLE: "#00f5ff",
    COMMAND: "#f5a623",
    SYNTHESIS: "#bf5fff",
  };

  const accent = modeColors[mode];

  const renderPage = () => {
    switch (page) {
      case "dash":
        return <Dashboard accent={accent} mode={mode} />;

      case "chat":
        return <Chat accent={accent} mode={mode} setMode={setMode} />;

      case "globe":
        return <Globe accent={accent} mode={mode} />;

      case "memory":
        return <Memory accent={accent} mode={mode} />;

      case "voice":
        return <Voice accent={accent} mode={mode} />;

      default:
        return <Dashboard accent={accent} mode={mode} />;
    }
  };
  return (
    <div style={{ height: "100vh", background: "#020c14" }}>
      <ParticleBackground />
      <NavBar page={page} setPage={setPage} mode={mode} />
      {renderPage()}
    </div>
  );
}

export default App;