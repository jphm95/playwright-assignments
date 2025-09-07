import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
    await page.goto('/')
})

test.describe('Interacting with Input Fields', () => {
    test.beforeEach(async ({ page }) => {
        //1. Select the PET TYPES menu item in the navigation bar
        await page.getByText('Pet Types').click()
        //2. Add assertion of the "Pet Types" text displayed above the table with the list of pet types
        await expect(page.getByRole('heading', { name: 'Pet Types' })).toBeVisible();
    })

    test('TC1: Update pet type', async ({ page }) => {

        //Locator
        const firstPetTypeField = page.locator('input').first()

        //3. Click on "Edit" button for the "cat" pet type 
        await page.getByRole('row', { name: "cat" }).getByRole('button', { name: "Edit" }).click()

        //4. Add assertion of the "Edit Pet Type" text displayed
        await expect(page.getByRole('heading', { name: 'Edit Pet Type' })).toBeVisible()

        //5. Change the pet type name from "cat" to "rabbit" and click "Update" button
        await expect(page.getByRole('textbox')).toHaveValue('cat')
        await page.getByRole('textbox').fill('rabbit')
        await page.getByRole('button', { name: "Update" }).click()
        await expect(page.getByRole('heading', { name: 'Pet Types' })).toBeVisible()

        //6. Add the assertion that the first pet type in the list of types has a value "rabbit" 
        await expect(firstPetTypeField).toHaveValue('rabbit')

        //7. Click on "Edit" button for the same "rabbit" pet type
        await page.getByRole('row', { name: "rabbit" }).getByRole('button', { name: "Edit" }).click()

        //8. Change the pet type name back from "rabbit" to "cat" and click "Update" button
        await expect(page.getByRole('textbox')).toHaveValue('rabbit')
        await page.getByRole('textbox').fill('cat')
        await page.getByRole('button', { name: "Update" }).click()
        await expect(page.getByRole('heading', { name: 'Pet Types' })).toBeVisible();

        //9. Add the assertion that the first pet type in the list of names has a value "cat" 
        await expect(firstPetTypeField).toHaveValue('cat')
    })

    test('TC2: Cancel pet type update', async ({ page }) => {

        //3. Click on "Edit" button for the "dog" pet type
        await page.getByRole('row', { name: "dog" }).getByRole('button', { name: "Edit" }).click()

        //4. Type the new pet type name "moose"
        await expect(page.getByRole('textbox')).toHaveValue('dog')
        await page.getByRole('textbox').fill('moose')

        //5. Add assertion the value "moose" is displayed in the input field of the "Edit Pet Type" page
        await expect(page.getByRole('textbox')).toHaveValue('moose')

        //6. Click on "Cancel" button
        await page.getByRole('button', { name: "Cancel" }).click()

        //7. Add the assertion the value "dog" is still displayed in the list of pet types
        await expect(page.locator('input').nth(1)).toHaveValue('dog')
    })

    test('Pet type name is required validation', async ({ page }) => {
       
        //3. Click on "Edit" button for the "lizard" pet type
        await page.getByRole('row', { name: "lizard" }).getByRole('button', { name: "Edit" }).click()

        //4. On the Edit Pet Type page, clear the input field
        await expect(page.getByRole('textbox')).toHaveValue('lizard')
        await page.getByRole('textbox').clear()

        //5. Add the assertion for the "Name is required" message below the input field
        await expect(page.locator('.help-block')).toHaveText('Name is required')

        //6. Click on "Update" button
        await page.getByRole('button', { name: "Update" }).click()

        //7. Add assertion that "Edit Pet Type" page is still displayed
        await expect(page.getByRole('heading', { name: 'Edit Pet Type' })).toBeVisible()

        //8. Click on the "Cancel" button
        await page.getByRole('button', { name: "Cancel" }).click()

        //9. Add assertion that "Pet Types" page is displayed
        await expect(page.getByRole('heading', { name: 'Pet Types' })).toBeVisible()
    })

})