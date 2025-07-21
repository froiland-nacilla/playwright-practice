import { expect, test } from '@playwright/test';
import { SauceDemoLoginPage } from '../pages/SauceDemoLoginPage';
import { SauceDemoInventoryPage } from '../pages/SauceDemoInventoryPage';
import { SauceDemoMenubar } from '../pages/SauceDemoMenubar';
import { SauceDemoCartPage } from '../pages/SauceDemoCartPage';
import { SauceDemoItemPage } from '../pages/SauceDemoItemPage';
import { ENV } from '../utils/SauceDemo_ENV';

// positive testing 
test.describe('Add and remove items', () => {
    let loginPage: SauceDemoLoginPage;
    let menubar: SauceDemoMenubar; 
    let inventoryPage: SauceDemoInventoryPage;
    let cartPage: SauceDemoCartPage;
    let itemPage: SauceDemoItemPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new SauceDemoLoginPage(page);
        menubar = new SauceDemoMenubar(page);
        inventoryPage = new SauceDemoInventoryPage(page);
        cartPage = new SauceDemoCartPage(page);
        itemPage = new SauceDemoItemPage(page);

        await test.step('Precondition#001 - Go to homepage and login.', async () => {
            await page.goto(ENV.HOMEPAGE);
            await loginPage.login(ENV.STANDARD_USER, ENV.PASSWORD);
        }); 

        await test.step('Precondition#002 - Check and setup Inventory Page', async () => {
            await inventoryPage.checkInventoryPage();   // check if in inventory page
        });
    });

    test('TC#001 - Verify you can add and remove from Inventory Page', async ({ page }) => {
        const inventoryItems = await inventoryPage.getInventoryDetails();
        const firstItem = inventoryItems[0];

        await test.step('Step#001 - Add first item to cart', async () => {
            await test.step('Step#001-A - Add first item to cart', async () => {
                await firstItem.addToCart();
                expect(await menubar.getCartCount()).toBe(1);
            })

            await test.step('Step#001-B - Go to Cart', async () => {
                await menubar.openCart();
                await cartPage.checkCartPage(); // Check and setup if on cart page
            });

            await test.step('Step#001-C - Check if item is in cart', async () => {
                expect(await cartPage.isItemInCart(firstItem)).toBeTruthy();
                await menubar.returnToInventoryPage();
            });
        });

        await test.step('Step#002 - Remove first item from cart', async () => {
           await test.step('Step#002-A - Remove item from cart', async () => {
                await firstItem.removeFromCart();
                expect(await menubar.getCartCount()).toBe(0);
           });
            
           await test.step('Step#002-B - Go to cart to see if item is removed', async () => {
                await menubar.openCart();
                expect(await cartPage.isItemInCart(firstItem)).toBeFalsy();
                await menubar.returnToInventoryPage();
           });
        });

        await test.step('Step#003 - Add all items to cart', async () => {
            await test.step('Step#003-A - Add items to cart', async () => {
                for (let i = 0; i < inventoryItems.length; i++) {
                    await inventoryItems[i].addToCart();
                }
                expect(await menubar.getCartCount()).toBe(6);
            });
            
            await test.step('Step#003-B - Check if items are in cart', async () => {
                await menubar.openCart();
                expect(await cartPage.isItemInCart(inventoryItems)).toBeTruthy();
                await menubar.returnToInventoryPage();
            });
        })

        await test.step('Step#004 - Remove items from cart', async () => {
            await test.step('Step#004-A - Remove from Cart', async () => {
                for (let i = 0; i < inventoryItems.length; i++) {
                    await inventoryItems[i].removeFromCart();
                }
                expect(await menubar.getCartCount()).toBe(0);
            });

            await test.step('Step#004-B - Check if items are in cart', async () => {
                await menubar.openCart();
                expect(await cartPage.isItemInCart(inventoryItems)).toBeFalsy();
                await menubar.returnToInventoryPage();
            });
        });
    });

    // add and remove from item page
    test('TC#002 - Verify that you can and remove items from the Item Page', async ({ page }) => {
        const inventoryItems = await inventoryPage.getInventoryDetails();
        const firstItem = inventoryItems[0];
        
        await test.step('Step#001 - Add the first item from item page', async () => {
            await test.step(`Step#001-A - Visit item page`, async () => {
                await firstItem.name.click();
                await itemPage.checkItemPage(firstItem);
            });

            await test.step(`Step#001-B - Add item to cart`, async () => {
                await itemPage.addToCart();
                expect(await menubar.getCartCount()).toBe(1);
            });

            await test.step('Step#001-C - Verify item is on cart', async () => {
                await menubar.openCart();
                expect(await cartPage.isItemInCart(itemPage)).toBeTruthy();
                await cartPage.continueShopping();
            });
        });

        await test.step('Step#002 - Remove item to from item page', async () => {
            await test.step(`Step#002-A - Visit item page`, async () => {
                await firstItem.name.click();
                await itemPage.checkItemPage(firstItem);
            });

            await test.step(`Step#002-B - Click the remove button`, async () => {
                await itemPage.removeFromCart();
                expect(await menubar.getCartCount()).toBe(0);
            });

            await test.step(`Step#002-C - Verify item is not on cart`, async () => {
                await menubar.openCart();
                expect(await cartPage.isItemInCart(itemPage)).toBeFalsy();
                await cartPage.continueShopping();
            });
        });

        // repeat steps 2 and 3 for all items 
        await test.step('Step#003 - Add all items from item page', async () => {
            for (let count = 0; count < inventoryItems.length; count++) {
                const targetItem = inventoryItems[count];

                await test.step(`Step#003-A - Visit item page`, async () => {
                    await targetItem.name.click();
                    await itemPage.checkItemPage(targetItem);
                });

                await test.step(`Step#003-B - Add item to cart`, async () => {
                    await itemPage.addToCart();
                    expect(await menubar.getCartCount()).toBe(count + 1);
                });

                await test.step('Step#003-C - Verify item is on cart', async () => {
                    await menubar.openCart();
                    expect(await cartPage.isItemInCart(itemPage)).toBeTruthy();
                    await cartPage.continueShopping();
                });
            }
        });

        await test.step('Step#004 - Remove all items from item page', async () => {
            for (let count = inventoryItems.length; count > 0; count--) {
                const targetItem = inventoryItems[count - 1];

                await test.step(`Step#004-A - Visit item page`, async () => {
                    await targetItem.name.click();
                    await itemPage.checkItemPage(targetItem);
                });

                await test.step(`Step#004-B - Add item to cart`, async () => {
                    await itemPage.removeFromCart();
                    expect(await menubar.getCartCount()).toBe(count - 1);
                });

                await test.step('Step#004-C - Verify item is on cart', async () => {
                    await menubar.openCart();
                    expect(await cartPage.isItemInCart(itemPage)).toBeFalsy();
                    await cartPage.continueShopping();
                });
            }
        });
    });

    // verify you can remove items from the cart page 
    test(`TC#003 - Verify that you can remove item from the Cart Page`, async ({ page }) => {
        let inventoryItems = await inventoryPage.getInventoryDetails();
        let firstItem = inventoryItems[0];

        await test.step.skip(`Step#001 - Remove an item from Cart Page`, async () => {
            await test.step(`Step#001-A - Add an item to cart`, async () => {
                await firstItem.addToCart();
                expect(await menubar.getCartCount()).toBe(1);
            });
            // step b - remove item from cart + check cart count + check cart list 
            await test.step(`Step#001-B - Remove item from Cart Page`, async () => {
                await menubar.openCart();
                await cartPage.removeItemFromCart(firstItem);
                expect(await cartPage.isItemInCart(firstItem)).toBeFalsy();
                await cartPage.continueShopping();
            })
        });

        await test.step(`Step#002 - Remove multiple items from Cart Page`, async () => {
            inventoryItems = await inventoryPage.getInventoryDetails();
            
            await test.step(`Step#002-A - Add items to cart`, async () => {
                for(let count = 0; count < inventoryItems.length; count++) {
                    const targetItem = inventoryItems[count];
                    await targetItem.addToCart();
                    expect(await menubar.getCartCount()).toBe(count + 1);
                }
            });

            await test.step(`Step#002-B - Remove item from Cart Page`, async () => {
                await menubar.openCart();
                await cartPage.removeItemFromCart(inventoryItems); 
                expect(await menubar.getCartCount()).toBe(0);
            });               
        });
    });
})

// Negative testing 