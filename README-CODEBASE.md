# Zonomo - Codebase Structure

## Project Overview
Zonomo is a full-stack e-commerce marketplace built with modern technologies. This document explains the structure and purpose of each file and directory in the project.

## Directory Structure

### `/src/app`
The Next.js 14 app router directory containing all pages and routes.

#### Key Files:
- `layout.tsx`: Root layout component
- `page.tsx`: Home page component
- `(auth)/*`: Authentication-related pages
- `(dashboard)/*`: Dashboard pages
- `(shop)/*`: Shop-related pages

### `/src/components`
Reusable UI components built with shadcn/ui and Tailwind CSS.

#### Key Components:
- `ui/`: Base UI components
- `forms/`: Form-related components
- `layout/`: Layout components
- `product/`: Product-related components
- `cart/`: Shopping cart components

### `/src/collections`
Payload CMS collections defining the data structure.

#### Key Collections:
- `Users.ts`: User collection with roles and permissions
- `Products.ts`: Product collection with fields and relationships
- `Orders.ts`: Order collection for tracking purchases
- `Media.ts`: Media collection for handling files
- `ProductFiles.ts`: Digital product files collection

### `/src/trpc`
tRPC router and procedure definitions.

#### Key Files:
- `index.ts`: Main router setup
- `auth.ts`: Authentication procedures
- `products.ts`: Product-related procedures
- `orders.ts`: Order-related procedures
- `context.ts`: tRPC context creation

### `/src/lib`
Utility functions and shared code.

#### Key Files:
- `utils.ts`: General utility functions
- `validations.ts`: Zod validation schemas
- `constants.ts`: Application constants
- `api.ts`: API utility functions

### `/src/hooks`
Custom React hooks.

#### Key Hooks:
- `use-cart.ts`: Shopping cart management
- `use-auth.ts`: Authentication state
- `use-products.ts`: Product data fetching
- `use-orders.ts`: Order management

### `/src/config`
Configuration files.

#### Key Files:
- `site.ts`: Site configuration
- `email.ts`: Email templates
- `stripe.ts`: Stripe configuration

## Core Files

### `payload.config.ts`
```typescript
// Payload CMS configuration
export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
  collections: [Users, Products, Media, ProductFiles, Orders],
  // ... other config
})
```

### `server.ts`
```typescript
// Express server setup with Next.js and Payload
const app = express()
const payload = await getPayload()
// ... server configuration
```

### `middleware.ts`
```typescript
// Next.js middleware for authentication and routing
export default middleware((req) => {
  // ... middleware logic
})
```

## Data Flow

### Product Creation Flow
1. User submits product form
2. Form data validated with Zod
3. tRPC procedure processes request
4. Payload CMS creates product
5. MongoDB stores product data
6. Response sent to client

### Purchase Flow
1. User adds product to cart
2. Cart state managed by Zustand
3. Checkout process initiated
4. Stripe payment processed
5. Order created in Payload CMS
6. Digital product delivered

## Authentication System

### User Roles
- Admin: Full access
- Seller: Can create and manage products
- Customer: Can purchase products

### Authentication Flow
1. User login/register
2. JWT token generated
3. Token stored in cookies
4. Protected routes check token
5. Role-based access control

## State Management

### Server State (React Query)
- Product data
- User data
- Order history
- Cart items

### Client State (Zustand)
- Shopping cart
- UI preferences
- Form state
- Authentication state

## API Structure

### tRPC Procedures
- `auth.*`: Authentication procedures
- `products.*`: Product management
- `orders.*`: Order processing
- `users.*`: User management

### Webhooks
- Stripe payment webhooks
- Email notifications
- Order status updates

## Error Handling

### Global Error Handling
- API error boundaries
- Form validation errors
- Payment processing errors
- Authentication errors

### Error Types
- ValidationError
- AuthenticationError
- PaymentError
- DatabaseError

## Testing Strategy

### Unit Tests
- Component testing
- Utility function testing
- State management testing

### Integration Tests
- API endpoint testing
- Authentication flow testing
- Payment processing testing

### E2E Tests
- User journey testing
- Checkout process testing
- Admin dashboard testing

## Deployment

### Environment Variables
- `NEXT_PUBLIC_SERVER_URL`
- `MONGODB_URL`
- `STRIPE_SECRET_KEY`
- `PAYLOAD_SECRET`

### Build Process
1. TypeScript compilation
2. Payload CMS build
3. Next.js build
4. Static file optimization

## Performance Optimization

### Client-side
- Code splitting
- Image optimization
- Component lazy loading
- State management optimization

### Server-side
- Database indexing
- API caching
- Rate limiting
- Request batching

## Security Measures

### Authentication
- JWT token validation
- Password hashing
- Session management
- CSRF protection

### Data Protection
- Input sanitization
- XSS prevention
- SQL injection prevention
- File upload validation

## Monitoring and Logging

### Error Tracking
- Error boundaries
- API error logging
- Client-side error tracking
- Performance monitoring

### Analytics
- User behavior tracking
- Performance metrics
- Error rates
- API usage statistics

### `Products.ts` (Previously for Digital Products, now for Services)

**File Address:** `src/collections/Products/Products.ts`

This file defines the schema for what was previously 'digital products' and is now adapted to represent 'house services'. We have updated its fields to include service-specific attributes such as:
- **Service Name** (replaces Product Name)
- **Service Details** (more descriptive for services)
- **Price per hour (USD)**
- **Service Category** (now includes categories like Cleaning, Plumbing, etc., as defined in `src/config/index.ts`)
- **Service Type** (e.g., 'One-time Service', 'Recurring Service')
- **Service Duration (hours)**
- **Service Availability** (an array of days with associated time slots for providers to specify when they are available).

**Use of the page (in Payload Admin):**
When a user with the 'Service Provider' role (or an 'Admin') goes to the 'Products' section in the Payload CMS admin panel, this collection's definition dictates the form fields they see. They use this page to create, edit, and manage their service listings, setting prices, categories, descriptions, images, and crucially, their availability schedule for clients to book. The backend logic (hooks) associated with this collection also handles the integration with Stripe for pricing and linking services to users. 