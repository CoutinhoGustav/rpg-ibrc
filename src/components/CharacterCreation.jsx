import React, { useState } from "react";
import { useGame } from "../context/GameContext";
import Dice3D from "./Dice3D";

export default function CharacterCreation({ onNext }) {
  const { setPlayer } = useGame();
  const [name, setName] = useState("");
  const [gender, setGender] = useState("Menino");
  const [charClass, setCharClass] = useState("Guerreiro da Fé");
  const [classInfo, setClassInfo] = useState("💪 Foco em ataque físico. Começa com mais força e defesa.");

  const classAdvantages = {
    "Guerreiro da Fé": {
      description: "💪 Foco em ataque físico. Começa com mais força e defesa.",
      stats: { hp: 120, attack: 8, defense: 6 }
    },
    "Sábio dos Salmos": {
      description: "📖 Foco em inteligência e sabedoria. Bônus em XP e enigmas.",
      stats: { hp: 100, attack: 5, defense: 4 }
    },
    "Curador da Luz": {
      description: "✨ Foco em cura e suporte. Mais resistência e regeneração.",
      stats: { hp: 110, attack: 4, defense: 5 }
    },
  };

  const [diceRolled, setDiceRolled] = useState(false);
  const [diceValue, setDiceValue] = useState(0);
  const [availablePoints, setAvailablePoints] = useState(0);
  const [bonusStats, setBonusStats] = useState({ attack: 0, defense: 0, hp: 0 });

  const handleDiceRoll = (value) => {
    setDiceValue(value);
    setAvailablePoints(value);
    setDiceRolled(true);
  };

  const handleClassChange = (e) => {
    const selectedClass = e.target.value;
    setCharClass(selectedClass);
    setClassInfo(classAdvantages[selectedClass].description);
  };

  const allocatePoint = (stat) => {
    if (availablePoints > 0) {
      setBonusStats(prev => ({
        ...prev,
        [stat]: prev[stat] + (stat === "hp" ? 20 : 1)
      }));
      setAvailablePoints(availablePoints - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!diceRolled) return;
    if (availablePoints > 0) {
      alert("Distribua todos os seus pontos antes de começar!");
      return;
    }

    const baseStats = classAdvantages[charClass].stats;
    setPlayer(prev => ({
      ...prev,
      name,
      gender,
      class: charClass,
      hp: baseStats.hp + bonusStats.hp,
      attack: baseStats.attack + bonusStats.attack,
      defense: baseStats.defense + bonusStats.defense,
      skillPoints: 0 // Reset skill points as they are already distributed
    }));
    onNext();
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-amber-500">Crie seu Herói</h2>
        <p className="text-slate-400">Toda grande jornada começa com um primeiro passo.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-800/50 p-6 md:p-10 rounded-3xl border border-slate-700 shadow-2xl space-y-6 backdrop-blur-sm">
        <div className="space-y-4">
          <label className="block">
            <span className="text-slate-300 font-medium mb-1 block ml-1 text-sm uppercase tracking-wider">Como devemos te chamar?</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Digite seu nome..."
              className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all placeholder:text-slate-600"
            />
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-slate-300 font-medium mb-1 block ml-1 text-sm uppercase tracking-wider">Voz:</span>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all cursor-pointer"
              >
                <option>Menino</option>
                <option>Menina</option>
              </select>
            </label>

            <label className="block">
              <span className="text-slate-300 font-medium mb-1 block ml-1 text-sm uppercase tracking-wider">Vocação:</span>
              <select
                value={charClass}
                onChange={handleClassChange}
                className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all cursor-pointer"
              >
                <option>Guerreiro da Fé</option>
                <option>Sábio dos Salmos</option>
                <option>Curador da Luz</option>
              </select>
            </label>
          </div>
        </div>

        {classInfo && (
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-200 text-sm italic animate-in fade-in duration-500">
            {classInfo}
          </div>
        )}

        {/* Seção do Dado */}
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700/50 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 font-medium text-sm uppercase tracking-wider text-center flex-1">
              Atributos de Fé
            </span>
          </div>

          {!diceRolled ? (
            <div className="flex flex-col items-center space-y-2 py-4">
              <Dice3D onRoll={handleDiceRoll} />
            </div>
          ) : (
            <div className="space-y-6 animate-in zoom-in-95 duration-500">
              <div className="flex items-center justify-center space-x-6">
                <Dice3D onRoll={handleDiceRoll} disabled={diceRolled} />
                <div className="text-left">
                  <div className="text-amber-500 font-black text-xl italic uppercase">Sorte Grande!</div>
                  <div className="text-slate-400 text-sm">Distribua seus <span className="text-amber-500 font-bold">{availablePoints}</span> pontos:</div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => allocatePoint("attack")}
                  disabled={availablePoints <= 0}
                  className="flex justify-between items-center bg-slate-800 hover:bg-slate-700 disabled:opacity-50 p-3 rounded-xl border border-slate-700 transition-all group"
                >
                  <span className="flex items-center space-x-2">
                    <span className="text-xl">⚔️</span>
                    <span className="font-bold text-slate-300">Ataque</span>
                  </span>
                  <span className="bg-amber-500/10 px-3 py-1 rounded-lg text-amber-500 font-black group-hover:bg-amber-500 group-hover:text-slate-900 transition-colors">
                    +{bonusStats.attack}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => allocatePoint("defense")}
                  disabled={availablePoints <= 0}
                  className="flex justify-between items-center bg-slate-800 hover:bg-slate-700 disabled:opacity-50 p-3 rounded-xl border border-slate-700 transition-all group"
                >
                  <span className="flex items-center space-x-2">
                    <span className="text-xl">🛡️</span>
                    <span className="font-bold text-slate-300">Defesa</span>
                  </span>
                  <span className="bg-blue-500/10 px-3 py-1 rounded-lg text-blue-400 font-black group-hover:bg-blue-500 group-hover:text-slate-900 transition-colors">
                    +{bonusStats.defense}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => allocatePoint("hp")}
                  disabled={availablePoints <= 0}
                  className="flex justify-between items-center bg-slate-800 hover:bg-slate-700 disabled:opacity-50 p-3 rounded-xl border border-slate-700 transition-all group"
                >
                  <span className="flex items-center space-x-2">
                    <span className="text-xl">❤️</span>
                    <span className="font-bold text-slate-300">Vida (HP)</span>
                  </span>
                  <span className="bg-red-500/10 px-3 py-1 rounded-lg text-red-500 font-black group-hover:bg-red-500 group-hover:text-slate-900 transition-colors">
                    +{bonusStats.hp / 20} (total +{bonusStats.hp})
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!diceRolled || availablePoints > 0}
          className="w-full py-4 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-slate-900 font-bold text-lg rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-amber-500/10"
        >
          {availablePoints > 0 ? `Distribua os pontos (${availablePoints} restantes)` : "Pronto para a Aventura"}
        </button>
      </form >
    </div >
  );
}
