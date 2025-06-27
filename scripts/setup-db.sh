#!/bin/bash

# Database setup script for Diving Sites project

echo "🏊‍♂️ Setting up Diving Sites Database..."

# Check if PostgreSQL is running
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first."
    echo "On macOS: brew install postgresql"
    exit 1
fi

# Database configuration
DB_NAME="diving_sites"
DB_USER="your_username"  # Change this to your PostgreSQL username
DB_PASSWORD="your_password"  # Change this to your PostgreSQL password

echo "📦 Creating database '$DB_NAME'..."

# Create database (ignore error if it already exists)
createdb $DB_NAME 2>/dev/null || echo "Database '$DB_NAME' already exists"

echo "🔄 Running Prisma migrations..."
npx prisma migrate deploy

echo "📊 Pushing schema to database..."
npx prisma db push

echo "✅ Database setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Update your .env.local file with your actual database credentials"
echo "2. Update DATABASE_URL to: postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME"
echo "3. Generate a secure NEXTAUTH_SECRET: openssl rand -base64 32"
echo "4. Run 'npm run dev' to start the development server"
