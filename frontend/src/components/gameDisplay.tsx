import React from "react";
import { useState } from "react";
import type { Game } from "../model/game";

interface GameDisplayProps {
  game: Game;
  detailed?: boolean;
  onClick?: () => void;
}

const GameDisplay = ({ game, detailed = false, onClick }: GameDisplayProps) => {
  return (
    <div className="card" onClick={onClick}>
      <p>Nombre: {game.name}</p>
      <p>Autor: {game.creator}</p>
      {detailed && (
        <>
          <p>Año de lanzamiento: {game.release_year}</p>
          <p>Género/s: {game.genre.map((e) => e + ", ")}</p>
        </>
      )}
    </div>
  );
};

export default GameDisplay;
