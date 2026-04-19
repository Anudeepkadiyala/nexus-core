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

  const renderPage = () => {
    switch (page) {
      case "dash": return <Dashboard />;
      case "chat": return <Chat mode={mode} setMode={setMode} />;
      case "globe": return <Globe />;
      case "memory": return <Memory />;
      case "voice": return <Voice />;
      default: return <Dashboard />;
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