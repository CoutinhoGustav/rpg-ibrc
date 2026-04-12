import React, { useState } from "react";
import { useGame } from "../context/GameContext";
import DiceSkillOverlay from "./DiceSkillOverlay";

export default function Capitulo4({ onNext }) {
  const { player, treasures, setPlayer, gainXP, allocateSkill } = useGame();
  const [showDiceOverlay, setShowDiceOverlay] = useState(false);
  const [overlayDone, setOverlayDone] = useState(false);
  const [storyStep, setStoryStep] = useState(0);
  const [combatStarted, setCombatStarted] = useState(false);
  const [message, setMessage] = useState("");
  const [availableTreasures, setAvailableTreasures] = useState([...treasures]);

  const enemyInitial = { name: "O Pecado (Fortalecido)", hp: 150, strength: 15 };
  const [enemy, setEnemy] = useState(enemyInitial);

  const storyTexts = [
    `${player.name} adentra a escuridão profunda da caverna...`,
    "O Pecado ressurge, alimentado pelas dúvidas e medos daqueles que se perderam.",
    "Prepare-se! Esta batalha exigirá cada grama de sua fé e os artefatos sagrados.",
  ];

  const nextStory = () => {
    if (storyStep < storyTexts.length - 1) setStoryStep(storyStep + 1);
    else setCombatStarted(true);
  };

  const playerAttack = (usedTreasure) => {
    let damage = player.attack;

    if (usedTreasure) {
      const itemName = typeof usedTreasure === 'string' ? usedTreasure : usedTreasure.name;
      if (itemName.includes("Espada")) damage += 15;
      if (itemName.includes("Escudo")) {
        setPlayer(prev => ({ ...prev, hp: Math.min(100 + (prev.level * 10), prev.hp + 30) }));
        setMessage("Você usou o Escudo e renovou suas forças!");
      }
      setAvailableTreasures(availableTreasures.filter((t) => t !== usedTreasure));
    }

    const newEnemyHP = Math.max(enemy.hp - damage, 0);
    setEnemy(prev => ({ ...prev, hp: newEnemyHP }));
    setMessage(`Você atacou e causou ${damage} de dano!`);

    if (newEnemyHP > 0) setTimeout(enemyAttack, 800);
    else {
      setMessage("🎉 O inimigo foi banido pela luz da sua fé!");
      gainXP(150);
      setTimeout(() => setShowDiceOverlay(true), 800);
    }
  };

  const enemyAttack = () => {
    const damage = Math.max(enemy.strength - player.defense, 1);
    setPlayer(prev => ({ ...prev, hp: Math.max(prev.hp - damage, 0) }));
    setMessage(`O inimigo lança trevas sobre você! -${damage} HP.`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      {/* HUD Superior - Responsivo */}
      <div className="flex justify-between items-center bg-slate-800/80 p-3 md:p-4 rounded-xl md:rounded-2xl border border-slate-700 backdrop-blur-md sticky top-2 md:top-4 z-20 shadow-xl">
        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-500 rounded-full flex items-center justify-center text-xl md:text-2xl">
            {player.gender === "Menino" ? "👦" : "👧"}
          </div>
          <div>
            <div className="text-[10px] md:text-sm font-bold text-slate-300 uppercase">{player.name} (Lvl {player.level})</div>
            <div className="flex items-center space-x-2">
              <div className="w-20 md:w-32 h-1.5 md:h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
                <div className="h-full bg-red-500 transition-all duration-500" style={{ width: `${player.hp}%` }}></div>
              </div>
              <span className="text-[9px] md:text-[10px] text-red-400 font-bold">{player.hp} HP</span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2 md:space-x-4 text-[9px] md:text-[10px] font-bold text-slate-400">
          <div className="text-center"><span className="text-amber-500 block text-[10px] md:text-xs">{player.attack}</span> ATK</div>
          <div className="text-center"><span className="text-blue-400 block text-[10px] md:text-xs">{player.defense}</span> DEF</div>
          <div className="text-center"><span className="text-purple-400 block text-[10px] md:text-xs">{player.skillPoints}</span> PTS</div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-amber-500 font-bold uppercase tracking-[0.2em] text-sm mb-2">Capítulo 4</h2>
        <h1 className="text-3xl md:text-4xl font-black text-white italic">A Batalha Final</h1>
      </div>

      {!combatStarted && (
        <div className="min-h-[300px] flex flex-col items-center justify-center space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          {/* Container Premium do Placeholder - Responsivo */}
          <div className="relative group w-full max-w-2xl px-2 md:px-4 transition-all duration-700 hover:scale-[1.01]">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 blur-2xl opacity-40 group-hover:opacity-80 transition-opacity duration-700 rounded-[2.5rem]"></div>

            <div className="relative aspect-video md:aspect-[21/9] bg-slate-900/90 rounded-2xl md:rounded-[2rem] border-2 border-dashed border-slate-700/50 flex items-center justify-center overflow-hidden group-hover:border-purple-500/30 transition-all duration-500 shadow-2xl">
              <div className="absolute inset-2 md:inset-3 border border-slate-700/20 rounded-xl md:rounded-[1.4rem] z-10 pointer-events-none"></div>

              <div className="text-center space-y-2 md:space-y-4 animate-in zoom-in-90 duration-1000">
                <div className="relative inline-block">
                  <span className="text-5xl md:text-7xl block transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110">🌑</span>
                  <div className="absolute top-0 right-0 w-2 h-2 md:w-3 md:h-3 bg-purple-500 rounded-full animate-ping"></div>
                </div>
                <div className="space-y-0.5 md:space-y-1 px-4">
                  <p className="text-[10px] md:text-sm font-black text-slate-500 uppercase tracking-[0.3em] group-hover:text-purple-400/70 transition-colors">
                    Desafio na Escuridão
                  </p>
                  <p className="text-[8px] md:text-[10px] text-slate-600 italic tracking-widest uppercase font-bold">Conteúdo em Revelação</p>
                </div>
              </div>

              {/* Overlay de Gradiente Sutil */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent"></div>
            </div>
          </div>

          <div className="bg-slate-800/40 p-10 rounded-3xl border border-slate-700/50 max-w-2xl w-full text-center">
            <p className="text-xl md:text-2xl leading-relaxed text-slate-200 italic">
              "{storyTexts[storyStep]}"
            </p>
          </div>
          <button onClick={nextStory} className="px-10 py-4 bg-amber-500 text-slate-900 font-black rounded-2xl transition-all">
            Avançar para Batalha
          </button>
        </div>
      )}

      {combatStarted && (
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 py-8 items-center">
          <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700 text-center space-y-4">
            <div className="text-5xl">🛡️</div>
            <h3 className="font-bold">{player.name}</h3>
            <p className="text-sm text-amber-400 min-h-[1.5rem] italic">{message}</p>
            <div className="space-y-2">
              <button
                disabled={enemy.hp <= 0 || player.hp <= 0}
                onClick={() => playerAttack(null)}
                className="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold"
              >
                ⚔️ Golpe de Luz
              </button>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {availableTreasures.map((t, i) => (
                  <button key={i} onClick={() => playerAttack(t)} className="py-2 bg-amber-500/20 border border-amber-500/30 rounded-lg text-[10px] font-bold text-amber-500 uppercase">
                    ✨ {typeof t === 'string' ? t.split(' ')[0] : t.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-red-950/20 p-6 rounded-3xl border border-red-900/40 text-center space-y-4">
            <div className={`text-6xl ${enemy.hp > 0 ? 'animate-pulse' : 'grayscale'}`}>👤</div>
            <h3 className="font-bold text-red-500">{enemy.name}</h3>
            <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-700">
              <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${(enemy.hp / 150) * 100}%` }}></div>
            </div>
            <p className="text-xs font-bold text-slate-500">{enemy.hp} / 150 HP</p>
          </div>
        </div>
      )}

      {/* Dado de Atributos ao Derrotar o Inimigo */}
      {showDiceOverlay && !overlayDone && (
        <DiceSkillOverlay
          title="Evolução!"
          setPlayer={setPlayer}
          onDone={() => { setShowDiceOverlay(false); setOverlayDone(true); }}
        />
      )}

      {enemy.hp <= 0 && overlayDone && (
        <div className="text-center py-8">
          <button onClick={onNext} className="px-12 py-4 bg-green-500 text-slate-900 font-black rounded-2xl animate-bounce">
            Avançar para o Capítulo Final
          </button>
        </div>
      )}
    </div>
  );
}
