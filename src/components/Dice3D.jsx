import React, { useState } from "react";
import "./Dice3D.css";

const pipLayouts = {
    1: [[50, 50]],
    2: [[25, 25], [75, 75]],
    3: [[25, 25], [50, 50], [75, 75]],
    4: [[25, 25], [75, 25], [25, 75], [75, 75]],
    5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
    6: [[25, 20], [75, 20], [25, 50], [75, 50], [25, 80], [75, 80]],
};

// Rotação aplicada ao CUBO para trazer cada face para a frente (de frente ao jogador)
const faceRotations = {
    1: { x: 0, y: 0 },  // face frontal
    2: { x: -90, y: 0 },  // face do topo
    3: { x: 0, y: -90 },  // face direita
    4: { x: 0, y: 90 },  // face esquerda
    5: { x: 90, y: 0 },  // face inferior
    6: { x: 0, y: 180 },  // face traseira
};

function DiceFace({ number }) {
    const pips = pipLayouts[number] || [];
    return (
        <div className="dice-face-inner">
            {pips.map(([x, y], i) => (
                <div key={i} className="dice-pip" style={{ left: `${x}%`, top: `${y}%` }} />
            ))}
        </div>
    );
}

export default function Dice3D({ onRoll, disabled = false }) {
    const [rolling, setRolling] = useState(false);
    const [result, setResult] = useState(null);
    // Acumula rotações para que o dado sempre gire a partir de onde parou
    const [rotX, setRotX] = useState(0);
    const [rotY, setRotY] = useState(0);

    const roll = () => {
        if (disabled || rolling) return;
        setRolling(true);
        setResult(null);

        const value = Math.floor(Math.random() * 6) + 1;
        const face = faceRotations[value];

        // 2-3 voltas + a rotação exata da face sorteada
        const spinsX = (Math.floor(Math.random() * 2) + 2) * 360;
        const spinsY = (Math.floor(Math.random() * 2) + 2) * 360;

        const newRotX = rotX + spinsX + face.x;
        const newRotY = rotY + spinsY + face.y;

        setRotX(newRotX);
        setRotY(newRotY);

        setTimeout(() => {
            setResult(value);
            setRolling(false);
            if (onRoll) onRoll(value);
        }, 1800);
    };

    return (
        <div
            className="dice-scene"
            onClick={roll}
            title={disabled ? "Dado já utilizado" : "Clique para rolar o dado"}
            style={{
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.85 : 1,
            }}
        >
            <div
                className="dice-cube"
                style={{ transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)` }}
            >
                {/* front=1, back=6, right=3, left=4, top=2, bottom=5 */}
                <div className="dice-face dice-front"><DiceFace number={1} /></div>
                <div className="dice-face dice-back"><DiceFace number={6} /></div>
                <div className="dice-face dice-right"><DiceFace number={3} /></div>
                <div className="dice-face dice-left"><DiceFace number={4} /></div>
                <div className="dice-face dice-top"><DiceFace number={2} /></div>
                <div className="dice-face dice-bottom"><DiceFace number={5} /></div>
            </div>

            {!rolling && !result && <p className="dice-hint">Clique para rolar</p>}
            {rolling && <p className="dice-rolling-text">Rolando...</p>}
            {!rolling && result && <p className="dice-result">🎲 {result} pontos!</p>}
        </div>
    );
}
