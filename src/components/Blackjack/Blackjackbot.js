export function createAIPlayer() {
  return {
    name: "Játékos (AI)",
    tokens: 2000,
    cards: [],
    bet: 0,

    placeBet() {
      const amounts = [100, 200];
      this.bet = amounts[Math.floor(Math.random() * amounts.length)];
      return this.bet;
    },

    reset() {
      this.cards = [];
      this.bet = 0;
    },

    decideMove(points, dealerCard) {
  // Ha 11 vagy kevesebb → mindig húz
  if (points <= 11) return "hit";

  // Ha 17 vagy több → mindig standol
  if (points >= 17) return "stand";

  // 12–16 → a dealer lapja dönt
  // Ha a dealer erős lapot mutat (7–A), akkor AI húz
  if (dealerCard >= 7) return "hit";

  // Ha gyenge dealer lap (2–6), AI megáll
  return "stand";
}

  };
}
