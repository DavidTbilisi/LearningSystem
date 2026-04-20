import { test, expect } from '@playwright/test'

test.describe('CAST document', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/docs/cast-system')
  })

  test('shows document hero, orbit, and markdown', async ({ page }) => {
    await expect(page.locator('.doc-hero-copy h1')).toHaveText(/CAST \+ Georgian Node System/i)
    await expect(page.getByRole('heading', { name: /CAST orbit/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /Markdown document/i })).toBeVisible()
    await expect(page.locator('#doc-section-representation-atlas-every-surface-in-this-app').first()).toBeVisible()
  })

  test('learning studio tabs and CAST playground representations', async ({ page }) => {
    await expect(page.getByRole('region', { name: /Learning studio/i })).toBeVisible()

    await page.getByTestId('studio-tab-walkthrough').click()
    await expect(page.getByText(/Walkthrough/i).first()).toBeVisible()

    await page.getByTestId('studio-tab-examples').click()
    await expect(page.getByRole('heading', { name: /Relationship -> CAST edge/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Critical temporal trigger edge/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Palace walk as graph traversal/i })).toBeVisible()

    await page.getByTestId('studio-tab-playground').click()
    await expect(page.getByTestId('cast-studio-visuals')).toBeVisible()
    await expect(page.getByTestId('cast-flow-rail')).toBeVisible()
    await expect(page.getByTestId('cast-composer')).toBeVisible()

    const sceneBefore = await page.getByTestId('cast-scene-text').textContent()
    await page.getByTestId('cast-select-action').selectOption({ index: 3 })
    const sceneAfter = await page.getByTestId('cast-scene-text').textContent()
    expect(sceneAfter).not.toEqual(sceneBefore)

    await page.getByTestId('cast-challenge-toggle').click()
    await expect(page.getByTestId('cast-challenge-answer')).toBeVisible()
    await page.getByTestId('cast-challenge-random').click()
    await expect(page.getByTestId('cast-challenge-answer')).toBeHidden()
  })
})
