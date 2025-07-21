import { Locator } from "@playwright/test";
import { SauceDemoItemData } from "./SauceDemoItemData";

// create an interface 
export interface SauceDemoItem {
    root: Locator;
    name: Locator;
    description: Locator;
    price: Locator;
    removeButton: Locator;
    itemData: SauceDemoItemData;
    
    setupItemData();
    removeFromCart();
    compareItem(item: SauceDemoItem): boolean;
}