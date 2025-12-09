import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

const products = [
  {
    id: 1,
    name: 'Custom T-Shirt',
    category: 'clothing',
    price: 24.99,
  },
  {
    id: 2,
    name: 'Pullover Hoodie',
    category: 'clothing',
    price: 405.02,
  },
  {
    id: 3,
    name: 'Coffee Mug',
    category: 'accessories',
    price: 14.99,
  },
  {
    id: 4,
    name: 'Tote Bag',
    category: 'accessories',
    price: 18.99,
  },
  {
    id: 5,
    name: 'Phone Case',
    category: 'accessories',
    price: 19.99,
  },
  {
    id: 6,
    name: 'Poster Print',
    category: 'home',
    price: 12.99,
  },
  {
    id: 7,
    name: 'Canvas Print',
    category: 'home',
    price: 34.99,
  },
  {
    id: 8,
    name: 'Throw Pillow',
    category: 'home',
    price: 22.99,
  },
  {
    id: 9,
    name: 'Sweatshirt',
    category: 'clothing',
    price: 38.99,
  },
  {
    id: 10,
    name: 'Tank Top',
    category: 'clothing',
    price: 19.99,
  },
  {
    id: 11,
    name: 'Water Bottle',
    category: 'accessories',
    price: 16.99,
  },
  {
    id: 12,
    name: 'Notebook',
    category: 'accessories',
    price: 11.99,
  },
];

async function seed(): Promise<void> {
  // Reset tables for a clean seed
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Create categories and keep their ids for product mapping
  const categoryNames = ['clothing', 'accessories', 'home'];
  const categories = await Promise.all(
    categoryNames.map((name) =>
      prisma.category.create({
        data: { name },
      })
    )
  );
  const categoryIdByName = Object.fromEntries(
    categories.map((c) => [c.name, c.id])
  );

  // Seed products using provided list; stock defaults to 100
  await prisma.product.createMany({
    data: products.map((product) => ({
      name: product.name,
      price: product.price,
      stock: 100,
      categoryId: categoryIdByName[product.category],
    })),
  });

  console.log('✅ Seeding finished successfully.');
}

seed()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
