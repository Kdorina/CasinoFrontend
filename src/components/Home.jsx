import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TokenContext } from "../context/TokenContext";
import "./Home.css";
import "./CasinoMainPage.css";
import Navbar from "./Navbar.jsx";

const Home = ({ onLogout }) => {
  const navigate = useNavigate();
  const { tokens } = useContext(TokenContext);

  const handleBlackjackStart = () => {
    navigate("/blackjack");
  };

  const handleRouletteStart = () => {
    navigate("/roulette"); 
  };

  return (
    <div>
      {/* NAVBAR */}
      <Navbar 
        tokens={200}
        onLogout={() => alert("Kijelentkezve!")}
      />

      <div className="home-wrapper">

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
              onClick={handleRouletteStart}
              style={{ cursor: "pointer" }}
            />
          </div>

          {/* BLACKJACK KATEGÓRIA */}
          <div className="category-box">
            <img
              src="/img/blackjack.png"
              className="blackjack-image"
              onClick={handleBlackjackStart}
              style={{ cursor: "pointer" }}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;
