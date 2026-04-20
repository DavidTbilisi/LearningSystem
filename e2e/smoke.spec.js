import { test, expect } from '@playwright/test'

test.describe('Atlas home', () => {
  test('loads hero and workspace', async ({ page }) => {
    await page.goto('/#/')
    await expect(page.getByRole('heading', { name: /^theSystem$/i })).toBeVisible()
    await expect(page.getByText(/Architecture map/i)).toBeVisible()
  })
})
