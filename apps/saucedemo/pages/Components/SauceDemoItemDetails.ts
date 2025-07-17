export class SauceDemoItemDetails {
    readonly name: string;
    readonly description: string;
    readonly price: string;
    readonly image: string;

    constructor(name: string, description: string, price: string, amount: number, image: string) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.image = image;
    }

    get currency(): string {
        // get the currency 
        return '$';
    }

    get amount(): number {
        // get the number 
        return 0;
    }
}