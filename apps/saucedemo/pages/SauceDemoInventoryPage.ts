import { Page, Locator, expect } from '@playwright/test';
import { SauceDemoInventoryItem } from './Components/SauceDemoInventoryItem';

export class SauceDemoInventoryPage {
    readonly page: Page;
    readonly filter: Locator;
    readonly inventoryList: Locator;
    private _inventoryDetails: SauceDemoInventoryItem[] | undefined;

    constructor(page: Page) {
        this.page = page;
        this.filter = page.locator('.product_sort_container');
        this.inventoryList = page.locator('.inventory_list')
    }

    async checkInventoryPage() {
        await expect(this.inventoryList).toBeVisible();
        await this.setupInventoryItems();
    }

    async setupInventoryItems() {
        this.clearInventoryDetails();
        await this.getInventoryDetails();
    }

    async getInventoryDetails() {
        if(this._inventoryDetails) return this._inventoryDetails;
        
        const items = this.inventoryList.locator('.inventory_item');
        const itemCount = await items.count();
        this._inventoryDetails = [];

        for (let i = 0; i < itemCount; i++) {
            const newItem = new SauceDemoInventoryItem(items.nth(i));
            await newItem.getItemDetails(false);
            this._inventoryDetails.push(newItem);
        }
        
        return this._inventoryDetails;
    }

    clearInventoryDetails() {
        this._inventoryDetails = undefined;
    }
}
