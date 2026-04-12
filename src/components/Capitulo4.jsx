import React, { useState, useEffect } from "react";
import usePlayerProgress from "../hooks/usePlayerProgress";

export default function Capitulo4({ player, treasures, setTreasures, onNext }) {
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

  const enemyInitial = { name: "O Pecado", hp: 150, strength: 15 };
  const [enemy, setEnemy] = useState(enemyInitial);

  const storyTexts = [
    `${player.name} adentra uma caverna escura e sente o perigo aumentando.`,
    "O Pecado aparece novamente, encurralando você sem saída!",
    "Prepare-se para a batalha, use sabedoria e os tesouros que conquistou.",
  ];

  // Mensagem da classe
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
    else setCombatStarted(true);
  };

  const playerAttack = (usedTreasure) => {
    let damage = attack;

    if (usedTreasure) {
      if (player.class === "Guerreiro da Fé") damage += 2;
      if (player.class === "Curador da Luz" && usedTreasure.name === "Escudo da Fé") {
        const healed = 15;
        setHP(hp + healed);
        setMessage(`Você usou ${usedTreasure.name} e recuperou ${healed} HP!`);
      }

      switch (usedTreasure.name) {
        case "Chave de Sabedoria":
          damage += 5;
          setMessage(`Você usou a ${usedTreasure.name}! +5 de ataque neste turno.`);
          break;
        case "Escudo da Fé":
          if (player.class !== "Curador da Luz") {
            const healed = 15;
            setHP(hp + healed);
            setMessage(`Você usou a ${usedTreasure.name} e recuperou ${healed} HP!`);
          }
          break;
        default:
          setMessage(`Você usou ${usedTreasure.name || usedTreasure}.`);
      }

      setAvailableTreasures(
        availableTreasures.filter((t) =>
          t.name ? t.name !== usedTreasure.name : t !== usedTreasure
        )
      );
    } else {
      setMessage(`Você atacou normalmente e causou ${damage} de dano.`);
    }

    const newEnemyHP = Math.max(enemy.hp - damage, 0);
    setEnemy({ ...enemy, hp: newEnemyHP });

    if (newEnemyHP > 0) setTimeout(enemyAttack, 1000);
    else {
      setMessage("🎉 Você derrotou o inimigo!");
      gainXP(30); // XP ganho
    }
  };

  const enemyAttack = () => {
    const damage = Math.max(enemy.strength - defense, 1);
    setHP(Math.max(hp - damage, 0));
    setMessage(`O Pecado atacou! Você perdeu ${damage} de HP.`);
  };

  return (
    <div className="story-chapter">
      <h2>Capítulo 4: Provações na Caverna</h2>
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
                    {treasure.name || treasure}
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
          <button onClick={() => allocateSkill("hp")}>HP</button>
        </div>
      )}

      {enemy.hp <= 0 && skillPointsToDistribute === 0 && (
        <>
          <p>Parabéns! Você completou o Capítulo 4 com sucesso e está pronto para novas aventuras!</p>
          <button onClick={onNext}>Avançar para Capítulo 5</button>
        </>
      )}
    </div>
  );
}
