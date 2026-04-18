export default function InputBar({
  message,
  setMessage,
  sendMessage,
  handleKeyPress
}) {
  return (
    <div className="panel glow glass" style={{
      height: "70px",
      display: "flex",
      alignItems: "center",
      padding: "0 20px",
      gap: "10px"
    }}>
      
      <input
        placeholder="ENTER COMMAND PROTOCOL..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        style={{
          flex: 1,
          background: "transparent",
          border: "none",
          color: "#00f0ff",
          outline: "none"
        }}
      />

      <button onClick={sendMessage}>➤</button>

    </div>
  );
}