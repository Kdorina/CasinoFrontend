import React, { useState } from "react";
import "./RouletteGame.css";

const ROULETTE_NUMBERS = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36,
  11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9,
  22, 18, 29, 7, 28, 12, 35, 3, 26,
];

const RED_NUMBERS = new Set([
  1, 3, 5, 7, 9, 12, 14, 16, 18,
  19, 21, 23, 25, 27, 30, 32, 34, 36,
]);

const CHIP_VALUES = [1, 5, 25, 100];

// ennyi fok jut egy számra
const SEGMENT_ANGLE = 360 / ROULETTE_NUMBERS.length;
// kerék kép offset – ezzel tudsz finomhangolni
const WHEEL_OFFSET = 19.46;

export default function RouletteGame() {
  const [spinning, setSpinning] = useState(false);
  const [angle, setAngle] = useState(0);
  const [result, setResult] = useState(null);
  const [lastResults, setLastResults] = useState([]);

  const [balance, setBalance] = useState(1000);
  const [chip, setChip] = useState(5);
  const [bets, setBets] = useState([]); // { type, value, amount }
  const [lastWin, setLastWin] = useState(0);

  const totalBet = bets.reduce((s, b) => s + b.amount, 0);

  const placeBet = (type, value) => {
    if (spinning) return;
    if (balance < chip) return;

    setBalance((b) => b - chip);
    setBets((prev) => {
      const idx = prev.findIndex(
        (bet) => bet.type === type && bet.value === value
      );
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], amount: copy[idx].amount + chip };
        return copy;
      }
      return [...prev, { type, value, amount: chip }];
    });
  };

  const getBetAmount = (type, value) =>
    bets
      .filter((b) => b.type === type && b.value === value)
      .reduce((s, b) => s + b.amount, 0);

  const clearBets = () => {
    if (spinning) return;
    const refund = bets.reduce((s, b) => s + b.amount, 0);
    setBalance((b) => b + refund);
    setBets([]);
    setResult(null);
    setLastWin(0);
  };

  const spinWheel = () => {
    if (spinning || bets.length === 0) return;

    setSpinning(true);
    setLastWin(0);
    setResult(null);

    // sorsolunk egy indexet, ehhez igazítjuk a kereket
    const index = Math.floor(Math.random() * ROULETTE_NUMBERS.length);
    const landed = ROULETTE_NUMBERS[index];

    const extraTurns = 6 + Math.floor(Math.random() * 3); // 6–8 teljes kör
    const targetAngle =
      angle + extraTurns * 360 + index * SEGMENT_ANGLE + WHEEL_OFFSET;

    setAngle(targetAngle);

    setTimeout(() => {
      resolveSpin(landed);
      setSpinning(false);
    }, 4000);
  };

  const resolveSpin = (landed) => {
    let winnings = 0;

    for (const bet of bets) {
      if (bet.type === "number" && bet.value === landed) {
        winnings += bet.amount * 36;
      }
      if (bet.type === "color") {
        const isRed = RED_NUMBERS.has(landed);
        const isBlack = landed !== 0 && !RED_NUMBERS.has(landed);
        if (bet.value === "red" && isRed) winnings += bet.amount * 2;
        if (bet.value === "black" && isBlack) winnings += bet.amount * 2;
      }
      if (bet.type === "parity" && landed !== 0) {
        const isEven = landed % 2 === 0;
        if (bet.value === "even" && isEven) winnings += bet.amount * 2;
        if (bet.value === "odd" && !isEven) winnings += bet.amount * 2;
      }
    }

    setBalance((b) => b + winnings);
    setLastWin(winnings);
    setResult(landed);
    setBets([]);

    setLastResults((prev) => {
      const updated = [landed, ...prev];
      return updated.slice(0, 4);
    });
  };

  const renderNumberCell = (n) => {
    const isZero = n === 0;
    const isRed = RED_NUMBERS.has(n);
    const colorClass = isZero
      ? "rg-cell-zero"
      : isRed
      ? "rg-cell-red"
      : "rg-cell-black";

    const amount = getBetAmount("number", n);

    return (
      <div
        key={n}
        className={`rg-table-cell ${colorClass}`}
        onClick={() => placeBet("number", n)}
      >
        <span className="rg-cell-number">{n}</span>
        {amount > 0 && (
          <span className="rg-cell-bet">{amount}</span>
        )}
      </div>
    );
  };

  const numberRows = [
    [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
    [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
    [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
  ];

  const colorLabel =
    result === null
      ? ""
      : result === 0
      ? "GREEN"
      : RED_NUMBERS.has(result)
      ? "RED"
      : "BLACK";

  return (
    <div className="rg-root">
      <div className="rg-cabinet">
        {/* BAL OLDALI FEJLÉC / HISTORY SÁV */}
        <div className="rg-side-rail">
          <div className="rg-history">
            {lastResults.map((n, i) => (
              <div
                key={i}
                className={
                  "rg-history-item " +
                  (n === 0
                    ? "rg-his-green"
                    : RED_NUMBERS.has(n)
                    ? "rg-his-red"
                    : "rg-his-black")
                }
              >
                {n}
              </div>
            ))}
          </div>

          <div className="rg-side-buttons">
            <button className="rg-side-round">⏮</button>
            <button className="rg-side-round">🔊</button>
            <button className="rg-side-round">?</button>
          </div>
        </div>

        {/* FŐ JÁTÉKTÉR */}
        <div className="rg-main-panel">
          {/* felső fa fejléccel */}
          <div className="rg-top-wood">
            <div className="rg-banner">EUROPEAN ROULETTE</div>
          </div>

          <div className="rg-content-row">
            {/* BAL: KERÉK + CLEAR/SPIN + CHIPEK */}
            <div className="rg-left-panel">
              <div className="rg-wheel-panel">
                <div className="rg-wheel-inner">
                  <div className="rg-wheel-shadow">
                    <div
                      className="rg-wheel-img-wrapper"
                      style={{
                        transform: `rotate(${angle}deg)`,
                        transition: spinning
                          ? "transform 4s cubic-bezier(0.1, 0.7, 0, 1)"
                          : "none",
                      }}
                    >
                      {/* IDE TESZED BE A SAJÁT KEREKET */}
                      <img
                        src="/img/wheel.png"
                        alt="Roulette"
                        className="rg-wheel-img"
                      />
                    </div>
                    {/* golyó – most fixen alul, opcionálisan animálható */}
                    <div className="rg-ball" />
                  </div>
                </div>
              </div>

              <div className="rg-controls-row">
                <button
                  className="rg-circle-btn rg-clear-btn"
                  onClick={clearBets}
                  disabled={spinning || bets.length === 0}
                >
                  CLEAR
                </button>
                <button
                  className="rg-circle-btn rg-spin-btn"
                  onClick={spinWheel}
                  disabled={spinning || bets.length === 0}
                >
                  {spinning ? "SPINNING" : "SPIN"}
                </button>
              </div>

              <div className="rg-chips-row">
                {CHIP_VALUES.map((v) => (
                  <button
                    key={v}
                    className={
                      "rg-chip" + (chip === v ? " rg-chip-active" : "")
                    }
                    onClick={() => setChip(v)}
                  >
                    <span>{v}</span>
                  </button>
                ))}
              </div>

              <div className="rg-status-row">
                <span>Balance: ${balance}</span>
                <span>Total bet: ${totalBet}</span>
                <span>Last win: ${lastWin}</span>
              </div>

              {result !== null && (
                <div className="rg-result-label">
                  RESULT: {result} {colorLabel && `(${colorLabel})`}
                </div>
              )}
            </div>

            {/* JOBB: TÉT TÁBLA */}
            <div className="rg-right-panel">
              <div className="rg-table-border">
                <div className="rg-table-top-row">
                  <div className="rg-top-zero">0</div>
                </div>

                <div className="rg-table-main">
                  {/* baloldalt 1–18 stb. */}
                  <div className="rg-outside-col">
                    <div
                      className="rg-outside-slot"
                      onClick={() => placeBet("range", "1-18")}
                    >
                      1 - 18
                    </div>
                    <div
                      className="rg-outside-slot"
                      onClick={() => placeBet("parity", "even")}
                    >
                      EVEN
                    </div>
                    <div
                      className="rg-outside-slot"
                      onClick={() => placeBet("range", "19-36")}
                    >
                      19 - 36
                    </div>
                  </div>

                  {/* középen a számok */}
                  <div className="rg-numbers-block">
                    {numberRows.map((row, i) => (
                      <div key={i} className="rg-numbers-row">
                        {row.map((n) => renderNumberCell(n))}
                      </div>
                    ))}
                  </div>

                  {/* jobb oldali 1st / 2nd / 3rd 12 jelölések – csak UI */}
                  <div className="rg-side-col">
                    <div className="rg-side-label">1st 12</div>
                    <div className="rg-side-label">2nd 12</div>
                    <div className="rg-side-label">3rd 12</div>
                  </div>
                </div>

                {/* alsó sor – even/red/black/odd imitáció */}
                <div className="rg-bottom-row">
                  <div
                    className="rg-bottom-slot"
                    onClick={() => placeBet("parity", "even")}
                  >
                    EVEN
                  </div>
                  <div
                    className="rg-bottom-slot rg-bottom-red"
                    onClick={() => placeBet("color", "red")}
                  >
                    RED
                  </div>
                  <div
                    className="rg-bottom-slot rg-bottom-black"
                    onClick={() => placeBet("color", "black")}
                  >
                    BLACK
                  </div>
                  <div
                    className="rg-bottom-slot"
                    onClick={() => placeBet("parity", "odd")}
                  >
                    ODD
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>      
    </div>
  );
}
