import { expect, test } from '@playwright/test';
import { ENV } from '../utils/SauceDemo_ENV';
import { SauceDemoLoginPage } from '../pages/SauceDemoLoginPage';
import { SauceDemoInventoryPage } from '../pages/SauceDemoInventoryPage';
import { SauceDemoMenubar } from '../pages/SauceDemoMenubar';
import { SauceDemoCartPage } from '../pages/SauceDemoCartPage';

// positive testing 
test.describe('Add and remove items', () => {
    let loginPage: SauceDemoLoginPage;
    let menubar: SauceDemoMenubar; 
    let inventoryPage: SauceDemoInventoryPage;
    let cartPage: SauceDemoCartPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new SauceDemoLoginPage(page);
        menubar = new SauceDemoMenubar(page);
        inventoryPage = new SauceDemoInventoryPage(page);
        cartPage = new SauceDemoCartPage(page);

        await test.step('Pre-condition Step#001 - Go to home and login.', async () => {
            await page.goto(ENV.HOMEPAGE);
            await loginPage.login(ENV.STANDARD_USER, ENV.PASSWORD);
        }); 

        await test.step('Pre-condition#002 - Check and setup Inventory Page', async () => {
            await inventoryPage.checkInventoryPage();   // check if in inventory page
        });
    });

    test('TC#001 - Verify you can add and remove from Inventory Page', async ({ page }) => {
        const inventoryItems = await inventoryPage.getInventoryDetails();
        const firstItem = inventoryItems[0];

        await test.step('Step#001 - Add first item to cart', async () => {
           await firstItem.addItemToCart();
           expect(await menubar.getCartCount()).toBe(1);
        })

        await test.step('Step#002 - Check if correct item has been added to cart', async () => {
            await test.step('Step#002-A - Go to Cart', async () => {
                await menubar.openCart();
                await cartPage.checkCartPage(); // Check and setup if on cart page
            });

            await test.step('Step#002-B - Check if item is in cart', async () => {
                expect(await cartPage.checkCartForItems(firstItem)).toBe(true);
                await menubar.returnToInventoryPage();
            });
        });

        await test.step('Step#003 - Remove first item from cart', async () => {
           await firstItem.removeItemFromCart();
           expect(await menubar.getCartCount()).toBe(0);
        });

        await test.step('Step#004 - Add all items to cart', async () => {
            for (let i = 0; i < inventoryItems.length; i++) {
                await inventoryItems[i].addItemToCart();
            }
            expect(await menubar.getCartCount()).toBe(6);
        })

        await test.step('Step#005 - Check if all items are in cart', async () => {
            await test.step('Step#005-A - Go to Cart', async () => {
                await menubar.openCart();
                await cartPage.checkCartPage(); // Check and setup if on cart page
            });

            await test.step('Step#005-B - Check if items are in cart', async () => {
                expect(await cartPage.checkCartForItems(inventoryItems)).toBe(true);
                await menubar.returnToInventoryPage();
            });
        });

        await test.step('Step#006 - Remove all items from cart', async () => {
           for (let i = 0; i < inventoryItems.length; i++) {
                await inventoryItems[i].removeItemFromCart();
            }
           expect(await menubar.getCartCount()).toBe(0);
        });
    });

    // add and remove from item page
})

// Negative testing 