import React, { useEffect, useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Package,
  LogOut,
  Lock,
  LayoutDashboard,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import ProductForm from '@/components/ProductForm';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '@/lib/supabaseApi';
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext';

// Define the allowed admin email
const ADMIN_EMAIL = 'kunnikarbcreative@gmail.com';

const AdminPage = () => {
  const {
    user,
    signIn,
    signUp,
    signOut,
    loading: authLoading,
  } = useFirebaseAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Auth State
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // Check if current user is admin
  const isAuthorized = user?.email === ADMIN_EMAIL;

  // Load products only when user is authenticated AND authorized
  const loadProducts = async () => {
    if (!isAuthorized) return;

    try {
      setLoading(true);
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
      toast({
        title: 'Error',
        description: 'Failed to load products. You might need to log in.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      setOrdersLoading(true);
      const res = await fetch('http://localhost:3000/orders');
      if (!res.ok) throw new Error('Failed to load orders');
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to load orders.',
        variant: 'destructive',
      });
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (user && isAuthorized) {
      loadProducts();
      loadOrders();
    }
  }, [user, isAuthorized]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthSubmitting(true);
    try {
      if (authMode === 'login') {
        const { user: signedInUser, error } = await signIn(email, password);
        if (error) {
          toast({
            title: 'Login Failed',
            description: error.message || 'Invalid email or password',
            variant: 'destructive',
          });
        } else if (signedInUser) {
          // Check authorization immediately after sign in
          if (email !== ADMIN_EMAIL) {
            toast({
              title: 'Access Denied',
              description: 'This account does not have admin privileges.',
              variant: 'destructive',
            });
            await signOut();
          } else {
            toast({
              title: 'Welcome back!',
              description: 'You have successfully logged in as admin.',
            });
          }
        }
      } else {
        const { user: newUser, error } = await signUp(email, password);
        if (error) {
          toast({
            title: 'Sign Up Failed',
            description: error.message || 'Failed to create account',
            variant: 'destructive',
          });
        } else if (newUser) {
          toast({
            title: 'Account Created',
            description:
              'Your account has been created successfully. You can now log in.',
          });
          setAuthMode('login');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleProductSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
        toast({
          title: 'Success',
          description: 'Product updated successfully',
        });
      } else {
        await createProduct(formData);
        toast({
          title: 'Success',
          description: 'Product created successfully',
        });
      }
      setIsDialogOpen(false);
      setEditingProduct(null);
      loadProducts();
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save product',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      toast({ title: 'Success', description: 'Product deleted successfully' });
      loadProducts();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        variant: 'destructive',
      });
    }
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const openCreate = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  // Loading Screen for Initial Auth Check
  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-gray-500 font-medium">Verifying access...</p>
      </div>
    );
  }

  // Unauthorized State (Logged in but wrong email)
  if (user && !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="max-w-md w-full shadow-lg border-red-100">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <ShieldAlert className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-xl text-red-600">
              Access Restricted
            </CardTitle>
            <CardDescription className="pt-2">
              You are signed in as{' '}
              <span className="font-semibold text-gray-900">{user.email}</span>,
              but this account does not have administrator privileges.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center pt-6">
            <Button variant="outline" onClick={signOut} className="w-full">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Login/Signup Screen (Unauthenticated)
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center rotate-3 hover:rotate-6 transition-transform">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Admin Access
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Please sign in to access the dashboard
            </p>
          </div>

          <Card className="login-card">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">
                {authMode === 'login' ? 'Sign In' : 'Create Account'}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {authMode === 'login'
                  ? 'Enter your email and password to continue'
                  : 'Register a new admin account'}
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleAuthSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="login-input"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="text-gray-700">
                      Password
                    </Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="login-input"
                    placeholder="••••••••"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 pt-2">
                <Button
                  type="submit"
                  className="login-button"
                  disabled={authSubmitting}
                >
                  {authSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {authMode === 'login'
                    ? 'Sign in to Dashboard'
                    : 'Create Account'}
                </Button>

                <div className="relative w-full">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  className="login-toggle-button"
                  onClick={() =>
                    setAuthMode(authMode === 'login' ? 'signup' : 'login')
                  }
                >
                  {authMode === 'login'
                    ? "Don't have an account? Sign up"
                    : 'Already have an account? Sign in'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  // Authenticated Dashboard
  return (
    <>
      <div className="min-h-screen bg-gray-50/50">
        <header className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-2">
                <LayoutDashboard className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold text-gray-900">
                  Admin Dashboard
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500 hidden sm:inline-block">
                  Signed in as{' '}
                  <span className="font-medium text-gray-900">
                    {user.email}
                  </span>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={signOut}
                  className="text-gray-600 hover:text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Orders
                </h2>
                <p className="text-gray-500 mt-1">
                  Recent orders with shipping and tax breakdown.
                </p>
              </div>
            </div>

            {ordersLoading ? (
              <div className="flex flex-col items-center justify-center h-40 bg-white rounded-xl border border-dashed">
                <Loader2 className="w-6 h-6 animate-spin text-primary mb-2" />
                <p className="text-gray-500 text-sm">Loading orders...</p>
              </div>
            ) : (
              <Card className="shadow-sm border-0 ring-1 ring-gray-200">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50/50 text-gray-600 font-medium border-b">
                      <tr>
                        <th className="py-4 px-6">Order</th>
                        <th className="py-4 px-6">Customer</th>
                        <th className="py-4 px-6">Items</th>
                        <th className="py-4 px-6">Subtotal</th>
                        <th className="py-4 px-6">Shipping</th>
                        <th className="py-4 px-6">Tax</th>
                        <th className="py-4 px-6">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.length === 0 ? (
                        <tr>
                          <td
                            colSpan="7"
                            className="py-8 text-center text-gray-500"
                          >
                            No orders yet.
                          </td>
                        </tr>
                      ) : (
                        orders.map((order) => {
                          const itemCount = order.orderItems?.length || 0;
                          const firstDate = new Date(order.orderDate);
                          const itemsLabel = itemCount === 1 ? 'item' : 'items';
                          return (
                            <tr
                              key={order.id}
                              className="hover:bg-gray-50/50 transition-colors"
                            >
                              <td className="py-4 px-6 text-gray-900 font-semibold">
                                #{order.id}
                                <div className="text-xs text-gray-500">
                                  {firstDate.toLocaleString()}
                                </div>
                              </td>
                              <td className="py-4 px-6 text-gray-700">
                                <div className="font-medium text-gray-900">
                                  {order.customer?.name || 'Unknown'}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {order.customer?.email || ''}
                                </div>
                              </td>
                              <td className="py-4 px-6 text-gray-700">
                                {itemCount} {itemsLabel}
                              </td>
                              <td className="py-4 px-6 text-gray-900 font-medium">
                                ${Number(order.subtotal ?? 0).toFixed(2)}
                              </td>
                              <td className="py-4 px-6 text-gray-900 font-medium">
                                ${Number(order.shippingCost ?? 0).toFixed(2)}
                              </td>
                              <td className="py-4 px-6 text-gray-900 font-medium">
                                ${Number(order.tax ?? 0).toFixed(2)}
                              </td>
                              <td className="py-4 px-6 text-gray-900 font-bold">
                                ${Number(order.totalPrice ?? 0).toFixed(2)}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                Products
              </h2>
              <p className="text-gray-500 mt-1">
                Manage your inventory, prices, and stock levels.
              </p>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={openCreate}
                  className="bg-primary hover:bg-primary/90 shadow-sm"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add New Product
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </DialogTitle>
                  <DialogDescription>
                    Provide basic details (name, price, stock, category) to save
                    this product.
                  </DialogDescription>
                </DialogHeader>
                <ProductForm
                  product={editingProduct}
                  onSubmit={handleProductSubmit}
                  isSubmitting={isSubmitting}
                />
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-dashed">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
              <p className="text-gray-500 text-sm">Loading products...</p>
            </div>
          ) : (
            <Card className="shadow-sm border-0 ring-1 ring-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50/50 text-gray-600 font-medium border-b">
                    <tr>
                      <th className="py-4 px-6">Product</th>
                      <th className="py-4 px-6">Category</th>
                      <th className="py-4 px-6">Price</th>
                      <th className="py-4 px-6">Stock</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="py-12 text-center">
                          <div className="flex flex-col items-center justify-center text-gray-500">
                            <Package className="w-12 h-12 mb-3 opacity-20" />
                            <p className="text-lg font-medium text-gray-900">
                              No products found
                            </p>
                            <p className="text-sm max-w-sm mt-1">
                              Get started by adding your first product to the
                              inventory.
                            </p>
                            <Button
                              variant="outline"
                              className="mt-4"
                              onClick={openCreate}
                            >
                              <Plus className="w-4 h-4 mr-2" /> Add Product
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      products.map((product) => (
                        <tr
                          key={product.id}
                          className="group hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border flex items-center justify-center">
                                {product.image ? (
                                  <img
                                    src={product.image}
                                    alt={product.title || product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.parentElement.innerHTML =
                                        '<span class="text-xs text-gray-400">No Image</span>';
                                    }}
                                  />
                                ) : (
                                  <span className="text-xs text-gray-400">
                                    No Image
                                  </span>
                                )}
                              </div>
                              <div>
                                <span className="font-semibold text-gray-900 block">
                                  {product.title || product.name}
                                </span>
                                <span className="text-xs text-gray-500 truncate max-w-[200px] block mt-0.5">
                                  {product.description?.substring(0, 50)}...
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-gray-600">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {product.category || 'Uncategorized'}
                            </span>
                          </td>
                          <td className="py-4 px-6 font-medium text-gray-900">
                            ${product.price.toFixed(2)}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <div
                                className={`w-2 h-2 rounded-full mr-2 ${
                                  product.stock > 10
                                    ? 'bg-green-500'
                                    : product.stock > 0
                                    ? 'bg-amber-500'
                                    : 'bg-red-500'
                                }`}
                              />
                              <span
                                className={
                                  product.stock === 0
                                    ? 'text-red-600 font-medium'
                                    : 'text-gray-600'
                                }
                              >
                                {product.stock} units
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-9 w-9 p-0"
                                onClick={() => openEdit(product)}
                                title="Edit"
                              >
                                <Pencil className="w-4 h-4 text-gray-600" />
                              </Button>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-9 w-9 p-0 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Delete Product
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete{' '}
                                      <span className="font-semibold text-gray-900">
                                        {product.title}
                                      </span>
                                      ? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(product.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete Product
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </main>
      </div>
    </>
  );
};

export default AdminPage;
