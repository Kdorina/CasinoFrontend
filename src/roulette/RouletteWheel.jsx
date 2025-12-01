import React, { useEffect, useRef } from "react";
import "./roulette.css";
import wheelImg from "/img/wheel.png";

const ROULETTE_ORDER = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6,
  27, 13, 36, 11, 30, 8, 23, 10, 5, 24,
  16, 33, 1, 20, 14, 31, 9, 22, 18, 29,
  7, 28, 12, 35, 3, 26
];

export default function RouletteWheel({ number, spinning }) {
  const wheelRef = useRef(null);

  useEffect(() => {
    if (!spinning || number === null) return;

    const slice = 360 / 37;
    const index = ROULETTE_ORDER.indexOf(number);
    const targetAngle = index * slice;

    const fullRotations = 360 * 5;
    const randomOffset = Math.random() * 25;

    const finalAngle = fullRotations + (360 - targetAngle) + randomOffset;

    if (wheelRef.current) {
      wheelRef.current.style.setProperty("--finalAngle", `${finalAngle}deg`);
      wheelRef.current.classList.add("spin-physics");

      setTimeout(() => {
        wheelRef.current.classList.remove("spin-physics");
      }, 4200);
    }
  }, [spinning, number]);

  return (
    <div className="wheel-wrapper">
      <div className="wheel-pointer"></div>

      <div className="wheel-container" ref={wheelRef}>
        <img src={wheelImg} className="wheel-image" alt="roulette wheel" />
      </div>

      {number !== null && (
        <div className="wheel-result">Nyerő szám: {number}</div>
      )}
    </div>
  );
}
