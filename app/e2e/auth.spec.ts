import { test, expect } from '@playwright/test';

const TEST_EMAIL = `test-${Date.now()}@back-discipline.app`;
const TEST_PASSWORD = 'Test123!@#';
const TEST_NAME = 'Usuário Teste';

test.describe('Auth Flow', () => {
  test('register new user', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'Cadastrar' }).click();
    await page.getByPlaceholder('Seu nome').fill(TEST_NAME);
    await page.getByPlaceholder('seu@email.com').fill(TEST_EMAIL);
    const passwordFields = page.getByPlaceholder('••••••••');
    await passwordFields.nth(0).fill(TEST_PASSWORD);
    await passwordFields.nth(1).fill(TEST_PASSWORD);
    await page.getByRole('button', { name: 'Cadastrar', exact: true }).click();

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
    await expect(page.locator('text=Carregando...')).toBeHidden({ timeout: 10000 });
  });

  test('session persists after refresh', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('text=Carregando...')).toBeHidden({ timeout: 10000 });
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('logout', async ({ page }) => {
    await page.goto('/perfil');

    await page.getByRole('button', { name: /sair|logout/i }).click();
    await expect(page).toHaveURL('/', { timeout: 10000 });
  });

  test('login with existing credentials', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'Entrar' }).first().click();
    await page.getByPlaceholder('seu@email.com').fill(TEST_EMAIL);
    const passwordFields = page.getByPlaceholder('••••••••');
    await passwordFields.nth(0).fill(TEST_PASSWORD);
    await page.getByRole('button', { name: 'Entrar', exact: true }).click();

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
    await expect(page.locator('text=Carregando...')).toBeHidden({ timeout: 10000 });
  });
});
