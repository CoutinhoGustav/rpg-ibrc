import React, { useState } from "react";
import Dice3D from "./Dice3D";

/**
 * DiceSkillOverlay - Overlay de vitória com sorteio de dado 3D e distribuição de pontos.
 *
 * Props:
 *   title: string - Título do overlay
 *   setPlayer: function - Setter do player do GameContext
 *   onDone: () => void - Chamada quando todos os pontos forem distribuídos
 */
export default function DiceSkillOverlay({ title = "Evolução!", setPlayer, onDone }) {
    const [diceRolled, setDiceRolled] = useState(false);
    const [availablePoints, setAvailablePoints] = useState(0);
    const [bonusStats, setBonusStats] = useState({ attack: 0, defense: 0, hp: 0 });

    const handleDiceRoll = (value) => {
        setAvailablePoints(value);
        setDiceRolled(true);
    };

    const allocate = (stat) => {
        if (availablePoints <= 0) return;
        const amount = stat === "hp" ? 20 : 1;

        setBonusStats(prev => ({ ...prev, [stat]: prev[stat] + amount }));

        setPlayer(prev => ({
            ...prev,
            hp: stat === "hp" ? prev.hp + amount : prev.hp,
            attack: stat === "attack" ? prev.attack + amount : prev.attack,
            defense: stat === "defense" ? prev.defense + amount : prev.defense,
        }));

        const newVal = availablePoints - 1;
        setAvailablePoints(newVal);
        if (newVal <= 0) {
            setTimeout(() => onDone(), 700);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 border-2 border-amber-500 p-8 rounded-3xl max-w-md w-full text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-500">
                <h3 className="text-2xl font-black text-amber-500 uppercase italic">{title}</h3>

                {!diceRolled ? (
                    <div className="flex flex-col items-center space-y-3 py-2">
                        <Dice3D onRoll={handleDiceRoll} />
                    </div>
                ) : (
                    <div className="space-y-5 animate-in zoom-in-95 duration-500">
                        <div className="flex items-center justify-center space-x-4">
                            <Dice3D onRoll={handleDiceRoll} disabled={diceRolled} />
                            <div className="text-left">
                                <div className="text-amber-500 font-black text-lg italic uppercase">Sorte Grande!</div>
                                <div className="text-slate-400 text-sm">
                                    Distribua seus{" "}
                                    <span className="text-amber-500 font-bold">{availablePoints}</span> pontos:
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-2 text-left">
                            <button
                                onClick={() => allocate("attack")}
                                disabled={availablePoints <= 0}
                                className="flex justify-between items-center bg-slate-900 hover:bg-slate-700 disabled:opacity-50 p-3 rounded-xl border border-slate-700 transition-all group"
                            >
                                <span className="flex items-center space-x-2">
                                    <span className="text-xl">⚔️</span>
                                    <span className="font-bold text-slate-300">Ataque</span>
                                </span>
                                <span className="bg-amber-500/10 px-3 py-1 rounded-lg text-amber-500 font-black group-hover:bg-amber-500 group-hover:text-slate-900 transition-colors">
                                    +{bonusStats.attack} (▲+1)
                                </span>
                            </button>

                            <button
                                onClick={() => allocate("defense")}
                                disabled={availablePoints <= 0}
                                className="flex justify-between items-center bg-slate-900 hover:bg-slate-700 disabled:opacity-50 p-3 rounded-xl border border-slate-700 transition-all group"
                            >
                                <span className="flex items-center space-x-2">
                                    <span className="text-xl">🛡️</span>
                                    <span className="font-bold text-slate-300">Defesa</span>
                                </span>
                                <span className="bg-blue-500/10 px-3 py-1 rounded-lg text-blue-400 font-black group-hover:bg-blue-500 group-hover:text-slate-900 transition-colors">
                                    +{bonusStats.defense} (▲+1)
                                </span>
                            </button>

                            <button
                                onClick={() => allocate("hp")}
                                disabled={availablePoints <= 0}
                                className="flex justify-between items-center bg-slate-900 hover:bg-slate-700 disabled:opacity-50 p-3 rounded-xl border border-slate-700 transition-all group"
                            >
                                <span className="flex items-center space-x-2">
                                    <span className="text-xl">❤️</span>
                                    <span className="font-bold text-slate-300">Vida (HP)</span>
                                </span>
                                <span className="bg-red-500/10 px-3 py-1 rounded-lg text-red-400 font-black group-hover:bg-red-500 group-hover:text-slate-900 transition-colors">
                                    +{bonusStats.hp} (▲+20)
                                </span>
                            </button>
                        </div>

                        {availablePoints <= 0 && (
                            <p className="text-green-400 font-bold animate-in fade-in duration-500 text-sm">
                                ✅ Atributos distribuídos! Continuando...
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
