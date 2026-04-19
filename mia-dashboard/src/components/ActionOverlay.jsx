import { useEffect } from "react";

export default function ActionOverlay({ action, onClose }) {
  if (!action || !action.url) return null;

  useEffect(() => {
    // 🔥 OPEN IN NEW WINDOW (NOT TAB)
    window.open(
      action.url,
      "_blank",
      "width=1200,height=800,left=200,top=100"
    );

    onClose(); // close overlay immediately
  }, [action]);

  return null; // no UI needed
}