#  🛒 Webshop with Prisma, Express, and React (Vite + TypeScript)
- A minimal webshop backend built with Express, TypeScript, and Prisma, connected to PostgreSQL. Supports CRUD operations for products and orders, with relational handling for customers, categories, and order items.
- It allows you to create and list products with real-time updates on the frontend.
  <img width="494" height="916" alt="Screenshot 2025-10-11 at 07 27 41" src="https://github.com/user-attachments/assets/23d2976f-7e57-4dfc-8684-06c1c114100a" />


## 🚀 Tech Stack
- Backend
  - Node.js + Express
  - Prisma ORM
  - PostgreSQL

- Frontend
  - React (Vite + TypeScript)
  - Axios for API calls
  - Tailwind CSS for styling
  - React Hot Toast for notifications

## ⚒️ Features

- Database models for `Category`, `Product`, `Customer`, `Order`, and `OrderItem`.
- - Prisma relations and data integrity handling.
  <img width="931" height="714" alt="Screenshot 2025-10-10 at 12 10 54" src="https://github.com/user-attachments/assets/a4f89395-1a62-4a1f-b7ce-140e7b8ab65c" />

- Seed script to populate initial data.
--- 
### Getting Started
- Clone
  - https://github.com/KunnikarB/webshop-prisma.git
- Install dependencies
  - npm install
- Install frontend dependencies
  - npm install
- Create a .env file with your PostgreSQL database URL:
  - DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"
- Generate Prisma client and migrate database
  - npx prisma generate
  - npx prisma migrate dev --name init
- Run server
  - npm run dev
  - Server runs at http://localhost:3000


---
### Express routes demonstrating:
  - `req.query` → GET / filter

  http://localhost:3000/products
  
  <img width="388" height="704" alt="Products" src="https://github.com/user-attachments/assets/f4e22279-c7f7-4c23-8f87-04e364d18aa8" />

  http://localhost:3000/products?category=Books
  <img width="462" height="427" alt="Books" src="https://github.com/user-attachments/assets/a237be46-b5f9-44c7-bfe9-9d11d87de863" />
  
  http://localhost:3000/products?category=Electronics
  <img width="492" height="457" alt="Electronics" src="https://github.com/user-attachments/assets/6417ac0d-1fb0-4686-84f9-c4fef615999d" />

  http://localhost:3000/products?minPrice=10&maxPrice=100
  <img width="656" height="278" alt="minPrice" src="https://github.com/user-attachments/assets/3cc62da9-9df1-426c-a65a-b034e6b4b17c" />
---

#### 👩🏻‍💻 Insomnia
  
<img width="822" height="639" alt="GetAll" src="https://github.com/user-attachments/assets/608dc64e-6e47-422a-9f5e-46ba8ff14be8" />
<br>
<img width="824" height="366" alt="Post" src="https://github.com/user-attachments/assets/e6492904-8882-4a60-8429-9aebc16ea02d" />
<br>
 <img width="818" height="370" alt="Patch" src="https://github.com/user-attachments/assets/11438853-c10b-4ea7-88a9-2ff22a3dadb7" />
<br> 
<img width="824" height="373" alt="Delete" src="https://github.com/user-attachments/assets/b16fe78d-af62-4e32-8ca5-c6fac9788e85" />
