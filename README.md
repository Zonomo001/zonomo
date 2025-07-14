# Zonomo

Zonomo is a modern e-commerce platform built with Next.js, PayloadCMS, and TypeScript. This project provides a robust foundation for building scalable e-commerce applications with a focus on developer experience and performance.

## 🚀 Features

- Next.js 14 for server-side rendering and optimal performance
- PayloadCMS for content management
- TypeScript for type safety
- TailwindCSS for styling
- tRPC for type-safe API calls
- React Query for data fetching
- Stripe integration for payments
- Email functionality with Resend
- Drag and drop functionality with dnd-kit
- Modern UI components with Radix UI
- Form handling with React Hook Form and Zod validation

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- Yarn package manager
- MongoDB (local or remote instance)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd zonomo
```

2. Install dependencies:
```bash
yarn install
```

3. Create a `.env` file in the root directory with the following variables:
```env
MONGODB_URI=your_mongodb_connection_string
PAYLOAD_SECRET=your_payload_secret
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
RESEND_API_KEY=your_resend_api_key
```

4. Start the development server:
```bash
yarn dev
```

The application will be available at `http://localhost:3000`

## 🏗️ Project Structure

```
zonomo/
├── src/                           # Source code
│   ├── app/                      # Next.js app directory (pages and layouts)
│   │   ├── (auth)/              # Authentication related pages
│   │   ├── api/                 # API routes
│   │   ├── booking/            # Booking related pages
│   │   ├── cart/               # Shopping cart pages
│   │   ├── products/           # Products listing pages
│   │   ├── product/            # Individual product pages
│   │   ├── services/           # Services listing pages
│   │   ├── service/            # Individual service pages
│   │   ├── thank-you/          # Order confirmation page
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout component
│   │   └── page.tsx            # Home page
│   │
│   ├── components/              # Reusable React components
│   │   ├── ui/                 # Basic UI components
│   │   ├── forms/              # Form-related components
│   │   └── [feature]/          # Feature-specific components
│   │
│   ├── collections/            # PayloadCMS collections
│   │   ├── Media/             # Media collection
│   │   ├── Products/          # Products collection
│   │   ├── Services/          # Services collection
│   │   └── Users/             # Users collection
│   │
│   ├── trpc/                   # tRPC API routes and procedures
│   │   ├── router/            # API route definitions
│   │   └── procedures/        # API procedures
│   │
│   ├── lib/                    # Utility functions and shared logic
│   ├── hooks/                  # Custom React hooks
│   ├── config/                 # Configuration files
│   ├── media/                  # Media storage
│   ├── product_files/          # Product-related files
│   ├── service_files/          # Service-related files
│   │
│   ├── server.ts              # Express server setup
│   ├── payload.config.ts      # PayloadCMS configuration
│   ├── payload-types.ts       # Generated PayloadCMS types
│   ├── webhooks.ts            # Webhook handlers
│   ├── middleware.ts          # Next.js middleware
│   ├── get-payload.ts         # PayloadCMS initialization
│   └── next-utils.ts          # Next.js utility functions
│
├── public/                     # Static assets
│   ├── images/                # Image assets
│   └── fonts/                 # Font files
│
├── dist/                       # Build output
├── build/                      # Build artifacts
├── .next/                      # Next.js build cache
│
├── package.json               # Project dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── next.config.js            # Next.js configuration
└── vercel.json               # Vercel deployment configuration
```

### Key Directories Explained

#### `src/app/`
This is where all your pages and routes live. The directory structure directly maps to your URL structure:
- `(auth)/` - Authentication-related pages (login, register, etc.)
- `products/` - Product listing pages
- `product/` - Individual product pages
- `services/` - Service listing pages
- `service/` - Individual service pages
- `cart/` - Shopping cart functionality
- `booking/` - Booking system pages
- `api/` - API routes for your application

#### `src/components/`
Reusable React components organized by feature and type:
- `ui/` - Basic UI components (buttons, inputs, etc.)
- `forms/` - Form-related components
- Feature-specific components are organized in their own directories

#### `src/collections/`
PayloadCMS collections that define your data structure:
- `Media/` - Handles file uploads and media management
- `Products/` - Product data structure and validation
- `Services/` - Service data structure and validation
- `Users/` - User management and authentication

#### `src/trpc/`
Type-safe API routes and procedures:
- `router/` - API route definitions
- `procedures/` - Individual API procedures

#### `src/lib/`
Shared utility functions and business logic that can be used across the application.

#### `src/hooks/`
Custom React hooks for shared functionality across components.

### Where to Start

1. **For Frontend Development:**
   - Start in `src/app/` for page-level components
   - Use `src/components/` for reusable UI elements
   - Check `src/hooks/` for shared functionality

2. **For Backend Development:**
   - Work in `src/collections/` for data structure
   - Use `src/trpc/` for API endpoints
   - Check `src/lib/` for shared utilities

3. **For Styling:**
   - Global styles are in `src/app/globals.css`
   - Component-specific styles use Tailwind CSS
   - Configuration in `tailwind.config.ts`

4. **For Configuration:**
   - `src/payload.config.ts` for PayloadCMS setup
   - `next.config.js` for Next.js configuration
   - `tsconfig.json` for TypeScript settings

## 📝 Available Scripts

- `yarn dev`
