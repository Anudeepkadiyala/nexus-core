import { useEffect, useState } from "react";
import GlobeComponent from "./Globe";

export default function RightPanel() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [region, setRegion] = useState("us");
  const [fullscreen, setFullscreen] = useState(false);
  const [analysis, setAnalysis] = useState("");

  const fetchNews = async () => {
    try {
      setLoading(true);

      const res = await fetch(`http://192.168.29.13:8000/news?region=${region}`);
      const data = await res.json();

      const articles = data.news || [];
      setNews(articles);

      if (articles.length > 0) {
        const aiRes = await fetch("http://192.168.29.13:8000/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ news: articles }),
        });

        const aiData = await aiRes.json();
        setAnalysis(aiData.analysis || "No analysis available");
      } else {
        setAnalysis("No significant updates in this region.");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setNews([]);
      setAnalysis("MIA unable to analyze at the moment.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [region]);

  return (
    <>
      {/* ================= NORMAL PANEL ================= */}
      <div
        className="panel glass"
        style={{
          width: "100%",
          height: "100%",
          maxHeight: "100vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          padding: "15px",
        }}
      >
        {/* HEADER */}
        <h3 style={{ cursor: "pointer" }} onClick={() => setFullscreen(true)}>
          🌍 GLOBAL
        </h3>

        {/* GLOBE */}
        <div
          style={{
            marginTop: "10px",
            marginBottom: "10px",
            border: "1px solid #00f0ff33",
            boxShadow: "0 0 10px #00f0ff22",
            padding: "5px",
            height: "200px",
            overflow: "hidden",
          }}
        >
          <GlobeComponent onRegionSelect={setRegion} />
        </div>

        {/* STATUS */}
        <p className="small-text live-indicator">
          {loading ? "Updating..." : `Live Feed Active • ${region.toUpperCase()}`}
        </p>

        {/* 🧠 ANALYSIS (FIXED HEIGHT) */}
        <div
          className="panel glass"
          style={{
            padding: "10px",
            marginBottom: "10px",
            maxHeight: "100px",     // 🔥 FIX
            overflowY: "auto"
          }}
        >
          <p style={{ fontSize: "12px", opacity: 0.8 }}>
            🧠 {analysis || "Analyzing region..."}
          </p>
        </div>

        {/* 🔥 NEWS GRID (CONTROLLED) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            flex: 1,
            overflowY: "auto",
            minHeight: 0,
            paddingRight: "5px",
          }}
        >
          {(news || []).slice(0, 4).map((item, index) => (
            <div
              key={index}
              className="panel glass"
              style={{
                padding: "10px",
                height: "130px",   // 🔥 FIXED
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                overflow: "hidden",
              }}
            >
              {/* TITLE */}
              <p
                style={{
                  fontWeight: "bold",
                  fontSize: "13px",
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {item.title}
              </p>

              {/* DESCRIPTION */}
              <p
                style={{
                  fontSize: "11px",
                  opacity: 0.7,
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {item.description}
              </p>

              {/* SOURCE */}
              <p style={{ fontSize: "10px", opacity: 0.5 }}>
                {item.source}
              </p>
            </div>
          ))}

          {!loading && news.length === 0 && (
            <p style={{ fontSize: "12px", opacity: 0.6 }}>
              No news available
            </p>
          )}
        </div>
      </div>

      {/* ================= FULLSCREEN ================= */}
      {fullscreen && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0, 8, 20, 0.98)",
      zIndex: 9999,
      padding: "20px",
    }}
  >

    {/* CLOSE BUTTON (ALWAYS WORKS) */}
    <button
      onClick={() => setFullscreen(false)}
      style={{
        position: "absolute",
        top: "20px",
        right: "20px",
        border: "1px solid #00f0ff",
        color: "#00f0ff",
        background: "transparent",
        padding: "6px 12px",
        cursor: "pointer",
        zIndex: 10000,
      }}
    >
      CLOSE
    </button>

    {/* CONTENT */}
    <div style={{ width: "100%", height: "100%" }}>
      
      {/* GLOBE */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <GlobeComponent onRegionSelect={setRegion} />
      </div>

      {/* ANALYSIS */}
      <div style={{ marginTop: "20px" }}>
        <p>🧠 {analysis}</p>
      </div>

      {/* NEWS */}
      <div
        style={{
          marginTop: "30px",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
        }}
      >
        {(news || []).map((item, index) => (
          <div key={index} className="panel glass">
            <h4>{item.title}</h4>
            <p>{item.description}</p>
          </div>
        ))}
      </div>

    </div>
  </div>
)}
    </>
  );
}