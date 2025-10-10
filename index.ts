import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const app = express();
const PORT = 3000;

// ------------------------
// POST /products -> create product (req.body)
// ------------------------
app.post("/products", async (req, res) => {
  try {
    const newProduct = await prisma.product.create({ data: req.body });
    res.json(newProduct);
  } catch (error) {
    res.status(500).send(error instanceof Error ? error.message : "Unknown error");
  }
});

// ------------------------
// GET /products -> filter products (req.query)
// /products?category=Electronics
// /products?minPrice=10&maxPrice=100
// ------------------------
 app.get('/products', async (req, res) => {
  try {
    const { category, minPrice, maxPrice } = req.query;

    const products = await prisma.product.findMany({
      where: {
        price: {
          gte: minPrice ? Number(minPrice) : undefined,
          lte: maxPrice ? Number(maxPrice) : undefined,
        },
        category: category ? { name: { equals: String(category) } } : undefined,
      },
      include: { category: true },
    });

    res.json(products);
  } catch (error) {
    res
      .status(500)
      .send(error instanceof Error ? error.message : 'Unknown error');
  }
});

// Update product by id (req.params) 
app.patch("/products/:productId", async (req, res) => { 

  try { 

    const updated = await prisma.product.update({ 

      where: { id: Number(req.params.productId) }, 

      data: req.body 

    }); 

    res.json(updated); 

  } catch (error) { res.status(500).send(error instanceof Error ? error.message : "Unknown error"); } 

}); 


app.listen(PORT, () => {
  console.log(` 🚀 Server is running at http://localhost:${PORT}`);
});