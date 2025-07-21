import { Page, Locator, expect } from '@playwright/test';
import { SauceDemoInventoryItem } from './Components/SauceDemoInventoryItem';

export class SauceDemoInventoryPage {
    readonly page: Page;
    readonly filter: Locator;
    readonly inventoryList: Locator;
    private _inventoryDetails: SauceDemoInventoryItem[];

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
        this.clearInventoryDetails();
        
        const items = this.inventoryList.locator('.inventory_item');
        const itemCount = await items.count();

        for (let i = 0; i < itemCount; i++) {
            const newItem = new SauceDemoInventoryItem(items.nth(i));
            await newItem.setupItemData();
            this._inventoryDetails.push(newItem);
        }
        
        return this._inventoryDetails;
    }

    clearInventoryDetails() {
        this._inventoryDetails = [];
    }
}
