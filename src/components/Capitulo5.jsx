import React, { useState } from "react";
import { useGame } from "../context/GameContext";
import DiceSkillOverlay from "./DiceSkillOverlay";

export default function Capitulo5({ onNext }) {
  const { player, treasures, setTreasures, gainXP, allocateSkill, setPlayer } = useGame();
  const [showDiceOverlay, setShowDiceOverlay] = useState(false);
  const [overlayDone, setOverlayDone] = useState(false);
  const [storyStep, setStoryStep] = useState(0);
  const [showPuzzle, setShowPuzzle] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [showItemChoice, setShowItemChoice] = useState(false);
  const [foundItem, setFoundItem] = useState(null);
  const [combatStarted, setCombatStarted] = useState(false);
  const [message, setMessage] = useState("");
  const [availableTreasures, setAvailableTreasures] = useState([...treasures]);

  const [enemy, setEnemy] = useState({
    name: "A Manifestação do Pecado",
    hp: 200,
    strength: 12,
  });

  const storyTexts = [
    `${player.name} adentra a parte mais profunda da caverna, onde uma luz radiante emana do chão.`,
    "Um pergaminho de ouro aparece flutuando, contendo o último grande enigma desta caverna.",
    "O Pecado Supremo observa das sombras, tentando impedir que você alcance a iluminação final.",
  ];

  const puzzles = [
    {
      question: "Quem dividiu o Mar Vermelho com o poder de Deus?",
      reference: "Êxodo 14",
      options: ["Moisés", "Josué", "Davi", "Elias"],
      answer: "Moisés",
      reward: { name: "Anel da Aliança", atk: 10, def: 10 },
    },
  ];

  const nextStory = () => {
    if (storyStep < storyTexts.length - 1) setStoryStep(storyStep + 1);
    else setShowPuzzle(true);
  };

  const handleAnswer = (option) => {
    if (option === puzzles[0].answer) {
      setFeedback(`✅ Correto! Você provou sua sabedoria.`);
      setFoundItem(puzzles[0].reward);
      setTimeout(() => {
        setFeedback("");
        setShowItemChoice(true);
      }, 1500);
    } else {
      setFeedback("❌ Tente novamente. A história é a chave para o futuro.");
    }
  };

  const handleItemChoice = (choice) => {
    if (choice) {
      setTreasures([...treasures, foundItem]);
      setAvailableTreasures([...availableTreasures, foundItem]);
    }
    setShowItemChoice(false);
    setShowPuzzle(false);
    setCombatStarted(true);
  };

  const playerAttack = (usedTreasure) => {
    let damage = player.attack;

    if (usedTreasure) {
      const itemName = typeof usedTreasure === 'string' ? usedTreasure : usedTreasure.name;
      if (itemName.includes("Anel")) damage += 20;
      if (itemName.includes("Espada")) damage += 10;
      if (itemName.includes("Escudo")) {
        setPlayer(prev => ({ ...prev, hp: Math.min(100 + (prev.level * 10), prev.hp + 20) }));
      }
      setAvailableTreasures(availableTreasures.filter((t) => t !== usedTreasure));
    }

    const newEnemyHP = Math.max(enemy.hp - damage, 0);
    setEnemy(prev => ({ ...prev, hp: newEnemyHP }));
    setMessage(`Sua luz causou ${damage} de dano!`);

    if (newEnemyHP > 0) {
      setTimeout(enemyAttack, 800);
    } else {
      setMessage("🎉 Derrotado! As sombras do pecado se dissipam diante de sua fé.");
      gainXP(200);
      setTimeout(() => setShowDiceOverlay(true), 800);
    }
  };

  const enemyAttack = () => {
    const damage = Math.max(enemy.strength - player.defense, 1);
    setPlayer(prev => ({ ...prev, hp: Math.max(prev.hp - damage, 0) }));
    setMessage(`O Pecado tenta corromper sua alma! -${damage} HP.`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 pb-20">
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
        <h2 className="text-amber-500 font-bold uppercase tracking-[0.2em] text-sm mb-2">Capítulo 5</h2>
        <h1 className="text-3xl md:text-4xl font-black text-white italic">O Julgamento Final</h1>
      </div>

      {!combatStarted && !showItemChoice && (
        <div className="min-h-[300px] flex flex-col items-center justify-center space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          {/* Container Premium do Placeholder do Inimigo - Responsivo */}
          <div className="relative group w-full max-w-2xl px-2 md:px-4 transition-all duration-700 hover:scale-[1.01]">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600/20 to-purple-600/20 blur-2xl opacity-40 group-hover:opacity-80 transition-opacity duration-700 rounded-[2.5rem]"></div>

            <div className="relative aspect-video md:aspect-[21/9] bg-slate-900/90 rounded-2xl md:rounded-[2rem] border-2 border-dashed border-slate-700/50 flex items-center justify-center overflow-hidden group-hover:border-red-500/30 transition-all duration-500 shadow-2xl">
              <div className="absolute inset-2 md:inset-3 border border-slate-700/20 rounded-xl md:rounded-[1.4rem] z-10 pointer-events-none"></div>

              <div className="text-center space-y-2 md:space-y-4 animate-in zoom-in-90 duration-1000">
                <div className="relative inline-block">
                  <span className="text-5xl md:text-7xl block transition-transform duration-700 group-hover:-rotate-12 group-hover:scale-110">�</span>
                  <div className="absolute top-0 right-0 w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full animate-ping"></div>
                </div>
                <div className="space-y-0.5 md:space-y-1 px-4">
                  <p className="text-[10px] md:text-sm font-black text-slate-500 uppercase tracking-[0.3em] group-hover:text-red-400 transition-colors">
                    O Julgamento Final
                  </p>
                  <p className="text-[8px] md:text-[10px] text-slate-600 italic tracking-widest uppercase font-bold">A Sombra Final</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/40 p-10 rounded-3xl border border-slate-700/50 max-w-2xl w-full text-center">
            <p className="text-xl md:text-2xl leading-relaxed text-slate-200 italic">
              "{storyTexts[storyStep]}"
            </p>
          </div>
          {!showPuzzle && (
            <button onClick={nextStory} className="px-10 py-4 bg-amber-500 text-slate-900 font-black rounded-2xl transition-all">
              Avançar
            </button>
          )}
        </div>
      )}

      {showPuzzle && !showItemChoice && (
        <div className="max-w-2xl mx-auto space-y-6 animate-in zoom-in-95 duration-500">
          <div className="bg-amber-500/10 border-2 border-amber-500/30 p-8 rounded-3xl shadow-2xl">
            <h3 className="text-amber-500 font-black uppercase text-xl mb-4">Último Enigma</h3>
            <p className="text-2xl font-medium text-white mb-6 italic">{puzzles[0].question}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {puzzles[0].options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  className="p-4 bg-slate-900/80 hover:bg-amber-500 border border-slate-700 hover:border-amber-400 text-left text-slate-300 hover:text-slate-900 font-bold rounded-2xl transition-all"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          {feedback && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
              <div className={`bg-slate-800 border-2 ${feedback.includes('✅') ? 'border-amber-500/50' : 'border-red-500/50'} p-8 rounded-[2.5rem] max-w-sm w-full text-center shadow-2xl transform animate-in zoom-in-95 duration-300 relative overflow-hidden`}>
                <div className={`absolute -inset-24 ${feedback.includes('✅') ? 'bg-amber-500/10' : 'bg-red-500/10'} blur-3xl opacity-50`}></div>

                <div className="relative z-10">
                  <div className="text-7xl mb-6 animate-bounce">
                    {feedback.includes('✅') ? '🔱' : '⚖️'}
                  </div>
                  <h3 className={`text-2xl font-black mb-4 uppercase tracking-tight ${feedback.includes('✅') ? 'text-amber-500' : 'text-red-400'}`}>
                    {feedback.includes('✅') ? 'Digno!' : 'Julgamento'}
                  </h3>
                  <p className="text-slate-200 text-lg leading-relaxed mb-8 font-medium italic">
                    {feedback.replace('✅ ', '').replace('❌ ', '')}
                  </p>

                  <button
                    onClick={() => setFeedback("")}
                    className={`w-full py-4 rounded-2xl font-black text-slate-900 transition-all shadow-lg ${feedback.includes('✅') ? 'bg-amber-500 hover:bg-amber-400' : 'bg-red-500 hover:bg-red-400'}`}
                  >
                    {feedback.includes('✅') ? 'Receber Artefato' : 'Retornar'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {showItemChoice && foundItem && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border-2 border-amber-500 p-10 rounded-[3rem] max-w-lg w-full text-center space-y-6">
            <div className="text-7xl animate-pulse">💍</div>
            <h3 className="text-3xl font-black text-amber-500 uppercase">Artefato Superior!</h3>
            <p className="text-xl text-white font-bold">{foundItem.name}</p>
            <p className="text-slate-400 italic">"Um anel para lembrar da aliança eterna entre o Criador e sua criação."</p>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => handleItemChoice(true)} className="py-4 bg-amber-500 text-slate-900 font-black rounded-2xl">Equipar</button>
              <button onClick={() => handleItemChoice(false)} className="py-4 bg-slate-700 text-white font-bold rounded-2xl">Ignorar</button>
            </div>
          </div>
        </div>
      )}

      {combatStarted && (
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-center py-8">
          <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700 text-center space-y-4">
            <div className="text-5xl">⛪</div>
            <h3 className="font-bold">{player.name}</h3>
            <p className="text-sm text-amber-400 italic min-h-[1.5rem]">{message}</p>
            <div className="space-y-2">
              <button disabled={enemy.hp <= 0} onClick={() => playerAttack(null)} className="w-full py-3 bg-slate-700 rounded-xl font-bold">Ataque Sagrado</button>
              <div className="grid grid-cols-2 gap-2">
                {availableTreasures.map((t, i) => (
                  <button key={i} onClick={() => playerAttack(t)} className="py-2 bg-amber-500/20 border border-amber-500/30 rounded-lg text-[10px] font-bold text-amber-500 uppercase">
                    ✨ {typeof t === 'string' ? t.split(' ')[0] : t.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-red-950/20 p-6 rounded-3xl border border-red-900/40 text-center space-y-4">
            <div className={`text-6xl ${enemy.hp > 0 ? 'animate-pulse' : 'grayscale'}`}>🌑</div>
            <h3 className="font-bold text-red-500">{enemy.name}</h3>
            <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-red-900/50">
              <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${(enemy.hp / 200) * 100}%` }}></div>
            </div>
            <p className="text-xs font-bold text-slate-500">{enemy.hp} / 200 HP</p>
          </div>
        </div>
      )}

      {/* Dado de Atributos ao Derrotar o Inimigo */}
      {showDiceOverlay && !overlayDone && (
        <DiceSkillOverlay
          title="Iluminação!"
          setPlayer={setPlayer}
          onDone={() => { setShowDiceOverlay(false); setOverlayDone(true); }}
        />
      )}

      {enemy.hp <= 0 && overlayDone && (
        <div className="text-center py-8">
          <button onClick={onNext} className="px-12 py-4 bg-green-500 text-slate-900 font-black rounded-2xl animate-bounce">
            Rumo ao Capítulo Final
          </button>
        </div>
      )}
    </div>
  );
}
