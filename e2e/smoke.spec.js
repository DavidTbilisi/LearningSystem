import { test, expect } from '@playwright/test'

test.describe('Atlas home', () => {
  test('loads hero and workspace', async ({ page }) => {
    await page.goto('/#/')
    await expect(page).toHaveTitle(/LearningSystem · Atlas/i)
    await expect(page.getByRole('heading', { name: /^theSystem$/i })).toBeVisible()
    await expect(page.getByText(/Architecture map/i)).toBeVisible()
  })

  test('deep-links selected document via query', async ({ page }) => {
    await page.goto('/#/?doc=cast-system')
    await expect(page.getByRole('heading', { name: /^theSystem$/i })).toBeVisible()
    await expect(page.locator('.home-doc-title')).toContainText(/CAST/i)
  })
})
