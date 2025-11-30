import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TokenContext } from "../context/TokenContext";
import "./Home.css";
//import RouletteGame from "./RouletteGame";   // ← EZT ADD HOZZÁ

const Home = () => {
  const navigate = useNavigate();
  const { tokens, balanceFt } = useContext(TokenContext);

  return (
    <div className="home-wrapper">

      {/* JOBB FELSŐ SAROK */}
      <div className="home-top-right">
        <div className="token-display">Tokenek: <strong>{tokens}</strong></div>
        <div className="money-display">Ft egyenleg: <strong>{balanceFt} Ft</strong></div>
        <button className="withdraw-btn" onClick={() => navigate("/withdraw")}>
          💸 Kifizetés
        </button>
      </div>

      {/* Központi üdvözlés */}
      <div className="home-center">
        <h2>Üdvözlünk a Casino App-ban!</h2>

        {/* IDE KERÜL A RULETT */}
        <RouletteGame />
      </div>

    </div>
  );
};

export default Home;
