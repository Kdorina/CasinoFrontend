import React from "react";
import {
  Link,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";

import Register from "./components/Register";
import Withdraw from "./components/Withdraw";
import Home from "./components/Home";
import "./index.css";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Csak ezeken az oldalakon jelenik meg a Cím + Menü:
  const showMenu = location.pathname === "/";
  const showTitle =
    location.pathname === "/" ||
    location.pathname === "/register" ||
    location.pathname === "/login";

  return (
    <div className="app-container">
      <header className="app-header">

        {/* Csak itt mutatjuk a címet */}
        {showTitle && (
          <h1 className="app-title">
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              Casino App
            </Link>
          </h1>
        )}

        {/* Menü CSAK a / főoldalon */}
        {showMenu && (
          <nav className="nav">
            <Link to="/register" className="nav-btn">Regisztráció</Link>
            <Link to="/login" className="nav-btn">Bejelentkezés</Link>
          </nav>
        )}

      </header>

      <main className="page-container">
        <Routes>

          {/* Főoldal */}
          <Route
            path="/"
            element={
              <div style={{ padding: "30px" }}>
                <h2>Válassz a fenti menüpontok közül.</h2>
              </div>
            }
          />

          {/* Regisztráció */}
          <Route
            path="/register"
            element={
              <Register onRegisterSuccess={() => navigate("/home")} />
            }
          />

          {/* Bejelentkezés */}
          <Route
            path="/login"
            element={
              <div className="card">
                <h2>Bejelentkezés</h2>
                <p>Ezt a részt a csapattársad csinálta.</p>
              </div>
            }
          />

          {/* Home */}
          <Route path="/home" element={<Home />} />

          {/* Kifizetés */}
          <Route path="/withdraw" element={<Withdraw />} />

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

export default App;
