import { Page, Locator, expect } from '@playwright/test';
import { SauceDemoInventoryItem } from './Components/SauceDemoInventoryItem';

export class SauceDemoCartPage {
    readonly page: Page;
    readonly cartList: Locator;
    // private _cartDetails: SauceDemoInventoryItem[] | undefined;

    constructor(page: Page) {
        this.page = page;
        this.cartList = page.locator('.cart_list')
    }

    async checkCartPage() {
        await expect(this.cartList).toBeVisible();
    }
}
