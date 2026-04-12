import React, { useState, useEffect } from "react";
import usePlayerProgress from "../hooks/usePlayerProgress";

export default function Capitulo6({ player, treasures, setTreasures, onNext }) {
  const [storyStep, setStoryStep] = useState(0);
  const [showPuzzle, setShowPuzzle] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [showItemChoice, setShowItemChoice] = useState(false);
  const [foundItem, setFoundItem] = useState(null);
  const [combatStarted, setCombatStarted] = useState(false);
  const [message, setMessage] = useState("");
  const [availableTreasures, setAvailableTreasures] = useState([...treasures]);

  const { hp, attack, defense, skillPointsToDistribute, gainXP, allocateSkill, setHP } =
    usePlayerProgress(player);

  const [classMessage, setClassMessage] = useState("");

  const [enemy, setEnemy] = useState({
    name: "A Ira",
    hp: 180,
    strength: 12,
  });

  const storyTexts = [
    "Após derrotar o Guardião, você emerge da caverna e se depara com um imenso deserto escaldante.",
    `"No horizonte, uma figura com um cajado apascenta ovelhas. É Moisés, o grande libertador!"`,
    `"Ele lhe ensina que a jornada exige paciência e entrega um novo enigma celestial sobre a dependência em Deus."`
  ];

  const puzzles = [
    {
      question: "Qual praga foi o estopim para a libertação do povo hebreu no Egito?",
      reference: "Êxodo 12",
      options: ["Gafanhotos", "Trevas", "Morte dos primogênitos", "Sapos"],
      answer: "Morte dos primogênitos",
      reward: { name: "Cajado da Mansidão", atk: 4, def: 5 },
    },
  ];

  const [currentPuzzle] = useState(0);

  useEffect(() => {
    switch (player.class) {
      case "Guerreiro da Fé":
        setClassMessage("💪 Guerreiro da Fé: +2 de ataque ao usar tesouros!");
        break;
      case "Sábio dos Salmos":
        setClassMessage("📖 Sábio dos Salmos: +2 de defesa ao usar tesouros!");
        break;
      case "Curador da Luz":
        setClassMessage("✨ Curador da Luz: +10 HP ao usar tesouros de cura!");
        break;
      default:
        setClassMessage("");
    }
  }, [player.class]);

  const nextStory = () => {
    if (storyStep < storyTexts.length - 1) setStoryStep(storyStep + 1);
    else setShowPuzzle(true);
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
      setTreasures([...treasures, foundItem]);
      setAvailableTreasures([...availableTreasures, foundItem]);
    }
    setShowItemChoice(false);
    setShowPuzzle(false);
    setStoryStep(storyTexts.length);
    setCombatStarted(true);
  };

  const playerAttack = (usedTreasure) => {
    let damage = attack;

    if (usedTreasure) {
      if (player.class === "Guerreiro da Fé") damage += 2;
      else if (player.class === "Curador da Luz" && usedTreasure.name === "Escudo da Fé") {
        const healed = 20;
        setHP(hp + healed);
        setMessage(`✨ Curador da Luz: +${healed} HP usando ${usedTreasure.name}`);
        setAvailableTreasures(availableTreasures.filter((t) => t !== usedTreasure));
        return;
      }

      switch (usedTreasure.name) {
        case "Cajado da Mansidão":
          damage += 6;
          setMessage(`Você usou ${usedTreasure.name}! +6 de ataque contra A Ira.`);
          break;
        case "Anel da Proteção":
          damage += 3;
          setMessage(`Você usou ${usedTreasure.name}! +3 de ataque.`);
          break;
        case "Chave de Sabedoria":
          damage += 5;
          setMessage(`Você usou ${usedTreasure.name}! +5 de ataque.`);
          break;
        case "Escudo da Fé":
          const healed = 20;
          setHP(hp + healed);
          setMessage(`Você usou ${usedTreasure.name} e recuperou ${healed} HP!`);
          break;
        default:
          damage += usedTreasure.atk || 0;
          setMessage(`Você usou ${usedTreasure.name || usedTreasure}. Atk +${usedTreasure.atk || 0}`);
      }

      setAvailableTreasures(availableTreasures.filter((t) => t !== usedTreasure));
    } else {
      setMessage(`Você atacou normalmente e causou ${damage} de dano.`);
    }

    const newEnemyHP = Math.max(enemy.hp - damage, 0);
    setEnemy({ ...enemy, hp: newEnemyHP });

    if (newEnemyHP > 0) setTimeout(enemyAttack, 1000);
    else {
      setMessage("🎉 Você dissipou A Ira!");
      gainXP(50);
    }
  };

  const enemyAttack = () => {
    const damage = Math.max(enemy.strength - defense, 1);
    setHP(Math.max(hp - damage, 0));
    setMessage(`A tempestade de areia viva, ${enemy.name}, atacou com rancor! Você perdeu ${damage} de HP.`);
  };

  return (
    <div className="story-chapter">
      <h2>Capítulo 6: O Deserto e A Ira</h2>
      {classMessage && <p className="class-info">{classMessage}</p>}

      {!combatStarted && !showItemChoice && storyStep < storyTexts.length && (
        <>
          <p>{storyTexts[storyStep]}</p>
          <button onClick={nextStory}>Avançar</button>
        </>
      )}

      {showPuzzle && !showItemChoice && (
        <div className="puzzle">
          <h3>Enigma de Moisés</h3>
          <p>{puzzles[currentPuzzle].question}</p>
          <p className="reference">📖 Referência: {puzzles[currentPuzzle].reference}</p>
          <div className="options">
            {puzzles[currentPuzzle].options.map((opt) => (
              <button key={opt} onClick={() => handleAnswer(opt)}>
                {opt}
              </button>
            ))}
          </div>
          {feedback && <p>{feedback}</p>}
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

      {combatStarted && hp > 0 && enemy.hp > 0 && (
        <div className="combat">
          <p>Uma tempestade escaldante de areia moldada pelo rancor se ergue. A Besta da Ira te confronta!</p>
          <p>🛡 {player.name} HP: {hp} | {enemy.name} HP: {enemy.hp}</p>
          <p>{message}</p>
          <div className="combat-actions">
            <button onClick={() => playerAttack(null)}>Atacar Normal</button>
            {availableTreasures.length > 0 && (
              <div className="inventory">
                <p>Inventário:</p>
                {availableTreasures.map((treasure, index) => (
                  <button key={index} onClick={() => playerAttack(treasure)}>
                    {treasure.name || treasure}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {enemy.hp <= 0 && skillPointsToDistribute > 0 && (
        <div className="level-up">
          <p>Distribua seus pontos restantes ({skillPointsToDistribute}):</p>
          <button onClick={() => allocateSkill("attack")}>Ataque</button>
          <button onClick={() => allocateSkill("defense")}>Defesa</button>
          <button onClick={() => allocateSkill("hp")}>HP</button>
          <p>
            Skills atuais: Ataque {attack}, Defesa {defense}, HP {hp}
          </p>
        </div>
      )}

      {enemy.hp <= 0 && skillPointsToDistribute === 0 && (
        <>
          <p>Parabéns! Moisés lhe ensinou bem, e você completou o Capítulo 6 e subjugou A Ira!</p>
          <button onClick={onNext}>Avançar para Capítulo 7</button>
        </>
      )}
    </div>
  );
}
