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
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/register";

  const showMenu = location.pathname === "/";

  return (
    <div className="app-container">

      {/* HEADER */}
      <header className="app-header">

        {/* CÍM */}
        {showTitle && (
          <h1 className="app-title">
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              Casino App
            </Link>
          </h1>
        )}

        {/* FŐOLDALI MENÜ */}
        {showMenu && (
          <nav className="nav">
            <Link to="/register" className="nav-btn">Regisztráció</Link>
            <Link to="/login" className="nav-btn">Bejelentkezés</Link>
          </nav>
        )}

      </header>

      {/* OLDALTARTALOM */}
      <main className="page-container">
        <Routes>

          {/* FŐOLDAL */}
          <Route
            path="/"
            element={
              <div style={{ padding: "30px" }}>
                <h2>Válassz a fenti menüpontok közül.</h2>
              </div>
            }
          />

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

          {/* HOME */}
          <Route
            path="/home"
            element={
              loggedIn ? <Home /> : <Navigate to="/login" />
            }
          />

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
