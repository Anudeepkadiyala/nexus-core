export default function CorePanel({
  chat,
  chatEndRef,
  message,
  setMessage,
  sendMessage,
  handleKeyPress
}) {
  return (
    <div
      className="panel glow glass"
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        height: "100%",
        overflow: "hidden"
      }}
    >

      {/* CHAT AREA */}
      <div style={{ flex: 1, overflowY: "auto", minHeight: "0" }}>

        {chat.length === 0 ? (
          <div
            style={{
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <h1 style={{ letterSpacing: "10px" }}>M.I.A</h1>
            <p className="small-text">ALL SYSTEMS NOMINAL</p>
            <p style={{ marginTop: "40px", opacity: 0.5 }}>
              Awaiting Command Protocol...
            </p>
          </div>
        ) : (
          <div>
            {chat.map((msg, index) => {
              let text = msg.text;
              let output = text;
              let analysis = null;

              if (text.includes("Explanation:")) {
                const parts = text.split("Explanation:");
                output = parts[0];
                analysis = parts[1];
              }

              return (
                <div key={index} style={{ marginBottom: "15px" }}>
                  <span style={{ color: "#00f0ff" }}>
                    {msg.role === "user"
                      ? `> USER [${msg.mode?.toUpperCase()}]:`
                      : `> MIA [${msg.mode?.toUpperCase()}]:`}
                  </span>

                  <div style={{ marginLeft: "10px" }}>
                    <pre
                      style={{
                        whiteSpace: "pre-wrap",
                        fontFamily: "monospace",
                      }}
                    >
                      {output}
                    </pre>

                    {analysis && (
                      <div style={{ marginTop: "10px", opacity: 0.8 }}>
                        <span>⚡ ANALYSIS:</span>
                        <pre
                          style={{
                            whiteSpace: "pre-wrap",
                            fontFamily: "monospace",
                          }}
                        >
                          {analysis}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* 🔥 INPUT BAR (NEW LOCATION) */}
      <div
        style={{
          marginTop: "10px",
          borderTop: "1px solid rgba(0,255,255,0.2)",
          paddingTop: "10px",
        }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Enter Command Protocol..."
            style={{
              flex: 1,
              padding: "10px",
              background: "transparent",
              border: "1px solid #00f0ff",
              color: "#00f0ff",
              outline: "none",
              fontFamily: "Orbitron, sans-serif",
            }}
          />

          <button
            onClick={sendMessage}
            style={{
              padding: "10px 15px",
              background: "#00f0ff",
              color: "#000",
              border: "none",
              cursor: "pointer",
            }}
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
}