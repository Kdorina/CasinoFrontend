import React from "react";
import "./CasinoMainPage.css";

function CasinoMainPage() {
  return (
    <div className="casino-wrapper">

      {/* NAVBAR FELSŐ */}
      <nav className="casino-navbar">
        <a className="casino-brand" href="/">Casino.hu</a>
        
        <div>
        <a className="register-btn" href="/register">Regisztráció</a>
        <a className="login-btn" href="/login">Bejelentkezés</a>
        </div>
      </nav>

     

      {/* SLIDER */}
      <div className="slider-box">
        <img
          src="/img/closeup-roulette-wheel-action-neon-lights-illuminating-scene-with-blurred-crowd-background – nagy.jpeg"
          className="slider-image"
        />
      </div>

       {/* JATEK HOLDER */}
      <div className="game-holder">

      {/* ROULETTE KATEGÓRIA */}
      <div className="category-box">
         <img
          src="/img/Rulett.png"
          className="roulette-image"
        />
       
      </div>

      {/* BLACKJACK KATEGÓRIA */}
      <div className="category-box">
        <img
          src="/img/blackjack.png"
          className="blackjack-image"
        />
  
        
      </div>
      </div>

    </div>
  );
}

export default CasinoMainPage;
