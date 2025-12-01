// src/bot/useBotConnection.jsx
import { useEffect } from "react";

export default function useBotConnection(onEvent) {
  useEffect(() => {
    let joined = false;
    let left = false;

    const interval = setInterval(() => {
      if (!joined) {
        onEvent({ type: "bot_join", playerId: "bot-1" });
        joined = true;
        return;
      }

      if (left) return;

      const r = Math.random();

      if (r < 0.45) {
        // bot tesz tétet → 0–36
        const field = Math.floor(Math.random() * 37);
        onEvent({
          type: "bot_bet",
          playerId: "bot-1",
          bet: { fieldId: field, amount: 10 }
        });
      }

      else if (r < 0.7) {
        onEvent({ type: "bot_win", playerId: "bot-1" });
      }

      else {
        onEvent({ type: "bot_leave", playerId: "bot-1" });
        left = true;
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [onEvent]);
}
