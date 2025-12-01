import React from "react";
import "./roulette.css";

export default function RouletteChipSelector({ selected, onSelect }) {
  
  const chips = [
    { value: 5, color: "black" },
    { value: 10, color: "blue" },
    { value: 25, color: "green" },
    { value: 50, color: "red" },
    { value: 100, color: "purple" }
  ];

  return (
    <div className="chips-row">
      {chips.map(chip => (
        <div
          key={chip.value}
          className={`chip ${chip.color} ${
            selected === chip.value ? "selected-chip" : ""
          }`}
          onClick={() => onSelect(chip.value)}
        >
          {chip.value}
        </div>
      ))}
    </div>
  );
}
