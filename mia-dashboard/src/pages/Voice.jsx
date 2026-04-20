import { useEffect, useRef, useState } from "react";

export default function Voice({ accent, mode }) {
  const canvasRef = useRef(null);
  const [state, setState] = useState("IDLE"); // IDLE | LISTENING | PROCESSING

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 48;
    canvas.style.display = "block";

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      const time = Date.now() * 0.004;

      // 🔥 Core pulse
      const baseRadius = 30;
      const pulse =
        state === "LISTENING"
          ? baseRadius + Math.sin(time * 3) * 10
          : state === "PROCESSING"
          ? baseRadius + Math.sin(time * 6) * 6
          : baseRadius + Math.sin(time) * 3;

      // Core
      ctx.beginPath();
      ctx.arc(cx, cy, pulse, 0, Math.PI * 2);
      ctx.fillStyle = accent;
      ctx.shadowBlur = 30;
      ctx.shadowColor = accent;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Rings
      for (let i = 1; i <= 3; i++) {
        const r = pulse + i * 25;

        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `${accent}${20 - i * 5}`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      requestAnimationFrame(draw);
    }

    draw();
  }, [accent, state]);

  return (
    <div style={{ position: "relative", height: "calc(100vh - 48px)",overflow: "hidden" }}>
      <canvas ref={canvasRef} />

      {/* HUD Label */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          fontSize: "10px",
          color: "#4a7a96",
        }}
      >
        // VOICE INTERFACE
      </div>

      {/* STATUS */}
      <div
        style={{
          position: "absolute",
          bottom: "70px",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "12px",
          color: accent,
          letterSpacing: "0.1em",
        }}
      >
        {state === "IDLE" && "SYSTEM READY"}
        {state === "LISTENING" && "LISTENING..."}
        {state === "PROCESSING" && "PROCESSING..."}
      </div>

      {/* CONTROLS */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "10px",
        }}
      >
        <button onClick={() => setState("LISTENING")}>Listen</button>
        <button onClick={() => setState("PROCESSING")}>Process</button>
        <button onClick={() => setState("IDLE")}>Reset</button>
      </div>
    </div>
  );
}