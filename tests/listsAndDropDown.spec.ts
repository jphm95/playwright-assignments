import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
    await page.goto('/')
})

test.describe('Lists and Drop Downs', () => {
    test.beforeEach(async ({ page }) => {
        //1. Select the OWNERS menu item in the navigation bar and then select "Search" from the drop-down menu
        await page.getByRole('button', { name: "OWNERS" }).click()
        await page.getByRole('link', { name: "SEARCH" }).click()
        //2. Add assertion of the "Owners" text displayed
        await expect(page.getByRole('heading', { name: "Owners" })).toBeVisible()
    })

    test('TC1: Validate selected pet types from the list', async ({ page }) => {

        // 3. Select the first owner "George Franklin"
        await page.getByRole('link', { name: "George Franklin" }).click()

        // 4. Add the assertion for the owner "Name", the value "George Franklin" is displayed
        await expect(page.locator('.ownerFullName')).toHaveText("George Franklin")

        // 5. In the "Pets and Visits" section, click on "Edit Pet" button for the pet with a name "Leo"
        await page.locator('td', { hasText: "Leo" }).getByRole('button', { name: "Edit Pet" }).click()

        // 6. Add assertion of "Pet" text displayed as header on the page
        await expect(page.getByRole('heading', { name: "Pet" })).toBeVisible()

        // 7. Add the assertion "George Franklin" name is displayed in the "Owner" field
        await expect(page.locator('#owner_name')).toHaveValue("George Franklin")

        // 8. Add the assertion the value "cat" is displayed in the "Type" field 
        await expect(page.getByLabel('Type')).toHaveValue('cat')

        // 9. Using a loop, select the values from the drop-down one by one, and add the assertion, that every selected value from the drop-down is displayed in the "Type" field
        const pets = ["cat", "dog", "lizard", "snake", "bird", "hamster"]
        for (const pet of pets) {
            await page.locator('[name="pettype"]').selectOption({ value: pet })
            await expect(page.locator('.form-group', { hasText: "Type" }).getByRole('textbox')).toHaveValue(pet)
        }
    })

    test('TC2: Validate the pet type update', async ({ page }) => {

        //Locators:
        const petTypeDropDown = page.locator('[name="pettype"]')
        const petRosy = page.locator('app-pet-list', { hasText: "Rosy" })

        // 3. Select the owner "Eduardo Rodriquez"
        await page.getByRole('link', { name: "Eduardo Rodriquez" }).click()

        // 4. In the "Pets and Visits" section, click on "Edit Pet" button for the pet with a name "Rosy"
        await petRosy.getByRole('button', { name: "Edit Pet" }).click()

        // 5. Add the assertion that name "Rosy" is displayed in the input field "Name"
        await expect(page.getByLabel('Name')).toHaveValue('Rosy')

        // 6. Add the assertion the value "dog" is displayed in the "Type" field 
        await expect(page.getByLabel('Type')).toHaveValue('dog')

        // 7. From the drop-down menu, select the value "bird"
        await petTypeDropDown.selectOption('bird')

        // 8. On the "Pet details" page, add the assertion the value "bird" is displayed in the "Type" field as well as drop-down input field
        await expect(page.getByLabel('Type')).toHaveValue('bird')
        await expect(petTypeDropDown).toContainText('bird')

        // 9. Select "Update Pet" button
        await page.getByRole('button', { name: "Update Pet" }).click()

        // 10. On the "Owner Information" page, add the assertion that pet "Rosy" has a new value of the Type "bird"
        await expect(petRosy.getByRole('row', {name: "Type"})).toContainText('bird')

        // 11. Select "Edit Pet" button one more time, and perform steps 6-10 to revert the selection of the pet type "bird" to its initial value "dog
        await petRosy.getByRole('button', { name: "Edit Pet" }).click()

        await expect(page.getByLabel('Type')).toHaveValue('bird')
        await petTypeDropDown.selectOption('dog')

        await expect(page.getByLabel('Type')).toHaveValue('dog')
        await expect(petTypeDropDown).toContainText('dog')

        await page.getByRole('button', { name: "Update Pet" }).click()
        await expect(petRosy.getByRole('row', {name: "Type"})).toContainText('dog')
    })

})