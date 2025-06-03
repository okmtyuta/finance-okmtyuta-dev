# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Application Overview

This is a financial management application built with Next.js 15, TypeScript, and PostgreSQL. It enables personal finance tracking through transactions, account management, and transfers between accounts using a double-entry bookkeeping pattern.

## Development Commands

```bash
# Development workflow
pnpm dev          # Start development server with Turbopack
pnpm build        # Build for production  
pnpm start        # Start production server
pnpm lint         # Run Next.js linting

# Code quality (Biome)
pnpm format       # Format code with Biome
pnpm check        # Lint and format code with Biome
pnpm ci           # Check code for CI (no auto-fix)

# Database operations (Drizzle)
npx drizzle-kit generate  # Generate new migrations
npx drizzle-kit push      # Push schema changes to database
npx drizzle-kit studio    # Open Drizzle Studio for database inspection

# Task commands (alternative using Taskfile.yaml)
task db:push     # Push schema changes to NeonDB
task db:generate # Generate new migrations
task db:studio   # Open Drizzle Studio
task dev         # Start development server
task build       # Build for production
task format      # Format code with Biome
task check       # Lint and format with Biome
```

## Architecture Patterns

### Database Schema Structure
- **Users**: Authentication managed by Better Auth (user, session, account, verification tables)
- **Financial Accounts**: Bank accounts, cash, etc. with types (checking, savings, credit card)
- **Financial Transactions**: Individual income/expense entries linked to accounts and titles

### Server Actions Pattern
Actions follow a modular structure in `src/actions/`:
```
insert-financial-transaction/
├── action.ts     # Server action implementation
└── schema.ts     # Zod validation schema
```
Each action uses Conform + Zod for type-safe form validation and error handling.

### Authentication System
- **Better Auth** with email/password authentication
- Drizzle adapter for database integration
- Client utilities at `@/lib/auth-client`
- API routes at `/api/auth/[...all]`

### Component Architecture
- **UI Components**: Radix UI primitives with Tailwind CSS
- **Form Components**: Conform-integrated forms with real-time validation
- **Site Layout**: Modular header/main/footer structure using `src/components/site/`

## Key Services

- **DateService** (`src/services/date-service.ts`): Japan timezone standardization and date formatting
- **Converter** (`src/lib/converter.ts`): Type conversion utilities for form data

## Database Operations

When working with the database:
1. Schema changes go in `src/db/schemas/`
2. Generate migrations with `npx drizzle-kit generate`
3. Apply changes with `npx drizzle-kit push`
4. All schemas use TypeScript with Drizzle ORM type inference
5. Relations are defined separately from table schemas

## Form Handling

Forms use the Conform + Zod pattern:
1. Define Zod schema in `schema.ts`
2. Implement server action in `action.ts`
3. Use `useForm` from Conform in components
4. Server actions handle validation and database operations

## Code Conventions

- TypeScript for all source files
- Path mapping: `@/*` → `src/*`
- Database entities use snake_case
- Component/function naming: camelCase (e.g., `financialTransaction`)
- Schema naming: PascalCase (e.g., `FinancialTransactionSchema`)
- Server actions for all data mutations
- Zod schemas for runtime validation

## CLAUDE.md Maintenance

**IMPORTANT**: When making significant changes to the codebase (new features, architectural changes, new dependencies, or workflow modifications), Claude must update this CLAUDE.md file to reflect those changes. This ensures future Claude instances have accurate guidance.

Update triggers:
- New development commands or scripts
- Changes to database schema or architecture patterns
- New authentication or form handling patterns  
- Modified code conventions or project structure
- New dependencies or technology stack changes

## Technology Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4
- **Database**: PostgreSQL with Neon serverless, Drizzle ORM
- **Auth**: Better Auth with email/password
- **Forms**: Conform + Zod validation
- **UI**: Radix UI + Tailwind CSS
- **Development**: Biome for formatting/linting, Vercel deployment