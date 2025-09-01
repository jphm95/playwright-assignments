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
        //Data
        let originalPetType = 'cat'
        let updatedPetType = 'rabbit'

        //Locators
        const petTypeField = page.locator('input').first()
        const editPetButton = (name: string) =>
            page.getByRole('row', { name })
                .getByRole('button', { name: "Edit" })
        const petNameInput = page.getByRole('textbox')
        const updatePetTypeButton = page.getByRole('button', { name: "Update" })


        //3. Click on "Edit" button for the "cat" pet type 
        await editPetButton(originalPetType).waitFor({ state: "visible" })
        await editPetButton(originalPetType).click()
        //4. Add assertion of the "Edit Pet Type" text displayed
        await expect(page.getByRole('heading', { name: 'Edit Pet Type' })).toBeVisible()

        //5. Change the pet type name from "cat" to "rabbit" and click "Update" button
        await expect(petNameInput).toHaveValue(`${originalPetType}`)
        await petNameInput.fill(`${updatedPetType}`)
        await expect(petNameInput).toHaveValue(`${updatedPetType}`)
        await updatePetTypeButton.waitFor({ state: "attached" })
        await updatePetTypeButton.click()
        await expect(page.getByRole('heading', { name: 'Pet Types' })).toBeVisible()

        //6. Add the assertion that the first pet type in the list of types has a value "rabbit" 
        await expect(petTypeField).toHaveValue(`${updatedPetType}`)

        //7. Click on "Edit" button for the same "rabbit" pet type
        await editPetButton(updatedPetType).click()

        //8. Change the pet type name back from "rabbit" to "cat" and click "Update" button
        await expect(petNameInput).toHaveValue(`${updatedPetType}`)
        await petNameInput.fill(`${originalPetType}`)
        await updatePetTypeButton.click()
        await expect(page.getByRole('heading', { name: 'Pet Types' })).toBeVisible();

        //9. Add the assertion that the first pet type in the list of names has a value "cat" 
        await expect(petTypeField).toHaveValue(`${originalPetType}`)
    })

    test('TC2: Cancel pet type update', async ({ page }) => {
        //Data
        let originalPetType = 'dog'
        let updatedPetType = 'moose'

        //Locators
        const petTypeRow = (name: string) =>
            page.getByRole('row', { name })
        const editPetButton = (name: string) =>
            page.getByRole('row', { name })
                .getByRole('button', { name: "Edit" })
        const petNameInput = page.getByRole('textbox')
        const cancelEditPetTypeButton = page.getByRole('button', { name: "Cancel" })


        //3. Click on "Edit" button for the "dog" pet type
        await editPetButton(originalPetType).click()

        //4. Type the new pet type name "moose"
        await expect(petNameInput).toHaveValue(`${originalPetType}`)
        await petNameInput.fill(`${updatedPetType}`)

        //5. Add assertion the value "moose" is displayed in the input field of the "Edit Pet Type" page
        await expect(petNameInput).toHaveValue(`${updatedPetType}`)

        //6. Click on "Cancel" button
        await cancelEditPetTypeButton.click()

        //7. Add the assertion the value "dog" is still displayed in the list of pet types
        await expect(petTypeRow(updatedPetType)).toHaveCount(0)
        await expect(petTypeRow(originalPetType)).toHaveCount(1)
    })

    test('Pet type name is required validation', async ({ page }) => {
        //Data
        let petType = 'lizard'
        let expectedErrorMessage = 'Name is required'

        //Locators
        const petTypeRow = (name: string) =>
            page.getByRole('row', { name })
        const editPetButton = (name: string) =>
            page.getByRole('row', { name })
                .getByRole('button', { name: "Edit" })
        const petNameInput = page.getByRole('textbox')
        const updatePetTypeButton = page.getByRole('button', { name: "Update" })
        const cancelEditPetTypeButton = page.getByRole('button', { name: "Cancel" })
        const fieldErrorMessage = page.locator('.help-block')


        //3. Click on "Edit" button for the "lizard" pet type
        await editPetButton(petType).click()

        //4. On the Edit Pet Type page, clear the input field
        await expect(petNameInput).toHaveValue(`${petType}`)
        await petNameInput.clear()

        //5. Add the assertion for the "Name is required" message below the input field
        await expect(fieldErrorMessage).toHaveText(expectedErrorMessage)

        //6. Click on "Update" button
        await updatePetTypeButton.click()

        //7. Add assertion that "Edit Pet Type" page is still displayed
        await expect(page.getByRole('heading', { name: 'Edit Pet Type' })).toBeVisible

        //8. Click on the "Cancel" button
        await cancelEditPetTypeButton.click()

        //9. Add assertion that "Pet Types" page is displayed
        await expect(page.getByRole('heading', { name: 'Pet Types' })).toBeVisible
    })




})