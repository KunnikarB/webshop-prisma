import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

const prisma = new PrismaClient();
const app = express();

app.use(cors( { origin: "http://localhost:5173" }));
app.use(express.json());

const PORT = 3000;

// ------------------------
// POST /products -> create product (req.body)
// ------------------------
app.post('/products', async (req, res) => {
  try {
    const { name, price, stock, categoryId } = req.body;

    if (!name || !price || !stock || !categoryId) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        stock: parseInt(stock),
        category: {
          connect: { id: Number(categoryId) },
        }
      },
      include: { category: true },
    });

    res.status(201).json(product);
  } catch (error: any) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: error.message });
  }
});

// ------------------------
// GET /products -> Fetch or filter products
// Examples:
//   /products
//   /products?category=Electronics
//   /products?minPrice=10&maxPrice=100
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
        category: category
          ? { name: { equals: String(category), mode: 'insensitive' } }
          : undefined,
      },
      include: { category: true },
      orderBy: { id: 'desc' },
    });

    res.json(products);
  } catch (error: any) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: error.message });
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

// ------------------------
// DELETE /orders/:orderId -> delete order (req.params)
// ------------------------
app.delete("/orders/:orderId", async (req, res) => {
  try {

    await prisma.orderItem.deleteMany({ where: { orderId: Number(req.params.orderId) } });

    const deletedOrder = await prisma.order.delete({ where: { id: Number(req.params.orderId) } });
    res.json({ message: "Order deleted", order: deletedOrder });
  } catch (error) {
    res.status(500).send(error instanceof Error ? error.message : "Unknown error");
  }
});

app.listen(PORT, () => {
  console.log(` 🚀 Server is running at http://localhost:${PORT}`);
});