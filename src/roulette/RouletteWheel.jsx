// src/roulette/RouletteWheel.jsx
import React from "react";
import "./roulette.css";

export default function RouletteWheel({ number }) {
  return (
    <div className="wheel-container">
      <div className="wheel-outer">
        <div className="wheel-middle">
          <div className="wheel-inner">
            <div className="wheel-center" />

            <div className="winning-number">
              {number !== null ? `Nyerő szám: ${number}` : ""}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
