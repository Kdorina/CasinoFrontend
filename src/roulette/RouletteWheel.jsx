import React, { useEffect, useState } from "react";
import wheelImage from "../assets/wheel.png";

export default function RouletteWheel({ number, spinning }) {
  const [finalAngle, setFinalAngle] = useState(0);

  // Európai rulett sorrend
  const ROULETTE_ORDER = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27,
    13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1,
    20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
  ];

  const SLICE_ANGLE = 360 / 37;

  useEffect(() => {
    if (!spinning || number === null) return;

    const index = ROULETTE_ORDER.indexOf(number);

    const extraSpins = 360 * 6;

    // 🔥 EZ A HELYES FORMULA (jó irány, jó végpont)
    const targetAngle = extraSpins - index * SLICE_ANGLE;

    setFinalAngle(targetAngle);
  }, [spinning, number]);

  return (
    <div className="wheel-container">
      <div className="wheel-pointer"></div>

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
