import React, { useCallback, useState } from "react";
import useBotConnection from "../bot/useBotConnection.jsx";
import BotBoard from "./BotBoard.jsx";
import BotChat from "./BotChat.jsx";
import "../bot.css";

const WIN_MESSAGES = ["Nyertem!", "Gazdag vagyok", "Megyek Hollywoodba!"];

const initialBot = {
  present: false,
  id: null,
  name: "Other Player",
  bets: [],
};

export default function BotGame() {
  const [bot, setBot] = useState(initialBot);
  const [chatMessages, setChatMessages] = useState([]);
  const [lastResult, setLastResult] = useState(null);

  const handleEvent = useCallback((event) => {
    switch (event.type) {
      case "bot_join":
        setBot({
          present: true,
          id: event.playerId,
          name: "Other Player",
          bets: [],
        });
        setChatMessages((prev) => [
          ...prev,
          { from: "system", text: "Other Player csatlakozott a játékhoz." },
        ]);
        break;

      case "bot_bet":
      setBot((prev) => ({
        ...prev,
        bets: [...prev.bets, event.bet] 
      }));
      break;


      case "bot_win": {
        const msg =
          WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)];
        setChatMessages((prev) => [...prev, { from: "Other Player", text: msg }]);
        break;
      }

      case "bot_leave":
        setBot(initialBot);
        setChatMessages((prev) => [
          ...prev,
          { from: "system", text: "Other Player kilépett a játékból." },
        ]);
        break;
    }
  }, []);

  useBotConnection(handleEvent);

  const handleSpin = () => {
    const result = Math.floor(Math.random() * 37);
    setLastResult(result);

    if (bot.present && bot.bets.some((b) => b.fieldId === result)) {
      handleEvent({ type: "bot_win", playerId: bot.id });
    }

    setBot((prev) => ({ ...prev, bets: [] }));
  };

  return (
    <div className="bot-game-container">
      <div className="players-panel">
        <div className="player-row you">
          <div className="avatar you-avatar" />
          <div className="player-text">
            <div className="name">Te</div>
            <div className="balance">1234 token</div>
          </div>
          <div className="stats">📊</div>
        </div>

        {bot.present && (
          <div className="player-row bot-row">
            <div className="avatar bot-avatar" />
            <div className="player-text">
              <div className="name">Other Player</div>
            </div>
          </div>
        )}
      </div>

      <div className="board-and-chat">
        <div className="board-panel">
          <BotBoard botBets={bot.bets} lastResult={lastResult} />
          <button className="spin-btn" onClick={handleSpin}>
            Megpörgetem
          </button>
        </div>

        <BotChat messages={chatMessages} />
      </div>
    </div>
  );
}
