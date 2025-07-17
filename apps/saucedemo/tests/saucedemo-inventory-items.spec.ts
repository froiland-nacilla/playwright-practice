import { expect, test } from '@playwright/test';
import { ENV } from '../utils/SauceDemo_ENV';
import { SauceDemoLoginPage } from '../pages/SauceDemoLoginPage';
import { SauceDemoInventoryPage } from '../pages/SauceDemoInventoryPage';
import { SauceDemoInventoryItem } from '../pages/Components/SauceDemoInventoryItem';
import { SauceDemoMenubar } from '../pages/SauceDemoMenubar';
import { SauceDemoCartPage } from '../pages/SauceDemoCartPage';

// positive testing 
test.describe('Add and remove items', () => {
    let loginPage: SauceDemoLoginPage;
    let menubar: SauceDemoMenubar; 
    let inventoryPage: SauceDemoInventoryPage;
    let inventoryItems: SauceDemoInventoryItem[];
    let cartPage: SauceDemoCartPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new SauceDemoLoginPage(page);
        menubar = new SauceDemoMenubar(page);
        inventoryPage = new SauceDemoInventoryPage(page);
        cartPage = new SauceDemoCartPage(page);

        await test.step('Pre-condition Step#001 - Go to home and login.', async () => {
            await page.goto(ENV.HOMEPAGE);
            await loginPage.login(ENV.STANDARD_USER, ENV.PASSWORD);
            await inventoryPage.checkInventoryPage();   // check if in inventory page
        }); 

        await test.step('Pre-condition#002 - Setup Inventory Page', async () => {
            await inventoryPage.resetInventoryItems(); // reset inventory items
            inventoryItems = await inventoryPage.getInventoryDetails(); // fetch new inventory items
        });
    });

    test('TC#001 - Verify you can add and remove from Inventory Page', async ({ page }) => {
        const firstItem = inventoryItems[0];
        
        await test.step('Step#001 - Add first item to cart', async () => {
           await firstItem.addItemToCart();
           expect(await menubar.getCartCount()).toBe(1);
        })

        await test.step('Step#002 - Check if correct item has been added to cart', async () => {
            await test.step('Step#002-A - Go to Cart', async () => {
                await menubar.openCart();
                await cartPage.checkCartPage(); // Check if on cart page
            });

            await test.step('Step#002-B - Check if correct item has been added to cart', async () => {
                // do some cartPage checking 
                // if done return to inventory list
                await menubar.returnToInventoryPage();
            });
        });

        await test.step('Step#003 - Remove first item from cart', async () => {
           await firstItem.removeItemFromCart();
           expect(await menubar.getCartCount()).toBe(0);
        });

        // add then remove all inventory items from the cart 
    });

    // add and remove from item page
})
