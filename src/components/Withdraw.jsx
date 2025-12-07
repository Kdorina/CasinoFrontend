import React, { useState, useContext } from "react";
import { TokenContext } from "../context/TokenContext";

const Withdraw = () => {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const { tokens, withdrawTokens } = useContext(TokenContext);

  const handleWithdraw = (e) => {
    e.preventDefault();
    setMessage("");

    const num = Number(amount);

    if (num <= 0) {
      setMessage("Adj meg pozitív mennyiséget!");
      return;
    }

    if (num > tokens) {
      setMessage("Nincs ennyi tokened!");
      return;
    }

    const ft = withdrawTokens(num);

    setMessage(`✅ ${num} token → ${ft} Ft`);
    setAmount("");
  };

  return (
    <div className="withdraw-popup">
      <form onSubmit={handleWithdraw}>
        <label>Token mennyiség</label>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button className="primary-btn">
          Beváltás
        </button>
      </form>

      {message && <p className="success-msg">{message}</p>}
    </div>
  );
};

export default Withdraw;
