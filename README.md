# SmartBuy

A full-stack multi-vendor e-commerce marketplace built with Next.js, TypeScript, PostgreSQL, Prisma, and Stripe.

SmartBuy was developed as a full-stack web application with a focus on scalable architecture, secure authentication, role-based access control, inventory management, multi-seller orders, and online payments.

## Features

### Authentication & Authorization
- User registration and login
- Email verification
- Password reset flow
- JWT-based sessions
- Role-based access control
- Customer and administrator roles
- Protected routes and server-side authorization

### E-commerce
- Product catalog
- Product search
- Category filtering
- Sorting
- Product detail pages
- Shopping cart
- Stock validation
- Inventory management
- Wishlist
- Product reviews for verified buyers

### Multi-Vendor Marketplace
- Multiple independent sellers
- Seller-owned stores
- Store approval workflow
- Products associated with individual stores
- Orders separated by seller
- Seller-specific order management

### Checkout & Payments
- Stripe Checkout integration
- Payment status tracking
- Secure Stripe webhook handling
- Server-side inventory revalidation
- Inventory deduction after successful payment
- Order creation through webhook processing

### Administration
- Product management
- Store management
- Order management
- User role management
- Order status management

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

### Backend
- Next.js App Router
- Route Handlers
- Server-side application logic
- REST-style API endpoints
- NextAuth

### Database
- PostgreSQL
- Prisma ORM

### Payments
- Stripe

### Development & Deployment
- Git / GitHub
- Vercel
- npm

## Architecture

SmartBuy uses the Next.js App Router and separates application responsibilities across UI components, server-side logic, API routes, authentication, and database access.

The application follows a server-first approach where sensitive operations such as authentication, database access, payment processing, and inventory updates are handled on the server.

The multi-vendor architecture allows products and orders to be associated with individual stores while maintaining centralized marketplace administration.

## Authentication & Security

Security-sensitive configuration is handled through environment variables rather than hardcoded credentials.

Examples include:

- Database connection strings
- Authentication secrets
- Stripe secret keys
- Stripe webhook secrets

Sensitive environment files are excluded from version control.

Stripe webhook requests are verified before payment-related operations are processed, and inventory is revalidated server-side before orders are finalized.

## Database

The application uses PostgreSQL with Prisma ORM.

The database models cover core marketplace functionality including:

- Users
- Stores
- Products
- Orders
- Order items
- Reviews
- Wishlist items
- Authentication and verification data

Prisma migrations are used to manage database schema changes throughout development.

## Payments Flow

The Stripe payment flow is handled server-side:

1. The customer proceeds to checkout.
2. A Stripe Checkout Session is created.
3. The customer completes the payment through Stripe.
4. Stripe sends a webhook event to the application.
5. The webhook is verified.
6. Inventory is revalidated.
7. Stock is decreased.
8. Orders are created for the corresponding sellers.
9. Payment status is recorded.

This approach avoids relying solely on client-side payment confirmation for order creation.

## Getting Started

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- PostgreSQL

### Installation

Clone the repository:

```bash
git clone <YOUR_REPOSITORY_URL>
cd smartbuy