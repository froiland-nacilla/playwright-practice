import { Page, Locator } from '@playwright/test';

export class SauceDemoMenubar {
    readonly page: Page;
    readonly sidebarMenu: Locator;
    readonly cartIcon: Locator;
    readonly burgerIcon: Locator;
    readonly closeIcon: Locator;
    readonly allItems: Locator;
    readonly logoutButton: Locator;
    readonly resetButton: Locator;
    readonly cartButton: Locator;
    readonly cartBadge: Locator;

    constructor(page: Page) {
        this.page = page;
        this.sidebarMenu = page.locator('.bm-menu-wrap');
        this.cartIcon = page.locator('#shopping_cart_container');
        this.burgerIcon = page.locator('#react-burger-menu-btn');
        this.closeIcon = page.locator('#react-burger-cross-btn');
        this.allItems = page.locator('#inventory_sidebar_link');
        this.logoutButton = page.locator('#logout_sidebar_link');
        this.resetButton = page.locator('#reset_sidebar_link');
        this.cartButton = page.locator('#shopping_cart_container');
        this.cartBadge = page.locator('.shopping_cart_badge');
    } 

    async isSidebarHidden() : Promise<boolean> {
        const ariaHidden = await this.sidebarMenu.getAttribute('aria-hidden');
        return ariaHidden === 'true';
    }

    async openSidebar() {
        if(!(await this.isSidebarHidden())) return;
        await this.burgerIcon.click();
    }

    async returnToInventoryPage() { 
        await this.openSidebar();
        await this.allItems.click();
    }

    async closeSidebar() {
        if((await this.isSidebarHidden())) return; 
        await this.closeIcon.click();
    }

    async logout() {
        await this.openSidebar();
        await this.logoutButton.click();
    }

    async resetState() {
        await this.openSidebar();
        await this.resetButton.click();
    }

    async openCart() {
        await this.cartButton.click();
    }

    async getCartCount(): Promise<number> {
        const isVisible = await this.cartBadge.count() > 0;
        if(!isVisible) return 0;
        const count = await this.cartBadge.textContent();
        return parseInt(count!, 10);
    }
}