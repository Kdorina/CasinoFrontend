import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SUITS = ["♠", "♥", "♦", "♣"];
const VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

// Kártyahúzás
function drawCard() {
  const suit = SUITS[Math.floor(Math.random() * SUITS.length)];
  const value = VALUES[Math.floor(Math.random() * VALUES.length)];
  return { suit, value };
}

// Kártya érték
function cardValue(card) {
  if (["J", "Q", "K"].includes(card.value)) return 10;
  if (card.value === "A") return 11;
  return parseInt(card.value);
}

// Kéz érték
function handValue(hand) {
  let total = hand.reduce((sum, c) => sum + cardValue(c), 0);
  let aces = hand.filter((c) => c.value === "A").length;

  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }
  return total;
}

export default function Blackjack() {
  const navigate = useNavigate();

  const [bet, setBet] = useState("");
  const [betLocked, setBetLocked] = useState(false);

  const [player, setPlayer] = useState([]);
  const [dealer, setDealer] = useState([]);
  const [revealed, setRevealed] = useState(false);
  const [message, setMessage] = useState("");

  const [insuranceTaken, setInsuranceTaken] = useState(false);
  const [insuranceMessage, setInsuranceMessage] = useState("");

  // Játék kezdete
  const startGame = () => {
    if (!bet || bet <= 0) return;

    const p1 = drawCard();
    const p2 = drawCard();
    const d1 = drawCard(); // EZ a látható lap
    const d2 = drawCard(); // EZ a rejtett lap

    setPlayer([p1, p2]);
    setDealer([d1, d2]); // FONTOS: dealer[0] = látható
    setBetLocked(true);
    setInsuranceTaken(false);
    setInsuranceMessage("");
    setMessage("");
  };

  // Hit
  const hit = () => {
    const newCard = drawCard();
    const newHand = [...player, newCard];
    setPlayer(newHand);

    if (handValue(newHand) > 21) {
      setMessage("Vesztettél – túlmentél 21-en.");
      setRevealed(true);
    }
  };

  // Stand
  const stand = () => {
    setRevealed(true);

    let d = [...dealer];
    while (handValue(d) < 17) {
      d.push(drawCard());
    }
    setDealer(d);

    const playerV = handValue(player);
    const dealerV = handValue(d);

    if (dealerV > 21 || playerV > dealerV) {
      setMessage("Nyertél!");
    } else if (playerV === dealerV) {
      setMessage("Döntetlen.");
    } else {
      setMessage("Vesztettél.");
    }
  };

  // Insurance
  const takeInsurance = () => {
    if (!canTakeInsurance) return;

    setInsuranceTaken(true);
    const halfBet = bet / 2;

    const secondCard = dealer[1];
    const dealerHasBlackjack =
      secondCard &&
      (secondCard.value === "10" || ["J", "Q", "K"].includes(secondCard.value));

    if (dealerHasBlackjack) {
      setMessage("Insurance nyert! Az osztónak blackjack-je van.");
      setRevealed(true);
    } else {
      setInsuranceMessage("Insurance elveszett – az osztónak nincs blackjack-je.");
    }
  };

  // Double down
  const doubleDown = () => {
    if (revealed) return;

    setBet((b) => b * 2);

    const newCard = drawCard();
    const newHand = [...player, newCard];
    setPlayer(newHand);

    setTimeout(() => {
      const playerV = handValue(newHand);

      let d = [...dealer];
      while (handValue(d) < 17) {
        d.push(drawCard());
      }
      setDealer(d);

      const dealerV = handValue(d);

      if (playerV > 21) {
        setMessage("Vesztettél – túlmentél 21-en.");
      } else if (dealerV > 21 || playerV > dealerV) {
        setMessage("Nyertél!");
      } else if (playerV === dealerV) {
        setMessage("Döntetlen.");
      } else {
        setMessage("Vesztettél.");
      }

      setRevealed(true);
    }, 150);
  };

  // Reset
  const reset = () => {
    setPlayer([]);
    setDealer([]);
    setMessage("");
    setInsuranceMessage("");
    setInsuranceTaken(false);
    setRevealed(false);
    setBetLocked(false);
    setBet("");
  };

  // Insurance csak akkor engedélyezett, ha a dealer első (látható) lapja ÁSZ
  const canTakeInsurance =
    dealer.length > 0 &&
    dealer[0].value === "A" &&
    !revealed &&
    !insuranceTaken;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#02320f",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 20,
        color: "white",
      }}
    >
      <button
        onClick={() => navigate("/")}
        style={{
          background: "#ffffff22",
          color: "white",
          border: "none",
          padding: "6px 14px",
          borderRadius: 6,
          cursor: "pointer",
          marginBottom: 20,
        }}
      >
        Vissza a főoldalra
      </button>

      <h1 style={{ marginBottom: 20 }}>Blackjack</h1>

      {!betLocked && (
        <div style={{ textAlign: "center", marginTop: 10 }}>
          <input
            type="number"
            placeholder="Tét (token)"
            value={bet}
            onChange={(e) => setBet(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: 6,
              border: "1px solid #ccc",
              width: 140,
              textAlign: "center",
            }}
          />
          <br />
          <button
            onClick={startGame}
            style={{
              marginTop: 15,
              padding: "10px 20px",
              background: "#00b32a",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 18,
            }}
          >
            Játék indítása
          </button>
        </div>
      )}

      {betLocked && (
        <>
          {/* Blackjack asztal */}
          <div
            style={{
              width: 955,
              height: 524,
              backgroundImage: "url('/img/Black-Jack-Online-game.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
              borderRadius: 12,
              marginTop: 20,
              boxShadow: "0 0 30px rgba(0,0,0,0.7)",
            }}
          >
            {/* DEALER KÁRTYÁK */}
            <div
              style={{
                position: "absolute",
                top: 40,
                left: 412,
                display: "flex",
                gap: 12,
              }}
            >
              {/* FIRST card = LÁTHATÓ */}
              <div
                style={{
                  width: 70,
                  height: 100,
                  padding: "6px",
                  background: "white",
                  color: "black",
                  borderRadius: 10,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 24,
                  fontWeight: "bold",
                  boxShadow: "0 8px 15px rgba(0,0,0,0.6)",
                  border: "2px solid #000",
                }}
              >
                {dealer[0]?.value}
                {dealer[0]?.suit}
              </div>

              {/* SECOND card = REJTETT */}
              <div
                style={{
                  width: 70,
                  height: 100,
                  padding: "6px",
                  background: revealed
                    ? "white"
                    : "linear-gradient(135deg, #b51717, #7a0c0c)",
                  color: revealed ? "black" : "transparent",
                  borderRadius: 10,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 24,
                  fontWeight: "bold",
                  boxShadow: "0 8px 15px rgba(0,0,0,0.6)",
                  border: "2px solid #000",
                }}
              >
                {revealed ? dealer[1]?.value + dealer[1]?.suit : "🂠"}
              </div>
            </div>

            {/* PLAYER KÁRTYÁK */}
            <div
              style={{
                position: "absolute",
                top: 245,
                left: 550,
                display: "flex",
                gap: 6,
              }}
            >
              {player.map((c, i) => (
                <div
                  key={i}
                  style={{
                    width: 70,
                    height: 100,
                    padding: "6px",
                    background: "white",
                    color: "black",
                    borderRadius: 10,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: 24,
                    fontWeight: "bold",
                    boxShadow: "0 8px 15px rgba(0,0,0,0.6)",
                    border: "2px solid #000",
                  }}
                >
                  {c.value}
                  {c.suit}
                </div>
              ))}
            </div>

            {/* Tét kijelzés */}
            <div
              style={{
                position: "absolute",
                bottom: 25,
                right: 20,
                fontSize: 12,
                fontWeight: "bold",
                color: "white",
                textShadow: "0 0 8px black",
                background: "rgba(0,0,0,0.4)",
                padding: "4px 16px",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.4)",
              }}
            >
              Total Bet: {bet}
            </div>

            {/* Insurance üzenet */}
            {insuranceMessage && (
              <div
                style={{
                  position: "absolute",
                  bottom: 75,
                  left: 260,
                  fontSize: 14,
                  color: "gold",
                  textShadow: "0 0 4px black",
                }}
              >
                {insuranceMessage}
              </div>
            )}

            {/* GOMBOK */}
            {!revealed && (
              <div
                style={{
                  position: "absolute",
                  bottom: 3,
                  left: 240,
                  display: "flex",
                  gap: 20,
                }}
              >
                {/* INSURANCE */}
                <button
                  onClick={() => {
                    if (canTakeInsurance) takeInsurance();
                  }}
                  onMouseEnter={() => {
                    if (!canTakeInsurance)
                      setInsuranceMessage("Az osztó kezében nincs ász!");
                  }}
                  onMouseLeave={() => setInsuranceMessage("")}
                  style={{
                    padding: "25px 12px",
                    background: "gold",
                    color: "black",
                    border: "2px solid black",
                    borderRadius: 10,
                    cursor: "pointer",
                    fontSize: 18,
                    fontWeight: "bold",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
                  }}
                >
                  Insurance
                </button>

                {/* STAND */}
                <button
                  onClick={stand}
                  style={{
                    padding: "12px 28px",
                    background: "#ffb300",
                    color: "black",
                    border: "none",
                    borderRadius: 10,
                    cursor: "pointer",
                    fontSize: 18,
                    fontWeight: "bold",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
                  }}
                >
                  Stand
                </button>

                {/* HIT */}
                <button
                  onClick={hit}
                  style={{
                    padding: "12px 28px",
                    background: "#00aaff",
                    color: "white",
                    border: "none",
                    borderRadius: 10,
                    cursor: "pointer",
                    fontSize: 18,
                    fontWeight: "bold",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
                  }}
                >
                  Hit
                </button>

                {/* DOUBLE */}
                <button
                  onClick={doubleDown}
                  style={{
                    padding: "12px 28px",
                    background: "#00c853",
                    color: "white",
                    border: "none",
                    borderRadius: 10,
                    cursor: "pointer",
                    fontSize: 18,
                    fontWeight: "bold",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
                  }}
                >
                  Double
                </button>
              </div>
            )}
          </div>

          {/* Pontok */}
          <div style={{ marginTop: 20, textAlign: "center" }}>
            <p>Osztó pont: {revealed ? handValue(dealer) : "?"}</p>
            <p>Te: {handValue(player)}</p>
          </div>

          {/* ÚJ KÖR */}
          {message && (
            <div style={{ textAlign: "center", marginTop: 25, fontSize: 24 }}>
              {message}
              <br />
              <button
                onClick={reset}
                style={{
                  marginTop: 15,
                  padding: "10px 20px",
                  background: "white",
                  color: "black",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                Új kör
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
