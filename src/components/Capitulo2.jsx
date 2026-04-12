import React, { useState, useEffect } from "react";
import { useGame } from "../context/GameContext";
import DiceSkillOverlay from "./DiceSkillOverlay";

export default function Capitulo2({ onNext }) {
  const { player, treasures, setTreasures, setPlayer, gainXP, allocateSkill } = useGame();
  const [showDiceOverlay, setShowDiceOverlay] = useState(false);
  const [overlayDone, setOverlayDone] = useState(false);

  // Dynamic image loading
  const images = import.meta.glob('../img/**/*.png', { eager: true });
  const getImagePath = (step) => {
    const path = `../img/${player.gender}/Capitulo 2/${Math.min(step + 1, 4)}.png`;
    return images[path]?.default || "";
  };

  const [storyStep, setStoryStep] = useState(0);
  const [combatStarted, setCombatStarted] = useState(false);
  const [message, setMessage] = useState("");
  const [availableTreasures, setAvailableTreasures] = useState([...treasures]);

  const enemyInitial = { name: "O Pecado", hp: 50, strength: 6 };
  const [enemy, setEnemy] = useState(enemyInitial);

  const storyTexts = [
    `Após resolver os enigmas do vilarejo, ${player.name} sente uma presença sombria...`,
    "Um inimigo aparece! É o Pecado, que tenta desviar o coração das pessoas.",
    "Você precisa enfrentá-lo e usar os tesouros ganhos para ter vantagem!",
  ];

  const nextStory = () => {
    if (storyStep < storyTexts.length - 1) setStoryStep(storyStep + 1);
    else setCombatStarted(true);
  };

  const playerAttack = (usedTreasure) => {
    let damage = player.attack;

    if (usedTreasure) {
      const itemName = typeof usedTreasure === 'string' ? usedTreasure : usedTreasure.name;
      switch (itemName) {
        case "Chave de Sabedoria":
          damage += 10;
          setMessage(`Você usou a Sabedoria! Dano massivo causado.`);
          break;
        case "Escudo da Fé":
          const healed = 20;
          setPlayer(prev => ({ ...prev, hp: Math.min(100 + (prev.level * 10), prev.hp + healed) }));
          setMessage(`Você se protegeu com Fé e recuperou ${healed} HP!`);
          break;
        default:
          setMessage(`Você usou ${itemName}.`);
      }
      setAvailableTreasures(availableTreasures.filter((t) => t !== usedTreasure));
    } else {
      setMessage(`Você atacou com coragem e causou ${damage} de dano.`);
    }

    const newEnemyHP = Math.max(enemy.hp - damage, 0);
    setEnemy(prev => ({ ...prev, hp: newEnemyHP }));

    if (newEnemyHP > 0) {
      setTimeout(enemyAttack, 800);
    } else {
      setMessage("🎉 VITÓRIA! O pecado foi afastado do vilarejo!");
      gainXP(100);
      setTimeout(() => setShowDiceOverlay(true), 800);
    }
  };

  const enemyAttack = () => {
    const damage = Math.max(enemy.strength - player.defense, 1);
    setPlayer(prev => ({ ...prev, hp: Math.max(prev.hp - damage, 0) }));
    setMessage(`O inimigo contra-ataca! Você perdeu ${damage} de HP.`);
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
        <h2 className="text-amber-500 font-bold uppercase tracking-[0.2em] text-sm mb-2">Capítulo 2</h2>
        <h1 className="text-3xl md:text-4xl font-black text-white italic">O Primeiro Inimigo</h1>
      </div>

      {!combatStarted && (
        <div className="min-h-[400px] flex flex-col items-center justify-center space-y-10 animate-in slide-in-from-bottom-6 duration-700">
          {/* Container Premium da Imagem de Combate - Responsivo */}
          <div className="relative group w-full max-w-2xl px-2 md:px-4">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600/20 to-amber-600/20 blur-2xl opacity-40 group-hover:opacity-80 transition-opacity duration-700 rounded-[2.5rem]"></div>

            <div className="relative aspect-video md:aspect-[21/9] bg-slate-900 rounded-2xl md:rounded-[2rem] overflow-hidden border-2 border-slate-700/50 shadow-2xl group-hover:border-red-500/30 transition-all duration-500">
              <div className="absolute inset-2 md:inset-3 border border-slate-700/30 rounded-xl md:rounded-[1.4rem] z-10 pointer-events-none group-hover:border-red-500/10 transition-colors"></div>

              <img
                src={getImagePath(storyStep)}
                className="absolute inset-0 w-full h-full object-cover blur-xl opacity-40 scale-110"
                alt=""
              />

              <img
                key={storyStep}
                src={getImagePath(storyStep)}
                alt="Prepare-se para o Combate"
                className="absolute inset-0 w-full h-full object-contain z-0 scale-95 md:scale-100 group-hover:scale-105 transition-all duration-[2000ms] ease-out animate-in fade-in zoom-in-95 duration-1000"
                onError={(e) => { e.target.style.display = 'none'; }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80 pointer-events-none"></div>

              <div className="absolute bottom-4 left-6 md:bottom-6 md:left-8 z-20 space-y-0.5 md:space-y-1 text-left">
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-red-500 rounded-full animate-pulse"></span>
                  <span className="text-[8px] md:text-[10px] font-black text-red-500 uppercase tracking-[0.2em] drop-shadow-md">Confronto Iminente</span>
                </div>
                <h3 className="text-white font-bold text-sm md:text-lg opacity-90">Parte {storyStep + 1} do Presságio</h3>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/40 p-6 md:p-10 rounded-2xl md:rounded-3xl border border-slate-700/50 max-w-2xl w-full text-center backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500/20"></div>
            <p className="text-xl md:text-2xl leading-relaxed text-slate-200 font-medium italic">
              "{storyTexts[storyStep]}"
            </p>
          </div>
          <button
            onClick={nextStory}
            className="px-10 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-black rounded-2xl transition-all hover:scale-105"
          >
            {storyStep === storyTexts.length - 1 ? "Entrar em Combate" : "Continuar"}
          </button>
        </div>
      )}

      {combatStarted && (
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-center py-8">
          {/* Jogador */}
          <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700 text-center space-y-4">
            <div className="text-6xl animate-bounce duration-1000">🛡️</div>
            <h3 className="text-xl font-bold">{player.name}</h3>
            {message && <p className="text-sm text-amber-400 italic font-medium">{message}</p>}

            <div className="grid grid-cols-1 gap-2">
              <button
                disabled={enemy.hp <= 0 || player.hp <= 0}
                onClick={() => playerAttack(null)}
                className="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold disabled:opacity-50"
              >
                ⚔️ Atacar Normal
              </button>

              <div className="grid grid-cols-2 gap-2">
                {availableTreasures.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => playerAttack(t)}
                    className="py-2 bg-amber-500/20 hover:bg-amber-500/40 border border-amber-500/50 rounded-xl text-xs font-bold text-amber-500"
                  >
                    ✨ Usar {typeof t === 'string' ? t.split(' ')[0] : t.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Inimigo */}
          <div className="bg-red-950/20 p-6 rounded-3xl border border-red-900/50 text-center space-y-4">
            <div className={`text-6xl transition-all duration-300 ${enemy.hp <= 0 ? 'grayscale rotate-180' : 'animate-pulse'}`}>😈</div>
            <h3 className="text-xl font-bold text-red-500">{enemy.name}</h3>
            <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden border border-red-900/50">
              <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${(enemy.hp / 50) * 100}%` }}></div>
            </div>
            <p className="text-xs font-bold text-red-800 uppercase tracking-widest">{enemy.hp} / 50 HP</p>
          </div>
        </div>
      )}

      {/* Dado de Atributos ao Derrotar o Inimigo */}
      {showDiceOverlay && !overlayDone && (
        <DiceSkillOverlay
          title="Nível Elevado!"
          setPlayer={setPlayer}
          onDone={() => { setShowDiceOverlay(false); setOverlayDone(true); }}
        />
      )}

      {enemy.hp <= 0 && overlayDone && (
        <div className="text-center py-8">
          <button
            onClick={onNext}
            className="px-12 py-4 bg-green-500 hover:bg-green-400 text-slate-900 font-black rounded-2xl transition-all animate-bounce"
          >
            Avançar para o Próximo Desafio
          </button>
        </div>
      )}
    </div>
  );
}
