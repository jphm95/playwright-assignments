import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
    page.goto('/')
})

test.describe('Checkboxes', () => {
    test.beforeEach(async ({ page }) => {
        //1. Select the VETERINARIANS menu item in the navigation bar, then select "All"
        await page.getByRole('button', { name: "VETERINARIANS" }).click()
        await page.getByRole('link', { name: "ALL" }).click()
    })

    test('TC1: Validate selected specialties', async ({ page }) => {
        //Data
        let veterinarianName = 'Helen Leary'

        //Locators
        const editVeterinarianButton = (name: string) =>
            page.getByRole('row', { name })
                .getByRole('button', { name: "Edit Vet" })
        const specialtiesField = page.locator('.selected-specialties')
        const radiologyCheckbox = page.getByRole('checkbox', { name: "radiology" })
        const surgeryCheckbox = page.getByRole('checkbox', { name: "surgery" })
        const dentistryCheckbox = page.getByRole('checkbox', { name: "dentistry" })


        // 2. Add assertion of the "Veterinarians" text displayed above the table with the list of Veterinarians
        await expect(page.getByRole('heading', { name: "Veterinarians" })).toBeVisible()

        // 3. Select the veterinarian "Helen Leary" and click "Edit Vet" button
        await editVeterinarianButton(`${veterinarianName}`).click()

        // 4. Add assertion of the "Specialties" field. The value "radiology" is displayed
        await expect(specialtiesField).toBeVisible()
        await expect(specialtiesField).toHaveText('radiology')

        // 5. Click on the "Specialties" drop-down menu
        await specialtiesField.click()

        // 6. Add assertion that "radiology" specialty is checked
        expect(await radiologyCheckbox.isChecked()).toBeTruthy()

        // 7. Add assertion that "surgery" and "dentistry" specialties are unchecked
        expect(await surgeryCheckbox.isChecked()).toBeFalsy()
        expect(await dentistryCheckbox.isChecked()).toBeFalsy()

        // 8. Check the "surgery" item specialty and uncheck the "radiology" item speciality
        await surgeryCheckbox.check()
        await radiologyCheckbox.uncheck()

        // 9. Add assertion of the "Specialties" field displayed value "surgery"
        await expect(specialtiesField).toHaveText('surgery')

        // 10. Check the "dentistry" item specialty
        await dentistryCheckbox.check()

        // 11. Add assertion of the "Specialties" field. The value "surgery, dentistry" is displayed
        await expect(specialtiesField).toHaveText('surgery, dentistry')
    })

    test('TC2: Select all specialties', async ({ page }) => {
        //Data
        let veterinarianName = 'Rafael Ortega'

        //Locators
        const editVeterinarianButton = (name: string) =>
            page.getByRole('row', { name })
                .getByRole('button', { name: "Edit Vet" })
        const specialtiesField = page.locator('.selected-specialties')
        const allCheckboxes = page.getByRole('checkbox')


        // 2. Select the veterinarian "Rafael Ortega" and click "Edit Vet" button
        await editVeterinarianButton(`${veterinarianName}`).click()

        // 3. Add assertion that "Specialties" field is displayed value "surgery"
        expect(specialtiesField).toHaveText('surgery')

        // 4. Click on the "Specialties" drop-down menu
        await specialtiesField.click()

        // 5. Check all specialties from the list
        // 6. Add assertion that all specialties are checked
        for (const box of await allCheckboxes.all()) {
            await box.check()
            expect(await box.isChecked()).toBeTruthy()
        }

        // 7. Add assertion that all checked specialities are displayed in the "Specialties" field
        await expect(specialtiesField).toHaveText('surgery, radiology, dentistry')
    })

    test('TC3: Unselect all specialties', async ({ page }) => {
        //Data
        let veterinarianName = 'Linda Douglas'

        //Locators
        const editVeterinarianButton = (name: string) =>
            page.getByRole('row', { name })
                .getByRole('button', { name: "Edit Vet" })
        const specialtiesField = page.locator('.selected-specialties')
        const allCheckboxes = page.getByRole('checkbox')


        // 2. Select the veterinarian "Linda Douglas" and click "Edit Vet" button
        await editVeterinarianButton(veterinarianName).click()

        // 3. Add assertion of the "Specialties" field displayed value "surgery, dentistry"
        expect(specialtiesField).toHaveText('dentistry, surgery')

        // 4. Click on the "Specialties" drop-down menu
        await specialtiesField.click()

        // 5. Uncheck all specialties from the list
        // 6. Add assertion that all specialties are unchecked
        for (const box of await allCheckboxes.all()) {
            await box.uncheck()
            expect(await box.isChecked()).toBeFalsy()
        }

        // 7. Add assertion that "Specialties" field is empty
        expect(specialtiesField).toBeEmpty()
    })

})




