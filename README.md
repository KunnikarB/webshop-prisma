# Webshop API with Express & Prisma

## ⚒️ Features

- Database models for `Category`, `Product`, `Customer`, `Order`, and `OrderItem`.
- - Prisma relations and data integrity handling.
  <img width="931" height="714" alt="Screenshot 2025-10-10 at 12 10 54" src="https://github.com/user-attachments/assets/a4f89395-1a62-4a1f-b7ce-140e7b8ab65c" />

- Seed script to populate initial data.
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
