import React from "react";
import { useState } from "react";
import type { Game } from "../model/game";

interface GameDisplayProps{
    game: Game
}

const GameDisplay=({game}: GameDisplayProps) => {
    
    return (
        <div className="card">
            <p>Nombre: {game.name}</p>
            <p>Autor: {game.creator}</p>
            <p>Año de lanzamiento: {game.release_year}</p>
            <p>Género/s: {game.genre.map(e => e + ", ")}</p>
        </div>
    )
}

export default GameDisplay;