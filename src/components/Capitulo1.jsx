import React, { useState } from "react";
import { useGame } from "../context/GameContext";

export default function Capitulo1({ onNext }) {
  const { player, treasures, setTreasures, setPlayer } = useGame();

  // Dynamic image loading
  const images = import.meta.glob('../img/**/*.png', { eager: true });
  const getImagePath = (step) => {
    const path = `../img/${player.gender}/Capitulo 1/${Math.min(step + 1, 6)}.png`;
    return images[path]?.default || "";
  };

  const [storyStep, setStoryStep] = useState(0);
  const [showPuzzle, setShowPuzzle] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);

  const storyTexts = [
    `Olá ${player.name}!`,
    "Hoje você sairá em sua primeira aventura pelo mundo de fé e coragem.",
    "Enquanto passeava pela floresta, algo te aflige e toca em seu coração. É o Espírito Santo, alertando que há algo errado em seu vilarejo.",
    "Voltando depressa, você vê que o vilarejo está em perigo.",
    "Vizinhos alertam que um grande mal apareceu de repente e pessoas enfurecidas atacaram o vilarejo.",
    "Eles pedem a sua ajuda, para combater este mal e que precisa usar sabedoria e coragem para enfrentar desafios e ajudar aqueles ao seu redor.",
    "Um deles lhe entrega um pergaminho antigo dizendo que se desvendar um enigma que está nele, você receberá um grande poder concedido por Deus.",
    "O vilarejo está em perigo e muitos tesouros estão escondidos em enigmas bíblicos que precisam ser resolvidos.",
    "Olha! Um antigo pergaminho com um enigma apareceu diante de você!",
  ];

  const puzzles = [
    {
      question: "Quem construiu a arca para sobreviver ao dilúvio?",
      reference: "Gênesis 6:14-22",
      options: ["Moisés", "Abraão", "Noé", "Davi"],
      answer: "Noé",
      reward: "Chave de Sabedoria",
      stats: { xp: 50, attack: 1 }
    },
    {
      question: "Quantos dias Jesus jejuou no deserto?",
      reference: "Mateus 4:2",
      options: ["30 dias", "40 dias", "7 dias", "50 dias"],
      answer: "40 dias",
      reward: "Escudo da Fé",
      stats: { xp: 50, defense: 2 }
    },
  ];

  const nextStory = () => {
    if (storyStep < storyTexts.length - 1) {
      setStoryStep(storyStep + 1);
    } else {
      setShowPuzzle(true);
    }
  };

  const handleAnswer = (option) => {
    const puzzle = puzzles[currentPuzzleIndex];
    if (option === puzzle.answer) {
      setFeedback(`✅ Correto! Você ganhou: ${puzzle.reward}`);

      // Update global state
      setTreasures([...treasures, puzzle.reward]);
      setPlayer(prev => ({
        ...prev,
        xp: prev.xp + puzzle.stats.xp,
        attack: prev.attack + (puzzle.stats.attack || 0),
        defense: prev.defense + (puzzle.stats.defense || 0)
      }));

      setTimeout(() => {
        setFeedback("");
        if (currentPuzzleIndex < puzzles.length - 1) {
          setCurrentPuzzleIndex(currentPuzzleIndex + 1);
        } else {
          setShowPuzzle(false);
          onNext(); // Advance to Chapter 2
        }
      }, 2000);
    } else {
      setFeedback("❌ Errado! O Espírito sussurra que você pode tentar novamente.");
      setPlayer(prev => ({ ...prev, hp: Math.max(0, prev.hp - 5) }));
    }
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
        <h2 className="text-amber-500 font-bold uppercase tracking-[0.2em] text-sm mb-2">Capítulo 1</h2>
        <h1 className="text-3xl md:text-4xl font-black text-white">O Início da Jornada</h1>
      </div>

      {!showPuzzle && (
        <div className="min-h-[400px] flex flex-col items-center justify-center space-y-10 animate-in slide-in-from-bottom-6 duration-700">
          {/* Container Premium da Imagem - Responsivo */}
          <div className="relative group w-full max-w-2xl px-2 md:px-4">
            {/* Brilho de Fundo Dinâmico */}
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-700 rounded-[2.5rem]"></div>

            <div className="relative aspect-video md:aspect-[21/9] bg-slate-900 rounded-2xl md:rounded-[2rem] overflow-hidden border-2 border-slate-700/50 shadow-2xl group-hover:border-amber-500/30 transition-all duration-500">
              {/* Moldura Interna */}
              <div className="absolute inset-2 md:inset-3 border border-slate-700/30 rounded-xl md:rounded-[1.4rem] z-10 pointer-events-none group-hover:border-amber-500/10 transition-colors"></div>

              {/* Background Desfocado para preencher espaços */}
              <img
                src={getImagePath(storyStep)}
                className="absolute inset-0 w-full h-full object-cover blur-xl opacity-40 scale-110"
                alt=""
              />

              <img
                key={storyStep}
                src={getImagePath(storyStep)}
                alt={`Cena ${storyStep + 1}`}
                className="absolute inset-0 w-full h-full object-contain z-0 scale-95 md:scale-100 group-hover:scale-105 transition-all duration-[2000ms] ease-out animate-in fade-in zoom-in-95 duration-1000"
                onError={(e) => { e.target.style.display = 'none'; }}
              />

              {/* Vinheta e Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80 pointer-events-none"></div>

              {/* Info da Cena Overlay - Ajustado para mobile */}
              <div className="absolute bottom-4 left-6 md:bottom-6 md:left-8 z-20 space-y-0.5 md:space-y-1 text-left">
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-amber-500 rounded-full animate-pulse"></span>
                  <span className="text-[8px] md:text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] drop-shadow-md">Escrito na História</span>
                </div>
                <h3 className="text-white font-bold text-sm md:text-lg opacity-90 group-hover:opacity-100 transition-opacity">Passo {storyStep + 1} de {storyTexts.length}</h3>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/40 p-6 md:p-10 rounded-2xl md:rounded-3xl border border-slate-700/50 max-w-2xl w-full text-center backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500/20"></div>

            <p className="text-lg md:text-2xl leading-relaxed text-slate-200">
              "{storyTexts[storyStep]}"
            </p>
          </div>

          <button
            onClick={nextStory}
            className="group flex items-center space-x-3 px-8 py-3 bg-slate-700 hover:bg-amber-500 text-white hover:text-slate-900 font-bold rounded-2xl transition-all shadow-lg hover:scale-105"
          >
            <span>{storyStep === storyTexts.length - 1 ? "Enfrentar Desafio" : "Continuar"}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      )}

      {showPuzzle && (
        <div className="max-w-2xl mx-auto space-y-6 animate-in zoom-in-95 duration-500">
          <div className="bg-amber-500/10 border-2 border-amber-500/30 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">📖</div>
            <h3 className="text-amber-500 font-black uppercase text-xl mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-amber-500 text-slate-900 flex items-center justify-center text-sm">?</span>
              Enigma Sagrado
            </h3>
            <p className="text-2xl font-medium text-white mb-6">
              {puzzles[currentPuzzleIndex].question}
            </p>
            <div className="bg-slate-900/50 inline-block px-3 py-1 rounded-lg border border-slate-700 text-xs text-amber-500 font-bold mb-8">
              📖 {puzzles[currentPuzzleIndex].reference}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {puzzles[currentPuzzleIndex].options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  className="p-4 bg-slate-900/80 hover:bg-amber-500 border border-slate-700 hover:border-amber-400 text-left text-slate-300 hover:text-slate-900 font-bold rounded-2xl transition-all active:scale-95 group flex justify-between items-center"
                >
                  {opt}
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">✨</span>
                </button>
              ))}
            </div>
          </div>
          {feedback && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
              <div className={`bg-slate-800 border-2 ${feedback.includes('✅') ? 'border-green-500/50' : 'border-red-500/50'} p-8 rounded-[2.5rem] max-w-sm w-full text-center shadow-2xl transform animate-in zoom-in-95 duration-300 relative overflow-hidden`}>
                {/* Efeito de brilho no fundo do modal */}
                <div className={`absolute -inset-24 ${feedback.includes('✅') ? 'bg-green-500/10' : 'bg-red-500/10'} blur-3xl opacity-50`}></div>

                <div className="relative z-10">
                  <div className="text-7xl mb-6 animate-bounce">
                    {feedback.includes('✅') ? '✨' : '⚠️'}
                  </div>
                  <h3 className={`text-2xl font-black mb-4 uppercase tracking-tight ${feedback.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>
                    {feedback.includes('✅') ? 'Excelente!' : 'Tente Novamente'}
                  </h3>
                  <p className="text-slate-200 text-lg leading-relaxed mb-8 font-medium italic">
                    {feedback.replace('✅ ', '').replace('❌ ', '')}
                  </p>

                  <button
                    onClick={() => setFeedback("")}
                    className={`w-full py-4 rounded-2xl font-black text-slate-900 transition-all active:scale-95 shadow-lg ${feedback.includes('✅') ? 'bg-green-500 hover:bg-green-400' : 'bg-red-500 hover:bg-red-400'}`}
                  >
                    {feedback.includes('✅') ? 'Continuar Jornada' : 'Entendi'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Inventário View */}
      <div className="pt-12">
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-4 text-center">Tesouros Conquistados</h4>
        <div className="flex flex-wrap justify-center gap-3">
          {treasures.length > 0 ? treasures.map((t, i) => (
            <div key={i} className="px-3 py-1 bg-slate-800/50 border border-slate-700 rounded-lg text-xs font-bold text-amber-500/80 animate-in fade-in zoom-in duration-300">
              💎 {t}
            </div>
          )) : (
            <p className="text-[10px] text-slate-700 uppercase italic">Nenhum tesouro ainda...</p>
          )}
        </div>
      </div>
    </div>
  );
}