import React, { useState, useEffect } from "react";
import "../css/Capitulo2.css";
import usePlayerProgress from "../hooks/usePlayerProgress";

export default function Capitulo2({ player, treasures, onNext, setTreasures }) {
  const [storyStep, setStoryStep] = useState(0);
  const [combatStarted, setCombatStarted] = useState(false);
  const [message, setMessage] = useState("");
  const [availableTreasures, setAvailableTreasures] = useState([...treasures]);
  const [classMessage, setClassMessage] = useState("");

  // Hook para progressão do jogador
  const {
    hp,
    attack,
    defense,
    skillPointsToDistribute,
    gainXP,
    allocateSkill,
    setHP,
  } = usePlayerProgress(player);

  const enemyInitial = { name: "O Pecado", hp: 50, strength: 6 };
  const [enemy, setEnemy] = useState(enemyInitial);

  const storyTexts = [
    `Após resolver os enigmas do vilarejo, ${player.name} sente uma presença sombria...`,
    "Um inimigo aparece! É o Pecado, que tenta desviar o coração das pessoas.",
    "Você precisa enfrentá-lo e usar os tesouros ganhos para ter vantagem!",
  ];

  // Define bônus da classe
  useEffect(() => {
    let bonusHP = 0;
    let message = "";

    switch (player.class) {
      case "Guerreiro da Fé":
        bonusHP = 20;
        message = "💪 Guerreiro da Fé: Bônus em força e defesa!";
        break;
      case "Sábio dos Salmos":
        bonusHP = 10;
        message = "📖 Sábio dos Salmos: Bônus em sabedoria e XP!";
        break;
      case "Curador da Luz":
        bonusHP = 15;
        message = "✨ Curador da Luz: Bônus em recuperação de HP!";
        break;
      default:
        message = "";
    }

    setHP((prevHP) => prevHP + bonusHP);
    setClassMessage(message);
  }, [player.class, setHP]);

  const nextStory = () => {
    if (storyStep < storyTexts.length - 1) setStoryStep(storyStep + 1);
    else setCombatStarted(true);
  };

  const playerAttack = (usedTreasure) => {
    let damage = attack;

    if (usedTreasure) {
      switch (usedTreasure.name || usedTreasure) {
        case "Chave de Sabedoria":
          damage += 5;
          setMessage(`Você usou a ${usedTreasure.name || usedTreasure}! +5 de ataque neste turno.`);
          break;
        case "Escudo da Fé":
          const healed = 10;
          setHP((prevHP) => prevHP + healed);
          setMessage(`Você usou ${usedTreasure.name || usedTreasure} e recuperou ${healed} HP!`);
          break;
        default:
          setMessage(`Você usou ${usedTreasure.name || usedTreasure}.`);
      }
      setAvailableTreasures(availableTreasures.filter((t) => t !== usedTreasure));
    } else {
      setMessage(`Você atacou normalmente e causou ${damage} de dano.`);
    }

    const newEnemyHP = Math.max(enemy.hp - damage, 0);
    setEnemy({ ...enemy, hp: newEnemyHP });

    if (newEnemyHP > 0) setTimeout(enemyAttack, 1000);
    else {
      setMessage("🎉 Você derrotou o inimigo!");
      gainXP(20); // XP do inimigo
    }
  };

  const enemyAttack = () => {
    const damage = Math.max(enemy.strength - defense, 1); // defesa reduz dano
    setHP((prevHP) => Math.max(prevHP - damage, 0));
    setMessage(`O inimigo atacou! Você perdeu ${damage} de HP.`);
  };

  // Avança automaticamente para Capítulo 3
  useEffect(() => {
    if (enemy.hp <= 0 && skillPointsToDistribute === 0) onNext();
  }, [enemy.hp, skillPointsToDistribute, onNext]);

  return (
    <div className="story-chapter">
      <h2>Capítulo 2: O Primeiro Inimigo</h2>

      {classMessage && <p className="class-info">{classMessage}</p>}

      {!combatStarted && storyStep < storyTexts.length && (
        <>
          <p>{storyTexts[storyStep]}</p>
          <p className="next-hint">Clique para continuar...</p>
          <button onClick={nextStory}>Avançar</button>
        </>
      )}

      {combatStarted && hp > 0 && enemy.hp > 0 && (
        <div className="combat">
          <p>🛡 {player.name} HP: {hp} | Inimigo HP: {enemy.hp}</p>
          <p>{message}</p>

          <div className="combat-actions">
            <button onClick={() => playerAttack(null)}>Atacar Normal</button>
            {availableTreasures.length > 0 && (
              <div className="inventory">
                <p>Inventário:</p>
                {availableTreasures.map((treasure, index) => (
                  <button key={index} onClick={() => playerAttack(treasure)}>
                    Usar {treasure.name || treasure}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {hp <= 0 && <p>Você perdeu a batalha. Reinicie para tentar novamente.</p>}

      {enemy.hp <= 0 && skillPointsToDistribute > 0 && (
        <div className="level-up">
          <p>Distribua seus pontos restantes ({skillPointsToDistribute}):</p>
          <button onClick={() => allocateSkill("attack")}>Ataque</button>
          <button onClick={() => allocateSkill("defense")}>Defesa</button>
          <button onClick={() => allocateSkill("wisdom")}>Sabedoria</button>
          <button onClick={() => allocateSkill("faith")}>Fé</button>
          <button onClick={() => allocateSkill("hp")}>HP</button>
        </div>
      )}
    </div>
  );
}
