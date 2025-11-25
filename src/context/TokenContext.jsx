import { createContext, useState } from "react";

export const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
  const [tokens, setTokens] = useState(1200);
  const [balanceFt, setBalanceFt] = useState(0); // <-- Ft egyenleg

  const TOKEN_RATE = 10; // 1 token = 10 Ft

  const withdrawTokens = (amount) => {
    // Csökkentjük a tokent
    setTokens((prev) => prev - amount);

    // Átváltjuk Ft-ra
    const ft = amount * TOKEN_RATE;

    // Hozzáadjuk az Ft-egyenleghez
    setBalanceFt((prev) => prev + ft);

    return ft; // fontos! visszaadjuk, hogy megjelenhessen
  };

  return (
    <TokenContext.Provider
      value={{ tokens, balanceFt, withdrawTokens, TOKEN_RATE }}
    >
      {children}
    </TokenContext.Provider>
  );
};
