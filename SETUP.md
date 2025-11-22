# 🚀 Restaurant Ordering System - Complete Setup Guide

This guide will help you set up and run the Restaurant Ordering & QR Menu System on your local machine or deploy it to production.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v14 or higher)
- **Redis** (optional but recommended)
- **Docker & Docker Compose** (for containerized setup)

## 🎯 Quick Start with Docker (Recommended)

The easiest way to run the entire application:

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Restaurant-Ordering-QR-Menu-System
```

### 2. Set Up Environment Variables

#### Backend (.env)
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and update the following:
```env
# Database (Docker will use these)
DATABASE_URL=postgresql://restaurant_user:restaurant_password@postgres:5432/restaurant_db

# JWT Secrets (CHANGE THESE!)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-change-this
JWT_REFRESH_SECRET=your-refresh-secret-key-min-32-characters-change-this

# Stripe (Get from https://dashboard.stripe.com)
STRIPE_SECRET_KEY=sk_test_your_actual_stripe_secret_key
STRIPE_PUBLIC_KEY=pk_test_your_actual_stripe_public_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email (Gmail example)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# Other settings are fine as default for development
```

#### Frontend (.env.local)
```bash
cd ../frontend
cp .env.example .env.local
```

Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_your_actual_stripe_public_key
```

### 3. Start with Docker Compose

From the project root:
```bash
docker-compose up -d
```

This will start:
- PostgreSQL database (port 5432)
- Redis cache (port 6379)
- Backend API (port 5000)
- Frontend (port 3000)

### 4. Run Database Migrations and Seed

```bash
# Wait for services to be ready (about 30 seconds)

# Run Prisma migrations
docker-compose exec backend npx prisma migrate dev

# Seed the database with sample data
docker-compose exec backend npm run prisma:seed
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api-docs

### 🔑 Default Test Accounts

After seeding, you can login with:

```
Admin:
Email: admin@restaurant.com
Password: Admin@123

Restaurant Owner:
Email: owner@restaurant.com
Password: Owner@123

Customer:
Email: customer@restaurant.com
Password: Customer@123
```

---

## 💻 Manual Setup (Without Docker)

If you prefer to run services manually:

### 1. Set Up PostgreSQL

Create a database:
```sql
CREATE DATABASE restaurant_db;
CREATE USER restaurant_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE restaurant_db TO restaurant_user;
```

### 2. Set Up Redis (Optional)

Install and start Redis:
```bash
# macOS
brew install redis
brew services start redis

# Ubuntu
sudo apt-get install redis-server
sudo systemctl start redis

# Windows
# Download from https://github.com/microsoftarchive/redis/releases
```

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your database credentials

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database
npm run prisma:seed

# Start development server
npm run dev
```

Backend will run on http://localhost:5000

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local

# Start development server
npm run dev
```

Frontend will run on http://localhost:3000

---

## 🔧 Configuration Guide

### Email Setup (Gmail)

1. Enable 2-Factor Authentication in your Google Account
2. Generate an App Password:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the generated password
3. Use this password in `EMAIL_PASS` in `.env`

### Stripe Setup

1. Create account at https://stripe.com
2. Get your keys from https://dashboard.stripe.com/test/apikeys
3. Copy Secret Key to `STRIPE_SECRET_KEY`
4. Copy Publishable Key to `STRIPE_PUBLIC_KEY`
5. Set up webhook (for local testing, use Stripe CLI)

### Stripe Webhook (Local Development)

```bash
# Install Stripe CLI
# https://stripe.com/docs/stripe-cli

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:5000/api/payments/webhook

# Copy the webhook signing secret to STRIPE_WEBHOOK_SECRET in .env
```

---

## 🚀 Production Deployment

### Using Docker Compose

1. Update environment variables for production
2. Use production compose file:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Manual Deployment

#### Backend

```bash
cd backend

# Install dependencies
npm ci --only=production

# Build TypeScript
npm run build

# Run migrations
npx prisma migrate deploy

# Start with PM2
pm2 start dist/server.js --name restaurant-api
```

#### Frontend

```bash
cd frontend

# Install dependencies
npm ci

# Build for production
npm run build

# Start
npm start

# Or use PM2
pm2 start npm --name restaurant-frontend -- start
```

### Environment Variables for Production

Update these in production:

```env
NODE_ENV=production
DATABASE_URL=your-production-database-url
JWT_SECRET=strong-random-secret-min-32-chars
STRIPE_SECRET_KEY=sk_live_your_live_key
FRONTEND_URL=https://yourdomain.com
API_URL=https://api.yourdomain.com
```

### SSL/HTTPS

For production, configure Nginx with SSL:

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Proxy to frontend
    location / {
        proxy_pass http://localhost:3000;
    }

    # Proxy to backend
    location /api {
        proxy_pass http://localhost:5000;
    }
}
```

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm run test
npm run test:coverage
```

### Frontend Tests
```bash
cd frontend
npm run test
npm run test:e2e
```

---

## 🛠️ Useful Commands

### Database

```bash
# View database in Prisma Studio
npx prisma studio

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Create new migration
npx prisma migrate dev --name your_migration_name

# Generate Prisma Client after schema changes
npx prisma generate
```

### Docker

```bash
# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Restart service
docker-compose restart backend

# Stop all services
docker-compose down

# Remove volumes (WARNING: Deletes database)
docker-compose down -v

# Rebuild containers
docker-compose up -d --build
```

---

## 📊 Project Structure

```
Restaurant-Ordering-QR-Menu-System/
├── backend/                # Express.js API
│   ├── src/
│   │   ├── controllers/   # Route handlers
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Express middleware
│   │   ├── services/      # Business logic
│   │   ├── utils/         # Helper functions
│   │   ├── config/        # Configuration
│   │   └── validators/    # Zod schemas
│   ├── prisma/
│   │   ├── schema.prisma  # Database schema
│   │   └── seed.ts        # Seed data
│   └── package.json
│
├── frontend/              # Next.js 14 app
│   ├── src/
│   │   ├── app/          # Next.js pages
│   │   ├── components/   # React components
│   │   ├── lib/          # Utilities
│   │   ├── services/     # API services
│   │   ├── store/        # Zustand stores
│   │   └── types/        # TypeScript types
│   └── package.json
│
├── docker-compose.yml     # Development setup
├── docker-compose.prod.yml # Production setup
├── nginx.conf            # Nginx configuration
└── README.md
```

---

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
docker-compose ps

# Check database logs
docker-compose logs postgres

# Verify connection string
echo $DATABASE_URL
```

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### Prisma Client Issues

```bash
# Regenerate Prisma Client
npx prisma generate

# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

### Frontend Build Issues

```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Socket.io Documentation](https://socket.io/docs/v4)

---

## 🤝 Support

For issues and questions:
- Check existing issues on GitHub
- Create a new issue with detailed description
- Include error logs and environment details

---

## 📝 License

This project is licensed under the MIT License.

---

**Happy Coding! 🚀**
