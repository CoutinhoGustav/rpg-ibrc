import React from "react";
import { useGame } from "./context/GameContext";
import Intro from "./components/Intro";
import CharacterCreation from "./components/CharacterCreation";
import Transition from "./components/Transitions";
import Capitulo1 from "./components/Capitulo1";
import Capitulo2 from "./components/Capitulo2";
import Capitulo3 from "./components/Capitulo3";
import Capitulo4 from "./components/Capitulo4";
import Capitulo5 from "./components/Capitulo5";
import Capitulo6 from "./components/Capitulo6";
import GameOver from "./components/GameOver";
import "./index.css";

export default function App() {
  const { step, player, nextStep, resetGame } = useGame();

  return (
    <div className="App min-h-screen bg-slate-900 text-white font-sans selection:bg-amber-500 selection:text-slate-900 pb-20">
      {player.hp === 0 && <GameOver />}
      <div className="max-w-4xl mx-auto p-4 md:p-8 flex flex-col justify-center min-h-[90vh]">
        {step === 0 && <Intro onNext={nextStep} />}
        {step === 1 && <CharacterCreation onNext={nextStep} />}
        {step === 2 && <Transition onNext={nextStep} />}
        {step === 3 && <Capitulo1 onNext={nextStep} />}
        {step === 4 && <Capitulo2 onNext={nextStep} />}
        {step === 5 && <Capitulo3 onNext={nextStep} />}
        {step === 6 && <Capitulo4 onNext={nextStep} />}
        {step === 7 && <Capitulo5 onNext={nextStep} />}
        {step === 8 && <Capitulo6 onNext={nextStep} />}

        {step > 8 && (
          <div className="text-center py-20 space-y-8 animate-in fade-in zoom-in duration-1000">
            <div className="text-8xl mb-6">🏆</div>
            <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
              Jornada Concluída!
            </h2>
            <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto">
              Parabéns, <span className="text-amber-500 font-bold">{player.name}</span>! Sua fé e coragem te levaram através de todas as provações.
            </p>
            <div className="pt-10">
              <button
                onClick={resetGame}
                className="px-12 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-black rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-amber-500/20"
              >
                Reiniciar Jornada
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
