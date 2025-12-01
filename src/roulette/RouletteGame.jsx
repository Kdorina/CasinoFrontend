// src/roulette/RouletteGame.jsx
import React, { useState, useCallback } from "react";
import RouletteWheel from "./RouletteWheel.jsx";
import RouletteTable from "./RouletteTable.jsx";
import RouletteChips from "./RouletteChips.jsx";
import useBotConnection from "../bot/useBotConnection.jsx";
import "./roulette.css";

const WIN_MESSAGES = [
  "Nyertem!",
  "Gazdag vagyok",
  "Megyek Hollywoodba!"
];

export default function RouletteGame() {
  const [bot, setBot] = useState({
    present: false,
    name: "Other Player",
    bets: []
  });

  const [chat, setChat] = useState([]);
  const [lastNumber, setLastNumber] = useState(null);
  const [playerBets, setPlayerBets] = useState([]);

  // BOT EVENT KEZELÉS
  const onBotEvent = useCallback((event) => {
    switch (event.type) {
      case "bot_join":
        setBot({ present: true, name: "Other Player", bets: [] });
        setChat(prev => [...prev, { system: true, text: "Other Player csatlakozott a játékhoz." }]);
        break;

      case "bot_bet":
        setBot(prev => ({
          ...prev,
          bets: [...prev.bets, event.bet]
        }));
        break;

      case "bot_win":
        const msg = WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)];
        setChat(prev => [...prev, { from: "Other Player", text: msg }]);
        break;

      case "bot_leave":
        setBot({ present: false, name: "Other Player", bets: [] });
        setChat(prev => [...prev, { system: true, text: "Other Player kilépett a játékból." }]);
        break;
    }
  }, []);

  useBotConnection(onBotEvent);

  // JÁTÉKOS SPIN
  const handleSpin = () => {
    const number = Math.floor(Math.random() * 37);
    setLastNumber(number);

    // bot nyert?
    if (bot.present && bot.bets.some(b => b.fieldId === number)) {
      onBotEvent({ type: "bot_win", playerId: "bot-1" });
    }

    // reset tétek spin után
    setBot(prev => ({ ...prev, bets: [] }));
    setPlayerBets([]);
  };

  return (
    <div className="roulette-root">

      <div className="left-side">
        <RouletteWheel number={lastNumber} />
        <button className="spin-button" onClick={handleSpin}>
          Megpörgetem
        </button>
      </div>

      <div className="right-side">
        <RouletteTable 
          playerBets={playerBets}
          botBets={bot.bets}
        />
        <RouletteChips />

        <div className="chat-box">
          <h3>Chat</h3>
          <div className="chat-messages">
            {chat.map((m,i) => (
              <div key={i} className={
                m.system ? "msg system" :
                m.from === "Other Player" ? "msg bot" :
                "msg you"
              }>
                {m.system ? (
                  <i>{m.text}</i>
                ) : (
                  <>
                    <b>{m.from}:</b> {m.text}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
