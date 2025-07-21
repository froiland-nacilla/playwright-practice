export class SauceDemoItemData {
    readonly name: string;
    readonly description: string;
    readonly price: string;
    readonly isCartItem: boolean; 
    readonly imageSrc: string | undefined; // undefined only for cart items
    readonly id: string;
    protected _quantity: number;  // purchase quantity could be 0 || > 1 

    constructor(
        name: string, 
        description: string, 
        price: string, 
        isCartItem: boolean,
        id: string, 
        quantity?: number,
        imageSrc?: string) {
            
        this.name = name;
        this.description = description;
        this.price = price;
        this.isCartItem = isCartItem;
        this._quantity = quantity ?? 0;
        this.imageSrc = imageSrc ?? undefined;
        this.id = id;
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

    compareItemData(itemToCompare: SauceDemoItemData): boolean {
        const checkImage = !this.isCartItem && !itemToCompare.isCartItem;
        const checkPurchase = this.isCartItem !== itemToCompare.isCartItem;

        const nameMatches = this.name === itemToCompare.name; 
        const descMatches = this.description === itemToCompare.description; 
        const priceMatches = this.price === itemToCompare.price;

        const imageMatches = checkImage ? this.imageSrc === itemToCompare.imageSrc : true;
        const purchaseMatches = checkPurchase ? this.quantity === itemToCompare.quantity : true;

        const result =  nameMatches && 
                        descMatches && 
                        priceMatches && 
                        imageMatches && 
                        purchaseMatches;
        
        console.log(`\n--------------\n***Comparing Items***\nItem A: ${JSON.stringify(this)}\n\nItem B: ${JSON.stringify(itemToCompare)}\n***MATCH RESULT: ${result}\nChecked Image ${checkImage}\nChecked Quantity ${checkPurchase}***\n--------------`);
        return result;
    }
}