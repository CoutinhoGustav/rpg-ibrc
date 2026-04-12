import React from "react";

export default function Intro({ onNext }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="relative">
        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 py-2">
          Mundo Bíblico RPG
        </h1>
        <div className="absolute -inset-1 bg-amber-500/20 blur-xl -z-10 rounded-full"></div>
      </div>

      <p className="text-xl md:text-2xl text-slate-300 max-w-2xl leading-relaxed">
        Nesta aventura épica, você viverá histórias sagradas e resolverá desafios milenares com <span className="text-amber-400 font-semibold">sabedoria</span> e <span className="text-orange-400 font-semibold">coragem</span>!
      </p>

      <button
        onClick={onNext}
        className="group relative px-10 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xl rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-amber-500/30 overflow-hidden"
      >
        <span className="relative z-10">Começar Jornada</span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
      </button>

      <div className="pt-12 grid grid-cols-3 gap-8 text-slate-500">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-12 h-12 rounded-full border border-slate-700 flex items-center justify-center">⚔️</div>
          <span className="text-xs uppercase tracking-widest font-bold">Combate</span>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <div className="w-12 h-12 rounded-full border border-slate-700 flex items-center justify-center">📖</div>
          <span className="text-xs uppercase tracking-widest font-bold">História</span>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <div className="w-12 h-12 rounded-full border border-slate-700 flex items-center justify-center">🧩</div>
          <span className="text-xs uppercase tracking-widest font-bold">Enigmas</span>
        </div>
      </div>
    </div>
  );
}
