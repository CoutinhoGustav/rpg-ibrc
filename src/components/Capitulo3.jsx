import React, { useState } from "react";
import { useGame } from "../context/GameContext";

export default function Capitulo3({ onNext }) {
  const { player, treasures, setTreasures } = useGame();

  // Dynamic image loading
  const images = import.meta.glob('../img/**/*.png', { eager: true });
  const getImagePath = (step) => {
    const path = `../img/${player.gender}/Capitulo 3/${Math.min(step + 1, 4)}.png`;
    return images[path]?.default || "";
  };

  const [storyStep, setStoryStep] = useState(0);
  const [showPuzzle, setShowPuzzle] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [showItemChoice, setShowItemChoice] = useState(false);
  const [foundItem, setFoundItem] = useState(null);

  const storyTexts = [
    `Após derrotar o inimigo anterior, ${player.name} segue sua jornada pelas terras áridas.`,
    "Você avista uma caverna misteriosa, com símbolos antigos que emitem um brilho suave.",
    "Um pergaminho no chão revela mais um enigma bíblico deixado por antigos profetas.",
  ];

  const puzzles = [
    {
      question: "Quem foi lançado na cova dos leões por orar a Deus?",
      reference: "Daniel 6",
      options: ["Elias", "Daniel", "José", "Paulo"],
      answer: "Daniel",
      reward: {
        name: "Espada da Verdade",
        atk: 5,
        def: 2,
      },
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
    if (option === puzzles[0].answer) {
      setFeedback(`✅ Correto! Uma passagem se abre revelando um tesouro.`);
      setFoundItem(puzzles[0].reward);
      setTimeout(() => {
        setFeedback("");
        setShowItemChoice(true);
      }, 1500);
    } else {
      setFeedback("❌ O silêncio da caverna indica que a resposta está incorreta.");
    }
  };

  const handleItemChoice = (choice) => {
    if (choice) {
      setTreasures([...treasures, foundItem]);
    }
    setShowItemChoice(false);
    onNext();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 uppercase">
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
        <h2 className="text-amber-500 font-bold uppercase tracking-[0.2em] text-sm mb-2">Capítulo 3</h2>
        <h1 className="text-3xl md:text-4xl font-black text-white italic">A Caverna Misteriosa</h1>
      </div>

      {!showPuzzle && !showItemChoice && (
        <div className="min-h-[400px] flex flex-col items-center justify-center space-y-10 animate-in slide-in-from-bottom-6 duration-700">
          {/* Container Premium da Imagem da Caverna - Responsivo */}
          <div className="relative group w-full max-w-2xl px-2 md:px-4">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 blur-2xl opacity-40 group-hover:opacity-80 transition-opacity duration-700 rounded-[2.5rem]"></div>

            <div className="relative aspect-video md:aspect-[21/9] bg-slate-900 rounded-2xl md:rounded-[2rem] overflow-hidden border-2 border-slate-700/50 shadow-2xl group-hover:border-blue-500/30 transition-all duration-500">
              <div className="absolute inset-2 md:inset-3 border border-slate-700/30 rounded-xl md:rounded-[1.4rem] z-10 pointer-events-none group-hover:border-blue-500/10 transition-colors"></div>

              <img
                src={getImagePath(storyStep)}
                className="absolute inset-0 w-full h-full object-cover blur-xl opacity-40 scale-110"
                alt=""
              />

              <img
                key={storyStep}
                src={getImagePath(storyStep)}
                alt="Exploração da Caverna"
                className="absolute inset-0 w-full h-full object-contain z-0 scale-95 md:scale-100 group-hover:scale-105 transition-all duration-[2000ms] ease-out animate-in fade-in zoom-in-95 duration-1000"
                onError={(e) => { e.target.style.display = 'none'; }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80 pointer-events-none"></div>

              <div className="absolute bottom-4 left-6 md:bottom-6 md:left-8 z-20 space-y-0.5 md:space-y-1 text-left">
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  <span className="text-[8px] md:text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] drop-shadow-md">Territórios Desconhecidos</span>
                </div>
                <h3 className="text-white font-bold text-sm md:text-lg opacity-90">Exploração - Passo {storyStep + 1}</h3>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/40 p-6 md:p-10 rounded-2xl md:rounded-3xl border border-slate-700/50 max-w-2xl w-full text-center backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/20"></div>
            <p className="text-xl md:text-2xl leading-relaxed text-slate-200 font-medium italic">
              "{storyTexts[storyStep]}"
            </p>
          </div>
          <button
            onClick={nextStory}
            className="px-10 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-black rounded-2xl transition-all hover:scale-105"
          >
            Avançar
          </button>
        </div>
      )}

      {showPuzzle && !showItemChoice && (
        <div className="max-w-2xl mx-auto space-y-6 animate-in zoom-in-95 duration-500">
          <div className="bg-amber-500/10 border-2 border-amber-500/30 p-8 rounded-3xl shadow-2xl relative">
            <h3 className="text-amber-500 font-black uppercase text-xl mb-4">Enigma da Caverna</h3>
            <p className="text-2xl font-medium text-white mb-6 italic">{puzzles[0].question}</p>
            <div className="bg-slate-900/50 inline-block px-3 py-1 rounded-lg border border-slate-700 text-xs text-amber-500 font-bold mb-8">
              📖 {puzzles[0].reference}
            </div>

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
              <div className={`bg-slate-800 border-2 ${feedback.includes('✅') ? 'border-green-500/50' : 'border-red-500/50'} p-8 rounded-[2.5rem] max-w-sm w-full text-center shadow-2xl transform animate-in zoom-in-95 duration-300 relative overflow-hidden uppercase`}>
                <div className={`absolute -inset-24 ${feedback.includes('✅') ? 'bg-green-500/10' : 'bg-red-500/10'} blur-3xl opacity-50`}></div>

                <div className="relative z-10">
                  <div className="text-7xl mb-6 animate-bounce">
                    {feedback.includes('✅') ? '🕊️' : '🌑'}
                  </div>
                  <h3 className={`text-2xl font-black mb-4 uppercase tracking-tight ${feedback.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>
                    {feedback.includes('✅') ? 'Sabedoria!' : 'Reflexão'}
                  </h3>
                  <p className="text-slate-200 text-lg leading-relaxed mb-8 font-medium italic">
                    {feedback.replace('✅ ', '').replace('❌ ', '')}
                  </p>

                  <button
                    onClick={() => setFeedback("")}
                    className={`w-full py-4 rounded-2xl font-black text-slate-900 transition-all shadow-lg ${feedback.includes('✅') ? 'bg-green-500 hover:bg-green-400' : 'bg-red-500 hover:bg-red-400'}`}
                  >
                    {feedback.includes('✅') ? 'Abrir Passagem' : 'Tentar Outra Vez'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {showItemChoice && foundItem && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border-2 border-amber-500 p-10 rounded-[3rem] max-w-lg w-full text-center space-y-8 shadow-[0_0_50px_rgba(245,158,11,0.2)]">
            <div className="text-7xl animate-pulse">⚔️</div>
            <div className="space-y-2">
              <h3 className="text-3xl font-black text-amber-500 uppercase">Artefato Encontrado!</h3>
              <p className="text-2xl text-white font-bold">{foundItem.name}</p>
            </div>

            <div className="flex justify-center gap-6 text-slate-400 font-bold uppercase tracking-widest text-sm">
              <div className="text-center"><span className="text-amber-500 block text-xl">+{foundItem.atk}</span> ATK</div>
              <div className="text-center"><span className="text-blue-400 block text-xl">+{foundItem.def}</span> DEF</div>
            </div>

            <p className="text-slate-400 italic">"Pois a palavra de Deus é viva e eficaz, e mais afiada que qualquer espada de dois gumes..."</p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <button
                onClick={() => handleItemChoice(true)}
                className="py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-black rounded-2xl transition-all hover:scale-105"
              >
                Equipar
              </button>
              <button
                onClick={() => handleItemChoice(false)}
                className="py-4 bg-slate-700 hover:bg-slate-600 text-white font-black rounded-2xl transition-all"
              >
                Deixar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
