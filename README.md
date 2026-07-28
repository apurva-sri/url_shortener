# LinkPilot - Modern URL Shortening & Analytics SaaS Platform

LinkPilot is a full-stack, enterprise-grade URL shortener and link management platform built with modern web technologies. It provides custom short aliases, real-time click analytics, custom branded QR code generation, link password protection, subscription billing via Razorpay, and robust tier-based access control.

Live Application: [https://linkpilot-kappa.vercel.app/](https://linkpilot-kappa.vercel.app/)  
API Endpoint: [https://linkpilot-api.onrender.com/](https://linkpilot-api.onrender.com/)

---

## Key Features

- **Custom Short URL Generation**: Shorten long URLs with automated NanoID generation or custom aliases.
- **Custom Branded QR Codes**: Dynamic QR code rendering with color customization, center logo overlay, and instant PNG/SVG downloads.
- **Real-Time Click Analytics**: Visual charts tracking total clicks, unique visitors, browser distribution, device breakdown, and geographic traffic.
- **Link Password Protection**: Secure sensitive short links with bcrypt-hashed passwords.
- **Subscription Tier System**: Integrated Razorpay payment workflow for plan upgrades (Free, Starter, Pro) with automated cryptographic HMAC signature verification and PDF invoice generation.
- **User Authentication**: Secure JWT-based authentication with OTP email verification via Brevo API.
- **Database & Caching**: PostgreSQL database managed via Prisma ORM combined with Upstash Redis for high-performance caching.
- **Responsive Dashboard**: Fully responsive dark/light mode interface optimized for desktop, tablet, and mobile devices.

---

## Subscription Tiers & Feature Matrix

| Feature | Free Plan ($0/mo) | Starter Plan ($1/mo) | Pro Plan ($19/mo) |
| :--- | :---: | :---: | :---: |
| Active Links Capacity | 2 Links Max | 10 Links Max | Unlimited |
| Custom Aliases & Tags | Restricted | Enabled | Enabled |
| Password Protection | Restricted | Restricted | Enabled |
| Branded QR Generation | Standard | Custom Colors & Logo | Custom Colors & Logo |
| Analytics Depth | Basic Logs | Full Analytics | Full Analytics |
| Downloadable PDF Invoices | Included | Included | Included |

---

## Technology Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: TailwindCSS with CSS Variables for Dark/Light Mode
- **State Management & Data Fetching**: TanStack Query (React Query v5) & React Context API
- **Routing**: React Router DOM v6
- **Charts & Icons**: Recharts & Lucide React
- **Hosting**: Vercel

### Backend
- **Runtime**: Node.js v20+ with Express.js
- **Database**: PostgreSQL (hosted on Neon) managed with Prisma ORM v6
- **Caching**: Upstash Redis for high-speed link redirection and QR caching
- **Authentication**: JSON Web Tokens (JWT) & Bcrypt password hashing
- **Email Service**: Brevo REST API v3
- **Media Storage**: Cloudinary API for avatar and QR asset storage
- **Payments**: Razorpay Node.js SDK with HMAC-SHA256 signature verification
- **Hosting**: Render

---

## Repository Architecture

```
URL_SHORTENER/
├── docker-compose.yml              # Root Docker Compose orchestration
├── README.md                       # Comprehensive project documentation
├── linkpilot-frontend/            # React SPA Frontend
│   ├── Dockerfile                  # Multi-stage Nginx build Dockerfile
│   ├── public/                     # Static assets and brand mark logos
│   ├── src/
│   │   ├── api/                    # Axios API request clients
│   │   ├── components/             # Reusable UI components and layouts
│   │   ├── pages/                  # Route views (Landing, Dashboard, Links, QR, Analytics, Settings)
│   │   ├── store/                  # AuthContext global state
│   │   └── styles/                 # TailwindCSS and global variables
│   └── vercel.json                 # SPA rewrite configuration
└── url-shortener/                  # Express Backend API
    ├── Dockerfile                  # Node.js production container image
    ├── docker-compose.yml          # Backend local stack (API, PostgreSQL, Redis)
    ├── prisma/                     # Database schema definition and migration history
    └── src/
        ├── config/                 # Database, Redis, and Envalid environment configuration
        ├── controllers/            # Request handlers (Auth, Link, Analytics, Payments)
        ├── middlewares/            # Auth protection, validation, and error middleware
        ├── routes/                 # Express route definitions
        ├── services/               # Core business logic services
        └── utils/                  # Cryptography, JWT, storage, and helper utilities
```

---

## Environment Variables Reference

### Backend (`url-shortener/.env`)

```env
PORT=5000
NODE_ENV=development

# Database & Caching
DATABASE_URL="postgresql://user:password@host/neondb?sslmode=require"
REDIS_URL="rediss://default:password@host:6379"

# Authentication & Base URL
JWT_SECRET="your_jwt_secret_key"
JWT_EXPIRES_IN="7d"
BASE_URL="https://linkpilot-api.onrender.com"

# Email Configuration (Brevo)
BREVO_API_KEY="your_brevo_api_key"
SENDER_EMAIL="notify.ap.sri@gmail.com"
SENDER_NAME="LinkPilot"

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Razorpay Payments
RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="your_razorpay_secret"
```

### Frontend (`linkpilot-frontend/.env`)

```env
VITE_API_BASE_URL="https://linkpilot-api.onrender.com/api"
```

---

## Setup & Local Development

### Prerequisites
- Node.js (v18.x or v20.x)
- npm or yarn
- Docker & Docker Compose (optional for containerized setup)

### Local Manual Installation

1. **Clone Repository**:
   ```bash
   git clone https://github.com/apurva-sri/url_shortener.git
   cd url_shortener
   ```

2. **Backend Setup**:
   ```bash
   cd url-shortener
   npm install
   npx prisma migrate dev
   npm run dev
   ```
   The backend API server will run at `http://localhost:5000`.

3. **Frontend Setup**:
   ```bash
   cd ../linkpilot-frontend
   npm install
   npm run dev
   ```
   The frontend application will run at `http://localhost:5173`.

---

## Docker & Containerized Deployment

To run the complete application stack (Frontend, Backend API, PostgreSQL database, and Redis cache) using Docker:

### Using Root Docker Compose

From the project root directory, run:

```bash
docker-compose up --build -d
```

This will spin up four synchronized services:
- **Frontend App**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000`
- **PostgreSQL Database**: `localhost:5432`
- **Redis Cache**: `localhost:6380`

To stop all running services:
```bash
docker-compose down
```

---

## Core API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user account and trigger verification OTP.
- `POST /api/auth/verify-email` - Verify user email with 6-digit OTP.
- `POST /api/auth/login` - Authenticate user and receive JWT session token.
- `GET /api/auth/me` - Fetch authenticated user profile and subscription status.
- `PUT /api/auth/profile` - Update user profile attributes (name, username, avatar).

### Short URLs & QR Codes
- `POST /api/url/shorten` - Shorten a URL (enforces link count and alias tier rules).
- `GET /api/url/my-urls` - List authenticated user's short links with pagination and search.
- `GET /:shortCode` - Redirect short link to destination URL (with click logging).
- `PATCH /api/url/:id/password` - Enable password protection on a short link (Pro plan).
- `POST /api/url/verify-password` - Verify password for protected link redirection.
- `GET /api/url/:id/qr` - Retrieve customized QR code data for link.

### Analytics
- `GET /api/analytics/:urlId` - Retrieve click history, visitor logs, device, browser, and location statistics.

### Payments & Invoices
- `POST /api/payments/create-order` - Generate Razorpay order for Starter or Pro subscription.
- `POST /api/payments/verify` - Verify cryptographic payment signature and upgrade account tier.
- `GET /api/payments/invoices` - Retrieve user invoice billing history.

---

## License

Distributed under the ISC License. Created and maintained by Apurva Srivastava.
