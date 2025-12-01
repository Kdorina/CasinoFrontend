// src/roulette/RouletteChips.jsx
import React from "react";
import "./roulette.css";

export default function RouletteChips() {
  const chips = [
    { color: "#000", label: "5" },
    { color: "#1976D2", label: "10" },
    { color: "#4CAF50", label: "25" },
    { color: "#F44336", label: "50" },
    { color: "#9C27B0", label: "100" }
  ];

  return (
    <div className="chips-row">
      {chips.map((c,i) => (
        <div key={i} className="chip" style={{ background: c.color }}>
          {c.label}
        </div>
      ))}
    </div>
  );
}
