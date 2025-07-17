import { expect, Locator } from "@playwright/test";
import { SauceDemoItemDetails } from "./SauceDemoItemDetails";

export class SauceDemoInventoryItem {
    readonly root: Locator;
    readonly name: Locator;
    readonly description: Locator;
    readonly price: Locator;
    readonly image: Locator;
    readonly addCartButton: Locator;
    readonly removeCartButton: Locator;
    private _itemDetails: SauceDemoItemDetails;

    constructor(root: Locator){
        this.root = root;
        this.name = root.locator('.inventory_item_name ');
        this.description = root.locator('.inventory_item_desc');
        this.price = root.locator('.inventory_item_price');
        this.image = root.locator('.inventory_item_img');
        this.addCartButton = root.locator('button.btn.btn_primary.btn_small.btn_inventory ');
        this.removeCartButton = root.locator('button.btn.btn_secondary.btn_small.btn_inventory ');
    }

    async getItemDetails() {
        if(this._itemDetails) return this._itemDetails;

        const _name = await this.name.textContent();
        const _desc = await this.description.textContent();
        // const _curr = await this.price.
        // const _amount = await this.price
        // const _img = await this.image.

        this._itemDetails = new SauceDemoItemDetails(
            '',
            'desc',
            '$ curr',
            99.99,
            'imagename'
        )

        return this._itemDetails;
    }

    async visitItemPage() {
        await this.name.click();
    }

    async addItemToCart() {
        await expect(this.addCartButton).toBeVisible();
        await this.addCartButton.click();
    }

    async removeItemFromCart() {
        await expect(this.removeCartButton).toBeVisible();
        await this.removeCartButton.click();
    }
}