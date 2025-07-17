import { Page, Locator, expect } from '@playwright/test';

export class SauceDemoLoginPage {
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly loginError: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.locator('#user-name');
        this.passwordInput = page.locator('#password');
        this.loginButton = page.locator('#login-button');
        this.loginError = page.locator('[data-test="error"]');
    } 

    async checkHomepage () {
        await expect(this.loginButton).toBeVisible();
    }

    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    } 

    async clearInputs() {
        await this.usernameInput.clear();
        await this.passwordInput.clear();
    }

    async getLoginError() {
        await expect(this.loginError).toBeVisible();
        return await this.loginError.textContent();
    }
} 