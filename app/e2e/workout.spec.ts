import { test, expect } from '@playwright/test';

test.describe('Workout Logging', () => {
  test('workout history page loads', async ({ page }) => {
    await page.goto('/historico');
    await expect(page.locator('text=Carregando...')).toBeHidden({ timeout: 10000 });
    await expect(page.locator('text=Histórico')).toBeVisible({ timeout: 5000 });
  });

  test('planilha page loads with weeks', async ({ page }) => {
    await page.goto('/planilha');
    await expect(page.locator('text=Carregando...')).toBeHidden({ timeout: 10000 });
    await expect(page.getByText(/semana|week/i).first()).toBeVisible({ timeout: 5000 });
  });

  test('exercise library loads', async ({ page }) => {
    await page.goto('/biblioteca');
    await expect(page.locator('text=Carregando...')).toBeHidden({ timeout: 10000 });
    await expect(page.getByText(/exercícios|biblioteca/i).first()).toBeVisible({ timeout: 5000 });
  });
});
