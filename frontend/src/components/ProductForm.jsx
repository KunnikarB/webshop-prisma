import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Upload, X } from 'lucide-react';
import { uploadProductImage } from '@/lib/supabaseApi';
import { useToast } from '@/components/ui/use-toast';

const ProductForm = ({ product, onSubmit, isSubmitting }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image: '',
    category: '',
    categoryId: '',
    stock: 100,
  });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || '',
        description: product.description || '',
        price: product.price || '',
        image: product.image || '',
        category: product.category || '',
        categoryId: product.categoryId || '',
        stock: product.stock || 0,
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file (JPEG, PNG, WEBP)',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      toast({
        title: 'File too large',
        description: 'Image size should be less than 5MB',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsUploading(true);
      const uploadResult = await uploadProductImage(file);
      const publicUrl = uploadResult?.data?.publicUrl || uploadResult;
      setFormData((prev) => ({ ...prev, image: publicUrl || '' }));
      toast({
        title: 'Image uploaded',
        description: 'Product image has been uploaded successfully.',
      });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Failed to upload image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.category && !formData.categoryId) {
      toast({
        title: 'Category required',
        description: 'Enter a category name or ID before submitting.',
        variant: 'destructive',
      });
      return;
    }

    onSubmit({
      name: formData.title,
      description: formData.description || '',
      image: formData.image || '',
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      categoryId: formData.categoryId ? Number(formData.categoryId) : undefined,
      category: formData.category || undefined,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-lg shadow-sm border"
    >
      <div className="space-y-2">
        <Label htmlFor="title">Product Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="e.g. Classic Hoodie"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            required
            placeholder="0.00"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleChange}
            required
            placeholder="100"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category (name or ID)</Label>
        <Input
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="e.g. clothing, accessories, home"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="categoryId">Category ID (optional)</Label>
        <Input
          id="categoryId"
          name="categoryId"
          type="number"
          value={formData.categoryId}
          onChange={handleChange}
          placeholder="1"
        />
      </div>

      <div className="space-y-2">
        <Label>Product Image</Label>

        {/* Image Preview Area */}
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors">
          {formData.image ? (
            <div className="relative group">
              <img
                src={formData.image}
                alt="Preview"
                className="mx-auto h-48 object-contain rounded-md"
              />
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, image: '' }))}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="py-8">
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                  <p className="text-sm text-gray-500">Uploading...</p>
                </div>
              ) : (
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                    <Upload className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    Click to upload image
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    SVG, PNG, JPG or GIF (max. 5MB)
                  </span>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>
          )}
        </div>

        {/* Fallback URL Input */}
        <div className="pt-2">
          <Label htmlFor="image-url" className="text-xs text-gray-500">
            Or enter image URL directly
          </Label>
          <Input
            id="image-url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://..."
            className="mt-1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          placeholder="Describe your product..."
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || isUploading}
      >
        {(isSubmitting || isUploading) && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {product ? 'Update Product' : 'Create Product'}
      </Button>
    </form>
  );
};

export default ProductForm;
