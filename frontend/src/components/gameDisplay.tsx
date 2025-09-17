import React from "react";
import { useState } from "react";
import type { Game } from "../model/game";

interface GameDisplayProps{
    game: Game
}

const gameDisplay=({game}: GameDisplayProps) => {
    
    return (
        <div>
            <p>Nombre: {game.name}</p>
            <p>Autor: {game.creator}</p>
            <p>Año de lanzamiento: {game.release_year}</p>
            <p>Género/s: {game.genre.map(e => e)}</p>
        </div>
    )
}
