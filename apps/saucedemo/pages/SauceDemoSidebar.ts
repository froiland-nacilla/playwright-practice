import { Page, Locator } from '@playwright/test';

export class SauceDemoSidebar {
    readonly page: Page;
    readonly sidebarMenu: Locator;
    readonly burgerIcon: Locator;
    readonly logoutButton: Locator;
    readonly closeIcon: Locator;
    readonly resetButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.sidebarMenu = page.locator('.bm-menu-wrap');
        this.burgerIcon = page.locator('#react-burger-menu-btn');
        this.logoutButton = page.locator('#logout_sidebar_link');
        this.resetButton = page.locator('#reset_sidebar_link');
        this.closeIcon = page.locator('#react-burger-cross-btn');
    } 

    async isHidden() : Promise<boolean> {
        const ariaHidden = await this.sidebarMenu.getAttribute('aria-hidden');
        return ariaHidden === 'true';
    }

    async openSidebar() {
        if(!(await this.isHidden())) return;
        await this.burgerIcon.click();
    }

    async closeSidebar() {
        if((await this.isHidden())) return; 
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
}