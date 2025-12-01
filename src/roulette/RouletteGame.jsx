import React, { useState, useEffect } from "react";
import RouletteWheel from "./RouletteWheel.jsx";
import RouletteTable from "./RouletteTable.jsx";
import RouletteChips from "./RouletteChips.jsx";
import useBotConnection from "../bot/useBotConnection.jsx";

import "../bot.css";
import "./roulette.css";

export default function RouletteGame() {
  // ------------------------------
  // ORIENTATION CHECK
  // ------------------------------
  const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight);

  useEffect(() => {
    const check = () => setIsLandscape(window.innerWidth > window.innerHeight);
    window.addEventListener("resize", check);
    window.addEventListener("orientationchange", check);
    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("orientationchange", check);
    };
  }, []);

  // ------------------------------
  // RULETT LOGIC
  // ------------------------------
  const [balance, setBalance] = useState(1000);
  const [playerBets, setPlayerBets] = useState([]);
  const [botBets, setBotBets] = useState([]);
  const [selectedChip, setSelectedChip] = useState(10);

  const [result, setResult] = useState(null);
  const [spinning, setSpinning] = useState(false);

  const [message, setMessage] = useState("");
  const [botMessage, setBotMessage] = useState("");

  const chips = [
    { value: 5, color: "black" },
    { value: 10, color: "blue" },
    { value: 25, color: "green" },
    { value: 50, color: "red" },
    { value: 100, color: "purple" }
  ];

  const currentChip = chips.find((c) => c.value === selectedChip);
  const totalBet = playerBets.reduce((s, b) => s + b.amount, 0);

  // ------------------------------
  // RULETT COLORS
  // ------------------------------
  const getColorForNumber = (num) => {
    if (num === 0) return "green";
    const reds = new Set([32, 19, 21, 25, 34, 27, 36, 30, 23, 5, 16, 1, 14, 9, 18, 7, 12, 3]);
    return reds.has(num) ? "red" : "black";
  };

  // ------------------------------
  // BOT FIELD OPTIONS
  // ------------------------------
  const VALID_FIELDS = [
    ...Array.from({ length: 37 }, (_, i) => String(i)),
    "1to18", "19to36",
    "even", "odd",
    "red", "black",
    "1st12", "2nd12", "3rd12",
    "2to1-left", "2to1-mid", "2to1-right"
  ];

  // ------------------------------
  // BOT CONNECTION
  // ------------------------------
  const {
    bot,
    isBotPresent,
    maybeJoin,
    placeRouletteBet,
    handleRoundResult
  } = useBotConnection({
    onPlaceRouletteBet: ({ fieldId, amount }) => {
  setBotBets(prev => [
    ...prev,
    {
      fieldId,
      amount,
      color: "bot",  // itt állítjuk be a bot színét
      isBot: true
    }
  ]);
},


    onBotMessage: (msg) => setBotMessage(msg),

    onBotLeave: (msg) => {
      setBotMessage(msg || "Kiléptem.");
      setBotBets([]);
    }
  });

  // ------------------------------
  // PLAYER BET
  // ------------------------------
const handlePlaceBet = (fieldId) => {
  if (spinning) return;

  if (balance - totalBet < currentChip.value) {
    setMessage("Nincs elég egyenleged!");
    return;
  }

  setPlayerBets((prev) => {
    const existing = prev.find((b) => b.fieldId === fieldId);

    if (existing) {
      // csak az amount nő, a color marad, ami volt
      return prev.map((b) =>
        b.fieldId === fieldId
          ? { ...b, amount: b.amount + currentChip.value }
          : b
      );
    }

    // ÚJ tét – FONTOS: color is megy vele
    return [
      ...prev,
      {
        fieldId,
        amount: currentChip.value,
        color: currentChip.color,
        isBot: false
      }
    ];
  });
};


  // ------------------------------
  // CLEAR BETS
  // ------------------------------
  const clearBets = () => {
    if (spinning) return;
    setPlayerBets([]);
    setMessage("Tétek törölve.");
  };

  // ------------------------------
  // BOT — instant tét, amikor csatlakozik
  // ------------------------------
  useEffect(() => {
    if (!isBotPresent) return;
    if (botBets.length > 0) return;

    const field = VALID_FIELDS[Math.floor(Math.random() * VALID_FIELDS.length)];
    const amount = Math.floor(Math.random() * 10) * 10 + 10;

    placeRouletteBet({ fieldId: field, amount });
    setBotMessage("Tettem egy tétet 🤖");
  }, [isBotPresent]);

  // ------------------------------
  // BOT — minden új kör elején új tét
  // ------------------------------
  useEffect(() => {
    if (!isBotPresent) return;
    if (spinning) return;

    const field = VALID_FIELDS[Math.floor(Math.random() * VALID_FIELDS.length)];
    const amount = Math.floor(Math.random() * 10) * 10 + 10;

    placeRouletteBet({ fieldId: field, amount });
    setBotMessage("Új tétet tettem 🤖");

  }, [result]);

  // ------------------------------
  // SPIN
  // ------------------------------
  const handleSpin = () => {
    if (spinning) return;

    // BOT attempt join
    if (maybeJoin()) {
      setBotMessage("Csatlakoztam a játékhoz 🤖");
    }

    // BOTNAK KÖTELEZŐ TÉTELHELYEZÉS
    if (isBotPresent && botBets.length === 0) {
      setBotMessage("Várj, még nem tettem tétet! 🤖");
      return;
    }

    // PLAYER needs a bet
    if (playerBets.length === 0) {
      setMessage("Tegyél fel tétet!");
      return;
    }

    setMessage("");
    setBotMessage("");
    setSpinning(true);

    const winning = Math.floor(Math.random() * 37);

    setTimeout(() => {
      setResult(winning);

      // PLAYER RESULT
      let playerWin = 0;
      playerBets.forEach((b) => {
        if (String(b.fieldId) === String(winning)) {
          playerWin += b.amount * 35;
        }
      });

      // BOT RESULT
      let botWin = 0;
      botBets.forEach((b) => {
        if (String(b.fieldId) === String(winning)) {
          botWin += b.amount * 35;
        }
      });

      setBalance((prev) => prev - totalBet + playerWin);

      const color = getColorForNumber(winning);
      const colorText = color === "red" ? "piros" : color === "black" ? "fekete" : "zöld";

      setMessage(
        playerWin > 0
          ? `Nyertél ${playerWin} tokent!`
          : `Nem nyertél. Nyerő szám: ${winning} (${colorText})`
      );

      // BOT RESPONSE
      handleRoundResult(botWin > 0);

      // RESET BETS
      setPlayerBets([]);
      setBotBets([]);

      setSpinning(false);
    }, 4200);
  };

  // ------------------------------
  // RENDER
  // ------------------------------
  return (
    <>
      {!isLandscape && (
        <div className="rotate-overlay">
          📱 Kérlek fordítsd el a telefont fekvő nézetbe!
        </div>
      )}

      <div className="roulette-responsive-wrapper">
        <div className="roulette-root">
          
          {/* LEFT SIDE */}
          <div className="left-side">
            <div className="balance-box">Egyenleg: {balance} token</div>

            <RouletteWheel number={result} spinning={spinning} />

            <button className="spin-button" onClick={handleSpin} disabled={spinning}>
              Megpörgetem
            </button>

            {message && <div className="info-msg">{message}</div>}
          </div>

          {/* RIGHT SIDE */}
          <div className="right-side">
            <RouletteTable
              bets={[...playerBets, ...botBets]}
              onPlaceBet={handlePlaceBet}
            />

            <div className="chip-and-clear">
              <RouletteChips selected={selectedChip} onSelect={setSelectedChip} />

              <div className="total-bet-side">
                Összesen feltett tét: {totalBet}
              </div>

              <button className="clear-button" onClick={clearBets} disabled={spinning}>
                Tétek törlése
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BOT ICON */}
      {isBotPresent && (
        <div className="bot-profile">
          <div className="bot-icon">🤖</div>
          {botMessage && <div className="bot-tooltip">{botMessage}</div>}
        </div>
      )}
    </>
  );
}
