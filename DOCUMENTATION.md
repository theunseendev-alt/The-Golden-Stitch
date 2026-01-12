# The Golden Stitch - Technical Documentation

## Overview

The Golden Stitch is a production-ready full-stack fashion marketplace connecting customers with fashion designers and seamstresses. This document outlines the complete technical architecture.

## Recent Updates (January 2026)

### Latest Changes Implemented:

- ✅ **Custom Timeline Setting**: Seamstresses can now set custom timelines when pricing designs (e.g., "3-5 days", "1 week"), overriding the default difficulty-based estimates
- ✅ **Enhanced User Navigation**: User button now displays actual user names instead of generic role-based text
- ✅ **Streamlined Navigation**: Removed "Browse Designs" links from user role navigation menus
- ✅ **Cleaned UI**: Removed Settings buttons from main content areas (SeamstressDashboard, DesignerDashboard)
- ✅ **Improved User Experience**: All user roles now show their actual account names for better identification

## Architecture Summary

### Tech Stack

| Layer              | Technology                                    |
| ------------------ | --------------------------------------------- |
| **Frontend**       | React 18 + TypeScript + Vite + TailwindCSS 3  |
| **Backend**        | Express.js 5 + TypeScript                     |
| **Database**       | Prisma ORM + SQLite (dev) / PostgreSQL (prod) |
| **Authentication** | JWT (Access + Refresh Tokens) + bcrypt        |
| **Real-time**      | Socket.IO for WebSocket notifications         |
| **Logging**        | Winston with file and console transports      |
| **UI Components**  | Radix UI + Lucide React icons                 |

---

## Project Structure

```
├── client/                    # React SPA Frontend
│   ├── components/           # UI components
│   │   ├── ui/              # Radix UI components
│   │   ├── Layout.tsx       # Main layout with navigation
│   │   ├── NotificationPanel.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── NoteContextMenu.tsx
│   │   ├── RoleBasedContextMenu.tsx
│   │   ├── NotesPanel.tsx
│   │   └── OrderModal.tsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useNotifications.tsx
│   │   ├── useNotes.tsx
│   │   └── use-mobile.tsx
│   ├── lib/                 # Utilities
│   │   ├── api.ts          # API client with JWT auth
│   │   ├── orders.ts       # Order management
│   │   ├── utils.ts        # Utility functions
│   │   └── elementAnalysis.ts # Element analysis utilities
│   ├── pages/              # Route components
│   │   ├── Index.tsx       # Home page
│   │   ├── Browse.tsx      # Design catalog
│   │   ├── Login.tsx       # Authentication
│   │   ├── Signup.tsx      # Registration
│   │   ├── ChooseRole.tsx  # Role selection
│   │   ├── CustomerDashboard.tsx
│   │   ├── DesignerDashboard.tsx
│   │   ├── DesignerEarnings.tsx
│   │   ├── DesignerUpload.tsx
│   │   ├── SeamstressDashboard.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── AccountManagement.tsx
│   │   ├── BecomeCustomer.tsx
│   │   ├── BecomeDesigner.tsx
│   │   ├── BecomeSeamstress.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   ├── Browse.tsx
│   │   ├── Seamstresses.tsx
│   │   ├── SavedDesigns.tsx
│   │   ├── Test.tsx
│   │   └── NotFound.tsx
│   ├── App.tsx             # Main app with routing
│   └── global.css          # TailwindCSS styles
│
├── server/                   # Express API Backend
│   ├── index.ts            # Main server with all routes
│   ├── db.ts               # Prisma client singleton
│   ├── auth.ts             # JWT authentication middleware
│   ├── logger.ts           # Winston logger configuration
│   ├── node-build.ts       # Node.js build configuration
│   └── routes/             # Route handlers (modular)
│       └── demo.ts         # Demo route handler
│
├── prisma/                   # Database
│   ├── schema.prisma       # Database schema
│   ├── seed.ts             # Database seeding script
│   └── dev.db              # SQLite database (development)
│
├── shared/                   # Shared types
│   └── api.ts              # API interfaces
│
├── public/                   # Static assets
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
│
└── netlify/                  # Netlify configuration
    └── functions/
        └── api.ts          # Netlify serverless functions
```

---

## Database Schema

### Models

#### User

```prisma
model User {
  id           String    @id @default(uuid())
  email        String    @unique
  password     String    // bcrypt hashed
  name         String
  role         String    @default("CUSTOMER") // CUSTOMER, DESIGNER, SEAMSTRESS, ADMIN
  isAdmin      Boolean   @default(false)
  refreshToken String?   // JWT refresh token
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}
```

#### Design

```prisma
model Design {
  id          String   @id @default(uuid())
  name        String
  description String
  price       Float    // Designer royalty
  rating      Float
  reviews     Int
  image       String
  category    String
  tags        String   // JSON array
  isActive    Boolean
  designerId  String   // FK to User
}
```

#### Seamstress

```prisma
model Seamstress {
  id              String   @id @default(uuid())
  userId          String   @unique  // FK to User
  specialty       String   // JSON array
  rating          Float
  completedOrders Int
  location        String
  basePrice       Float
  estimatedDays   String
  isActive        Boolean
}
```

#### Order

```prisma
model Order {
  id               String   @id @default(uuid())
  customerId       String   // FK to User
  designId         String   // FK to Design
  seamstressId     String   // FK to Seamstress
  customerName     String
  customerEmail    String
  totalPrice       Float    // Calculated server-side
  designerRoyalty  Float
  seamstressEarning Float
  status           String   // PLACED, CONFIRMED, APPROVED, PAID, IN_PROGRESS, COMPLETED, REJECTED, CANCELLED
  paymentStatus    String   // PENDING, PAID, REFUNDED
  progress         Int      // 0-100
  rushOrder        Boolean
  timeline         String   // JSON array of status changes
  shippingAddress  String?  // JSON object
}
```

---

## API Endpoints

### Authentication

| Method | Endpoint             | Description              | Auth Required |
| ------ | -------------------- | ------------------------ | ------------- |
| POST   | `/api/auth/register` | Register new user        | No            |
| POST   | `/api/auth/login`    | Login, get JWT tokens    | No            |
| POST   | `/api/auth/refresh`  | Refresh access token     | No            |
| POST   | `/api/auth/logout`   | Invalidate refresh token | Yes           |
| GET    | `/api/auth/me`       | Get current user         | Yes           |

### Designs

| Method | Endpoint                        | Description        | Auth Required |
| ------ | ------------------------------- | ------------------ | ------------- |
| GET    | `/api/designs`                  | List all designs   | No            |
| GET    | `/api/designs/:id`              | Get design by ID   | No            |
| GET    | `/api/designs?search=term`      | Search designs     | No            |
| GET    | `/api/designs?category=Evening` | Filter by category | No            |

### Seamstresses

| Method | Endpoint                          | Description           | Auth Required |
| ------ | --------------------------------- | --------------------- | ------------- |
| GET    | `/api/seamstresses`               | List all seamstresses | No            |
| GET    | `/api/seamstresses/:id`           | Get seamstress by ID  | No            |
| GET    | `/api/seamstresses?designId=uuid` | Filter by design      | No            |

### Orders

| Method | Endpoint              | Description         | Auth Required | Role             |
| ------ | --------------------- | ------------------- | ------------- | ---------------- |
| GET    | `/api/orders`         | List user's orders  | Yes           | All              |
| POST   | `/api/orders`         | Create new order    | Yes           | Customer         |
| PUT    | `/api/orders/:id`     | Update order status | Yes           | Seamstress/Admin |
| POST   | `/api/orders/:id/pay` | Process payment     | Yes           | Customer         |

### Admin Routes

| Method | Endpoint              | Description            | Auth Required | Role  |
| ------ | --------------------- | ---------------------- | ------------- | ----- |
| GET    | `/api/users`          | List all users         | Yes           | Admin |
| PUT    | `/api/users/:id/role` | Update user role       | Yes           | Admin |
| GET    | `/api/analytics`      | Get platform analytics | Yes           | Admin |

---

## Authentication Flow

### JWT Token Flow

```
1. User logs in → Server returns accessToken (15min) + refreshToken (7 days)
2. Client stores tokens in localStorage
3. Client sends accessToken in Authorization header: "Bearer <token>"
4. When accessToken expires (401), client uses refreshToken to get new tokens
5. If refreshToken is invalid, user is logged out
```

### Token Storage

- `accessToken`: Short-lived (15 minutes), sent with every API request
- `refreshToken`: Long-lived (7 days), stored in database, used to get new accessToken
- Tokens stored in localStorage on client

---

## Right-Click Context Menus

The application features two sophisticated right-click context menu systems:

1. **NoteContextMenu** - Universal context menu with note-taking capabilities
2. **RoleBasedContextMenu** - Role-specific context menu with different options

See `right-click-functions-explanation.md` for detailed documentation.

---

## Seamstress Custom Timeline Feature

Seamstresses can now set custom timelines when pricing designs, providing flexibility beyond the default difficulty-based estimates. This feature allows:

- **Custom Timeline Input**: Seamstresses can enter specific timelines like "3-5 days", "1 week", or "10 days"
- **Override Default Estimates**: The system still shows difficulty-based timeline suggestions, but seamstresses can provide their own realistic estimates
- **Data Persistence**: Custom timelines are stored with pricing data for order reference
- **Optional Field**: Timeline setting is optional, maintaining backward compatibility

---

## Role-Based Access Control (RBAC)

### Roles

| Role       | Description      | Permissions                                   |
| ---------- | ---------------- | --------------------------------------------- |
| CUSTOMER   | End user         | Browse, order, pay, track orders              |
| DESIGNER   | Fashion designer | Create designs, view earnings, upload designs |
| SEAMSTRESS | Makes garments   | Accept/reject orders, update progress, set custom timelines |
| ADMIN      | Platform admin   | Full access, user management                  |

---

## Environment Configuration

### .env File

```env
# Database
DATABASE_URL="file:./dev.db"  # SQLite for development

# JWT Secrets (CHANGE IN PRODUCTION!)
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Server
PORT=8080
NODE_ENV=development

# WebSocket
WS_ENABLED=true
```

---

## Development Commands

```bash
# Start development server (frontend + backend)
pnpm dev

# Database commands
pnpm db:generate     # Generate Prisma client
pnpm db:push         # Push schema to database
pnpm db:seed         # Seed database with test data
pnpm db:reset        # Reset and reseed database

# Build for production
pnpm build

# Start production server
pnpm start

# Type checking
pnpm typecheck

# Run tests
pnpm test
```

---

## Security Measures

1. **Authentication**: JWT with refresh tokens
2. **Password**: bcrypt hashing (10 rounds)
3. **CORS**: Configured for specific origins
4. **RBAC**: Server-side role enforcement on all routes
5. **Price Validation**: All pricing calculated server-side
6. **UUID IDs**: Prevents enumeration attacks

---

## Deployment

The application supports multiple deployment options:

- **Standard**: `pnpm build` and deploy static files
- **Netlify**: Using netlify.toml configuration
- **Self-contained**: Binary executables (Linux, macOS, Windows)

---

## Recent UI/UX Improvements

### Enhanced User Experience

- **Personalized User Display**: User buttons now show actual account names instead of generic role text
- **Streamlined Navigation**: Removed redundant "Browse Designs" links from authenticated user navigation
- **Cleaner Interface**: Eliminated unnecessary Settings buttons from main content areas
- **Better Role Clarity**: Clear indication of user role alongside user name

### Navigation Updates

- **Role-Based Navigation**: Each user type has tailored navigation options
- **User Name Display**: Prominent display of logged-in user's actual name
- **Dashboard Access**: One-click access to appropriate user dashboards
- **Mobile Responsive**: All improvements work across all device sizes

---

## Future Improvements

1. **Input Validation**: Add Zod schemas for all endpoints
2. **Rate Limiting**: Implement to prevent abuse
3. **File Uploads**: Add design image upload capability
4. **Payment Integration**: Stripe/PayPal integration
5. **Email Notifications**: Transactional emails for order updates
6. **Search**: Full-text search with Elasticsearch
7. **Caching**: Redis for frequently accessed data
8. **CI/CD**: Automated testing and deployment pipeline
