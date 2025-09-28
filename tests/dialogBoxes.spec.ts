import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
    page.goto('/')
})

test.describe('Dialog Boxes', () => {

    test('TC1: Add and delete pet type ', async ({ page }) => {

        // 1. Select the PET TYPES menu item in the navigation bar
        await page.getByRole('link', { name: "PET TYPES" }).click()

        // 2. On the "Pet Types" page, add assertion of the "Pet Types" text displayed above the table with the list of pet types
        await expect(page.getByRole('heading', {name: "Pet Types"})).toBeVisible()

        // 3. Click on "Add" button
        await page.getByRole('button', {name: "Add"}).click()

        // 4. Add assertions of "New Pet Type" section title, "Name" header for the input field and the input field is visible
        await expect(page.getByRole('heading', {name:"New Pet Type"})).toBeVisible()
        await expect(page.locator('#pettype')).toContainText("Name")
        await expect(page.locator('#name')).toBeVisible()
       
        // 5. Add a new pet type with the name "pig" and click "Save" button
        await page.locator('#name').fill('pig')
        await page.getByRole('button', {name: "Save"}).click()
       
        // 6. Add assertion that the last item in the list of pet types has value of "pig"
        await expect(page.getByRole('row').last().getByRole('textbox')).toHaveValue('pig')

        // 7. Click on "Delete" button for the "pig" pet type
        // 8. Add assertion to validate the message of the dialog box "Delete the pet type?"
        // 9. Click on OK button on the dialog box  
        page.on('dialog', dialog => {
            expect(dialog.message()).toEqual('Delete the pet type?') 
            dialog.accept()
        })

        await page.getByRole('row', {name: "pig"}).getByRole('button', {name: "Delete"}).click()

        // 10, Add assertion, that the last item in the list of pet types is not the "pig"
        await expect(page.getByRole('row').last().getByRole('textbox')).not.toHaveValue('pig')
    })

})