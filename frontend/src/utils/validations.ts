export const validateInputString = (input: string, lenMin: number, lenMax: number) => {
    if (!input) {
        return false;
    } else {
        if (typeof input === "string") {
            return input.replace(/\s+/g, '') !== "" && input.length > lenMin - 1 && input.length < lenMax + 1;
        } else {
            return false;
        };
    };
};

export const validateInputStringImage = (input: string) => {
    if (validateInputString(input, 10, 300)) {
        const pattern = /^https?:\/\/.*\.(png|jpg|jpeg|gif|bmp|webp|svg)$/i;
        return pattern.test(input.trim());
    } else {
        return false
    };
};

export const validateInputNumber = (input: number, min: number, max: number) => {
    if (!input && input !== 0) {
        return false;
    } else {
        if (typeof input === "number") {
            return input > min - 1 && input < max + 1;
        } else {
            return false;
        };
    };
};

export const validateInputGenre = (input: string[]) => {
    if (!input) {
        return false;
    } else {
        if (Array.isArray(input)) {
            const genreOptions = ["Acción", "Aventura", "Battle Royale", "Carrrera", "Ciencia Ficción",
                "Deportes", "Estrategia", "Fantasia", "Indie", "Metroidvania", "MOBA", "Multiplayer",
                "Mundo Abierto", "Party Game", "Peleas", "Plataforma", "Rogue Like", "RPG", "Sandbox",
                "Shooter", "Sigilo", "Simulador", "Souls Like", "Superheroes", "Survival", "Tactical",
                "Team-Based", "Terror"
            ];
            const withoutRepeat = new Set(input);
            return input.every(g => (typeof g === "string" && genreOptions.includes(g))) && 
            input.length > 0 && 
            withoutRepeat.size === input.length;
        } else {
            return false;
        };
    };
};