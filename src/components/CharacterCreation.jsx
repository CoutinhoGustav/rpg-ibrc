import React, { useState } from "react";

export default function CharacterCreation({ onNext, setPlayer }) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("Menino");
  const [charClass, setCharClass] = useState("Guerreiro da Fé");
  const [classInfo, setClassInfo] = useState("");

  const classAdvantages = {
    "Guerreiro da Fé": "💪 Foco em ataque físico. Começa com mais força e defesa.",
    "Sábio dos Salmos": "📖 Foco em inteligência e magia. Começa com bônus em XP e ataque mágico.",
    "Curador da Luz": "✨ Foco em cura e suporte. Começa com habilidade de recuperar HP mais rápido.",
  };

  const handleClassChange = (e) => {
    const selectedClass = e.target.value;
    setCharClass(selectedClass);
    setClassInfo(classAdvantages[selectedClass]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPlayer({ name, gender, class: charClass });
    onNext();
  };

  return (
    <div className="character-creation">
      <h2>Crie seu personagem</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nome:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Gênero:
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option>Menino</option>
            <option>Menina</option>
          </select>
        </label>
        <label>
          Classe:
          <select value={charClass} onChange={handleClassChange}>
            <option>Guerreiro da Fé</option>
            <option>Sábio dos Salmos</option>
            <option>Curador da Luz</option>
          </select>
        </label>

        {classInfo && (
          <p className="class-info">{classInfo}</p>
        )}

        <button type="submit">Pronto para Aventura</button>
      </form>
    </div>
  );
}
