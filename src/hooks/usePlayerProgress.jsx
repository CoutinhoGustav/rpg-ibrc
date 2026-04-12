// hooks/usePlayerProgress.js
import { useState } from "react"; // remove useEffect

export default function usePlayerProgress(initialPlayer) {
  const [level, setLevel] = useState(initialPlayer.level || 1);
  const [xp, setXP] = useState(initialPlayer.xp || 0);
  const [hp, setHP] = useState(initialPlayer.hp || 100);
  const [attack, setAttack] = useState(initialPlayer.attack || 5);
  const [defense, setDefense] = useState(initialPlayer.defense || 3);
  const [skillPointsToDistribute, setSkillPointsToDistribute] = useState(0);

  const gainXP = (gainedXP) => {
    const totalXP = xp + gainedXP;
    let newLevel = level;
    let extraPoints = 0;

    if (totalXP >= level * 50) {
      newLevel += 1;
      extraPoints = 3;
      setSkillPointsToDistribute(extraPoints);
    }

    setXP(totalXP);
    setLevel(newLevel);
    return extraPoints;
  };

  const allocateSkill = (skill) => {
    if (skillPointsToDistribute > 0) {
      if (skill === "hp") {
        const increase = 20;
        setHP(hp + increase);
      } else if (skill === "attack") {
        setAttack(attack + 1);
      } else if (skill === "defense") {
        setDefense(defense + 1);
      }
      setSkillPointsToDistribute(skillPointsToDistribute - 1);
    }
  };

  return {
    level,
    xp,
    hp,
    attack,
    defense,
    skillPointsToDistribute,
    gainXP,
    allocateSkill,
    setHP,
    setAttack,
    setDefense,
  };
}
