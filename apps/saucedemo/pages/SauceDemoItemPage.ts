import { expect, Locator, Page } from "@playwright/test";
import { SauceDemoItemData } from "./Components/SauceDemoItemData";
import { SauceDemoItem } from "./Components/SauceDemoItem";

export class SauceDemoItemPage implements SauceDemoItem {
    readonly page: Page;
    readonly root: Locator;
    readonly name: Locator; 
    readonly description: Locator;
    readonly price: Locator;
    readonly image: Locator;
    readonly addButton: Locator;
    readonly removeButton: Locator; 
    readonly backButton: Locator;
    itemData: SauceDemoItemData;
    
    constructor(page: Page) {
        this.page = page;
        this.backButton = page.locator('#back-to-products');
        this.name = page.locator('.inventory_details_name.large_size');
        this.description = page.locator('.inventory_details_desc.large_size');
        this.price = page.locator('.inventory_details_price');
        this.image = page.locator('#inventory_item_container').locator('img')
        this.addButton = page.locator('button.btn.btn_primary.btn_small.btn_inventory');
        this.removeButton = page.locator('button.btn.btn_secondary.btn_small.btn_inventory');
    }

    async setupItemData() {
        const _name = await this.name.textContent();
        const _desc = await this.description.textContent();
        const _price = await this.price.textContent();
        const _imgSrc = await this.image.getAttribute('src') ?? undefined;
        const _itemID = this.page.url().split('=')[1];
        const _quantity = await this.removeButton.isVisible() ? 1 : 0; 
        const _isCart = false;
        
        this.itemData = new SauceDemoItemData(
            _name!,
            _desc!,
            _price!,
            _isCart,
            _itemID,
            _quantity,
            _imgSrc
        )
    }

    async addToCart() {
        await expect(this.addButton).toBeVisible();
        await this.addButton.click();
        this.itemData.addedToCart();
    }

    async removeFromCart() {
        await expect(this.removeButton).toBeVisible();
        await this.removeButton.click();
        this.itemData.removedFromCart();
    }

    async backToProducts() {
        await this.backButton.click();
        expect(this.page.url()).toContain('/inventory.html');
    }

    async checkItemPage(item: SauceDemoItem) {
        await this.setupItemData();
        expect(this.page.url()).toContain(`/inventory-item.html?id=${item.itemData.id}`);
        if(!item) return;
        this.compareItem(item);
    }

    compareItem(item: SauceDemoItem): boolean {
        return this.itemData.compareItemData(item.itemData);
    }
}