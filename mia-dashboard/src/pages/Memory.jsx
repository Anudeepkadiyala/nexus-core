import { useEffect, useRef } from "react";

export default function Memory({ accent, mode }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 48;

    const labels = [
      "OpenAI API",
      "SQLite DB",
      "Oracle Mode",
      "Command Mode",
      "Synthesis",
      "FastAPI",
      "React UI",
      "Neural Core",
      "Memory Layer",
      "Voice System",
      "Execution",
      "MIA v2",
    ];
    const nodes = [
      ...Array.from({ length: 8 }, (_, i) => {
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        const angle = (i / 8) * Math.PI * 2;
        const radius = 90;

        return {
          angle,
          radius,
          speed: 0.003 + Math.random() * 0.002,
          x: cx + Math.cos(angle) * radius,
          y: cy + Math.sin(angle) * radius,
          label: labels[i],
        };
      }),

      ...Array.from({ length: 6 }, (_, i) => {
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        const angle = (i / 6) * Math.PI * 2;
        const radius = 220;

        return {
          angle,
          radius,
          speed: 0.005 + Math.random() * 0.001,
          x: cx + Math.cos(angle) * radius,
          y: cy + Math.sin(angle) * radius,
          label: labels[i + 8],
        };
      }),
    ];

    nodes.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      label: "NEURAL CORE",
      core: true,
    });

    let hovered = null;

    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      hovered = nodes.find(
        (n) => Math.hypot(n.x - mx, n.y - my) < 8
      );
    });

    const backgroundNodes = Array.from({ length: 20 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
    }));

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      backgroundNodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `${accent}22`;
        ctx.fill();
      });

      nodes.forEach((n) => {
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

      const pulse = 8 + Math.sin(Date.now() * 0.004) * 3;

      if (n.core) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, pulse + 10, 0, Math.PI * 2);
        ctx.strokeStyle = `${accent}33`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
        if (!n.core) {
          n.angle += n.speed;

          n.x = cx + Math.cos(n.angle) * n.radius;
          n.y = cy + Math.sin(n.angle) * n.radius;
        }
        
        if (hovered === n) {
          ctx.fillStyle = accent;
          ctx.font = "10px Orbitron";
          ctx.textAlign = "center";
          ctx.fillText(n.label.toUpperCase(), n.x, n.y - 10);
        }
        // node
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.core ? pulse : 4, 0, Math.PI * 2);
        ctx.fillStyle = accent;
        ctx.shadowBlur = n.core ? 35 : hovered === n ? 20 : 10;
        ctx.shadowColor = accent;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // connections
      const core = nodes.find(n => n.core);
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(0,245,255,${0.2 * (1 - dist / 100)})`;
            ctx.stroke();
          }

          if (nodes[i].core || nodes[j].core) {
            ctx.strokeStyle = `${accent}55`;
            ctx.lineWidth = 1.2;
          }
        }
      }

      nodes.forEach((n) => {
        if (!n.core) {
          const dx = n.x - core.x;
          const dy = n.y - core.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(core.x, core.y);
          ctx.strokeStyle = `rgba(0,245,255,0.15)`;
          ctx.stroke();
        }
      });

      requestAnimationFrame(draw);
    }

    draw();
  }, [accent]);

  return (
    <div style={{ position: "relative", height: "100%" }}>
      <canvas ref={canvasRef} />

      {/* HUD */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          fontSize: "10px",
          color: "#4a7a96",
        }}
      >
        // MEMORY SYSTEM
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "10px",
          color: "#4a7a96",
        }}
      >
        847 NODES INDEXED · NEURAL GRAPH ACTIVE
      </div>
    </div>
  );
}
