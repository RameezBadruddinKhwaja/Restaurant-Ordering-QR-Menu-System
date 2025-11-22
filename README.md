# 🍽️ Restaurant Ordering & QR Menu System

A complete, production-ready multi-vendor restaurant ordering system with QR code menu functionality.

## 🚀 Features

### Core Functionality
- **QR Code Menu System** - Customers scan table QR codes to view digital menus
- **Multi-Vendor Platform** - Support for multiple restaurants on one platform
- **Real-time Order Management** - Live order tracking and updates
- **Three User Roles**:
  - **Admin** - Platform management, vendor approval, analytics
  - **Restaurant Owner** - Menu management, order handling, table setup
  - **Customer** - Browse menu, place orders, track delivery

### Advanced Features
- 🔐 **Secure Authentication** - JWT-based auth with role-based access control
- 💳 **Payment Integration** - Stripe payment gateway
- 📊 **Analytics Dashboard** - Sales reports, popular items, revenue tracking
- 🔔 **Real-time Notifications** - Socket.io for live order updates
- 🌍 **Multi-language Support** - i18n internationalization
- 📱 **Responsive Design** - Mobile-first, works on all devices
- 🖼️ **Image Upload** - Menu item photos, restaurant logos
- 📧 **Email Notifications** - Order confirmations, status updates
- 🔍 **Search & Filter** - Find restaurants, dishes, cuisines
- ⭐ **Ratings & Reviews** - Customer feedback system

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- Next.js 14 (React 18)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Socket.io client
- React Query
- Zustand (state management)

**Backend:**
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Socket.io
- JWT authentication
- Stripe API

**DevOps:**
- Docker & Docker Compose
- Nginx reverse proxy
- PostgreSQL database
- Redis caching

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm/yarn
- Docker and Docker Compose
- PostgreSQL (or use Docker)

### Quick Start with Docker

```bash
# Clone the repository
git clone <repository-url>
cd Restaurant-Ordering-QR-Menu-System

# Set up environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start all services with Docker
docker-compose up -d

# Run database migrations
docker-compose exec backend npm run prisma:migrate

# Seed initial data
docker-compose exec backend npm run seed
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/api-docs

### Manual Installation

**Backend Setup:**
```bash
cd backend
npm install
cp .env.example .env
# Configure your .env file
npm run prisma:migrate
npm run seed
npm run dev
```

**Frontend Setup:**
```bash
cd frontend
npm install
cp .env.example .env
# Configure your .env file
npm run dev
```

## 🗂️ Project Structure

```
Restaurant-Ordering-QR-Menu-System/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # Next.js 14 app directory
│   │   ├── components/      # Reusable React components
│   │   ├── lib/             # Utilities and configurations
│   │   ├── hooks/           # Custom React hooks
│   │   └── types/           # TypeScript type definitions
│   ├── public/              # Static assets
│   └── package.json
│
├── backend/                  # Express backend API
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Express middleware
│   │   ├── services/        # Business logic
│   │   ├── models/          # Prisma models
│   │   ├── utils/           # Helper functions
│   │   └── config/          # Configuration files
│   ├── prisma/              # Database schema and migrations
│   └── package.json
│
├── docker-compose.yml        # Docker orchestration
├── nginx.conf               # Nginx configuration
└── README.md
```

## 🔑 Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/restaurant_db
JWT_SECRET=your-secret-key
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-password
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

## 📱 Usage

### For Customers
1. Scan QR code at restaurant table
2. Browse digital menu with photos and descriptions
3. Add items to cart
4. Place order and pay online
5. Track order status in real-time

### For Restaurant Owners
1. Register restaurant and await admin approval
2. Set up menu (categories, items, prices, photos)
3. Generate QR codes for tables
4. Receive and manage orders
5. Update order status
6. View analytics and reports

### For Admins
1. Approve/reject restaurant registrations
2. Monitor all platform activity
3. View comprehensive analytics
4. Manage users and restaurants
5. Configure platform settings

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Role-based access control (RBAC)
- SQL injection prevention with Prisma
- XSS protection
- CSRF tokens
- Rate limiting
- Input validation and sanitization
- Secure payment processing with Stripe
- HTTPS in production

## 🧪 Testing

```bash
# Backend tests
cd backend
npm run test
npm run test:coverage

# Frontend tests
cd frontend
npm run test
npm run test:e2e
```

## 📚 API Documentation

Interactive API documentation is available at `/api-docs` when running the backend server.

Key API endpoints:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/restaurants` - List restaurants
- `GET /api/menu/:restaurantId` - Get restaurant menu
- `POST /api/orders` - Place order
- `GET /api/orders/:id` - Track order
- `POST /api/payments` - Process payment

## 🚀 Deployment

### Docker Production Deployment

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Run migrations
docker-compose -f docker-compose.prod.yml exec backend npm run prisma:migrate:deploy
```

### Manual Deployment

1. Set up PostgreSQL database
2. Configure environment variables for production
3. Build frontend: `cd frontend && npm run build`
4. Build backend: `cd backend && npm run build`
5. Start backend: `cd backend && npm start`
6. Serve frontend with Nginx or similar

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ for modern restaurants

## 🆘 Support

For issues and questions, please open a GitHub issue or contact support.

---

**Note:** This is a production-ready system with enterprise-level features. Customize according to your specific requirements.
