import { expect, Locator } from "@playwright/test";
import { SauceDemoItemDetails } from "./SauceDemoItemDetails";

export class SauceDemoInventoryItem {
    readonly root: Locator;
    readonly name: Locator;
    readonly description: Locator;
    readonly price: Locator;
    readonly addCartButton: Locator;
    readonly removeCartButton: Locator;
    readonly image: Locator; // optional if not cart 
    readonly quantity: Locator; // optional if is cart
    private _itemDetails: SauceDemoItemDetails;

    constructor(root: Locator){
        this.root = root;
        this.name = root.locator('.inventory_item_name ');
        this.description = root.locator('.inventory_item_desc');
        this.price = root.locator('.inventory_item_price');
        this.addCartButton = root.locator('button.btn.btn_primary.btn_small.btn_inventory ');
        this.removeCartButton = root.locator('button.btn.btn_secondary.btn_small.btn_inventory ');
        this.image = root.locator('.inventory_item_img');
        this.quantity = root.locator('.cart_quantity');
    }

    get itemDetails(): SauceDemoItemDetails {
        return this._itemDetails;
    }

    async getItemDetails(isCartItem: boolean) {
        if(this._itemDetails) return this._itemDetails;

        let _tmpSrc: string | null = null;
        let _tmpQuantity: string | null = null; 

        if(!isCartItem) 
            _tmpSrc = await this.image.locator('img').getAttribute('src');
        else 
            _tmpQuantity = await this.quantity.textContent();

        const _name = await this.name.textContent();
        const _desc = await this.description.textContent();
        const _price = await this.price.textContent();
        const _imgSrc = _tmpSrc ?? undefined;
        const _quantity = _tmpQuantity ? parseInt(_tmpQuantity) : undefined;
        
        this._itemDetails = new SauceDemoItemDetails(
            _name!,
            _desc!,
            _price!,
            _imgSrc!,
            _quantity,
            isCartItem
        )

        return this._itemDetails;
    }

    async visitItemPage() {
        await this.name.click();
    }

    async addItemToCart() {
        await expect(this.addCartButton).toBeVisible();
        await this.addCartButton.click();
        this._itemDetails.addedToCart();
    }

    async removeItemFromCart() {
        await expect(this.removeCartButton).toBeVisible();
        await this.removeCartButton.click();
        this._itemDetails.removedFromCart();
    }
}