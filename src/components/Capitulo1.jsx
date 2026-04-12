import React, { useState, useEffect } from "react";

export default function Capitulo1({ player, onNext, treasures, setTreasures }) {
  const [storyStep, setStoryStep] = useState(0);
  const [showPuzzle, setShowPuzzle] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [playerHP, setPlayerHP] = useState(100);
  const [playerAttack, setPlayerAttack] = useState(5);
  const [playerDefense, setPlayerDefense] = useState(3);
  const [classMessage, setClassMessage] = useState("");

  const storyTexts = [
    `Olá ${player.name}!`,
    "Hoje você sairá em sua primeira aventura pelo mundo de fé e coragem.",
    "Enquanto passeava pela floresta, algo te aflige e toca em seu coração. É o Espirito Santo, alertando que há algo errado em seu vilarejo.",
    "Voltando depressa, você vê que o vilarejo está em perigo.",
    "Vizinhos alertam que um grande mal apareceu de repente e pessoas enfurecidas atacaram o vilarejo.",
    "Eles pedem a sua ajuda, para combater este mal e que precisa usar sabedoria e coragem para enfrentar desafios e ajudar aqueles ao seu redor.",
    "Um deles lhe entrega um pergaminho antigo dizendo que se desvendar um enigma que está nele, você receberá um grande poder concedido por Deus.",
    "O vilarejo está em perigo e muitos tesouros estão escondidos em enigmas bíblicos que precisam ser resolvidos.",
    "Olha! Um antigo pergaminho com um enigma apareceu diante de você!",
  ];

  const puzzles = [
    {
      question: "Quem construiu a arca para sobreviver ao dilúvio?",
      reference: "Gênesis 6:14-22",
      options: ["Moisés", "Abraão", "Noé", "Davi"],
      answer: "Noé",
      reward: "Chave de Sabedoria",
    },
    {
      question: "Quantos dias Jesus jejuou no deserto?",
      reference: "Mateus 4:2",
      options: ["30 dias", "40 dias", "7 dias", "50 dias"],
      answer: "40 dias",
      reward: "Escudo da Fé",
    },
  ];

  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);

  // Define vantagens da classe
  useEffect(() => {
    switch (player.class) {
      case "Guerreiro da Fé":
        setPlayerHP(120);
        setPlayerAttack(8);
        setPlayerDefense(6);
        setClassMessage("💪 Você escolheu Guerreiro da Fé! Bônus em ataque e defesa.");
        break;
      case "Sábio dos Salmos":
        setPlayerHP(100);
        setPlayerAttack(5);
        setPlayerDefense(4);
        setClassMessage("📖 Você escolheu Sábio dos Salmos! Bônus em XP e sabedoria.");
        break;
      case "Curador da Luz":
        setPlayerHP(110);
        setPlayerAttack(4);
        setPlayerDefense(5);
        setClassMessage("✨ Você escolheu Curador da Luz! Bônus em recuperação de HP.");
        break;
      default:
        setClassMessage("");
    }
  }, [player.class]);

  const nextStory = () => {
    if (storyStep < storyTexts.length - 1) {
      setStoryStep(storyStep + 1);
    } else {
      setShowPuzzle(true);
    }
  };

  const handleAnswer = (option) => {
    if (option === puzzles[currentPuzzleIndex].answer) {
      setFeedback(`✅ Correto! Você ganhou: ${puzzles[currentPuzzleIndex].reward}`);
      setScore(score + 1);
      setTreasures([...treasures, puzzles[currentPuzzleIndex].reward]);

      setTimeout(() => {
        setFeedback("");
        if (currentPuzzleIndex < puzzles.length - 1) {
          setCurrentPuzzleIndex(currentPuzzleIndex + 1);
        } else {
          setShowPuzzle(false);
          setStoryStep(storyStep + 1);
          onNext(); // Avança para Capítulo 2
        }
      }, 2000);
    } else {
      setFeedback("❌ Errado! Tente novamente.");
    }
  };

  return (
    <div className="story-chapter">
      <h2>Capítulo 1: O Início da Jornada</h2>

      {classMessage && <p className="class-info">{classMessage}</p>}

      {!showPuzzle && storyStep < storyTexts.length && (
        <>
          <p>{storyTexts[storyStep]}</p>
          <p className="next-hint">Clique para continuar...</p>
          <button onClick={nextStory}>Avançar</button>
        </>
      )}

      {showPuzzle && currentPuzzleIndex < puzzles.length && (
        <div className="puzzle">
          <h3>Desafio Bíblico!</h3>
          <p>{puzzles[currentPuzzleIndex].question}</p>
          <p className="reference">📖 Referência: {puzzles[currentPuzzleIndex].reference}</p>
          <div className="options">
            {puzzles[currentPuzzleIndex].options.map((opt) => (
              <button key={opt} onClick={() => handleAnswer(opt)}>
                {opt}
              </button>
            ))}
          </div>
          {feedback && <p className="feedback">{feedback}</p>}
        </div>
      )}

      <p>HP: {playerHP} | Ataque: {playerAttack} | Defesa: {playerDefense}</p>
    </div>
  );
}