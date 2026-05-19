import { test, expect } from '@playwright/test';

test.describe('Reading Progress', () => {
  test('open book index, navigate to chapter, mark as complete', async ({ page }) => {
    await page.goto('/livro');
    await expect(page.locator('text=Carregando...')).toBeHidden({ timeout: 10000 });

    const chapterLink = page.getByRole('link', { name: /introdução/i }).first();
    await chapterLink.click();
    await expect(page).toHaveURL(/\/livro\/introducao/, { timeout: 10000 });

    await page.waitForTimeout(2000);

    const toggleButton = page.getByRole('button', { name: /concluir/i });
    if (await toggleButton.isVisible()) {
      await toggleButton.click();
      await page.waitForTimeout(1000);
      await expect(page.getByText(/concluído/i)).toBeVisible({ timeout: 5000 });
    }
  });
});
