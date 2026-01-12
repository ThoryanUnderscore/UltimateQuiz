// src/components/Score.jsx
import React from "react";

function Score({ score, total, onRestart }) {
  return (
    <div className="score-container">
      <h2>Score final : {score} / {total}</h2>
      <button onClick={onRestart}>Rejouer</button>
    </div>
  );
}

export default Score;
