import React, { useState } from "react";
import { useGame } from "../context/GameContext";
import DiceSkillOverlay from "./DiceSkillOverlay";

export default function Capitulo7({ onNext }) {
  const { player, treasures, setTreasures, gainXP, setPlayer } = useGame();
  const [showDiceOverlay, setShowDiceOverlay] = useState(false);
  const [overlayDone, setOverlayDone] = useState(false);
  const [storyStep, setStoryStep] = useState(0);
  const [showPuzzle, setShowPuzzle] = useState(false);
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [showItemChoice, setShowItemChoice] = useState(false);
  const [foundItem, setFoundItem] = useState(null);
  const [combatStarted, setCombatStarted] = useState(false);
  const [message, setMessage] = useState("");
  const [availableTreasures, setAvailableTreasures] = useState([...treasures]);

  // Dynamic image loading
  const images = import.meta.glob('../img/**/*.png', { eager: true });
  const getImagePath = (step) => {
    const path = `../img/${player.gender}/Capitulo 7/${Math.min(step + 1, 6)}.png`;
    return images[path]?.default || "";
  };

  const [enemy, setEnemy] = useState({ name: "A Soberba", hp: 300, strength: 16 });

  const storyTexts = [
    `Vencendo a tempestade, ${player.name} chega aos portões de uma cidade envolta em sombras e tristeza.`,
    `"Sentado aos portões, dedilhando uma harpa, está o Rei Davi — o pastor que virou rei."`,
    `"Guerreiro(a), o orgulho destrói mais reinos do que qualquer exército. Prove que conheces a humildade..."`,
    `"Ao revelar as respostas, as portas estremecem! Surge um colosso de armadura dourada: A Soberba!"`,
  ];

  const puzzles = [
    {
      question: "No Salmo 23, com o que Davi compara o Senhor?",
      reference: "Salmos 23:1",
      options: ["Um Rei poderoso", "Um Pastor", "Um Guerreiro", "Um Pai amoroso"],
      answer: "Um Pastor",
      reward: { name: "Harpa da Redenção", atk: 6, def: 10 },
      rewardEmoji: "🎸",
    },
    {
      question: "Com qual arma Davi derrotou o gigante Golias?",
      reference: "1 Samuel 17:49",
      options: ["Espada", "Lança", "Estilingue e pedra", "Arco e flecha"],
      answer: "Estilingue e pedra",
      reward: { name: "Pedra da Fé Simples", atk: 12, def: 4 },
      rewardEmoji: "🪨",
    },
    {
      question: "Qual tribo de Israel Davi pertencia?",
      reference: "1 Samuel 17:12",
      options: ["Levi", "Benjamim", "Judá", "Efraim"],
      answer: "Judá",
      reward: { name: "Coroa da Humildade", atk: 5, def: 12 },
      rewardEmoji: "👑",
    },
  ];

  const nextStory = () => {
    if (storyStep < storyTexts.length - 1) setStoryStep(storyStep + 1);
    else setShowPuzzle(true);
  };

  const handleAnswer = (option) => {
    const puzzle = puzzles[puzzleIndex];
    if (option === puzzle.answer) {
      setFeedback(`✅ Correto! Davi toca a harpa em sua honra. Você encontrou: ${puzzle.reward.name}`);
      setFoundItem(puzzle.reward);
      setTimeout(() => {
        setFeedback("");
        setShowItemChoice(true);
      }, 1800);
    } else {
      setFeedback("❌ O orgulho te cegou! Tente novamente com humildade.");
      setPlayer(prev => ({ ...prev, hp: Math.max(0, prev.hp - 5) }));
    }
  };

  const handleItemChoice = (choice) => {
    if (choice) {
      setTreasures([...treasures, foundItem]);
      setAvailableTreasures([...availableTreasures, foundItem]);
    }
    setShowItemChoice(false);
    if (puzzleIndex < puzzles.length - 1) {
      setPuzzleIndex(puzzleIndex + 1);
    } else {
      setShowPuzzle(false);
      setCombatStarted(true);
    }
  };

  const playerAttack = (usedTreasure) => {
    let damage = player.attack;
    if (usedTreasure) {
      const itemName = typeof usedTreasure === 'string' ? usedTreasure : usedTreasure.name;
      if (itemName.includes("Pedra")) damage += 25;
      else if (itemName.includes("Harpa")) { damage += 10; setPlayer(prev => ({ ...prev, hp: Math.min(100 + (prev.level * 10), prev.hp + 10) })); }
      else if (itemName.includes("Coroa")) damage += 15;
      else if (itemName.includes("Escudo")) { setPlayer(prev => ({ ...prev, hp: Math.min(100 + (prev.level * 10), prev.hp + 30) })); }
      else if (itemName.includes("Anel")) damage += 20;
      else damage += (typeof usedTreasure === 'object' ? usedTreasure.atk : 0) || 0;
      setAvailableTreasures(availableTreasures.filter(t => t !== usedTreasure));
      setMessage(`Você usou ${itemName} e causou ${damage} de dano!`);
    } else {
      setMessage(`Você atacou com humildade e causou ${damage} de dano!`);
    }

    const newHP = Math.max(enemy.hp - damage, 0);
    setEnemy(prev => ({ ...prev, hp: newHP }));
    if (newHP > 0) setTimeout(enemyAttack, 800);
    else {
      setMessage("🎉 A Soberba tomba! O gigante do orgulho desaparece diante da fé simples!");
      gainXP(200);
      setTimeout(() => setShowDiceOverlay(true), 800);
    }
  };

  const enemyAttack = () => {
    const damage = Math.max(enemy.strength - player.defense, 1);
    setPlayer(prev => ({ ...prev, hp: Math.max(prev.hp - damage, 0) }));
    setMessage(`O colosso soberbo golpeia com arrogância! -${damage} HP.`);
  };

  const maxEnemyHP = 300;

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 pb-20">
      {/* HUD */}
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
        <h2 className="text-amber-500 font-bold uppercase tracking-[0.2em] text-sm mb-2">Capítulo 7</h2>
        <h1 className="text-3xl md:text-4xl font-black text-white italic">O Rei Davi e A Soberba</h1>
      </div>

      {/* HISTÓRIA */}
      {!combatStarted && !showItemChoice && !showPuzzle && (
        <div className="min-h-[400px] flex flex-col items-center justify-center space-y-10 animate-in slide-in-from-bottom-6 duration-700">
          <div className="relative group w-full max-w-2xl px-2 md:px-4">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-700 rounded-[2.5rem]"></div>
            <div className="relative aspect-video md:aspect-[21/9] bg-slate-900 rounded-2xl md:rounded-[2rem] overflow-hidden border-2 border-slate-700/50 shadow-2xl group-hover:border-purple-500/30 transition-all duration-500">
              <img src={getImagePath(storyStep)} className="absolute inset-0 w-full h-full object-cover blur-xl opacity-40 scale-110" alt="" />
              <img key={storyStep} src={getImagePath(storyStep)} alt={`Cena ${storyStep + 1}`}
                className="absolute inset-0 w-full h-full object-contain z-0 group-hover:scale-105 transition-all duration-[2000ms] ease-out animate-in fade-in zoom-in-95 duration-1000"
                onError={(e) => { e.target.style.display = 'none'; }} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80 pointer-events-none"></div>
              <div className="absolute bottom-4 left-6 md:bottom-6 md:left-8 z-20">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                  <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em]">Cidade Sombria</span>
                </div>
                <h3 className="text-white font-bold text-sm md:text-lg">Passo {storyStep + 1} de {storyTexts.length}</h3>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/40 p-6 md:p-10 rounded-2xl md:rounded-3xl border border-slate-700/50 max-w-2xl w-full text-center backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-purple-500/20"></div>
            <p className="text-lg md:text-2xl leading-relaxed text-slate-200">"{storyTexts[storyStep]}"</p>
          </div>
          <button onClick={nextStory} className="group flex items-center space-x-3 px-8 py-3 bg-slate-700 hover:bg-amber-500 text-white hover:text-slate-900 font-bold rounded-2xl transition-all shadow-lg hover:scale-105">
            <span>{storyStep === storyTexts.length - 1 ? "Enfrentar Enigma" : "Continuar"}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      )}

      {/* ENIGMA */}
      {showPuzzle && !showItemChoice && (
        <div className="max-w-2xl mx-auto space-y-6 animate-in zoom-in-95 duration-500">
          <div className="bg-purple-500/10 border-2 border-purple-500/30 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">🎸</div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">👑</span>
              <span className="text-purple-400 font-black uppercase text-xs tracking-widest">Enigma do Rei Davi — {puzzleIndex + 1}/{puzzles.length}</span>
            </div>
            <h3 className="text-purple-400 font-black uppercase text-xl mb-4">Os Salmos e a Sabedoria</h3>
            <p className="text-2xl font-medium text-white mb-3">{puzzles[puzzleIndex].question}</p>
            <div className="bg-slate-900/50 inline-block px-3 py-1 rounded-lg border border-slate-700 text-xs text-purple-400 font-bold mb-6">📖 {puzzles[puzzleIndex].reference}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {puzzles[puzzleIndex].options.map((opt) => (
                <button key={opt} onClick={() => handleAnswer(opt)}
                  className="p-4 bg-slate-900/80 hover:bg-purple-500 border border-slate-700 hover:border-purple-400 text-left text-slate-300 hover:text-white font-bold rounded-2xl transition-all active:scale-95 group flex justify-between items-center">
                  {opt}<span className="opacity-0 group-hover:opacity-100 transition-opacity">👑</span>
                </button>
              ))}
            </div>
          </div>
          {feedback && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
              <div className={`bg-slate-800 border-2 ${feedback.includes('✅') ? 'border-green-500/50' : 'border-red-500/50'} p-8 rounded-[2.5rem] max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-300 relative overflow-hidden`}>
                <div className={`absolute -inset-24 ${feedback.includes('✅') ? 'bg-green-500/10' : 'bg-red-500/10'} blur-3xl opacity-50`}></div>
                <div className="relative z-10">
                  <div className="text-7xl mb-6 animate-bounce">{feedback.includes('✅') ? '🎸' : '⚠️'}</div>
                  <h3 className={`text-2xl font-black mb-4 uppercase ${feedback.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>
                    {feedback.includes('✅') ? 'Correto!' : 'Tente Novamente'}
                  </h3>
                  <p className="text-slate-200 text-lg leading-relaxed mb-8 italic">{feedback.replace('✅ ', '').replace('❌ ', '')}</p>
                  <button onClick={() => setFeedback("")} className={`w-full py-4 rounded-2xl font-black text-slate-900 ${feedback.includes('✅') ? 'bg-green-500' : 'bg-red-500'}`}>
                    {feedback.includes('✅') ? 'Continuar' : 'Entendi'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ITEM */}
      {showItemChoice && foundItem && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border-2 border-purple-500 p-10 rounded-[3rem] max-w-lg w-full text-center space-y-6">
            <div className="text-7xl animate-pulse">{puzzles[puzzleIndex > 0 ? puzzleIndex - 1 : 0]?.rewardEmoji || "👑"}</div>
            <h3 className="text-3xl font-black text-purple-400 uppercase">Artefato Real!</h3>
            <p className="text-xl text-white font-bold">{foundItem.name}</p>
            <div className="flex justify-center gap-4">
              <span className="px-3 py-1 bg-slate-900 rounded-lg text-xs font-bold text-amber-500">+{foundItem.atk} ATK</span>
              <span className="px-3 py-1 bg-slate-900 rounded-lg text-xs font-bold text-blue-400">+{foundItem.def} DEF</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => handleItemChoice(true)} className="py-4 bg-purple-500 text-white font-black rounded-2xl">Equipar</button>
              <button onClick={() => handleItemChoice(false)} className="py-4 bg-slate-700 text-white font-bold rounded-2xl">Ignorar</button>
            </div>
          </div>
        </div>
      )}

      {/* COMBATE */}
      {combatStarted && (
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-center py-8">
          <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700 text-center space-y-4">
            <div className="text-6xl animate-bounce duration-1000">🛡️</div>
            <h3 className="text-xl font-bold">{player.name}</h3>
            {message && <p className="text-sm text-amber-400 italic font-medium">{message}</p>}
            <div className="grid grid-cols-1 gap-2">
              <button disabled={enemy.hp <= 0 || player.hp <= 0} onClick={() => playerAttack(null)}
                className="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold disabled:opacity-50">
                ⚔️ Atacar com Humildade
              </button>
              <div className="grid grid-cols-2 gap-2">
                {availableTreasures.map((t, i) => (
                  <button key={i} onClick={() => playerAttack(t)}
                    className="py-2 bg-amber-500/20 hover:bg-amber-500/40 border border-amber-500/50 rounded-xl text-xs font-bold text-amber-500">
                    ✨ Usar {typeof t === 'string' ? t.split(' ')[0] : t.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-yellow-950/20 p-6 rounded-3xl border border-yellow-800/50 text-center space-y-4">
            <div className={`text-6xl transition-all duration-300 ${enemy.hp <= 0 ? 'grayscale rotate-180' : 'animate-pulse'}`}>🗿</div>
            <h3 className="text-xl font-bold text-yellow-500">{enemy.name}</h3>
            <p className="text-xs text-slate-500 italic">"Colosso da vaidade — servo do Pecado do Orgulho"</p>
            <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden border border-yellow-900/50">
              <div className="h-full bg-yellow-600 transition-all duration-300" style={{ width: `${(enemy.hp / maxEnemyHP) * 100}%` }}></div>
            </div>
            <p className="text-xs font-bold text-yellow-800 uppercase tracking-widest">{enemy.hp} / {maxEnemyHP} HP</p>
          </div>
        </div>
      )}

      {showDiceOverlay && !overlayDone && (
        <DiceSkillOverlay title="Humildade Fortalecida!" setPlayer={setPlayer} onDone={() => { setShowDiceOverlay(false); setOverlayDone(true); }} />
      )}

      {enemy.hp <= 0 && overlayDone && (
        <div className="text-center py-8 space-y-4">
          <p className="text-xl text-green-400 font-bold italic">"Davi assoa a harpa suavemente: 'O humilde herdará a terra.'"</p>
          <button onClick={onNext} className="px-12 py-4 bg-green-500 hover:bg-green-400 text-slate-900 font-black rounded-2xl transition-all animate-bounce">
            Avançar para o Capítulo 8 — O Monte Final
          </button>
        </div>
      )}
    </div>
  );
}
