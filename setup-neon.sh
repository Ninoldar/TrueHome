#!/bin/bash

# Neon.tech PostgreSQL Setup Script
# Run this after creating your Neon project and getting the connection string

echo "🚀 Setting up Neon PostgreSQL for TrueHome"
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL environment variable is not set"
    echo ""
    echo "Please set it first:"
    echo "  export DATABASE_URL='your-neon-connection-string'"
    echo ""
    echo "Or add it to your .env file:"
    echo "  DATABASE_URL='your-neon-connection-string'"
    exit 1
fi

echo "✅ DATABASE_URL is set"
echo ""

# Step 1: Generate Prisma Client
echo "📦 Step 1: Generating Prisma Client..."
pnpm prisma generate
if [ $? -ne 0 ]; then
    echo "❌ Failed to generate Prisma client"
    exit 1
fi
echo "✅ Prisma Client generated"
echo ""

# Step 2: Push schema to database
echo "📤 Step 2: Pushing schema to Neon database..."
pnpm prisma db push
if [ $? -ne 0 ]; then
    echo "❌ Failed to push schema"
    exit 1
fi
echo "✅ Schema pushed successfully"
echo ""

# Step 3: Seed database
echo "🌱 Step 3: Seeding database with sample data..."
pnpm run db:seed
if [ $? -ne 0 ]; then
    echo "❌ Failed to seed database"
    exit 1
fi
echo "✅ Database seeded successfully"
echo ""

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Add DATABASE_URL to Vercel environment variables"
echo "2. Deploy to Vercel"
echo "3. Test the production site"
echo ""
echo "To view your database:"
echo "  DATABASE_URL='your-url' pnpm prisma studio"

