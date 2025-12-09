import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import { exportOrders } from './scripts/export-orders.ts';

const prisma = new PrismaClient();
const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const PORT = 3000;

// ------------------------
// POST /products -> create product (req.body)
// ------------------------
app.post('/products', async (req, res) => {
  try {
    const { name, description, image, price, stock, categoryId, category } =
      req.body;

    if (name == null || price == null || stock == null) {
      return res
        .status(400)
        .json({ error: 'name, price, and stock are required' });
    }

    const parsedPrice = Number(price);
    const parsedStock = Number(stock);
    if (Number.isNaN(parsedPrice) || Number.isNaN(parsedStock)) {
      return res
        .status(400)
        .json({ error: 'price and stock must be valid numbers' });
    }

    let resolvedCategoryId = categoryId ? Number(categoryId) : undefined;

    // If no categoryId provided, attempt to resolve by category name
    if (!resolvedCategoryId) {
      if (!category) {
        return res
          .status(400)
          .json({ error: 'categoryId or category is required' });
      }

      const existingCategory = await prisma.category.findFirst({
        where: { name: { equals: String(category), mode: 'insensitive' } },
      });

      if (existingCategory) {
        resolvedCategoryId = existingCategory.id;
      } else {
        const createdCategory = await prisma.category.create({
          data: { name: String(category) },
        });
        resolvedCategoryId = createdCategory.id;
      }
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || '',
        image: image || '',
        price: parsedPrice,
        stock: parsedStock,
        category: {
          connect: { id: Number(resolvedCategoryId) },
        },
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
app.patch('/products/:productId', async (req, res) => {
  try {
    const { name, description, image, price, stock, categoryId, category } =
      req.body;

    // Build update data, resolving category if needed
    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (image !== undefined) updateData.image = image;
    if (price !== undefined) updateData.price = Number(price);
    if (stock !== undefined) updateData.stock = Number(stock);

    // Handle category update
    if (categoryId !== undefined) {
      updateData.category = { connect: { id: Number(categoryId) } };
    } else if (category !== undefined) {
      const existingCategory = await prisma.category.findFirst({
        where: { name: { equals: String(category), mode: 'insensitive' } },
      });

      if (existingCategory) {
        updateData.category = { connect: { id: existingCategory.id } };
      }
    }

    const updated = await prisma.product.update({
      where: { id: Number(req.params.productId) },
      data: updateData,
      include: { category: true },
    });

    res.json(updated);
  } catch (error) {
    console.error('Error updating product:', error);
    res
      .status(500)
      .send(error instanceof Error ? error.message : 'Unknown error');
  }
});

// ------------------------
// POST /orders -> Create a new order
// Body: {
//   email: string,
//   firstName: string,
//   lastName: string,
//   address: string,
//   city: string,
//   zipCode: string,
//   country: string,
//   items: [{ productId: number, quantity: number, price: number }]
// }
// ------------------------
app.post('/orders', async (req, res) => {
  try {
    const {
      email,
      firstName,
      lastName,
      address,
      city,
      zipCode,
      country,
      items,
    } = req.body;

    if (!email || !items || items.length === 0) {
      return res.status(400).json({ error: 'email and items are required' });
    }

    // Find or create customer
    let customer = await prisma.customer.findUnique({
      where: { email },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: `${firstName} ${lastName}`,
          email,
        },
      });
    }

    // Calculate subtotal first
    let subtotal = 0;
    const itemTotals = items.map((item: any) => {
      const price = Number(item.price);
      const quantity = Number(item.quantity);
      const itemTotal = price * quantity;
      subtotal += itemTotal;
      return { ...item, price, quantity, itemTotal };
    });

    // Calculate shipping based on country (example: $10 flat rate, $15 for international)
    const shippingCost =
      country &&
      country.toLowerCase() !== 'united states' &&
      country.toLowerCase() !== 'usa'
        ? 15
        : 10;

    // Calculate tax (example: 8% tax rate)
    const taxRate = 0.08;
    const tax = subtotal * taxRate;

    // Calculate total
    const totalPrice = subtotal + shippingCost + tax;

    // Allocate shipping/tax per item and prepare order items data
    interface OrderItem {
      productId: number;
      quantity: number;
      price: number;
      itemTotal: number;
    }

    interface OrderItemData {
      productId: number;
      quantity: number;
      priceAtTime: number;
      totalPrice: number;
      shippingCost: number;
      taxAmount: number;
      totalWithFees: number;
    }

    const orderItemsData: OrderItemData[] = itemTotals.map((item: OrderItem) => {
      const ratio = subtotal > 0 ? item.itemTotal / subtotal : 0;
      const itemShipping = shippingCost * ratio;
      const itemTax = tax * ratio;
      const totalWithFees = item.itemTotal + itemShipping + itemTax;
      return {
        productId: Number(item.productId),
        quantity: Number(item.quantity),
        priceAtTime: item.price,
        totalPrice: item.itemTotal,
        shippingCost: itemShipping,
        taxAmount: itemTax,
        totalWithFees,
      };
    });

    // Create order with calculated totals
    const order = await prisma.order.create({
      data: {
        customerId: customer.id,
        address,
        city,
        zipCode,
        country,
        subtotal,
        shippingCost,
        tax,
        totalPrice,
        orderItems: {
          create: orderItemsData,
        },
      },
      include: {
        customer: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    exportOrders({ prisma }).catch((err) =>
      console.error('Order export failed:', err)
    );

    res.status(201).json({
      id: order.id,
      customerId: order.customerId,
      orderDate: order.orderDate,
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      tax: order.tax,
      totalPrice: order.totalPrice,
      customer,
      items: order.orderItems,
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /orders -> Fetch all orders
app.get('/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        customer: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { orderDate: 'desc' },
    });
    res.json(orders);
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /orders/:orderId -> Fetch a specific order
app.get('/orders/:orderId', async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: Number(req.params.orderId) },
      include: {
        customer: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error: any) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: error.message });
  }
});

// ------------------------
// DELETE /orders/:orderId -> delete order (req.params)
// ------------------------
app.delete('/orders/:orderId', async (req, res) => {
  try {
    await prisma.orderItem.deleteMany({
      where: { orderId: Number(req.params.orderId) },
    });

    const deletedOrder = await prisma.order.delete({
      where: { id: Number(req.params.orderId) },
    });
    res.json({ message: 'Order deleted', order: deletedOrder });
  } catch (error) {
    res
      .status(500)
      .send(error instanceof Error ? error.message : 'Unknown error');
  }
});

app.listen(PORT, () => {
  console.log(` 🚀 Server is running at http://localhost:${PORT}`);
});
