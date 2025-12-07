import React, { useState, useContext, useRef, useEffect } from "react";
import "./Navbar.css";
import BuyToken from "./Buy/BuyToken";
import Withdraw from "./Withdraw";
import { TokenContext } from "../context/TokenContext";

export default function Navbar({ onLogout }) {
  const { tokens } = useContext(TokenContext);

  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("buy");

  const popupRef = useRef(null);

  // click-outside
  useEffect(() => {
    function handleClick(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="navbar-holder">
      <div className="navbar">

        <div className="navbar-left">
          <span className="navbar-title">Casino</span>
        </div>

        <div className="navbar-right">
          <button className="logout-btn" onClick={onLogout}>
            Kijelentkezem
          </button>

          <div className="token-wrapper" ref={popupRef}>
            <div
              className="token-pill"
              onClick={() => setOpen(!open)}
            >
              {tokens} token
            </div>

            {open && (
              <div className="token-popup">

                {/* ✅ TAB FEJLÉC — MINDIG LÁTSZIK */}
                <div className="popup-tabs">
                  <button
                    className={activeTab === "buy" ? "active" : ""}
                    onClick={() => setActiveTab("buy")}
                  >
                    Vásárlás
                  </button>
                  <button
                    className={activeTab === "withdraw" ? "active" : ""}
                    onClick={() => setActiveTab("withdraw")}
                  >
                    Beváltás
                  </button>
                </div>

                {/* ✅ TAB TARTALOM */}
                {activeTab === "buy" && (
                  <div className="buytoken-mask">
                    <BuyToken />
                  </div>
                )}

                {activeTab === "withdraw" && (
                  <div className="withdraw-mask">
                    <Withdraw />
                  </div>
                )}

              </div>
            )}
          </div>

          <div className="avatar" />
        </div>
      </div>
    </div>
  );
}
