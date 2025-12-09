import { PrismaClient } from '@prisma/client';
import { createObjectCsvWriter } from 'csv-writer';
import fs from 'fs';
import { pathToFileURL } from 'url';

type ExportOptions = {
  prisma?: PrismaClient;
  csvPath?: string;
  jsonPath?: string;
};

export async function exportOrders(options: ExportOptions = {}) {
  const prisma = options.prisma ?? new PrismaClient();
  const shouldDisconnect = !options.prisma;
  const csvPath = options.csvPath ?? 'orders-export.csv';
  const jsonPath = options.jsonPath ?? 'orders-export.json';

  try {
    const orders = await prisma.order.findMany({
      include: {
        customer: true,
        orderItems: { include: { product: true } },
      },
      orderBy: { orderDate: 'desc' },
    });

    const rows = orders.flatMap((o) =>
      o.orderItems.map((i) => ({
        orderId: o.id,
        orderDate: o.orderDate.toISOString(),
        customerEmail: o.customer.email,
        customerName: o.customer.name,
        address: o.address ?? '',
        city: o.city ?? '',
        zipCode: o.zipCode ?? '',
        country: o.country ?? '',
        subtotal: o.subtotal,
        shippingCost: o.shippingCost,
        tax: o.tax,
        orderTotal: o.totalPrice,
        productId: i.productId,
        productName: i.product.name,
        quantity: i.quantity,
        priceAtTime: i.priceAtTime ?? 0,
        itemSubtotal: i.totalPrice ?? 0,
        itemShipping: i.shippingCost,
        itemTax: i.taxAmount,
        itemTotalWithFees: i.totalWithFees,
      }))
    );

    if (rows.length === 0) {
      fs.writeFileSync(csvPath, '');
      fs.writeFileSync(jsonPath, '[]');
      console.log('No orders to export.');
      return;
    }

    const csvWriter = createObjectCsvWriter({
      path: csvPath,
      header: Object.keys(rows[0]).map((id) => ({ id, title: id })),
    });

    await csvWriter.writeRecords(rows);
    fs.writeFileSync(jsonPath, JSON.stringify(orders, null, 2));
    console.log(`Exported ${rows.length} rows to ${csvPath} and ${jsonPath}`);
  } finally {
    if (shouldDisconnect) {
      await prisma.$disconnect();
    }
  }
}

const isDirectRun =
  import.meta.url === pathToFileURL(process.argv[1] ?? '').href;

if (isDirectRun) {
  exportOrders().catch((err) => {
    console.error('Export failed:', err);
    process.exitCode = 1;
  });
}
