# Zonomo - Project Flow Diagrams

## Project Structure Flow

```mermaid
graph TD
    A[src/] --> B[app/]
    A --> C[components/]
    A --> D[collections/]
    A --> E[trpc/]
    A --> F[lib/]
    A --> G[hooks/]
    A --> H[config/]

    B --> B1[layout.tsx]
    B --> B2[page.tsx]
    B --> B3[(auth)/]
    B --> B4[(dashboard)/]
    B --> B5[(shop)/]

    C --> C1[ui/]
    C --> C2[forms/]
    C --> C3[layout/]
    C --> C4[product/]
    C --> C5[cart/]

    D --> D1[Users.ts]
    D --> D2[Products.ts]
    D --> D3[Orders.ts]
    D --> D4[Media.ts]
    D --> D5[ProductFiles.ts]

    E --> E1[index.ts]
    E --> E2[auth.ts]
    E --> E3[products.ts]
    E --> E4[orders.ts]
    E --> E5[context.ts]
```

## Data Flow Diagram

```mermaid
sequenceDiagram
    participant Client
    participant tRPC
    participant Payload
    participant MongoDB
    participant Stripe

    Client->>tRPC: API Request
    tRPC->>Payload: Process Request
    Payload->>MongoDB: Database Operation
    MongoDB-->>Payload: Return Data
    Payload-->>tRPC: Process Response
    tRPC-->>Client: Return Result

    Note over Client,Stripe: Payment Flow
    Client->>Stripe: Payment Request
    Stripe-->>Client: Payment Confirmation
    Client->>tRPC: Update Order
    tRPC->>Payload: Create Order
    Payload->>MongoDB: Store Order
```

## Authentication Flow

```mermaid
graph LR
    A[User] -->|Login/Register| B[Auth API]
    B -->|Validate| C[Payload CMS]
    C -->|Create/Verify| D[MongoDB]
    D -->|Return| C
    C -->|Generate| E[JWT Token]
    E -->|Store| F[Client]
    F -->|Use| G[Protected Routes]
```

## State Management Flow

```mermaid
graph TD
    A[Client State] -->|Zustand| B[Cart]
    A -->|Zustand| C[UI State]
    A -->|React Query| D[Server State]
    D -->|Fetch| E[Products]
    D -->|Fetch| F[Orders]
    D -->|Fetch| G[User Data]
    B -->|Update| H[Local Storage]
    C -->|Update| I[Session Storage]
```

## Component Hierarchy

```mermaid
graph TD
    A[Root Layout] --> B[Header]
    A --> C[Main Content]
    A --> D[Footer]
    
    B --> B1[Navigation]
    B --> B2[User Menu]
    
    C --> C1[Product List]
    C --> C2[Product Detail]
    C --> C3[Cart]
    
    C1 --> C1a[Product Card]
    C2 --> C2a[Product Info]
    C2 --> C2b[Add to Cart]
    C3 --> C3a[Cart Items]
    C3 --> C3b[Checkout]
```

## API Request Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant M as Middleware
    participant T as tRPC
    participant P as Payload
    participant DB as MongoDB

    C->>M: HTTP Request
    M->>M: Auth Check
    M->>T: Route Request
    T->>T: Validate Input
    T->>P: Process Request
    P->>DB: Database Operation
    DB-->>P: Return Data
    P-->>T: Process Response
    T-->>M: Return Result
    M-->>C: HTTP Response
```

## Error Handling Flow

```mermaid
graph TD
    A[Request] -->|Error| B[Error Boundary]
    B -->|API Error| C[API Error Handler]
    B -->|UI Error| D[UI Error Handler]
    B -->|Auth Error| E[Auth Error Handler]
    
    C -->|Log| F[Error Logger]
    D -->|Show| G[Error UI]
    E -->|Redirect| H[Login Page]
    
    F -->|Store| I[Error Database]
    G -->|Display| J[User Interface]
    H -->|Return| A
```

## Build Process Flow

```mermaid
graph TD
    A[Source Code] -->|TypeScript| B[Compilation]
    B -->|Payload| C[CMS Build]
    B -->|Next.js| D[App Build]
    C -->|Combine| E[Final Build]
    D -->|Combine| E
    E -->|Optimize| F[Production Build]
    F -->|Deploy| G[Server]
```

## Testing Flow

```mermaid
graph TD
    A[Test Suite] -->|Unit| B[Component Tests]
    A -->|Unit| C[Utility Tests]
    A -->|Integration| D[API Tests]
    A -->|E2E| E[User Flow Tests]
    
    B -->|Jest| F[Test Runner]
    C -->|Jest| F
    D -->|Jest| F
    E -->|Cypress| G[E2E Runner]
    
    F -->|Report| H[Test Results]
    G -->|Report| H
```

These diagrams provide a visual representation of how different parts of the application interact with each other. They help in understanding:

1. The overall project structure
2. How data flows through the application
3. The authentication process
4. State management patterns
5. Component relationships
6. API request handling
7. Error handling flow
8. Build process
9. Testing strategy

For more detailed information about each component, please refer to the README-CODEBASE.md file. 