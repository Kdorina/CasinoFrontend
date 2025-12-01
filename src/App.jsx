import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useLocation,
} from "react-router-dom";

import LoginPage from "./components/Login/LoginPage.jsx";
import Register from "./components/Register.jsx";
import Home from "./components/Home.jsx";
import Withdraw from "./components/Withdraw.jsx";
import BuyToken from "./components/Buy/BuyToken.jsx";
import CasinoMainPage from "./components/CasinoMainPage.jsx";
import RouletteGame from "./roulette/RouletteGame.jsx";
import BotGame from "./components/BotGame.jsx";
import BlackJack from "./components/BlackJack/BlackJack.jsx";



function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const location = useLocation();

const showTitle =
  location.pathname === "/login" ||
  location.pathname === "/register";


const showMenu = false;

  return (
    <div className="app-container">
      
     
      {/* OLDALTARTALOM */}
      <main className="page-container">
        <Routes>

          {/* FŐOLDAL */}
          <Route path="/" element={<CasinoMainPage />} />

          {/* LOGIN */}
          <Route
            path="/login"
            element={
              loggedIn ?
                <Navigate to="/home" /> :
                <LoginPage onLoginSuccess={() => setLoggedIn(true)} />
            }
          />

          {/* REGISTER */}
          <Route
            path="/register"
            element={
              <Register onRegisterSuccess={() => setLoggedIn(true)} />
            }
          />

          {/* test route */}
        <Route path="/home" element={<Home />} />


     {/* <Route
            path="/home"
            element={
              loggedIn ? (
                <Home onLogout={() => setLoggedIn(false)} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />*/}
      {/* RULETT OLDALAK */}
          <Route path="/roulette" element={<RouletteGame />} />
          <Route path="/bot-demo" element={<BotGame />} />
            <Route path="/blackjack" element={<BlackJack />} />

          {/* TOKEN VÁSÁRLÁS */}
          <Route
            path="/buytoken"
            element={
              loggedIn ? <BuyToken /> : <Navigate to="/login" />
            }
          />

          {/* KIFIZETÉS */}
          <Route
            path="/withdraw"
            element={
              loggedIn ? <Withdraw /> : <Navigate to="/login" />
            }
          />

          {/* 404 */}
          <Route
            path="*"
            element={<h2 style={{ padding: "30px" }}>Az oldal nem található.</h2>}
          />

          

        </Routes>
      </main>

    </div>
  );
}

export default AppWrapper;
