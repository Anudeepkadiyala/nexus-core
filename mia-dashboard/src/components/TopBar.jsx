export default function TopBar({ mode, setMode }) {
  return (
    <div className="panel glow glass" style={{
      height: "60px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 20px"
    }}>
      
      <div>
        12:36:06 | THU APR 16 | SESSION: 000001
      </div>

      <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          style={{
            background: "black",
            color: "#00f0ff",
            border: "1px solid #00f0ff"
          }}
        >
          <option value="oracle">Oracle</option>
          <option value="command">Command</option>
          <option value="synthesis">Synthesis</option>
        </select>

        ● COMMS ● POWER ● VOICE 🌍
      </div>
    </div>
  );
}