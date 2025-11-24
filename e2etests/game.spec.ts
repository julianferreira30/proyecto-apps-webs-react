import { test, expect } from "@playwright/test";
import { createGame, loginWith } from "./helper";

test.describe("Game tests", () => {
    test.beforeEach(async ({ page, request }) => {
        await request.post("/api/testing/reset");
        await request.post("/api/register", {
            data: {
                username: "testUser",
                name: "Test User",
                password: "testPassword123",
            },
        });
        await page.goto("http://localhost:7158/");
    });
    
    test("Logged user can create a new game", async ({ page }) => {
        await loginWith(page, "testUser", "testPassword123");
        await createGame(page, "Minecraft", 2020, "Mojang", "Sandbox", "https://example.com/minecraft.jpg", "A sandbox game about placing blocks and going on adventures.");
        await expect(page.getByText("Minecraft").first()).toBeVisible();
    });

    test("Logged user can view game details", async ({ page }) => {
        await loginWith(page, "testUser", "testPassword123");
        await createGame(page, "The Witcher 3", 2015, "CD Projekt", "RPG", "https://example.com/witcher3.jpg", "An open-world RPG set in a fantasy universe.");
        await page.getByText("The Witcher 3").click();
        await expect(page.getByText("An open-world RPG set in a fantasy universe.")).toBeVisible();
    });

    test("Logged user can leave a review for a game", async ({ page }) => {
        await loginWith(page, "testUser", "testPassword123");
        await createGame(page, "Cyberpunk 2077", 2020, "CD Projekt", "RPG", "https://example.com/cyberpunk2077.jpg", "A futuristic open-world RPG.");
        await page.getByText("Cyberpunk 2077").click();
        await page.getByRole("button", { name: "Review" }).click();
        await page.getByLabel("Añade un comentario...").fill("Amazing game with stunning visuals!");
        await page.getByRole("button", { name: "Guardar" }).click();
        await expect(page.getByText("Amazing game with stunning visuals!")).toBeVisible();
    });

    test("User can add a game to favorites", async ({ page }) => {
        await loginWith(page, "testUser", "testPassword123");
        await createGame(page, "Stardew Valley", 2016, "ConcernedApe", "Acción", "https://example.com/stardewvalley.jpg", "A farming simulation game.");
        await page.getByText("Stardew Valley").click();
        await page.getByRole("button", { name: "Favorito" }).click();
        await page.getByRole("button", { name: "Cuenta" }).click();
        await page.getByRole("button", { name: "Perfil" }).click();
        await page.getByRole("button", { name: "Favoritos" }).click();
        await expect(page.getByText("Stardew Valley")).toBeVisible();
    });

    test("User can remove a game from favorites", async ({ page }) => {
        await loginWith(page, "testUser", "testPassword123");
        await createGame(page, "Stardew Valley", 2016, "ConcernedApe", "Acción", "https://example.com/stardewvalley.jpg", "A farming simulation game.");
        await page.getByText("Stardew Valley").click();
        await page.getByRole("button", { name: "Favorito" }).click();
        await page.getByRole("button", { name: "Favorito" }).click();
        await page.getByRole("button", { name: "Cuenta" }).click();
        await page.getByRole("button", { name: "Perfil" }).click();
        await page.getByRole("button", { name: "Favoritos" }).click();
        await expect(page.getByText("No hay nada para mostrar")).toBeVisible();
    });

    test("User can add a game to wishlist", async ({ page }) => {
        await loginWith(page, "testUser", "testPassword123");
        await createGame(page, "Stardew Valley", 2016, "ConcernedApe", "Acción", "https://example.com/stardewvalley.jpg", "A farming simulation game.");
        await page.getByText("Stardew Valley").click();
        await page.getByRole("button", { name: "Wishlist" }).click();
        await page.getByRole("button", { name: "Cuenta" }).click();
        await page.getByRole("button", { name: "Perfil" }).click();
        await page.getByRole("button", { name: "Wishlist" }).click();
        await expect(page.getByText("Stardew Valley")).toBeVisible();
    });

    test("User can remove a game from wishlist", async ({ page }) => {
        await loginWith(page, "testUser", "testPassword123");
        await createGame(page, "Stardew Valley", 2016, "ConcernedApe", "Acción", "https://example.com/stardewvalley.jpg", "A farming simulation game.");
        await page.getByText("Stardew Valley").click();
        await page.getByRole("button", { name: "Wishlist" }).click();
        await page.getByRole("button", { name: "Wishlist" }).click();
        await page.getByRole("button", { name: "Cuenta" }).click();
        await page.getByRole("button", { name: "Perfil" }).click();
        await page.getByRole("button", { name: "Wishlist" }).click();
        await expect(page.getByText("No hay nada para mostrar")).toBeVisible();
    });

    test("User can add a game to played list", async ({ page }) => {
        await loginWith(page, "testUser", "testPassword123");
        await createGame(page, "Stardew Valley", 2016, "ConcernedApe", "Acción", "https://example.com/stardewvalley.jpg", "A farming simulation game.");
        await page.getByText("Stardew Valley").click();
        await page.getByRole("button", { name: "JUGADO" }).click();
        await page.getByRole("button", { name: "Cuenta" }).click();
        await page.getByRole("button", { name: "Perfil" }).click();
        await expect(page.getByText("Stardew Valley")).toBeVisible();
    });

    test("User can remove a game from played list", async ({ page }) => {
        await loginWith(page, "testUser", "testPassword123");
        await createGame(page, "Stardew Valley", 2016, "ConcernedApe", "Acción", "https://example.com/stardewvalley.jpg", "A farming simulation game.");
        await page.getByText("Stardew Valley").click();
        await page.getByRole("button", { name: "JUGADO" }).click();
        await page.getByRole("button", { name: "JUGADO" }).click();
        await page.getByRole("button", { name: "Cuenta" }).click();
        await page.getByRole("button", { name: "Perfil" }).click();
        await expect(page.getByText("No hay nada para mostrar")).toBeVisible();
    });
});