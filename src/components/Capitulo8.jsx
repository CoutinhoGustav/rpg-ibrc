import React, { useState, useEffect } from "react";
import usePlayerProgress from "../hooks/usePlayerProgress";

export default function Capitulo8({ player, treasures, setTreasures, onNext }) {
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
    name: "O Engano",
    hp: 300,
    strength: 18,
  });

  const storyTexts = [
    "Com a Soberba caída, você sobe até o topo do Monte Sagrado, onde repousa o lendário baú da profecia.",
    `"Lá, aguardando pacientemente, está o apóstolo Paulo."`,
    `"Para provar que é digno dos céus, ele oferece um último e grandioso enigma sobre a Armadura de Deus."`
  ];

  const puzzles = [
    {
      question: "Qual peça da armadura de Deus Paulo descreve como a palavra de Deus?",
      reference: "Efésios 6:17",
      options: ["O Escudo da Fé", "O Capacete da Salvação", "A Espada do Espírito", "O Cinto da Verdade"],
      answer: "A Espada do Espírito",
      reward: { name: "A Espada do Espírito", atk: 12, def: 6 },
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
      setFeedback(`✅ Correto! Você encontrou: ${puzzles[currentPuzzle].reward.name}! A arma suprema.`);
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
        case "A Espada do Espírito":
          damage += 15;
          setMessage(`Você cravou a Espada do Espírito na mentira! +15 de ataque fulminante.`);
          break;
        case "Harpa da Redenção":
          damage += 4;
          setMessage(`Você usou ${usedTreasure.name}!`);
          break;
        case "Cajado da Mansidão":
          damage += 6;
          setMessage(`Você usou ${usedTreasure.name}! +6 de ataque.`);
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
      setMessage("🎉 A ilusão se dissipa... O Engano foi derrotado!");
      gainXP(100);
    }
  };

  const enemyAttack = () => {
    const damage = Math.max(enemy.strength - defense, 1);
    setHP(Math.max(hp - damage, 0));
    setMessage(`A falsa miragem da luz te ataca e te confunde, ${enemy.name}! Você perdeu ${damage} de HP.`);
  };

  return (
    <div className="story-chapter">
      <h2>Capítulo 8: A Armadura e O Engano</h2>
      {classMessage && <p className="class-info">{classMessage}</p>}

      {!combatStarted && !showItemChoice && storyStep < storyTexts.length && (
        <>
          <p>{storyTexts[storyStep]}</p>
          <button onClick={nextStory}>Avançar</button>
        </>
      )}

      {showPuzzle && !showItemChoice && (
        <div className="puzzle">
          <h3>Enigma Supremo de Paulo</h3>
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
          <h3>A revelação divina trouxe a você: {foundItem.name}!</h3>
          <p>ATK: {foundItem.atk} | DEF: {foundItem.def}</p>
          <p>Equipar instantaneamente?</p>
          <button onClick={() => handleItemChoice(true)}>Sim</button>
          <button onClick={() => handleItemChoice(false)}>Não</button>
        </div>
      )}

      {combatStarted && hp > 0 && enemy.hp > 0 && (
        <div className="combat">
          <p>Logo após resolver, as nuvens de ocultam o sol, e a pura mentira assume as suas formas mais terríveis!</p>
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
          <p>Glória! Você abriu o tesouro final revelando a verdadeira Coroa da Vida e a sabedoria eterna. Parabéns Guerreiro!</p>
          <button onClick={onNext}>Ver Final</button>
        </>
      )}
    </div>
  );
}
