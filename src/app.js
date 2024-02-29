import express from 'express';
import ProductManager from './ProductManager.js';

const app = express();

app.use(express.urlencoded({extended:true}))

app.get('/products', async (req, res) => {
    let limit = req.query.limit;
    const PM = new ProductManager();
    let products = await PM.getProducts();

    if (limit) {
        products = products.slice(0, parseInt(limit));
    }

    res.send({products});
});

app.get('/products/:pid', async (req, res) => {
    let productId = req.params.pid;
    const PM = new ProductManager();
    const products = await PM.getProductById(parseInt(productId));
    res.send({products});
});


const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Servidor activo en http://localhost:${PORT}`)
});