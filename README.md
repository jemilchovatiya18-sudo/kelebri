# Kelebri Diamonds & Jewellery

A luxury full-stack jewelry showcase website built with React, Vite, TypeScript, Tailwind CSS, Node.js, Express, PostgreSQL, and Prisma.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL installed and running locally
- Cloudinary account (Free tier)

### 1. Database Setup
1. Create a PostgreSQL database named `kelebri_db`.
   - E.g., using psql: `CREATE DATABASE kelebri_db;`

### 2. Backend Setup
1. Open terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
3. Update the `.env` file with your actual Cloudinary credentials and database URL.
4. Run Prisma migrations to create tables:
   ```bash
   npm run prisma:migrate
   ```
5. Seed the database with categories and the default admin user:
   ```bash
   npm run db:seed
   ```
6. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The backend will run on http://localhost:5000*

### 3. Frontend Setup
1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
3. Update the WhatsApp number in the `.env` file to your actual business number.
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on http://localhost:5173*

## Admin Credentials
After running the seed script, you can log in to the admin panel at `http://localhost:5173/admin/login` using:
- **Email:** `admin@kelebri.com`
- **Password:** `Kelebri@Admin2024`

*Please change this password after your first login.*
