"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateInputGenre = exports.validateInputNumber = exports.validateInputStringImage = exports.validateInputString = void 0;
const validateInputString = (input, lenMin, lenMax) => {
    if (!input) {
        return false;
    }
    else {
        if (typeof input === "string") {
            return input.replace(/\s+/g, '') !== "" && input.length >= lenMin && input.length <= lenMax;
        }
        else {
            return false;
        }
    }
};
exports.validateInputString = validateInputString;
const validateInputStringImage = (input) => {
    if ((0, exports.validateInputString)(input, 10, 300)) {
        const pattern = /^https?:\/\/.*\.(png|jpg|jpeg|gif|bmp|webp|svg)$/i;
        return pattern.test(input.trim());
    }
    else {
        return false;
    }
};
exports.validateInputStringImage = validateInputStringImage;
const validateInputNumber = (input, min, max) => {
    if (!input && input !== 0) {
        return false;
    }
    else {
        if (typeof input == "number") {
            return input >= min && input <= max;
        }
        else {
            return false;
        }
    }
};
exports.validateInputNumber = validateInputNumber;
const validateInputGenre = (input) => {
    if (!input) {
        return false;
    }
    else {
        if (Array.isArray(input)) {
            const genreOptions = ["Acción", "Aventura", "Battle Royale", "Carrera", "Ciencia Ficción",
                "Deportes", "Estrategia", "Fantasia", "Indie", "Metroidvania", "MOBA", "Multiplayer",
                "Mundo Abierto", "Party Game", "Peleas", "Plataforma", "Rogue Like", "RPG", "Sandbox",
                "Shooter", "Sigilo", "Simulador", "Souls Like", "Superheroes", "Survival", "Tactical",
                "Team-Based", "Terror"
            ];
            const withoutRepeat = new Set(input);
            return input.every((g) => (typeof g === "string" && genreOptions.includes(g))) && input.length > 0 && withoutRepeat.size == input.length;
        }
        else {
            return false;
        }
    }
};
exports.validateInputGenre = validateInputGenre;
