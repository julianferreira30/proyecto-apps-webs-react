import { test, expect } from "@playwright/test";
import { loginWith } from "./helper";

test.describe("Login tests", () => {
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

    test("Successful login with valid credentials", async ({ page }) => {
        await loginWith(page, "testUser", "testPassword123");
        await expect(page.getByText("Añadir")).toBeVisible();
    });

    test("Login fails with invalid credentials", async ({ page }) => {
        await loginWith(page, "testUser", "wrongPassword");
        await expect(page.getByText("Error al iniciar sesión")).toBeVisible();
    });

    test ("Login fails with non-existent user", async ({ page }) => {
        await loginWith(page, "nonExistentUser", "somePassword");
        await expect(page.getByText("Error al iniciar sesión")).toBeVisible();
    });

    test("User can logout successfully", async ({ page }) => {
        await loginWith(page, "testUser", "testPassword123");
        await page.getByRole("button", { name: "Cuenta" }).click();
        await page.getByRole("button", { name: "Cerrar sesión" }).click();
        await expect(page.getByText("Añadir")).not.toBeVisible();
    });
});
