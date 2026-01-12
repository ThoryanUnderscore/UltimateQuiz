// src/components/Question.jsx
import React from "react";

function Question({ data, onAnswer }) {
  // "data" contient la question actuelle (texte + options)
  // "onAnswer" est une fonction qu'on appelle quand l'utilisateur clique sur une réponse

  return (
    <div className="question-container">
      <h2>{data.question}</h2>
      <div className="options">
        {data.options.map((option) => (
          <button key={option} onClick={() => onAnswer(option)}>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Question;
