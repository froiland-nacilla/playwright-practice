import { expect, Locator } from "@playwright/test";
import { SauceDemoItemData } from "./SauceDemoItemData";
import { SauceDemoItem } from "./SauceDemoItem";

export class SauceDemoCartItem implements SauceDemoItem {
    readonly root: Locator;
    readonly name: Locator;
    readonly description: Locator;
    readonly price: Locator;
    readonly removeButton: Locator;
    readonly quantity: Locator;
    itemData: SauceDemoItemData;

    constructor(root: Locator){
        this.root = root;
        this.name = root.locator('.inventory_item_name');
        this.description = root.locator('.inventory_item_desc');
        this.price = root.locator('.inventory_item_price');
        this.removeButton = root.locator('button.btn.btn_secondary.btn_small.cart_button');
        this.quantity = root.locator('.cart_quantity');
    }

    async setupItemData() {
        const _tmpItemID = await this.root.locator('a').first().getAttribute('data-test');

        const _name = await this.name.textContent();
        const _desc = await this.description.textContent();
        const _price = await this.price.textContent();
        const _tmpQuantity = await this.quantity.textContent();
        const _quantity = _tmpQuantity ? parseInt(_tmpQuantity!) : 1; // placeholder
        const _itemID = _tmpItemID!.split('-')[1];
        const _isCart = true;
        
        this.itemData = new SauceDemoItemData(
            _name!,
            _desc!,
            _price!,
            _isCart,
            _itemID!,
            _quantity,
            undefined,
        )
    }

    async visitItemPage() {
        await this.name.click();
    }

    async removeFromCart() {
        await expect(this.removeButton).toBeVisible();
        await this.removeButton.click();
        this.itemData.removedFromCart();
    }

    compareItem(item: SauceDemoItem): boolean {
        return this.itemData.compareItemData(item.itemData);
    }
}