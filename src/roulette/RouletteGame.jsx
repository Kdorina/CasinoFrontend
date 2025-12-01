import React, { useState, useEffect } from "react";
import RouletteWheel from "./RouletteWheel.jsx";
import RouletteTable from "./RouletteTable.jsx";
import RouletteChips from "./RouletteChips.jsx";
import useBotConnection from "../bot/useBotConnection.jsx";
import "./roulette.css";

export default function RouletteGame() {
  // ------------------------------
  // MOBIL ORIENTATION FIGYELÉS
  // ------------------------------
  const [isLandscape, setIsLandscape] = useState(
    window.innerWidth > window.innerHeight
  );

  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);

    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  // ------------------------------
  // RULETT LOGIKA
  // ------------------------------
  const [balance, setBalance] = useState(1000);
  const [bets, setBets] = useState([]);
  const [selectedChip, setSelectedChip] = useState(10);
  const [result, setResult] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [message, setMessage] = useState("");

  const chipObjects = [
    { value: 5, color: "black" },
    { value: 10, color: "blue" },
    { value: 25, color: "green" },
    { value: 50, color: "red" },
    { value: 100, color: "purple" }
  ];

  const currentChip = chipObjects.find((c) => c.value === selectedChip);
  const totalBet = bets.reduce((sum, b) => sum + b.amount, 0);

  // ------------------------------
  // BOT – Rulett AI
  // ------------------------------
  const {
    bot,
    isBotPresent,
    maybeJoin,
    placeRouletteBet,
    handleRoundResult
  } = useBotConnection({
    onBotBet: (bet) => {
      // BOT tétje NEM jelenik meg vizuálisan, de számít a kör eredményénél
      setBets((prev) => [
        ...prev,
        {
          fieldId: bet.value, // red vagy black
          amount: bet.amount,
          isBot: true
        }
      ]);
    },

    onBotMessage: (msg) => {
      setMessage("Bot: " + msg);
    },

    onBotLeave: (reason) => {
      if (reason) {
        setMessage("Bot: " + reason);
      } else {
        setMessage("A bot elhagyta a játékot.");
      }
    }
  });

  // ------------------------------
  // TÉT FELRAKÁS
  // ------------------------------
  const handlePlaceBet = (fieldId) => {
    if (spinning) return;

    if (balance - totalBet < currentChip.value) {
      setMessage("Nincs elég egyenleged!");
      return;
    }

    setBets((prev) => {
      const existing = prev.find((b) => b.fieldId === fieldId);

      if (existing) {
        return prev.map((b) =>
          b.fieldId === fieldId
            ? { ...b, amount: b.amount + currentChip.value }
            : b
        );
      }

      return [
        ...prev,
        {
          fieldId,
          amount: currentChip.value,
          color: currentChip.color
        }
      ];
    });
  };

  // ------------------------------
  // TÉTEK TÖRLÉSE
  // ------------------------------
  const clearBets = () => {
    if (spinning) return;
    setBets([]);
    setMessage("Tétek törölve.");
  };

  // ------------------------------
  // PÖRGETÉS + BOT LOGIKA
  // ------------------------------
  const handleSpin = () => {
    // BOT csatlakozik 35% eséllyel
    const joined = maybeJoin();
    if (joined) setMessage("A bot csatlakozott a játékhoz.");

    // BOT tesz tétet
    if (isBotPresent) placeRouletteBet();

    if (bets.length === 0) {
      setMessage("Tegyél fel tétet!");
      return;
    }

    setMessage("");
    setSpinning(true);

    const winning = Math.floor(Math.random() * 37);

    setTimeout(() => {
      setResult(winning);

      const winBets = bets.filter((b) => b.fieldId == winning);
      let winAmount = 0;

      winBets.forEach((b) => {
        winAmount += b.amount * 35;
      });

      setBalance(balance - totalBet + winAmount);

      if (winAmount > 0) {
        setMessage(`Nyertél ${winAmount} tokent!`);
      } else {
        setMessage(`Nem nyertél. Nyerő szám: ${winning}`);
      }

      // BOT kör végi viselkedése
      const botWon = winAmount > 0;
      handleRoundResult(botWon);

      setBets([]);
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
          📱 Kérlek fordítsd el a telefont fekvő (landscape) nézetbe a játékhoz!
        </div>
      )}

      <div className="roulette-responsive-wrapper">
        <div className="roulette-root">
          
          {/* BAL OLDAL */}
          <div className="left-side">
            <div className="balance-box">Egyenleg: {balance} token</div>

            <RouletteWheel number={result} spinning={spinning} />

            <button
              className="spin-button"
              onClick={handleSpin}
              disabled={spinning}
            >
              Megpörgetem
            </button>

            {message && <div className="info-msg">{message}</div>}
          </div>

          {/* JOBB OLDAL */}
          <div className="right-side">
            <RouletteTable
              bets={bets.filter((b) => !b.isBot)} // BOT tétje nem jelenik meg
              onPlaceBet={handlePlaceBet}
            />

            <div className="chip-and-clear">
              <RouletteChips
                selected={selectedChip}
                onSelect={setSelectedChip}
              />

              <div className="total-bet-side">
                Összesen feltett tét: {totalBet}
              </div>

              <button
                className="clear-button"
                onClick={clearBets}
                disabled={spinning}
              >
                Tétek törlése
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
