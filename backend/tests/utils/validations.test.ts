import { test, describe } from "node:test";
import assert from "node:assert";
import { validateInputGenre, validateInputNumber, validateInputString, validateInputStringImage } from "../../src/utils/validations";

describe("Validations Tests", () => {
    test("Input string doesn't contain letters or numbers", () => {
        // space
        assert(!validateInputString(" ", 1, 100));

        // empty string
        assert(!validateInputString("", 1, 100));

        // tab
        assert(!validateInputString("   ", 1, 100));

        // tab and space
        assert(!validateInputString("            ", 1, 100));
    });

    test("Input string is shorter than the minimum length", () => {
        assert(!validateInputString("aaaa", 5, 10));
        assert(!validateInputString("a  a", 5, 10));
    });

    test("Input string is larger than the maximum length", () => {
        assert(!validateInputString("aaa", 1, 2));
        assert(!validateInputString("  a", 1, 2));
    });

    test("Input string is valid", () => {
        assert(validateInputString("aaa", 1, 3));
        assert(validateInputString("aaa", 1, 100));
        assert(validateInputString("  a", 1, 3));
    });

    test("Input string image doesn't contain letters or numbers", () => {
        // space
        assert(!validateInputStringImage(" "));

        // empty string
        assert(!validateInputStringImage(""));

        // tab
        assert(!validateInputStringImage("   "));

        // tab and space
        assert(!validateInputStringImage("            "));
    });

    test("Input string image is larger than the maximum length", () => {
        assert(!validateInputStringImage("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"));
        assert(!validateInputStringImage("                                                                                                                                                                                                                                                                                                            a"));
    });

    test("Input string image doesn't have the correct url form", () => {
        assert(!validateInputStringImage("htttp://example.png"));
        assert(!validateInputStringImage("http//example.png"));
        assert(!validateInputStringImage("http:/example.png"));
        assert(!validateInputStringImage("http:example.png"));
        assert(!validateInputStringImage("http:/ /example.png"));
        assert(!validateInputStringImage("http://examplepng"));
        assert(!validateInputStringImage("http://example."));
        assert(!validateInputStringImage("http://example.mp4"));
    });

    test("Input string image is valid", () => {
        assert(validateInputStringImage("http://example.png"));
        assert(validateInputStringImage("http://example.png"));
        assert(validateInputStringImage("http://example.jpg"));
        assert(validateInputStringImage("http://example.jpeg"));
        assert(validateInputStringImage("http://example.gif"));
        assert(validateInputStringImage("http://example.webp"));
        assert(validateInputStringImage("http://example.bmp"));
        assert(validateInputStringImage("http://example.svg"));
        assert(validateInputStringImage("https://example.png"));
        assert(validateInputStringImage("https://example.jpg"));
        assert(validateInputStringImage("https://example.jpeg"));
        assert(validateInputStringImage("https://example.gif"));
        assert(validateInputStringImage("https://example.webp"));
        assert(validateInputStringImage("https://example.bmp"));
        assert(validateInputStringImage("https://example.svg"));
        assert(validateInputStringImage("https://example.SVG"));
        assert(validateInputStringImage("https://eexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexample.svg"));
    });

    test("Input number is minor than the minimum", () => {
        assert(!validateInputNumber(100, 101, 1000));
        assert(!validateInputNumber(-100, -99, 1000));
        assert(!validateInputNumber(-1, 0, 1000));
        assert(!validateInputNumber(0, 1, 1000));
    })

    test("Input number is larger than the maximum", () => {
        assert(!validateInputNumber(10, 1, 9));
        assert(!validateInputNumber(-100, 1, 1000));
        assert(!validateInputNumber(1, -100, 0));
        assert(!validateInputNumber(0, -100, -1));
    });

    test("Input number can't be in a invalid set", () => {
        assert(!validateInputNumber(10, 20, 5));
        assert(!validateInputNumber(-10, 0, -20));
        assert(!validateInputNumber(0, 5, -5));
    });

    test("Input number is valid", () => {
        assert(validateInputNumber(10, 5, 15));
        assert(validateInputNumber(10, 0, 15));
        assert(validateInputNumber(-10, -20, -5));
        assert(validateInputNumber(-10, -20, 0));
        assert(validateInputNumber(0, -5, 5));
        assert(validateInputNumber(0, 0, 0));
    });

    test("Input array genre not includes a rigth genre", () => {
        assert(!validateInputGenre([]));
        assert(!validateInputGenre(["hola"]));
        assert(!validateInputGenre([""]));
        assert(!validateInputGenre(["acción"]));
        assert(!validateInputGenre(["action"]));
        assert(!validateInputGenre(["Acción "]));
        assert(!validateInputGenre(["Acción         "]));
    });

    test("Input array genre repeats a genre", () => {
        assert(!validateInputGenre(["Acción", "Acción"]));
        assert(!validateInputGenre(["Acción","Aventura", "RPG", "Acción"]));
        assert(!validateInputGenre(["Acción", "Aventura", "Battle Royale", "Carrrera", "Ciencia Ficción",
                "Deportes", "Estrategia", "Fantasia", "Indie", "Metroidvania", "MOBA", "Multiplayer",
                "Mundo Abierto", "Party Game", "Peleas", "Plataforma", "Rogue Like", "RPG", "Sandbox",
                "Shooter", "Sigilo", "Simulador", "Souls Like", "Superheroes", "Survival", "Tactical",
                "Team-Based", "Terror", "Indie"
            ]));
    });

    test("Input array genre is valid", () => {
        assert(validateInputGenre(["Acción"]));
        assert(validateInputGenre(["Acción","Aventura", "RPG"]));
        assert(validateInputGenre(["Acción", "Aventura", "Battle Royale", "Carrrera", "Ciencia Ficción",
                "Deportes", "Estrategia", "Fantasia", "Indie", "Metroidvania", "MOBA", "Multiplayer",
                "Mundo Abierto", "Party Game", "Peleas", "Plataforma", "Rogue Like", "RPG", "Sandbox",
                "Shooter", "Sigilo", "Simulador", "Souls Like", "Superheroes", "Survival", "Tactical",
                "Team-Based", "Terror"
            ]));
    });
})