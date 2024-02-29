import * as fs from 'fs';

export default class ProductManager {
    #nextId;

    constructor () {
        this.path = 'products.json';
        this.#nextId = 0
    }

    getProducts() {
        try {
            const data = JSON.parse(fs.readFileSync(this.path));
            return data;
        } catch (error) {
            throw error;
        }
    }

    addProduct(productObj) {
        // Validates required fields
        const requiredFields = ['title', 'description', 'price', 'thumbnail', 'code', 'stock'];
        for (const field of requiredFields) {
            if (!productObj[field]) {
                return `Error: field ${field} is missing on the object.`;
            }
        }

        // field "code" doesn't appear twice
        let fileProducts = this.getProducts();
        if (fileProducts.some(product => product.code === productObj.code)) {
            return `Error: code ${productObj.code} already exists.`;
        }

        // Add new product with id
        const newProduct = {
            id: this.#nextId++,
            ...productObj
        };
        fileProducts.push(newProduct);
        this._saveProductsToFile(fileProducts);
        return "Product added.";
    }

    getProductById(id) {
        let fileProducts = this.getProducts();
        const product = fileProducts.find(product => product.id === id);
        if (product) {
            return product;
        } else {
            return "Error: That product doesn't exists.";
        }
    }

    updateProduct(id, productData) {
        let fileProducts = this.getProducts();
        const productIndex = fileProducts.findIndex(product => product.id === id);
        if (productIndex === -1) {
            return `Error: Product with id ${id} not found.`;
        }
        const updatedProduct = { ...fileProducts[productIndex], ...productData };
        fileProducts[productIndex] = updatedProduct;
        this._saveProductsToFile(fileProducts);
        return "Product updated.";
    }

    deleteProduct(id) {
        let fileProducts = this.getProducts();
        const productIndex = fileProducts.findIndex(product => product.id === id);
        if (productIndex === -1) {
            return `Error: Product with id ${id} not found.`;
        }
        fileProducts.splice(productIndex, 1);
        this._saveProductsToFile(fileProducts);
        return "Product deleted.";
    }

    _saveProductsToFile(productData) {
        const data = JSON.stringify(productData, null, "\t");
        fs.writeFileSync(this.path, data);
    }
}