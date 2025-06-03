# Home Accounting Application

A modern home accounting application built with Next.js 15, TypeScript, and PostgreSQL using Drizzle ORM.

## Project Overview

This application helps users manage personal finances through tracking financial transactions, account balances, and transfers between accounts. It features a clean, responsive UI built with modern React patterns and robust database management.

## Tech Stack

### Frontend
- **Next.js 15** (App Router with Turbopack)
- **React 19** with TypeScript
- **Tailwind CSS 4** for styling
- **Radix UI** components for accessible UI primitives
- **Lucide React** for icons

### Backend & Database
- **PostgreSQL** database with **Neon serverless**
- **Drizzle ORM** for type-safe database operations
- **Drizzle Kit** for migrations

### Authentication
- **Better Auth** for authentication with email/password

### Form Handling
- **Conform** with **Zod** for form validation and type safety

### Development Tools
- **TypeScript 5**
- **Biome** for code formatting and linting
- **Vercel** for deployment

## Project Structure

```
src/
├── actions/                    # Server actions for data mutations
│   ├── financial-transaction.ts
│   ├── insert-financial-transaction/
│   └── insert-financial-transfer/
├── app/                        # Next.js App Router pages
│   ├── api/auth/              # Authentication API routes
│   ├── auth/                  # Authentication pages
│   └── dashboard/             # Main dashboard page
├── components/                 # React components
│   ├── form/                  # Form components
│   ├── site/                  # Layout components
│   └── ui/                    # Reusable UI components
├── db/                        # Database configuration and schemas
│   ├── schemas/               # Drizzle schemas by entity
│   └── migrations/            # Database migrations
├── lib/                       # Utility libraries
└── services/                  # Business logic services
```

## Database Schema

### Core Entities

#### Users (`user`)
- User authentication and profile information
- Managed by Better Auth

#### Financial Accounts (`financial_account`)
- Represents bank accounts, cash, credit cards, etc.
- Contains: name, type, current balance
- Linked to account types for categorization

#### Financial Transactions (`financial_transaction`)
- Individual income/expense entries
- Contains: amount, date, description, account, account title
- Supports positive (income) and negative (expense) amounts

#### Financial Transfers (`financial_transfer`)
- Money transfers between accounts
- Creates two linked transactions (debit/credit)
- Maintains referential integrity between accounts

#### Account Types & Titles
- **Account Types**: Categories like "Bank", "Cash", "Credit Card"
- **Account Titles**: Transaction categories like "Salary", "Groceries", "Utilities"

## Key Features

### 1. Transaction Management
- Quick entry forms for income/expenses
- Date, amount, and description tracking
- Account and category selection
- Form validation with Zod schemas

### 2. Account Transfers
- Transfer money between accounts
- Automatic double-entry bookkeeping
- Maintains transaction history for both accounts

### 3. Dashboard Interface
- Responsive design with sidebar navigation
- Tabbed interface for different operations
- Quick access to common actions

### 4. Authentication
- Email/password authentication
- Session management
- Secure route protection

## Development Setup

### Environment Variables
```bash
DATABASE_URL=postgresql://...  # PostgreSQL connection string
```

### Scripts
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run linting
```

### Database Commands
```bash
# Generate migrations
npx drizzle-kit generate

# Push schema changes
npx drizzle-kit push

# View database
npx drizzle-kit studio
```

## Architecture Patterns

### 1. Database Layer
- **Drizzle ORM** for type-safe database operations
- **Schema-first** approach with TypeScript inference
- **Relational queries** with join support
- **Migration management** with Drizzle Kit

### 2. Server Actions
- **Server-side** form processing
- **Type-safe** with Zod validation
- **Error handling** with Conform integration

### 3. Component Architecture
- **Separation of concerns** between UI and business logic
- **Reusable components** in `components/ui/`
- **Form components** with validation integration

### 4. Type Safety
- **End-to-end TypeScript** from database to UI
- **Zod schemas** for runtime validation
- **Drizzle** for database type inference

## Current Status

The application includes:
✅ Database schema and migrations  
✅ Authentication system  
✅ Financial transaction creation  
✅ Account transfer functionality  
✅ Basic dashboard UI  
✅ Form validation and error handling  

## Future Enhancements

- Financial reporting and analytics
- Budget tracking and alerts
- Multi-currency support
- Import/export functionality
- Mobile app companion
- Advanced search and filtering
- Transaction categorization and tagging

## Code Conventions

- **TypeScript** for all source files
- **Server actions** for data mutations
- **Zod schemas** for validation
- **Consistent naming** following the pattern: `financialTransaction`, `FinancialTransactionSchema`
- **Database relations** defined separately from table schemas
- **Component composition** over inheritance