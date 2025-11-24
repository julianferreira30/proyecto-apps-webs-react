import { Page } from '@playwright/test';

const loginWith = async (page: Page, username: string, password: string) => {
    await page.getByRole("button", { name: "Cuenta" }).click();
    await page.getByRole("button", { name: "Iniciar sesión" }).click();
    await page.getByLabel("Nombre de usuario").fill(username);
    await page.getByLabel("Contraseña").fill(password);
    await page.getByRole("button", { name: "Entrar" }).click();
}

const createGame = async (page: Page, title: string, creationYear: number, creator: string, genre: string, imageUrl: string, description: string) => {
    await page.getByRole("button", { name: "Añadir" }).click();
    await page.getByLabel("Nombre del juego").fill(title);
    
    await page.getByRole("combobox", { name: "Año de lanzamiento" }).click();
    await page.getByRole("option", { name: creationYear.toString() }).click();
    
    await page.getByLabel("Creador").fill(creator);

    await page.getByRole("combobox", { name: "Géneros" }).click();
    await page.getByRole("option", { name: genre }).click();
    
    await page.getByLabel("URL de imagen").fill(imageUrl);

    await page.getByLabel("Descripción (mínimo 2 carácteres)").fill(description);
    await page.getByRole("button", { name: "Agregar juego" }).click();
}

export { loginWith, createGame };