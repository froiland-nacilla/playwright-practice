import { Page, Locator, expect } from '@playwright/test';
import { SauceDemoCartItem } from './Components/SauceDemoCartItem';
import { SauceDemoItem } from './Components/SauceDemoItem';

export class SauceDemoCartPage {
    readonly page: Page;
    readonly cartList: Locator;
    readonly backButton: Locator;
    readonly checkoutButton: Locator;
    private _cartItems: SauceDemoCartItem[] | undefined;

    constructor(page: Page) {
        this.page = page;
        this.cartList = page.locator('.cart_list')
        this.backButton = page.locator('#continue-shopping');
        this.checkoutButton = page.locator('#checkout');
    }

    async setupCartPage() {
        this.clearCartDetails();
        
        const items = this.cartList.locator('.cart_item');
        const itemCount = await items.count();
        this._cartItems = [];

        for (let i = 0; i < itemCount; i++) {
            const cartItem = new SauceDemoCartItem(items.nth(i));
            await cartItem.setupItemData();
            this._cartItems.push(cartItem);
        }
    }

    async checkCartPage() {
        await expect(this.cartList).toBeVisible();
        await this.setupCartPage(); // do a quick setup
    }

    async isItemInCart(toCheckItems: SauceDemoItem | SauceDemoItem[]): Promise<boolean> {
        await this.setupCartPage();
        const cartItems: SauceDemoItem[] = this._cartItems ?? []; 
        
        console.log(`CartDetails Array: ${JSON.stringify(cartItems.map(item => item.itemData), null, 2)}`);
        const itemsToCheck = Array.isArray(toCheckItems) ? toCheckItems : [toCheckItems];

        const result = itemsToCheck.every(item => 
            cartItems.some(cartItem => cartItem.compareItem(item)));
        
        return result;
    }

    async removeItemFromCart(itemsToRemove: SauceDemoItem | SauceDemoItem[]) {
        await this.setupCartPage();

        const _tmpItems = Array.isArray(itemsToRemove) ? itemsToRemove : [itemsToRemove];

        for(const tmpItem of _tmpItems) {
            const cartItems: SauceDemoItem[] = this._cartItems ?? []; 

            console.log(`\n============\n####\nRemoving item from cart ${JSON.stringify(tmpItem.itemData, null, 2)}`);
         
            // find item from cartItems 
            const _cartIndex = cartItems.findIndex(item => item.compareItem(tmpItem));
            const cartItem = cartItems.splice(_cartIndex, 1).pop();
            
            await cartItem!.removeFromCart();
            console.log(`\n####\nRemoved item from cart\n============ ${JSON.stringify(tmpItem.itemData, null, 2)}`);
            
            await this.setupCartPage();
        }

        await this.setupCartPage();
    }

    async continueShopping() {
        await this.backButton.click();
        expect(this.page.url()).toContain('/inventory.html');
    }

    async checkout() {
        await this.checkoutButton.click();
        expect(this.page.url()).toContain(`/checkout-step-one.html`);
    } 

    tallyTotal() {
        // add all the amount of items in cart
    }

    clearCartDetails() {
        this._cartItems = undefined;
    }
}
