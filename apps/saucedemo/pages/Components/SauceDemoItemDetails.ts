export class SauceDemoItemDetails {
    readonly name: string;
    readonly description: string;
    readonly price: string;
    readonly image: string | undefined; // undefined only for cart items
    readonly isCartItem: boolean; 
    private _quantity: number;  // purchase quantity could be 0 || > 1 

    constructor(name: string, description: string, price: string, image: string, quantity: number | undefined, isCartItem: boolean) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.image = image;
        this.isCartItem = isCartItem;
        this._quantity = quantity ?? 0;
    }

    get currency(): string {
        return this.price.charAt(0);
    }

    get amount(): number {
        return parseFloat(this.price.slice(1));
    }

    get quantity(): number {
        return this._quantity;
    }

    addedToCart() {
        this._quantity++;
    }

    removedFromCart() {
        if(this._quantity < 0)
            throw new Error("Purchase Amount of Items is being reduced below zero");
        this._quantity--;
    }

    compareItemDetails(itemToCompare: SauceDemoItemDetails): boolean {
        const checkImage = !this.isCartItem && !itemToCompare.isCartItem;
        const checkPurchase = this.isCartItem !== itemToCompare.isCartItem;

        const nameMatches = this.name === itemToCompare.name; 
        const descMatches = this.description === itemToCompare.description; 
        const priceMatches = this.price === itemToCompare.price;

        // check if both are not cart
        const imageMatches = checkImage ? this.image === itemToCompare.image : true;
        // check if both are not inventory but one is a cart
        const purchaseMatches = checkPurchase ? this.quantity === itemToCompare.quantity : true;

        const result =  nameMatches && 
                        descMatches && 
                        priceMatches && 
                        imageMatches && 
                        purchaseMatches;

        // Console Log
        // console.log(`\n------------- \n### Item matching result: ${result}\nItems to compare:\n***\n${JSON.stringify(this)}\n***\n${JSON.stringify(itemToCompare)}***\n-------------`);

        return result;
    }
}