import React, { createContext, useContext, useState, useEffect } from 'react';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
    const [step, setStep] = useState(() => {
        const savedStep = localStorage.getItem('rpg_step');
        return savedStep ? parseInt(savedStep, 10) : 0;
    });

    const [player, setPlayer] = useState(() => {
        const savedPlayer = localStorage.getItem('rpg_player');
        return savedPlayer ? JSON.parse(savedPlayer) : {
            name: "",
            gender: "",
            class: "",
            hp: 100,
            level: 1,
            xp: 0,
            attack: 5,
            defense: 3,
            skillPoints: 0
        };
    });

    const [treasures, setTreasures] = useState(() => {
        const savedTreasures = localStorage.getItem('rpg_treasures');
        return savedTreasures ? JSON.parse(savedTreasures) : [];
    });

    useEffect(() => {
        localStorage.setItem('rpg_step', step);
    }, [step]);

    useEffect(() => {
        localStorage.setItem('rpg_player', JSON.stringify(player));
    }, [player]);

    useEffect(() => {
        localStorage.setItem('rpg_treasures', JSON.stringify(treasures));
    }, [treasures]);

    const nextStep = () => setStep(prev => prev + 1);

    const gainXP = (gainedXP) => {
        setPlayer(prev => {
            const newXP = prev.xp + gainedXP;
            let newLevel = prev.level;
            let newSkillPoints = prev.skillPoints || 0;

            // Level up logic (every 100 XP for simplicity or current level * 50)
            if (newXP >= newLevel * 100) {
                newLevel += 1;
                newSkillPoints += 3;
            }

            return {
                ...prev,
                xp: newXP,
                level: newLevel,
                skillPoints: newSkillPoints
            };
        });
    };

    const allocateSkill = (skill, customAmount) => {
        setPlayer(prev => {
            if ((prev.skillPoints || 0) <= 0) return prev;

            const updates = { skillPoints: prev.skillPoints - 1 };
            if (skill === "hp") updates.hp = prev.hp + (customAmount || 20);
            else if (skill === "attack") updates.attack = prev.attack + (customAmount || 1);
            else if (skill === "defense") updates.defense = prev.defense + (customAmount || 1);

            return { ...prev, ...updates };
        });
    };

    const revivePlayer = () => {
        setPlayer(prev => ({
            ...prev,
            hp: 100 + (prev.level - 1) * 10 // Restaurar vida base + bônus de nível
        }));
    };

    const resetGame = () => {
        setStep(0);
        setPlayer({
            name: "",
            gender: "",
            class: "",
            hp: 100,
            level: 1,
            xp: 0,
            attack: 5,
            defense: 3,
            skillPoints: 0
        });
        setTreasures([]);
        localStorage.removeItem('rpg_step');
        localStorage.removeItem('rpg_player');
        localStorage.removeItem('rpg_treasures');
    };

    const value = {
        step,
        setStep,
        nextStep,
        player,
        setPlayer,
        treasures,
        setTreasures,
        gainXP,
        allocateSkill,
        revivePlayer,
        resetGame
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
};
