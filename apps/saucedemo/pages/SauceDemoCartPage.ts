import { Page, Locator, expect } from '@playwright/test';
import { SauceDemoInventoryItem } from './Components/SauceDemoInventoryItem';

export class SauceDemoCartPage {
    readonly page: Page;
    readonly cartList: Locator;
    private _cartDetails: SauceDemoInventoryItem[] | undefined;

    constructor(page: Page) {
        this.page = page;
        this.cartList = page.locator('.cart_list')
    }

    async setupCartPage() {
        this.clearCartDetails();
        await this.getCartDetails();
    }

    async getCartDetails() {
        if(this._cartDetails) return this._cartDetails;

        const items = this.cartList.locator('.cart_item');
        const itemCount = await items.count();
        this._cartDetails = [];

        for (let i = 0; i < itemCount; i++) {
            const cartItem = new SauceDemoInventoryItem(items.nth(i));
            await cartItem.getItemDetails(true);
            this._cartDetails.push(cartItem);
        }
        
        return this._cartDetails;
    }

    async checkCartPage() {
        await expect(this.cartList).toBeVisible();
        await this.setupCartPage(); // do a quick setup
    }

    // check if said item is in the _cartDetails 
    // and check if all information matches correctly not just the name of the item
    async checkCartForItems(toCheckItems: SauceDemoInventoryItem | SauceDemoInventoryItem[]): Promise<boolean> {
        const cartDetails = this._cartDetails ?? []; // check if toCheckItems is single object or an array
        const itemsToCheck = Array.isArray(toCheckItems) ? toCheckItems : [toCheckItems];

        return itemsToCheck.every(item => 
            cartDetails.some(cartItem => 
                cartItem.itemDetails.compareItemDetails(item.itemDetails)
            ));
    }

    clearCartDetails() {
        this._cartDetails = undefined;
    }
}
