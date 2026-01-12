// src/App.jsx
import React, { useState } from "react";
import { questions } from "./data/questions";
import "./App.css";

function App() {
  const [stage, setStage] = useState("start"); // 'start' | 'quiz'
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [activeQuestions, setActiveQuestions] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showScore, setShowScore] = useState(false);
  const [openQuestion, setOpenQuestion] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const handleChooseDifficulty = (diff) => {
    // 1. Filtrer
    const filtered = questions.filter(q => 
      diff === "Easy" ? q.difficulty === "easy" :
      diff === "Medium" ? q.difficulty === "medium" :
      diff === "Expert" ? q.difficulty === "expert" :
      q.difficulty === "hard"
    );

    // 2. Mélanger et sélectionner 10 questions
    const shuffled = [...filtered].sort(() => Math.random() - 0.5).slice(0, 10);

    // 3. Lancer directement le quiz
    setSelectedDifficulty(diff);
    setActiveQuestions(shuffled);
    setCurrentQuestion(0);
    setScore(0);
    setAnswers([]);
    setShowScore(false);
    setFeedback(null);
    setStage("quiz");
  };

  const handleAnswerOptionClick = (option) => {
    if (feedback) return;

    const currentQ = activeQuestions[currentQuestion];
    const isCorrect = option === currentQ.answer;
    
    setFeedback(isCorrect ? "correct" : "incorrect");
    if (isCorrect) setScore((s) => s + 1);

    setAnswers((prev) => [
      ...prev,
      {
        question: currentQ.question,
        chosen: option,
        correct: currentQ.answer,
        explanation: currentQ.explanation,
        isCorrect,
      },
    ]);

    setTimeout(() => {
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < activeQuestions.length) {
        setCurrentQuestion(nextQuestion);
        setFeedback(null);
      } else {
        setShowScore(true);
      }
    }, 1000);
  };

  const handleBackToMenu = () => {
    setStage("start");
    setSelectedDifficulty(null);
    setActiveQuestions(null);
    setShowScore(false);
  };

  // --- ÉCRAN RÉSULTATS ---
  if (stage === "quiz" && showScore) {
    return (
      <div className="app results animate-in">
        <header className="app-header">
          <h1>Fin du Quiz</h1>
          <div className="subheader">
            <span className="chip">{selectedDifficulty}</span>
          </div>
        </header>

        <div className="final-score-card">
          <div className="score-circle">
            <strong>{score}</strong><span>/ {activeQuestions.length}</span>
          </div>
          <p className="score-message">
            {score > 7 ? "🔥 Excellent travail !" : "🚀 Pas mal, continue à t'entraîner !"}
          </p>
        </div>

        <div className="summary-grid">
          {answers.map((item, index) => {
            const isOpen = openQuestion === index;
            return (
              <div 
                key={index} 
                className={`summary-item ${item.isCorrect ? "correct" : "incorrect"} ${isOpen ? "is-open" : ""}`}
              >
                <div className="summary-header" onClick={() => setOpenQuestion(isOpen ? null : index)}>
                  <strong>{index + 1}. {item.question}</strong>
                  <span className="status-icon">{item.isCorrect ? "✅" : "❌"}</span>
                </div>
                {isOpen && (
                  <div className="summary-details animate-in">
                    <div className="detail-row">
                      <span>Votre réponse :</span>
                      <strong className={item.isCorrect ? "txt-correct" : "txt-incorrect"}>{item.chosen}</strong>
                    </div>
                    {!item.isCorrect && (
                      <div className="detail-row">
                        <span>La bonne réponse :</span>
                        <strong className="txt-correct">{item.correct}</strong>
                      </div>
                    )}
                    <div className="explanation-box">
                      <p>💡 {item.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="results-footer">
          <button onClick={handleBackToMenu} className="btn-main-menu">
            Retour au Menu Principal
          </button>
        </div>
      </div>
    );
  }

  // --- ÉCRAN QUIZ ---
  if (stage === "quiz" && activeQuestions) {
    const progress = ((currentQuestion + 1) / activeQuestions.length) * 100;
    return (
      <div className="app">
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
        
        <div className="question-section animate-in" key={currentQuestion}>
          <div className="question-meta">Question {currentQuestion + 1} sur {activeQuestions.length}</div>
          <h2 className="question-text">{activeQuestions[currentQuestion].question}</h2>
        </div>

        <div className="answer-section">
          {activeQuestions[currentQuestion].options.map((option, index) => {
            let status = "";
            if (feedback) {
              if (option === activeQuestions[currentQuestion].answer) status = "btn-correct";
              else if (option === answers[answers.length - 1]?.chosen) status = "btn-incorrect";
            }
            return (
              <button 
                key={index} 
                className={`answer-btn ${status}`}
                onClick={() => handleAnswerOptionClick(option)}
                disabled={!!feedback}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // --- ÉCRAN ACCUEIL ---
  return (
    <div className="app home animate-in">
      <header className="hero">
        <h1>Ultimate Quiz</h1>
        <p>Sélectionnez une difficulté pour commencer instantanément</p>
      </header>

      <div className="difficulty-grid">
        {["Easy", "Medium", "Hard", "Expert"].map((d) => (
          <button 
            key={d} 
            className={`difficulty-card ${d.toLowerCase()}`} 
            onClick={() => handleChooseDifficulty(d)}
          >
            <span className="diff-label">{d}</span>
            <span className="diff-desc">10 Questions</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;