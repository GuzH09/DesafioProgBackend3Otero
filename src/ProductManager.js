import * as fs from 'fs';

export default class ProductManager {
    #nextId;

    constructor () {
        this.path = 'products.json';
        this.#nextId = 0
    }

    async getProducts() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            throw error;
        }
    }

    async addProduct(productObj) {
        // Validates required fields
        const requiredFields = ['title', 'description', 'price', 'thumbnail', 'code', 'stock'];
        for (const field of requiredFields) {
            if (!productObj[field]) {
                return `Error: field ${field} is missing on the object.`;
            }
        }

        // field "code" doesn't appear twice
        let fileProducts = await this.getProducts();
        if (fileProducts.some(product => product.code === productObj.code)) {
            return `Error: code ${productObj.code} already exists.`;
        }

        // Add new product with id
        const newProduct = {
            id: this.#nextId++,
            ...productObj
        };
        fileProducts.push(newProduct);
        await this._saveProductsToFile(fileProducts);
        return "Product added.";
    }

    async getProductById(id) {
        let fileProducts = await this.getProducts();
        const product = fileProducts.find(product => product.id === id);
        if (product) {
            return product;
        } else {
            return "Error: That product doesn't exists.";
        }
    }

    async updateProduct(id, productData) {
        let fileProducts = await this.getProducts();
        const productIndex = fileProducts.findIndex(product => product.id === id);
        if (productIndex === -1) {
            return `Error: Product with id ${id} not found.`;
        }
        const updatedProduct = { ...fileProducts[productIndex], ...productData };
        fileProducts[productIndex] = updatedProduct;
        await this._saveProductsToFile(fileProducts);
        return "Product updated.";
    }

    async deleteProduct(id) {
        let fileProducts = await this.getProducts();
        const productIndex = fileProducts.findIndex(product => product.id === id);
        if (productIndex === -1) {
            return `Error: Product with id ${id} not found.`;
        }
        fileProducts.splice(productIndex, 1);
        await this._saveProductsToFile(fileProducts);
        return "Product deleted.";
    }

    async _saveProductsToFile(productData) {
        const data = JSON.stringify(productData, null, "\t");
        await fs.promises.writeFileSync(this.path, data);
    }
}