// bot/useBotConnection.jsx
import { useState, useCallback } from "react";

export default function useBotConnection({ onBotBet, onBotMessage, onBotLeave }) {
  const [bot, setBot] = useState(null);

  const getRandomAmount = () => Math.floor(Math.random() * 91) + 10; // 10–100

  // 35% eséllyel csatlakozik a kör elején
  const maybeJoin = useCallback(() => {
    if (bot) return false;

    const shouldJoin = Math.random() < 0.35;
    if (!shouldJoin) return false;

    const newBot = {
      id: "roulette-bot",
      name: "Casino Bot",
      inGame: true,
    };

    setBot(newBot);
    return true;
  }, [bot]);

  // Rulett tét
  const placeRouletteBet = useCallback(() => {
    if (!bot) return;

    const amount = getRandomAmount();
    const colors = ["red", "black"];
    const color = colors[Math.floor(Math.random() * colors.length)];

    const bet = {
      playerId: "bot",
      amount,
      betType: "color",
      value: color,
    };

    onBotBet(bet);
  }, [bot, onBotBet]);

  // Kör végi logika
  const handleRoundResult = useCallback(
    (botWon) => {
      if (!bot) return;

      let shouldLeave = false;
      let reason = null;

      // Ha nyert → 50% üzen, 50% kilép
      if (botWon) {
        if (Math.random() < 0.5) {
          const msgs = ["Nyertem!", "Gazdag vagyok!", "Megyek Hollywoodba!"];
          onBotMessage(msgs[Math.floor(Math.random() * msgs.length)]);
        }

        if (Math.random() < 0.5) {
          shouldLeave = true;
        }
      }

      // Minden körben 10% eséllyel "Mindent elvesztettem"
      if (!shouldLeave && Math.random() < 0.1) {
        shouldLeave = true;
        reason = "Mindent elvesztettem";
      }

      if (shouldLeave) {
        setBot(null);
        onBotLeave(reason);
      }
    },
    [bot, onBotLeave, onBotMessage]
  );

  return {
    bot,
    isBotPresent: !!bot,
    maybeJoin,
    placeRouletteBet,
    handleRoundResult,
  };
}
