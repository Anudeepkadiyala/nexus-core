export default function Sidebar() {
  return (
    <div className="panel glass" style={{
      width: "250px",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    }}>
      
      <div>
        <h2>M.I.A</h2>
        <p className="small-text">SYSTEM ONLINE ●</p>

        <button className="glow" style={{ width: "100%", marginTop: "20px" }}>
          + Initialize Session
        </button>

        <div style={{ marginTop: "30px" }}>
          <p className="small-text">MODULES</p>
          <p>› Interface</p>
          <p>Databases</p>
          <p>Diagnostics</p>
        </div>
      </div>

      <div>
        <p className="small-text">● Secure Link</p>
      </div>
    </div>
  );
}