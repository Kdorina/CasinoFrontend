import React from "react";
import "./Navbar.css";

export default function Navbar({ tokens = 0, onLogout }) {
  return (
    <div className="navbar-holder">
    <div className="navbar">

      {/* Bal oldal */}
      <div className="navbar-left">
        <span className="navbar-title" href="/home">Casino</span>
      </div>

      {/* Jobb oldal */}
      <div className="navbar-right">
        <button className="logout-btn" onClick={onLogout}>
          Kijelentkezem
        </button>

        <div className="token-pill">
          {tokens} token
        </div>

        <div className="avatar"></div>
      </div>

    </div>
    </div>
  );
}
