#!/bin/bash

set -e

echo "🚀 Setting up TrueHome MVP..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Database
DATABASE_URL="postgresql://truehome:truehome@localhost:5432/truehome?schema=public"

# API
API_PORT=4000
FRONTEND_URL=http://localhost:3000

# Next.js
NEXT_PUBLIC_API_URL=http://localhost:4000
EOF
    echo "✅ Created .env file"
else
    echo "✅ .env file already exists"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Start Docker services
echo ""
echo "🐳 Starting Docker services..."
npm run docker:up

echo ""
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Generate Prisma client
echo ""
echo "🔧 Generating Prisma client..."
npm run db:generate

# Run migrations
echo ""
echo "🗄️  Running database migrations..."
npm run db:migrate

# Seed data
echo ""
echo "🌱 Seeding sample data..."
npm run db:seed

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Start the API server: cd apps/api && npm run dev"
echo "2. Start the web server: cd apps/web && npm run dev"
echo "3. Visit http://localhost:3000"
echo ""
echo "Or run both in separate terminals:"
echo "  Terminal 1: cd apps/api && npm run dev"
echo "  Terminal 2: cd apps/web && npm run dev"
