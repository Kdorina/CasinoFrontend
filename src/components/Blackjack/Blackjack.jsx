import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAIPlayer } from "./Blackjackbot";




//Kártya pakli
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

  // Ai játékos
  const [ai, setAi] = useState(createAIPlayer());
  const [aiPoints, setAiPoints] = useState(0);

  const [bet, setBet] = useState("");
  const [betLocked, setBetLocked] = useState(false);

  const [player, setPlayer] = useState([]);
  const [dealer, setDealer] = useState([]);
  const [revealed, setRevealed] = useState(false);
  const [message, setMessage] = useState("");

  const [aiRevealed, setAiRevealed] = useState(false);
  const [aiMessage, setAiMessage] = useState("");

  const [insuranceTaken, setInsuranceTaken] = useState(false);
  const [insuranceMessage, setInsuranceMessage] = useState("");



const startGame = () => {
  if (!bet || bet <= 0) return;

  const p1 = drawCard();
  const p2 = drawCard();
  const d1 = drawCard(); 
  const d2 = drawCard();

  //AI PLAYER INIT
  const newAI = createAIPlayer();
  newAI.placeBet(); // random 100 vagy 200

  const aiCards = [drawCard(), drawCard()];
  newAI.cards = aiCards;

  setAi(newAI);
  setAiPoints(handValue(aiCards));
 

  setPlayer([p1, p2]);
  setDealer([d1, d2]);
  setBetLocked(true);
  setInsuranceTaken(false);
  setInsuranceMessage("");
  setMessage("");
  setAiRevealed(false);
  setAiMessage("");
};


  // Hit
  const hit = () => {
    const newCard = drawCard();
    const newHand = [...player, newCard];
    setPlayer(newHand);

    if (handValue(newHand) > 21) {
      setMessage("Vesztettél – túlmentél 21-en.");
      setRevealed(true);
      setAiRevealed(true);
    }
  };

  // Stand
const stand = () => {
  setRevealed(true);

  // --- DEALER HÚZ ---
  let d = [...dealer];
  while (handValue(d) < 17) {
    d.push(drawCard());
  }
  setDealer(d);

  const dealerV = handValue(d);
  const playerV = handValue(player);

  // --- TE EREDMÉNY ---
  if (playerV > 21) {
    setMessage("Vesztettél – túlmentél 21-en.");
  }
  else if (dealerV > 21 || playerV > dealerV) {
    setMessage("Nyertél!");
  }
  else if (playerV === dealerV) {
    setMessage("Döntetlen.");
  }
  else {
    setMessage("Vesztettél.");
  }

  // --- AI lejátszása ---
  handleAIPlay();

  // --- AI felfedése ---
  setAiRevealed(true);

  const aiV = handValue(ai.cards);

  // --- AI eredmény ---
  if (aiV > 21) {
    setAiMessage("Vesztettem! :(");
  } 
  else if (dealerV > 21) {
    setAiMessage("Könnyű győzelem.");
  } 
  else if (aiV > dealerV) {
    setAiMessage("Könnyű győzelem.");
  } 
  else if (aiV === dealerV) {
    setAiMessage("Döntetlen… meh.");
  } 
  else {
    setAiMessage("Vesztettem! :(");
  }
};




  //Ai köre
  const handleAIPlay = () => {
  let updated = { ...ai };

  while (true) {
    const points = handValue(updated.cards);
    setAiPoints(points);

    const move = updated.decideMove(points);

    if (move === "hit") {
      updated.cards.push(drawCard());
    } else {
      break;
    }
  }

  setAi(updated);
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

// 🔥 AI üzenet double után is
const aiV = aiPoints;

if (aiV > 21) {
  setAiMessage("Vesztettem! :(");
} 
else if (dealerV > 21) {
  setAiMessage("Könnyű győzelem.");
}
else if (aiV > dealerV) {
  setAiMessage("Könnyű győzelem.");
}
else if (aiV === dealerV) {
  setAiMessage("Döntetlen… meh.");
}
else {
  setAiMessage("Vesztettem! :(");
}

setAiRevealed(true);

      
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





// styleok
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
    left: 360,
    display: "flex",
    gap: 12,
  }}
>
  {dealer.map((c, i) => {
    const isHiddenSecondCard = i === 1 && !revealed;

    return (
      <div
        key={i}
        style={{
          width: 70,
          height: 100,
          padding: "6px",
          background: isHiddenSecondCard
            ? "linear-gradient(135deg, #b51717, #7a0c0c)"
            : "white",
          color: isHiddenSecondCard ? "transparent" : "black",
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
        {isHiddenSecondCard ? "🂠" : c.value + c.suit}
      </div>
    );
  })}
</div>


 {/* AI + PLAYER */}
<div
  style={{
    position: "absolute",
    top: 175,
    left: 100,
    width: "750px",
    display: "flex",
    justifyContent: "space-between",
    padding: "0 20px",
  }}
>
{/* AI PLAYER */}
<div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>

  {/* CHAT BUBORÉK */}
  {aiRevealed && aiMessage && (
    <div
      style={{
        background: "rgba(255,255,255,0.9)",
        color: "black",
        padding: "6px 12px",
        borderRadius: "10px",
        marginBottom: "6px",
        fontSize: "14px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
        maxWidth: "180px",
        textAlign: "center"
      }}
    >
      {aiMessage}
    </div>
  )}

  <h3>AI Játékos – Tét: {ai.bet}</h3>

  <div style={{ display: "flex", gap: "10px" }}>
    {ai.cards.map((c, i) => (
      <div
        key={i}
        style={{
          width: 70,
          height: 100,
          padding: "6px",
          background: aiRevealed ? "white" : "linear-gradient(135deg, #b51717, #7a0c0c)",
          color: aiRevealed ? "black" : "transparent",
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
        {aiRevealed ? c.value + c.suit : "🂠"}
      </div>
    ))}
  </div>

  <p>Lapok összege: {aiRevealed ? aiPoints : "??"}</p>

</div>


  {/* TE / PLAYER */}
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
    <h3>Te  – Tét: {bet}</h3>

    <div style={{ display: "flex", gap: "10px" }}>
      {player.map((c, i) => (
        <div key={i}
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
          {c.value}{c.suit}
        </div>
      ))}
    </div>

    <p>Lapok összege: {handValue(player)}</p>
  </div>
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
              
            </div>

            {/* Insurance üzenet */}
            {insuranceMessage && (
              <div
                style={{
                  position: "absolute",
                  bottom: 100,
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
            <p>Osztó Lapjainak összege: {revealed ? handValue(dealer) : "?"}</p>
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
