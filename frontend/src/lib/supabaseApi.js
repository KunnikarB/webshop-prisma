// API functions for fetching data from the Prisma backend
const API_BASE_URL = 'http://localhost:3000';

export async function fetchProducts() {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to fetch products');
    }
    const products = await response.json();

    // Normalize backend shape to frontend expectations
    return products.map((product) => ({
      id: product.id,
      title: product.name,
      name: product.name,
      description: product.description || '',
      image: product.image || '',
      category: product.category?.name || '',
      categoryId: product.categoryId,
      price: product.price,
      stock: product.stock,
      variants: [
        {
          id: product.id,
          title: 'Default',
          price_in_cents: Math.round(product.price * 100),
          sale_price_in_cents: null,
          price_formatted: `$${product.price.toFixed(2)}`,
          sale_price_formatted: null,
          currency_info: { code: 'USD', symbol: '$' },
          inventory_quantity: product.stock,
        },
      ],
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function fetchProduct(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    const products = await response.json();
    const product = products.find((p) => p.id === parseInt(id));

    if (!product) {
      return null;
    }

    // Transform Prisma data to match expected format
    return {
      id: product.id,
      title: product.name,
      name: product.name,
      description: product.description || '',
      image: product.image || '',
      category: product.category?.name || '',
      categoryId: product.categoryId,
      price: product.price,
      stock: product.stock,
      variants: [
        {
          id: product.id,
          title: 'Default',
          price_in_cents: Math.round(product.price * 100),
          sale_price_in_cents: null,
          price_formatted: `$${product.price.toFixed(2)}`,
          sale_price_formatted: null,
          currency_info: { code: 'USD', symbol: '$' },
          inventory_quantity: product.stock,
        },
      ],
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function uploadProductImage(file) {
  // Placeholder for image upload
  console.warn('Image upload not implemented');
  return { data: { publicUrl: '' }, error: null };
}

export async function createProduct(productData) {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to create product');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

export async function updateProduct(id, productData) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to update product');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

export async function deleteProduct(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete product');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}
