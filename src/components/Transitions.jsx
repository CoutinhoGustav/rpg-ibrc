import React, { useEffect } from "react";

export default function Transition({ onNext }) {
  useEffect(() => {
    const timer = setTimeout(onNext, 3000); 
    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <div className="transition">
      <h1>⚔️ A Jornada Começa! ⚔️</h1>
      <p>Prepare-se para viver uma aventura incrível!</p>
    </div>
  );
}
