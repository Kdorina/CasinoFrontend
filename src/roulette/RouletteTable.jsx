import React from "react";
import "./roulette.css";

const RED = [
  1,3,5,7,9,12,14,16,18,
  19,21,23,25,27,30,32,34,36
];

export default function RouletteTable({ bets, onPlaceBet }) {

  const getBet = (fieldId) =>
    bets.find(b => b.fieldId === fieldId);

  return (
    <div className="roulette-table">

      {/* ZERO */}
      <div className="table-numbers">
        <div className="cell zero" onClick={() => onPlaceBet(0)}>
          <span>0</span>
          {getBet(0) && (
            <div className={`chip-on-cell chip-${getBet(0).color}`}>
              {getBet(0).amount}
            </div>
          )}
        </div>

        {/* NUMBERS 1–36 */}
        <div className="numbers-grid">
          {[...Array(36)].map((_, i) => {
            const n = i + 1;
            const bet = getBet(n);

            return (
              <div
                key={n}
                className={`cell number ${RED.includes(n) ? "red" : "black"}`}
                onClick={() => onPlaceBet(n)}
              >
                <span>{n}</span>

                {bet && (
                  <div className={`chip-on-cell chip-${bet.color}`}>
                    {bet.amount}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2 TO 1 columns */}
      <div className="columns-row">
        {[1,2,3].map((col) => {
          const id = `col-${col}`;

          return (
            <div
              key={col}
              className="cell col-bet"
              onClick={() => onPlaceBet(id)}
            >
              2 TO 1

              {getBet(id) && (
                <div className={`chip-on-cell chip-${getBet(id).color}`}>
                  {getBet(id).amount}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Dozens */}
      <div className="dozens-row">
        {["1st12","2nd12","3rd12"].map((dz) => (
          <div
            key={dz}
            className="cell dozen"
            onClick={() => onPlaceBet(dz)}
          >
            {dz.replace("st","st ").replace("nd","nd ").replace("rd","rd ")}

            {getBet(dz) && (
              <div className={`chip-on-cell chip-${getBet(dz).color}`}>
                {getBet(dz).amount}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* OUTSIDE BETS */}
      <div className="outside-bets-row">

        {/* 1–18 */}
        <div className="cell outside" onClick={() => onPlaceBet("1-18")}>
          1 to 18
          {getBet("1-18") && (
            <div className={`chip-on-cell chip-${getBet("1-18").color}`}>
              {getBet("1-18").amount}
            </div>
          )}
        </div>

        {/* EVEN */}
        <div className="cell outside" onClick={() => onPlaceBet("even")}>
          EVEN
          {getBet("even") && (
            <div className={`chip-on-cell chip-${getBet("even").color}`}>
              {getBet("even").amount}
            </div>
          )}
        </div>

        {/* RED */}
        <div className="cell outside red" onClick={() => onPlaceBet("red")}>
          {getBet("red") && (
            <div className={`chip-on-cell chip-${getBet("red").color}`}>
              {getBet("red").amount}
            </div>
          )}
        </div>

        {/* BLACK */}
        <div className="cell outside black" onClick={() => onPlaceBet("black")}>
          {getBet("black") && (
            <div className={`chip-on-cell chip-${getBet("black").color}`}>
              {getBet("black").amount}
            </div>
          )}
        </div>

        {/* ODD */}
        <div className="cell outside" onClick={() => onPlaceBet("odd")}>
          ODD
          {getBet("odd") && (
            <div className={`chip-on-cell chip-${getBet("odd").color}`}>
              {getBet("odd").amount}
            </div>
          )}
        </div>

        {/* 19–36 */}
        <div className="cell outside" onClick={() => onPlaceBet("19-36")}>
          19 to 36
          {getBet("19-36") && (
            <div className={`chip-on-cell chip-${getBet("19-36").color}`}>
              {getBet("19-36").amount}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
