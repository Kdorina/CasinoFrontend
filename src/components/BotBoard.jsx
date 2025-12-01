import React from "react";

const FIELDS = Array.from({ length: 37 }, (_, i) => i);

export default function BotBoard({ botBets, lastResult }) {
  const betMap = {};
  botBets.forEach((b) => {
    betMap[b.fieldId] = (betMap[b.fieldId] || 0) + b.amount;
  });

  const redNumbers = [
    1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
  ];

  return (
    <div className="bot-board">
      <div className="result-label">
        {lastResult !== null && <>Nyerő szám: {lastResult}</>}
      </div>
      <div className="grid">
        {FIELDS.map((n) => {
          const hasBet = betMap[n];
          const color =
            n === 0 ? "green" : redNumbers.includes(n) ? "red" : "black";

          return (
            <div key={n} className={`field ${color}`}>
              <span>{n}</span>
              {hasBet && <div className="bot-chip-anim" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
