import React, { useEffect } from "react";

export default function Transition({ onNext }) {
  useEffect(() => {
    const timer = setTimeout(onNext, 2000);
    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-pulse">
      <div className="text-6xl md:text-8xl mb-4 drop-shadow-2xl">⚔️</div>
      <h1 className="text-4xl md:text-6xl font-black text-amber-500 uppercase tracking-tighter italic">
        A Jornada Começa!
      </h1>
      <p className="text-slate-400 text-lg md:text-xl font-medium tracking-widest uppercase">
        Prepare seu coração para a aventura...
      </p>

      <div className="w-48 h-1 bg-slate-800 rounded-full mt-8 overflow-hidden">
        <div className="h-full bg-amber-500 animate-[loading_2s_ease-in-out]"></div>
      </div>
    </div>
  );
}
