import React, { useEffect, useState } from "react";
import wheelImage from "../assets/wheel.png"; // nálad az útvonal lehet más

// A TE képed (európai rulett) számsorrendje, 0-tól indulva KÓRHŰEN, KÓRHŰ IRÁNYBAN
const ROULETTE_ORDER = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27,
  13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1,
  20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];

const SLICE_ANGLE = 360 / 37;

export default function RouletteWheel({ number, spinning }) {
  const [finalAngle, setFinalAngle] = useState(0);

  useEffect(() => {
    if (!spinning || number === null || number === undefined) return;

    // nyerő szám pozíciója a képen
    const index = ROULETTE_ORDER.indexOf(number);
    if (index === -1) return;

    // látvány kedvéért: 6 teljes kör
    const extraSpins = 360 * 6;

    // FONTOS: a keréknek ELLENKEZŐ irányba kell fordulnia,
    // hogy az index-edik szektor kerüljön a pointer alá.
    const targetAngle = extraSpins - index * SLICE_ANGLE;

    setFinalAngle(targetAngle);
  }, [spinning, number]);

  return (
    <div className="wheel-container">
      <div className="wheel-pointer" />

      <img
        src={wheelImage}
        alt="roulette wheel"
        className={spinning ? "wheel-image spin-physics" : "wheel-image"}
        style={{
          "--finalAngle": `${finalAngle}deg`,
        }}
      />
    </div>
  );
}
