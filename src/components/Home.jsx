import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TokenContext } from "../context/TokenContext";
import "./Home.css";
import "./CasinoMainPage.css";

const Home = ({ onLogout }) => {
  const navigate = useNavigate();
  const { tokens } = useContext(TokenContext);

  return (
    <div className="home-wrapper">

      {/* Új NAVBAR a kép alapján */}
      <div className="home-navbar">

        {/* Bal oldal: ikon + Casino */}
        <div className="home-navbar-left">
          <span className="home-navbar-icon">✴</span>
          <span className="home-navbar-title">Casino</span>
        </div>

        {/* Jobb oldal */}
        <div className="home-navbar-right">
          
          <button 
            className="home-logout-btn" 
            onClick={onLogout}
          >
            Kijelentkezem
          </button>

          <div className="home-token-pill">
            {tokens} token
          </div>

          <div className="home-avatar"></div>
        </div>

      </div>

      {/* HOME tartalom */}
      <div className="home-content">
        <h2>Üdvözlünk a Casino App-ban!</h2>
        <p>Válassz játékot a fenti menüből, vagy kezdd a tokenek kezelésével.</p>
      </div>


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
};

export default Home;
