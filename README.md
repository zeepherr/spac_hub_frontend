<div align="center">

# SpecHub

### A second-hand IT hardware marketplace with protected checkout, inspection, escrow-style payment flow, and real-time support.

[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?logo=react&logoColor=white)](https://github.com/zeepherr/spac_hub_frontend)
[![Backend](https://img.shields.io/badge/Backend-Express%205-000000?logo=express&logoColor=white)](https://github.com/zeepherr/spec_hub_backend)
[![Database](https://img.shields.io/badge/Database-PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![ORM](https://img.shields.io/badge/ORM-Prisma-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Payments](https://img.shields.io/badge/Payments-Stripe-635BFF?logo=stripe&logoColor=white)](https://stripe.com/)
[![Realtime](https://img.shields.io/badge/Realtime-Socket.IO-010101?logo=socketdotio&logoColor=white)](https://socket.io/)

</div>

---

## About SpecHub

**SpecHub** is a full-stack marketplace for buying and selling second-hand IT hardware and accessories.

Unlike a simple classified-listing application, SpecHub is designed around a controlled transaction workflow. A product is reserved atomically during checkout, payment is tracked through Stripe, the seller ships the product to an admin for inspection, and only verified products continue to the buyer.

The project also includes seller tools, admin operations, real-time support chat, product condition analysis, cart availability handling, and role-based access control.

---

## Core Features

### Buyer

- Browse active second-hand IT listings
- Search listings and browse by category
- View product details and estimated condition
- Add products to cart
- Keep unavailable products visible in the cart while preventing checkout
- Select individual cart items for checkout
- Request optional PC assembly when the required categories are present
- Receive server-calculated checkout pricing
- Checkout multiple listings in one checkout
- Pay through Stripe
- Track buying orders
- Confirm delivery
- Open support cases and chat with an admin in real time

### Seller

- Create and manage product listings
- Upload listing images
- Answer product condition questions
- Use AI-assisted product/condition analysis
- Publish listings
- View personal listings
- Track selling orders
- View seller-related reporting screens
- Open support cases for order issues

### Admin

- Manage categories and condition questions
- Receive seller shipments
- Inspect products
- Mark inspection outcomes
- Handle products requiring review
- Ship verified products to buyers
- Return rejected products to sellers
- Manage support cases
- Chat with buyers and sellers through separate support conversations
- Manage site/web assets
- Review order workflow information

---

## Transaction Flow

```text
ACTIVE LISTING
      |
      +--> Buy Now
      |
      +--> Cart --> Checkout
                      |
                      v
              Validate Listings
                      |
                      v
              Atomic Reservation
              ACTIVE -> RESERVED
                      |
                      v
              AWAITING_PAYMENT
                      |
                      v
                   Payment
                      |
                      v
                     PAID
                      |
                      v
             Seller Ships to Admin
                      |
                      v
              SELLER_SHIPPING
                      |
                      v
              Admin Receives Item
                      |
                      v
            INSPECTION_PENDING
                      |
                      v
                 INSPECTING
                 /        \
                /          \
             PASS          FAIL
              |              |
              v              v
           VERIFIED       REJECTED
              |              |
              v              +--> Refund flow
       Admin Ships Buyer     +--> Return to Seller
              |
              v
       SHIPPING_TO_BUYER
              |
              v
       Buyer Confirms Delivery
              |
              v
           COMPLETED
              |
              v
       Payment Released
       Listing -> SOLD
```

The reservation step is performed inside a database transaction to reduce race conditions when multiple buyers attempt to purchase the same listing.

---

## Cart Availability Behavior

SpecHub intentionally distinguishes between two situations:

```text
Current buyer checks out an item
    -> remove that item from the current buyer's cart

Another buyer reserves an item that is in my cart
    -> keep the cart item visible
    -> show its new unavailable/reserved state
    -> disable selection and checkout
```

This preserves useful cart history without allowing a user to purchase a listing that is no longer available.

---

## Support Chat Architecture

Support messaging uses both REST APIs and Socket.IO.

```text
REST API
  -> create support cases
  -> load case information
  -> load paginated message history

Socket.IO
  -> join an authorized support room
  -> receive new messages in real time
  -> update the UI immediately

PostgreSQL
  -> source of truth for persisted messages
```

Buyer and seller support conversations are kept separate. An admin acts as the intermediary.

---

## Tech Stack

### Frontend

| Technology | Purpose |
| --- | --- |
| React 19 | UI |
| Vite 8 | Development/build tooling |
| React Router 8 | Routing |
| TanStack Query 5 | Server-state fetching, caching, mutations |
| Zustand 5 | Client/auth state |
| Axios | HTTP client |
| React Hook Form | Form state |
| Zod | Validation |
| Tailwind CSS 4 | Styling |
| DaisyUI | UI utilities/components |
| Base UI / shadcn | UI building blocks |
| Motion | Animation |
| Socket.IO Client | Real-time support messaging |
| Google OAuth | Google authentication |
| Sonner | Toast notifications |

### Backend

| Technology | Purpose |
| --- | --- |
| Node.js | Runtime |
| Express 5 | HTTP API |
| Prisma 7 | ORM |
| PostgreSQL / Neon | Database |
| Zod | Request validation |
| JWT | Access-token authentication |
| bcryptjs | Password hashing |
| Cookie Parser | Refresh-token cookie support |
| Socket.IO | Real-time support messaging |
| Stripe | Payments and refunds |
| Google Auth Library | Google authentication |
| Nodemailer | OTP email delivery |
| Cloudflare R2 via S3 SDK | Listing/web asset storage |
| Google GenAI | AI-assisted product analysis |
| express-rate-limit | API abuse protection |

---

## Project Architecture

### Frontend

```text
src/
├── api/             # Axios API functions
├── components/      # Reusable UI components
├── hook/            # Domain-specific TanStack Query/custom hooks
│   ├── cart/
│   ├── category/
│   ├── checkout/
│   ├── listing/
│   ├── order/
│   ├── payment/
│   ├── support/
│   └── user/
├── layouts/         # Public, auth, admin, profile layouts
├── lib/             # Query client, socket client, shared helpers
├── pages/           # Route-level screens
├── routes/          # Router and access guards
├── stores/          # Zustand stores
├── utils/           # Utility functions
└── validations/     # Frontend validation schemas
```

The frontend generally follows this data flow:

```text
Page / Component
      |
      v
Custom Hook
      |
      v
TanStack Query
      |
      v
API Module
      |
      v
Axios
      |
      v
Backend API
```

### Backend

```text
src/
├── configs/         # Environment and service configuration
├── controllers/     # HTTP/business-flow handling
├── jobs/            # Checkout expiration/background jobs
├── lib/             # Prisma and infrastructure helpers
├── middlewares/     # Authentication, authorization, errors, requests
├── providers/       # External service integrations
├── routes/          # Express route definitions
├── services/        # Database access and domain services
├── sockets/         # Socket.IO server and realtime events
├── utils/           # Shared utilities
└── validations/     # Zod request schemas
```

---

## API Areas

The backend currently exposes API areas for:

```text
/api/auth
/api/categories
/api/ai
/api/listings
/api/user
/api/cart
/api/checkouts
/api/orders
/api/admin/orders
/api/support-cases
/api/admin/support-cases
/api/web-assets
/api/admin/web-assets
/api/payments
/api/webhooks/stripe
```

---

## Authentication & Authorization

SpecHub uses:

- JWT access tokens
- Refresh-token cookies
- Protected frontend routes
- User/Admin role guards
- Protected backend routes
- Server-side authorization for privileged actions
- Protected Socket.IO connections for support chat

Frontend route protection should be treated as a UX layer only. The backend remains responsible for actual authorization.

---

## Getting Started

You need:

- Node.js
- npm
- PostgreSQL/Neon database access
- Stripe account for payment testing
- Google OAuth credentials
- Email credentials for OTP delivery
- Cloudflare R2 credentials for image storage
- Gemini/Google GenAI credentials for AI features

### 1. Clone the repositories

```bash
git clone https://github.com/zeepherr/spec_hub_backend.git
git clone https://github.com/zeepherr/spac_hub_frontend.git
```

You will have:

```text
spec_hub_backend/
spac_hub_frontend/
```

---

## Backend Setup

### 1. Enter the backend directory

```bash
cd spec_hub_backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env`

Create a `.env` file in the backend root:

```env
PORT=5000
NODE_ENV=development

DATABASE_URL=

JWT_SECRET=
OPT_SECRET=

MAIL_USER=
MAIL_APP_PASSWORD=

CLIENT_URL=http://localhost:5173

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=

STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

GEMINI_API_KEY=
GEMINI_MODEL=

CHECKOUT_RESERVATION_MINUTES=3
CHECKOUT_CLEANUP_INTERVAL_SECONDS=30
```

> Never commit `.env` or real credentials to GitHub.

The current backend configuration reads the environment key `OPT_SECRET`, so use that exact spelling unless the code is renamed later.

### 4. Generate Prisma Client

```bash
npx prisma generate
```

If the team uses a shared Neon database, coordinate before running schema-changing Prisma commands such as migrations or `db push`.

### 5. Start the backend

```bash
npm run dev
```

The API will run using the value configured in `PORT`.

---

## Frontend Setup

Open another terminal.

### 1. Enter the frontend directory

```bash
cd spac_hub_frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env`

```env
VITE_BACKEND_API=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=
```

Make sure `VITE_BACKEND_API` matches the backend URL used by your local environment.

### 4. Start the frontend

```bash
npm run dev
```

Vite will print the local development URL in the terminal.

---

## Stripe Webhook Development

Install the Stripe CLI if it is not already installed.

```bash
stripe login
```

Forward Stripe events to the backend:

```bash
stripe listen --forward-to localhost:5000/api/webhooks/stripe
```

Stripe CLI will provide a webhook signing secret. Put it in:

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

Restart the backend after changing environment variables.

---

## Useful Commands

### Frontend

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

### Backend

```bash
npm run dev
npm test
npx prisma generate
```

---

## Server-State Strategy

The frontend uses TanStack Query for server state and Zustand primarily for client/auth state.

Examples of server state:

- listings
- categories
- cart
- orders
- payments
- support cases
- message history

Examples of client state:

- authenticated user/session state
- access token
- local UI state
- temporary form state

Query-key factories are organized by domain so related queries can be invalidated consistently after mutations.

---

## Security Notes

Important security rules for this project:

- Never expose secrets in frontend environment variables.
- Never commit `.env` files.
- Always validate permissions on the backend.
- Never trust a role or user ID sent by the client.
- Payment totals must be calculated and verified by the backend.
- Listing reservation must remain atomic.
- Stripe webhook signatures must be verified.
- Socket.IO room access must be authorized on the server.
- Passwords must be hashed before storage.
- Refresh-token cookies should remain HTTP-only.
- Validate uploaded files before storing them.

---

## Development Workflow

A simple team workflow:

```text
dev
 |
 +--> feat/<feature-name>
 +--> fix/<bug-name>
 +--> refactor/<area>
```

Recommended process:

1. Pull the latest `dev`.
2. Create a focused feature/fix branch.
3. Make small, meaningful commits.
4. Push the branch.
5. Open a Pull Request into `dev`.
6. Review the diff and test the affected flow.
7. Merge only after the branch is stable.
8. Delete the completed feature branch when appropriate.

Example:

```bash
git checkout dev
git pull origin dev

git checkout -b fix/cart-checkout-cleanup

# make changes

git add .
git commit -m "fix: remove checked out items from buyer cart"
git push -u origin fix/cart-checkout-cleanup
```

---

## Repository Links

- Frontend: https://github.com/zeepherr/spac_hub_frontend
- Backend: https://github.com/zeepherr/spec_hub_backend

---

## Project Status

SpecHub is under active development.

Current development areas include marketplace flows, checkout/payment reliability, order fulfillment, inspection, refunds, seller tools, admin operations, and real-time support.

---

## Team

Built as a full-stack team project focused on applying production-oriented marketplace architecture, secure transaction handling, role-based workflows, and real-world frontend/backend collaboration.
