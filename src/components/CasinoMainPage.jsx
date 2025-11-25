import React from "react";
import "./CasinoMainPage.css";

function CasinoMainPage() {
  return (
    <div className="casino-wrapper">

      {/* NAVBAR FELSŐ */}
      <nav className="casino-navbar">
        <a className="casino-brand" href="/">Casino.hu</a>
        <a href="#blackjack">Blackjack</a>
        <a href="#roulette">Roulette</a>
        <a href="#ai-blackjack">AI.Blackjack</a>
        <a href="#ai-roulette">AI.Roulette</a>
        <a className="login-btn" href="/login">Belépés</a>
        <a className="register-btn" href="/register">Regisztráció</a>
      </nav>

     

      {/* SLIDER */}
      <div className="slider-box">
        <img
          src="/img/casino-bg.webp"
          className="slider-image"
        />
      </div>

       {/* JATEK HOLDER */}
      <div className="game-holder">

      {/* ROULETTE KATEGÓRIA */}
      <div className="category-box">
        <h2 className="cat-title">Roulette</h2>
       
      </div>

      {/* BLACKJACK KATEGÓRIA */}
      <div className="category-box">
        <h2 className="cat-title">Black Jack</h2>
        
      </div>
      </div>

    </div>
  );
}

export default CasinoMainPage;
