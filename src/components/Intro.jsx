import React from "react";

export default function Intro({ onNext }) {
  return (
    <div className="intro">
      <h1>Bem-vindo(a) ao Mundo Bíblico RPG!</h1>
      <p>Nesta aventura, você viverá histórias bíblicas e resolverá desafios com sabedoria e coragem!</p>
      
      <button onClick={onNext}>Começar Aventura</button>
    </div>
  );
}
