# Advanced E-commerce Store

A modern e-commerce platform built with Next.js, featuring AI-powered virtual try-on, real-time inventory management, and secure payment processing.

## Features

- 🛍️ Product Catalog with Advanced Filtering
  - Real-time search and filtering
  - Category-based navigation
  - Dynamic product recommendations
- 👕 Virtual Try-On using AI/ML
  - AI-powered size recommendations
  - Virtual fitting room
  - Real-time visualization
- 🔒 Secure Authentication with Supabase
  - Social login integration
  - Role-based access control
  - Secure token management
- 💳 Payment Processing with Stripe
  - Multiple payment methods
  - Secure checkout process
  - Order tracking
- 🎨 Modern UI with Tailwind CSS
  - Responsive design
  - Dark/Light mode
  - Customizable themes
- 🔄 Real-time Updates
  - Live inventory tracking
  - Order status updates
  - Real-time notifications

## Tech Stack

### Frontend
- **Next.js 15**: React framework for production
- **React 18**: UI library
- **TailwindCSS**: Utility-first CSS framework
- **Radix UI**: Unstyled, accessible components
- **Three.js**: 3D graphics library
- **Framer Motion & GSAP**: Animation libraries
- **TensorFlow.js**: Machine learning library

### Backend
- **FastAPI**: Modern Python web framework
- **Redis**: In-memory data store
- **Supabase**: Open source Firebase alternative
- **Stripe**: Payment processing

## Installation

### Prerequisites
- Node.js 18+
- Python 3.10+
- Redis Server
- Supabase Account
- Stripe Account

### Frontend Setup
1. Clone the repository
```bash
git clone https://github.com/yourusername/advance-ecomerce-store.git
cd advance-ecomerce-store
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Start development server
```bash
npm run dev
```

### Backend Setup
1. Navigate to backend directory
```bash
cd backend
```

2. Create virtual environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
```

3. Install dependencies
```bash
pip install -r requirements.txt
```

4. Configure environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. Start the server
```bash
python main.py
```

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
NEXT_PUBLIC_API_URL=http://localhost:8001
```

### Backend (.env)
```
SUPABASE_KEY=your_supabase_key
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

## API Documentation

### Authentication
- POST `/api/auth/login`: User login
- POST `/api/auth/register`: User registration
- GET `/api/auth/me`: Get current user

### Products
- GET `/api/products`: List all products
- GET `/api/products/{id}`: Get product details
- POST `/api/products`: Create product (admin)
- PUT `/api/products/{id}`: Update product (admin)
- DELETE `/api/products/{id}`: Delete product (admin)

### Orders
- POST `/api/orders`: Create order
- GET `/api/orders`: List user orders
- GET `/api/orders/{id}`: Get order details

## Deployment

### Frontend (Vercel)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables
4. Deploy

### Backend (Cloud Platform)
1. Set up a cloud server (e.g., AWS, GCP)
2. Install dependencies
3. Configure environment variables
4. Set up Redis server
5. Use PM2 or similar for process management

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.