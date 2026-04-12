import React, { useState, useEffect } from "react";

export default function Capitulo3({ player, treasures, setTreasures, onNext }) {
  const [storyStep, setStoryStep] = useState(0);
  const [showPuzzle, setShowPuzzle] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [showItemChoice, setShowItemChoice] = useState(false);
  const [foundItem, setFoundItem] = useState(null);
  const [classMessage, setClassMessage] = useState("");

  const storyTexts = [
    `Após derrotar o inimigo anterior, ${player.name} segue sua jornada.`,
    "Você avista uma caverna misteriosa, com símbolos antigos nas paredes.",
    "Um pergaminho no chão revela mais um enigma bíblico.",
  ];

  const puzzles = [
    {
      question: "Quem foi lançado na cova dos leões por orar a Deus?",
      reference: "Daniel 6",
      options: ["Elias", "Daniel", "José", "Paulo"],
      answer: "Daniel",
      reward: {
        name: "Espada da Verdade",
        atk: 5,
        def: 2,
      },
    },
  ];

  const [currentPuzzle] = useState(0); // Mantém um puzzle fixo

  // Mensagem e bônus da classe
  useEffect(() => {
    switch (player.class) {
      case "Guerreiro da Fé":
        setClassMessage("💪 Guerreiro da Fé: Mais força para usar os tesouros encontrados!");
        break;
      case "Sábio dos Salmos":
        setClassMessage("📖 Sábio dos Salmos: Recebe dicas adicionais para resolver enigmas!");
        break;
      case "Curador da Luz":
        setClassMessage("✨ Curador da Luz: Pode recuperar HP ao escolher tesouros especiais!");
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
    if (option === puzzles[currentPuzzle].answer) {
      setFeedback(`✅ Correto! Você encontrou: ${puzzles[currentPuzzle].reward.name}`);
      setFoundItem(puzzles[currentPuzzle].reward);
      setTimeout(() => {
        setFeedback("");
        setShowItemChoice(true);
      }, 2000);
    } else {
      setFeedback("❌ Errado! Tente novamente.");
    }
  };

  const handleItemChoice = (choice) => {
    if (choice) {
      // Aplica bônus da classe ao tesouro
      let finalReward = { ...foundItem };
      if (player.class === "Guerreiro da Fé") {
        finalReward.atk += 2;
      } else if (player.class === "Curador da Luz") {
        finalReward.def += 2;
      }
      setTreasures([...treasures, finalReward]);
    }
    setShowItemChoice(false);
    onNext(); // Avança para o próximo capítulo
  };

  return (
    <div className="story-chapter">
      <h2>Capítulo 3: A Caverna Misteriosa</h2>

      {classMessage && <p className="class-info">{classMessage}</p>}

      {!showPuzzle && !showItemChoice && storyStep < storyTexts.length && (
        <>
          <p>{storyTexts[storyStep]}</p>
          <button onClick={nextStory}>Avançar</button>
        </>
      )}

      {showPuzzle && !showItemChoice && (
        <div className="puzzle">
          <h3>Desafio Bíblico!</h3>
          <p>{puzzles[currentPuzzle].question}</p>
          <p className="reference">📖 Referência: {puzzles[currentPuzzle].reference}</p>
          <div className="options">
            {puzzles[currentPuzzle].options.map((opt) => (
              <button key={opt} onClick={() => handleAnswer(opt)}>
                {opt}
              </button>
            ))}
          </div>
          {feedback && <p className="feedback">{feedback}</p>}
        </div>
      )}

      {showItemChoice && foundItem && (
        <div className="item-choice">
          <h3>Você encontrou {foundItem.name}!</h3>
          <p>ATK: {foundItem.atk} | DEF: {foundItem.def}</p>
          <p>Deseja adicionar ao inventário?</p>
          <button onClick={() => handleItemChoice(true)}>Sim</button>
          <button onClick={() => handleItemChoice(false)}>Não</button>
        </div>
      )}
    </div>
  );
}
