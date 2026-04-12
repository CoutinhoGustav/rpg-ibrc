import React, { useState } from "react";
import { useGame } from "../context/GameContext";

export default function Capitulo6({ onNext }) {
  const { player, treasures, setTreasures } = useGame();
  const [storyStep, setStoryStep] = useState(0);
  const [showDivineMessage, setShowDivineMessage] = useState(false);
  const [artifactConfirmed, setArtifactConfirmed] = useState(false);
  const [message, setMessage] = useState("");

  const storyTexts = [
    `${player.name} sai finalmente das profundezas, sentindo o ar puro e uma paz que transcende todo entendimento.`,
    "De repente, uma luz indescritível envolve o horizonte e uma voz suave, mas poderosa, ecoa em sua alma.",
    "O Criador observa sua jornada de coragem e fé, vendo como você usou a sabedoria para vencer as trevas.",
    "Como sinal de uma nova aliança, Ele lhe confia o segredo de uma paz que ninguém pode tirar."
  ];

  const divineArtifact = {
    name: "Coração de Luz Eterna",
    description: "Um artefato que brilha com a verdade. Suas batalhas agora serão guiadas pela paz.",
    atk: 10,
    def: 10
  };

  const nextStory = () => {
    if (storyStep < storyTexts.length - 1) {
      setStoryStep(storyStep + 1);
    } else {
      setShowDivineMessage(true);
    }
  };

  const handleArtifactChoice = (choice) => {
    if (choice) {
      setTreasures([...treasures, divineArtifact]);
      setMessage(`✨ O Coração de Luz Eterna agora bate dentro de você. Sua jornada apenas começou.`);
    } else {
      setMessage(`Você escolheu seguir com a força que já possui. Sua fé é seu maior guia.`);
    }
    setArtifactConfirmed(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8 animate-in fade-in duration-2000">
      <div className="text-center">
        <h2 className="text-amber-500 font-bold uppercase tracking-[0.2em] text-sm mb-2">Capítulo Final</h2>
        <h1 className="text-4xl md:text-6xl font-black text-white italic">A Voz da Aliança</h1>
      </div>

      {!showDivineMessage && !artifactConfirmed && (
        <div className="space-y-10 animate-in slide-in-from-bottom-8 duration-700">
          {/* Container Premium da Revelação Final */}
          <div className="relative group w-full max-w-2xl px-4 transition-all duration-700 hover:scale-105">
            <div className="absolute -inset-2 bg-gradient-to-r from-amber-400/30 to-orange-500/30 blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-1000 rounded-[3rem]"></div>

            <div className="relative aspect-video bg-slate-900 rounded-[3rem] border border-dashed border-amber-500/40 flex items-center justify-center overflow-hidden transition-all duration-1000 shadow-[0_0_50px_rgba(245,158,11,0.2)] group-hover:shadow-[0_0_80px_rgba(245,158,11,0.4)]">
              {/* Efeitos de Partícula/Luz */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.1)_0%,transparent_70%)] animate-pulse"></div>

              <div className="text-center space-y-6 animate-in fade-in zoom-in-95 duration-1000">
                <span className="text-9xl block drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-transform duration-1000 group-hover:scale-110">✨</span>
                <div className="space-y-2">
                  <p className="text-lg font-black text-amber-500 uppercase tracking-[0.4em] drop-shadow-lg">
                    Revelação Final
                  </p>
                  <div className="h-px w-24 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent mx-auto"></div>
                  <p className="text-xs text-amber-500/50 italic tracking-widest uppercase font-bold">A Aliança Eterna</p>
                </div>
              </div>
            </div>
          </div>
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
          <div className="bg-slate-800/20 p-12 rounded-[3rem] border border-amber-500/20 backdrop-blur-sm max-w-3xl mx-auto">
            <p className="text-2xl md:text-3xl leading-relaxed text-slate-100 font-medium italic">
              "{storyTexts[storyStep]}"
            </p>
          </div>
          <button
            onClick={nextStory}
            className="group relative px-12 py-5 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-900 font-black text-xl rounded-2xl transition-all hover:scale-105 shadow-[0_0_30px_rgba(245,158,11,0.3)]"
          >
            Avançar na Luz
          </button>
        </div>
      )}

      {showDivineMessage && !artifactConfirmed && (
        <div className="max-w-xl mx-auto space-y-8 animate-in zoom-in-90 duration-1000">
          <div className="text-8xl animate-pulse drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">✨</div>
          <div className="space-y-4">
            <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Receba sua recompensa</h3>
            <p className="text-slate-400 italic">"Bem está, servo bom e fiel..."</p>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 p-8 rounded-3xl space-y-4 shadow-inner">
            <h4 className="text-2xl font-bold text-amber-500">{divineArtifact.name}</h4>
            <p className="text-sm text-slate-300">{divineArtifact.description}</p>
            <div className="flex justify-center gap-4 py-2">
              <span className="px-3 py-1 bg-slate-900 rounded-lg text-xs font-bold text-amber-500">+{divineArtifact.atk} ATK</span>
              <span className="px-3 py-1 bg-slate-900 rounded-lg text-xs font-bold text-blue-400">+{divineArtifact.def} DEF</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => handleArtifactChoice(true)} className="py-4 bg-amber-500 text-slate-900 font-black rounded-2xl transition-all shadow-lg hover:shadow-amber-500/20">Aceitar</button>
            <button onClick={() => handleArtifactChoice(false)} className="py-4 border border-slate-700 text-slate-400 font-bold rounded-2xl hover:bg-slate-800 transition-all">Seguir Apenas com Fé</button>
          </div>
        </div>
      )}

      {artifactConfirmed && (
        <div className="space-y-12 animate-in fade-in zoom-in duration-1000 py-10">
          <div className="text-6xl animate-bounce">🕊️</div>
          <div className="space-y-4">
            <p className="text-3xl font-medium text-white max-w-2xl leading-relaxed italic">
              "{message}"
            </p>
          </div>
          <button
            onClick={onNext}
            className="px-16 py-6 bg-white text-slate-900 font-black text-2xl rounded-3xl transition-all hover:scale-110 shadow-2xl hover:bg-slate-100"
          >
            Concluir Jornada
          </button>
        </div>
      )}
    </div>
  );
}
