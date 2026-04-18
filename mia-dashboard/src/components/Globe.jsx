import { useState, useEffect, useRef } from "react";
import Globe from "react-globe.gl";

export default function GlobeComponent({ onRegionSelect }) {
  const globeRef = useRef();
  const containerRef = useRef();
  const [size, setSize] = useState({ width: 0, height: 220 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setSize({
          width: containerRef.current.offsetWidth,
          height: 220,
        });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (globeRef.current) {
      const controls = globeRef.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;
      controls.enableZoom = true;
      controls.enablePan = false;
      controls.enableDamping = true;
    }
  }, []);

  const handleGlobeClick = (coords) => {
    const { lat, lng } = coords;

    let region = "us";

    if (lat > 5 && lat < 40 && lng > 60 && lng < 100) {
      region = "in";
    } else if (lat > 24 && lat < 50 && lng > -125 && lng < -66) {
      region = "us";
    } else if (lat > 40 && lng > -10 && lng < 40) {
      region = "gb";
    }

    if (onRegionSelect) {
      onRegionSelect(region);
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "220px",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Globe
        ref={globeRef}
        width={size.width}
        height={size.height}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundColor="rgba(0,0,0,0)"
        showAtmosphere={true}
        atmosphereColor="#00f0ff"
        atmosphereAltitude={0.2}
        onGlobeClick={handleGlobeClick}
      />
    </div>
  );
}