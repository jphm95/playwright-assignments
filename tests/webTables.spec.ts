import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/')
})

test.describe('Web Tables', () => {

    test('TC1: Validate the pet name city of the owner', async ({ page }) => {
        // 1. Select the OWNERS menu item in the navigation bar and then select "Search" from the drop-down menu
        await page.getByRole('button', { name: "OWNERS" }).click()
        await page.getByRole('link', { name: "SEARCH" }).click()

        // 2. In the list of Owners, locate the owner by the name "Jeff Black". Add the assertions that this owner is from the city of "Monona" and he has a pet with a name "Lucky"
        await expect(page.getByRole('row', { name: "Jeff Black" }).locator('td').nth(2)).toContainText('Monona')
        await expect(page.getByRole('row', { name: "Jeff Black" }).locator('td').nth(4)).toContainText('Lucky')
    })

    test('TC2: Validate owners count of the Madison City', async ({ page }) => {
        // 1. Select the OWNERS menu item in the navigation bar and then select "Search" from the drop-down menu
        await page.getByRole('button', { name: "OWNERS" }).click()
        await page.getByRole('link', { name: "SEARCH" }).click()

        // 2. In the list of Owners, locate all owners who live in the city of "Madison". Add the assertion that the total number of owners should be 4
        await expect(page.locator('tbody tr', { hasText: 'Madison' })).toHaveCount(4)
    })

    test('TC3: Validate search by Last Name', async ({ page }) => {
        //Locator
        const inputFieldLastName = page.locator('#lastName')
        const buttonFindOwner = page.getByRole('button', { name: "Find Owner" })
        const ownersList = page.locator('.ownerFullName')
        const wordList = ["Black", "Davis", "Es", "Playwright"]

        // 1. Select the OWNERS menu item in the navigation bar and then select "Search" from the drop-down menu
        await page.getByRole('button', { name: "OWNERS" }).click()
        await page.getByRole('link', { name: "SEARCH" }).click()

        /* 
        2. On the Owners page, in the "Last name" input field, type the last name "Black" and click the  "Find Owner" button
        3. Add the assertion that the displayed owner in the table has a last name "Black"
        4. In the "Last name" input field, type the last name "Davis" and click the "Find Owner" button
        5. Add the assertion that each owner displayed in the table has a last name "Davis"
        6. In the "Last name" input field, type the partial match for the last name "Es" and click the "Find Owner" button       
        7. Add the assertion that each owner displayed in the table has a last name containing "Es"
        8. In the "Last name" input field, type the last name "Playwright" click the "Find Owner" button       
        9. Add the assertion of the message "No owners with LastName starting with "Playwright""   */

        for(let searchedWord of wordList){
            await page.locator('#lastName').clear()
            await page.locator('#lastName').fill(searchedWord)
            await page.getByRole('button', { name: "Find Owner" }).click()
            await page.waitForTimeout(500)

            for (let owner of await ownersList.all()){        
                if( searchedWord == "Black"){
                    expect(await page.locator('td').nth(0)).toContainText(searchedWord)
                } else if (searchedWord == "Playwright") {
                    expect(await page.locator('app-owner-list')).toContainText('No owners with LastName starting with "Playwright"')   
                } else {
                    await expect(owner).toContainText(searchedWord)
                }
            }
        }  
    })

    test('TC4: Validate phone number and pet name on the Owner Information page', async ({ page }) => {
        // 1. Select the OWNERS menu item in the navigation bar and then select "Search" from the drop-down menu
        await page.getByRole('button', { name: "OWNERS" }).click()
        await page.getByRole('link', { name: "SEARCH" }).click()

        // 2. Locate the owner by the phone number "6085552765". Extract the Pet name displayed in the table for the owner and save it to the variable. Click on this owner.
        const petName = await page.locator('tbody tr', {hasText: "6085552765"}).locator('td').nth(4).innerText()
        await page.locator('tbody tr', {hasText: "6085552765"}).locator('.ownerFullName a').click()

        // 3. On the Owner Information page, add the assertion that "Telephone" value in the Owner Information card is "6085552765"
        await expect(page.getByRole('row', {name: "Telephone"}).locator('td')).toHaveText('6085552765')

        // 4. Add the assertion that Pet Name in the Owner Information card matches the name extracted from the page on the step 2
        await expect(page.locator('app-pet-list dt:has-text("Name") + dd')).toHaveText(petName); 
    })

    test('TC5: Validate pets of the Madison city', async ({ page }) => {
        // 1. Select the OWNERS menu item in the navigation bar and then select "Search" from the drop-down menu
        await page.getByRole('button', { name: "OWNERS" }).click()
        await page.getByRole('link', { name: "SEARCH" }).click()
        await page.locator('#ownersTable').waitFor({ state: 'visible', timeout: 40000 });

        // 2. On the Owners page, perform the assertion that Madison city has a list of pets: Leo, George, Mulligan, Freddy
        const petsListFromMadisonCity = []
        const expectedPetsFromMadsison = ['Leo', 'George', 'Mulligan', 'Freddy']
        
        for(let row of await page.locator('tbody tr', { hasText: 'Madison' }).all() ){
            const petCells = await row.locator('td').nth(4).locator('tr').all()
            for (let petRow of petCells){
                const petName = (await petRow.textContent())?.trim()
                if(petName) petsListFromMadisonCity.push(petName)
            }   
        }
         
        expect(new Set(petsListFromMadisonCity)).toEqual(new Set(expectedPetsFromMadsison)) 
    })

    test('TC6: Validate specialty update', async ({ page }) => {
    
        // 1. Select the VETERINARIANS menu item in the navigation bar, then select "All"
        await page.getByRole('button', { name: "VETERINARIANS" }).click()
        await page.getByRole('link', { name: "ALL" }).click()

        // 2. On the Veterinarians page, add the assertion that "Rafael Ortega" has specialty "surgery"
        await expect(page.getByRole('row', {name: "Rafael Ortega"}).locator('td').nth(1)).toHaveText('surgery')

        // 3. Select the SPECIALTIES menu item in the navigation bar
        await page.getByRole('link', { name: "SPECIALTIES" }).click()

        // 4. Add assertion of the "Specialties" header displayed above the table
        await expect(page.getByRole('heading', {name: "Specialties"})).toBeVisible()

        // 5. Click on "Edit" button for the "surgery" specialty
        await page.getByRole('row', {name: "surgery"}).locator('button', {hasText: "Edit"}).click()

        // 6. Add assertion "Edit Specialty" page is displayed
        await expect(page.getByRole('heading', {name:"Edit Specialty"})).toBeVisible()

        // 7. Update the specialty from "surgery" to "dermatology" and click "Update button
        await expect(page.locator('#name')).toHaveValue('surgery');
        await page.locator('#name').fill('dermatology')
        await page.getByRole('button', {name:"Update"}).click()

        // 8. Add assertion that "surgery" was changed to "dermatology" in the list of specialties
        await expect(page.locator('[id="1"]')).toHaveValue("dermatology")

        // 9. Select the VETERINARIANS menu item in the navigation bar, then select "All"
        await page.getByRole('button', { name: "VETERINARIANS" }).click()
        await page.getByRole('link', { name: "ALL" }).click()

        // 10. On the Veterinarians page, add assertion that "Rafael Ortega" has specialty "dermatology"
        await expect(page.getByRole('row', {name: "Rafael Ortega"}).locator('td').nth(1)).toHaveText('dermatology')

        // 11. Navigate to SPECIALTIES page, revert the changes renaming "dermatology" back to "surgery"
        await page.getByRole('link', { name: "SPECIALTIES" }).click()
        await page.getByRole('row', {name: "dermatology"}).locator('button', {hasText: "Edit"}).click()
        await expect(page.locator('#name')).toHaveValue('dermatology');
        await page.locator('#name').fill('surgery')
        await page.getByRole('button', {name:"Update"}).click()
        await expect(page.locator('[id="1"]')).toHaveValue("surgery")   
    })

    test('TC7: Validate specialty lists', async ({ page }) => {
        // 1. Select the SPECIALTIES menu item in the navigation bar
        await page.getByRole('link', { name: "SPECIALTIES" }).click()

        // 2. On the Specialties page, select "Add" button. Type the new specialty "oncology" and click "Save" button
        await page.getByRole('button', {name:"Add"}).click()
        await page.locator('#name').fill('oncology')
        await page.getByRole('button', {name:"Save"}).click()
        await expect(page.locator('tr input').last()).toHaveValue("oncology")
     
        // 3. Extract all values of specialties and put them into the array.
        const specialtiesList = []
        const specialtiesRows = page.locator('input[name="spec_name"]')

        for (let specialtyRow of await specialtiesRows.all()){
                const specialtyName = await specialtyRow.inputValue()
                specialtiesList.push(specialtyName)         
            }   

        // 4. Select the VETERINARIANS menu item in the navigation bar, then select "All"
        await page.getByRole('button', { name: "VETERINARIANS" }).click()
        await page.getByRole('link', { name: "ALL" }).click()

        // 5. On the Veterinarians page, locate the "Sharon Jenkins" in the list and click "Edit" button
        await page.getByRole('row', {name:"Sharon Jenkins"}).getByRole('button', {name:"Edit Vet"}).click()

        // 6. Click on the Specialties drop-down menu. Extract all values from the drop-down menu to an array
        await page.locator('.dropdown-arrow').click()

        const dropdownContent = page.locator('.dropdown-content label')
        const specialtiesDropdownList = []

        for (let item of await dropdownContent.all()) {
           const itemList = await item.textContent()
           specialtiesDropdownList.push(itemList)
          }
 
        // 7. Add the assertion that array of specialties collected in the step 3 is equal the the array from drop-down menu
        expect(new Set(specialtiesList)).toEqual(new Set(specialtiesDropdownList))
        
        // 8. Select the "oncology" specialty and click "Save vet" button
         await page.getByRole('checkbox', { name: "oncology" }).check()
         await page.getByRole('heading', { name: 'Edit Veterinarian' }).click()
         await page.getByRole('button', {name:"Save Vet"}).click()

        // 9. On the Veterinarians page, add assertion, that "Sharon Jenkins" has specialty "oncology"
        await expect(page.getByRole('row', {name:"Sharon Jenkins"}).locator('td').nth(1)).toHaveText('oncology')

        // 10. Navigate to SPECIALTIES page. Click "Delete" for "oncology" specialty
        await page.getByRole('link', { name: "SPECIALTIES" }).click()
        await page.getByRole('row', {name:"oncology"}).getByRole('button', {name:"Delete"}).click()

        // 11. Navigate to VETERINARIANS page. Add assertion that "Sharon Jenkins" has no specialty assigned
        await page.getByRole('button', { name: "VETERINARIANS" }).click()
        await page.getByRole('link', { name: "ALL" }).click()
        await expect(page.getByRole('row', {name:"Sharon Jenkins"}).locator('td').nth(1)).not.toHaveText('oncology')

    })
})

 