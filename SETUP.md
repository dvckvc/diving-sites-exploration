# Diving Sites - Setup Guide

Welcome to the Diving Sites project! This guide will help you set up the database and authentication system.

## Prerequisites

- **Node.js** (v18 or later)
- **PostgreSQL** (v13 or later)
- **npm** or **yarn**

### Install PostgreSQL (macOS)
```bash
# Using Homebrew
brew install postgresql
brew services start postgresql

# Create a database user (optional)
createuser --createdb your_username
```

## Setup Instructions

### 1. Environment Configuration

First, update your environment variables in `.env.local`:

```bash
# Copy the example file
cp .env.example .env.local
```

Update `.env.local` with your actual database credentials:
```env
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/diving_sites"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-key"
```

**Generate a secure secret:**
```bash
openssl rand -base64 32
```

### 2. Database Setup

Option A - Use our setup script:
```bash
npm run db:setup
```

Option B - Manual setup:
```bash
# Create database
createdb diving_sites

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed
```

### 3. Start Development Server

```bash
npm run dev
```

Your application will be available at `http://localhost:3000`

## Test Accounts

After seeding, you can use these test accounts:

| Role  | Email                    | Password |
|-------|--------------------------|----------|
| Admin | admin@divingsites.com    | admin123 |
| Guide | guide@divingsites.com    | guide123 |
| User  | user@divingsites.com     | user123  |

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run db:setup` | Complete database setup |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema changes |
| `npm run db:migrate` | Run migrations |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:reset` | Reset database (destructive) |

## User Roles & Permissions

### Guest (Not logged in)
- View basic dive site information
- Browse public dive sites
- View site ratings and limited details

### User (Authenticated)
- All Guest permissions
- View full dive site details
- Create and manage reviews
- Add comments
- Favorite dive sites
- Report inappropriate content
- Upload photos

### Guide (Dive Professional)
- All User permissions
- Add new dive sites
- Edit dive sites they created
- Enhanced profile features

### Admin (System Administrator)
- All permissions
- User management
- Content moderation
- Handle reports
- System-wide configuration

## Troubleshooting

### Database Connection Issues
1. Ensure PostgreSQL is running: `brew services start postgresql`
2. Check your DATABASE_URL in `.env.local`
3. Verify database exists: `psql -l | grep diving_sites`

### Authentication Issues
1. Verify NEXTAUTH_SECRET is set
2. Check NEXTAUTH_URL matches your development URL
3. Clear browser cookies and try again

### Permission Errors
1. Check file permissions on the database setup script
2. Ensure your PostgreSQL user has CREATE DATABASE privileges

### Need Help?
- Check the [Prisma documentation](https://www.prisma.io/docs/)
- Review [NextAuth.js documentation](https://next-auth.js.org/)
- Check the project's issue tracker

## Next Steps

1. **Customize the UI**: Add shadcn/ui components for a beautiful interface
2. **Implement Features**: Build dive site listing, search, and detailed views
3. **Add Authentication Pages**: Create sign-in and sign-up forms
4. **Deploy**: Set up production database and deploy to Vercel

Happy diving! 🤿
