import React from "react";
import { useGame } from "../context/GameContext";

export default function GameOver() {
    const { player, revivePlayer, resetGame } = useGame();

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl animate-in fade-in duration-1000">
            {/* Background Decor */}
            <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-900/30 blur-[120px] rounded-full animate-pulse"></div>
            </div>

            <div className="relative max-w-lg w-full bg-slate-900 border-2 border-red-900/50 rounded-[3rem] p-10 text-center space-y-8 shadow-[0_0_100px_rgba(153,27,27,0.3)] animate-in zoom-in-95 slide-in-from-bottom-10 duration-700">
                {/* Icone de Derrota */}
                <div className="relative inline-block">
                    <div className="text-8xl drop-shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-bounce duration-[3000ms]">💀</div>
                    <div className="absolute -bottom-2 -right-2 text-3xl">🥀</div>
                </div>

                <div className="space-y-2">
                    <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-red-800 uppercase tracking-tighter">
                        Sua Luz se Apagou
                    </h2>
                    <p className="text-slate-400 font-medium italic">
                        "${player.name} caiu bravamente em sua jornada..."
                    </p>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-red-900/50 to-transparent"></div>

                <p className="text-slate-300 text-sm leading-relaxed max-w-xs mx-auto">
                    Mas a jornada espiritual é feita de recomeços. O que deseja fazer agora, fiel guerreiro?
                </p>

                <div className="grid grid-cols-1 gap-4 pt-4">
                    <button
                        onClick={revivePlayer}
                        className="group relative px-8 py-5 bg-gradient-to-r from-red-600 to-red-800 text-white font-black text-xl rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(153,27,27,0.4)] overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                        <span className="relative">Reiniciar Combate</span>
                    </button>

                    <button
                        onClick={resetGame}
                        className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white font-bold rounded-2xl transition-all border border-slate-700 active:scale-95"
                    >
                        Voltar ao Início
                    </button>
                </div>

                <div className="pt-4">
                    <p className="text-[10px] text-red-900 font-bold uppercase tracking-[0.3em]">
                        "Misericordioso é o Senhor"
                    </p>
                </div>
            </div>
        </div>
    );
}
