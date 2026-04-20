import { test, expect } from '@playwright/test'

test.describe('Onboarding path document', () => {
  test('loads and shows level sections', async ({ page }) => {
    await page.goto('/#/docs/onboarding-path')
    await expect(page.locator('.doc-hero-copy h1')).toHaveText(/Onboarding Path/i)
    await expect(page.getByRole('heading', { name: /Level A — Minimal path/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /Spacing defaults/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /Pruning rules/i })).toBeVisible()
  })
})
