import { useState, useCallback } from "react";

export default function useBotConnection({ onPlaceRouletteBet, onBotMessage, onBotLeave }) {
  const [bot, setBot] = useState(null);

  const getRandomAmount = () => Math.floor(Math.random() * 91) + 10; // 10–100

  // Rulett tét generálás (0–36 közötti számra)
  const createRandomBet = () => {
    const fieldId = Math.floor(Math.random() * 37); // 0..36
    const amount = getRandomAmount();
    return { fieldId, amount };
  };

  // 35% eséllyel csatlakozik ÉS első körben azonnal tesz tétet
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

    // első körben azonnal tesz egy tétet
    const bet = createRandomBet();
    onPlaceRouletteBet(bet);

    return true;
  }, [bot, onPlaceRouletteBet]);

  // további körökben tét (ha már bent ül)
  const placeRouletteBet = useCallback(() => {
    if (!bot) return;
    const bet = createRandomBet();
    onPlaceRouletteBet(bet);
  }, [bot, onPlaceRouletteBet]);

  const winMessages = ["Nyertem!", "Gazdag vagyok!", "Megyek Hollywoodba!"];

  const handleRoundResult = useCallback(
    (botWon) => {
      if (!bot) return;

      let shouldLeave = false;
      let reason = null;

      if (botWon) {
        // 50% eséllyel mond valamit
        if (Math.random() < 0.5) {
          const msg = winMessages[Math.floor(Math.random() * winMessages.length)];
          onBotMessage(msg);
        }

        // 50% eséllyel kilép
        if (Math.random() < 0.5) {
          shouldLeave = true;
        }
      }

      // minden kör végén 10% eséllyel "Mindent elvesztettem"
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
