# Admin Setup Guide

## Current Status

- ✅ API Backend running on http://localhost:3000
- ✅ Frontend running on http://localhost:5174
- ✅ Firebase Authentication configured
- ✅ Admin email: kunnikarbcreative@gmail.com

## Steps to Access Admin Dashboard

### 1. Create Admin Account

Since this is your first time, you need to create the admin account:

1. Open http://localhost:5174/admin
2. Click "Don't have an account? Sign up"
3. Enter:
   - Email: `kunnikarbcreative@gmail.com` (must match exactly)
   - Password: (choose a secure password you'll remember)
4. Click "Create Account"
5. After account creation, click "Already have an account? Sign in"
6. Sign in with your email and password

### 2. Access Denied?

If you see "Access Restricted" after signing in, it means you're signed in but not using the admin email. Make sure you signed up with exactly: `kunnikarbcreative@gmail.com`

### 3. Common Issues

**Can't see login form?**

- Check browser console (F12 → Console) for errors
- Make sure both servers are running (API on 3000, Frontend on 5174)

**Login button doesn't work?**

- Open browser console to see Firebase errors
- Check that .env file has all VITE*FIREBASE*\* variables

**After login, page is blank?**

- Check browser console for API errors
- Verify API is accessible: http://localhost:3000/products

### 4. Test Product Creation

Once logged in as admin:

1. Click "Add New Product"
2. Fill in:
   - Product Title: "Test Hoodie"
   - Price: 49.99
   - Stock: 100
   - Category: "clothing" (or accessories, or home)
3. Click "Create Product"
4. Product should appear in the table below

### 5. View Products

After adding products, visit:

- Home page: http://localhost:5174/
- Shop page: http://localhost:5174/shop

Your products should display in the grid!

## Need Help?

If you're stuck, tell me:

1. What you see on the screen
2. Any red errors in browser console (F12)
3. Whether you can create an account or not
