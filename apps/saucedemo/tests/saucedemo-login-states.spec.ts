import { expect, test } from '@playwright/test';
import { SauceDemoLoginPage } from '../pages/SauceDemoLoginPage';
import { SauceDemoMenubar } from '../pages/SauceDemoMenubar';
import { LOGIN_ERROR_MESSAGES } from '../utils/SauceDemo_LoginErrorMessages';
import { ENV } from '../utils/SauceDemo_ENV';

test.describe('Test login functionality', () => {
    let loginPage: SauceDemoLoginPage;
    let sidebarMenu: SauceDemoMenubar;

    // Set variables and enter homepage
    test.beforeEach(async ({ page }) => {
        loginPage = new SauceDemoLoginPage(page);
        sidebarMenu = new SauceDemoMenubar(page);
        await page.goto(ENV.HOMEPAGE);
    });

    test('TC#001 - Verify login with valid credentials and logout', async ({ page }) => {
        await test.step('Step#001 - Login with valid credentials', async () => {
            await loginPage.login(ENV.STANDARD_USER, ENV.PASSWORD);
            await expect(sidebarMenu.burgerIcon).toBeVisible();
        });

        await test.step('Step#002 - Logout from page', async () => {
            await sidebarMenu.logout();
            await loginPage.checkHomepage();
        });
    });

    // # Negative Testing 
    test('TC#002 - Verify cannot login with invalid credentials', async ({ page }) => {
        await test.step('Step#001 - Empty both username and password', async () => {
            await loginPage.login('', '');
            expect(await loginPage.getLoginError()).toBe(LOGIN_ERROR_MESSAGES.requiredUsername);
        });
        
        await test.step('Step#002 - Filled username and empty password', async () => {
            await loginPage.clearInputs();
            await loginPage.login(ENV.STANDARD_USER, '');
            expect(await loginPage.getLoginError()).toBe(LOGIN_ERROR_MESSAGES.requiredPassword);
        });
        
        await test.step('Step#003 - Empty username and filled password', async () => {
            await loginPage.clearInputs();
            await loginPage.login('', ENV.PASSWORD);
            expect(await loginPage.getLoginError()).toBe(LOGIN_ERROR_MESSAGES.requiredUsername);
        });

        await test.step('Step#004 - Correct username and incorrect password', async () => {
            await loginPage.clearInputs();
            await loginPage.login(ENV.STANDARD_USER, 'asldkfn');
            expect(await loginPage.getLoginError()).toBe(LOGIN_ERROR_MESSAGES.invalidCreds);
        });

        await test.step('Step#005 - Incorrect username and correct password', async () => {
            await loginPage.clearInputs();
            await loginPage.login('asdfasdfasdf', ENV.PASSWORD);
            expect(await loginPage.getLoginError()).toBe(LOGIN_ERROR_MESSAGES.invalidCreds);
        });
    });

    // # Locked User
    test('TC#003 - Verify Locked users cannot enter the website', async ({ page }) => {
        await loginPage.login(ENV.LOCKED_OUT_USER, ENV.PASSWORD);
        expect(await loginPage.getLoginError()).toBe(LOGIN_ERROR_MESSAGES.lockedOutUser);
    });

    // # Logout and return to previous page
    test('TC#004 - Verify you cannot access previous session after logging back out by pressing the return page button', async ({ page }) => {
        await test.step('Step#001 - Login with valid credentials', async () => {
            await loginPage.login(ENV.STANDARD_USER, ENV.PASSWORD);
            await expect(page).toHaveURL('/inventory.html');
        });
        
        await test.step('Step#002 - Logout from page', async () => {
            await sidebarMenu.logout();
            await loginPage.checkHomepage();
        });

        await test.step('Step#003 - Return to previous page', async () => {
            await page.goBack();
            expect(await loginPage.getLoginError()).toBe(LOGIN_ERROR_MESSAGES.requiredLogin);
        });
    });
});