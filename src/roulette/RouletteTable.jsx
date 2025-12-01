// src/roulette/RouletteTable.jsx
import React from "react";

const RED = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];

export default function RouletteTable({ playerBets, botBets }) {

  const fields = Array.from({ length: 37 }, (_, i) => i);

  function getBotBet(field) {
    return botBets.filter(b => b.fieldId === field).length;
  }

  return (
    <div className="table-container">
      <div className="fields-grid">
        {fields.map(n => (
          <div 
            key={n}
            className={`table-field ${
              n === 0 ? "green" :
              RED.includes(n) ? "red" : "black"
            }`}
          >
            <span>{n}</span>

            {getBotBet(n) > 0 && (
              <div className="bot-chip" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
