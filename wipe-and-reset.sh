#!/bin/bash

set -e

echo "🧹 Wiping localhost and resetting TrueHome..."
echo ""

# Stop and remove Docker containers and volumes
echo "🐳 Stopping Docker services and removing volumes..."
docker compose down -v 2>/dev/null || docker-compose down -v 2>/dev/null || echo "Docker not running or not installed"

# Clean node_modules
echo ""
echo "📦 Cleaning node_modules..."
rm -rf node_modules apps/*/node_modules packages/*/node_modules

# Clean build artifacts
echo ""
echo "🧹 Cleaning build artifacts..."
rm -rf apps/api/dist apps/web/.next apps/web/out packages/*/dist .turbo

# Reinstall dependencies
echo ""
echo "📥 Reinstalling dependencies..."
npm ci

# Start Docker services
echo ""
echo "🐳 Starting Docker services..."
npm run docker:up

echo ""
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 10

# Set up database
echo ""
echo "🗄️  Setting up database..."
npm run db:generate
npm run db:migrate

# Seed data
echo ""
echo "🌱 Seeding sample data..."
npm run db:seed

echo ""
echo "✅ Wipe and reset complete!"
echo ""
echo "Your local environment has been reset with fresh data."
echo ""
echo "To start the servers:"
echo "  Terminal 1: cd apps/api && npm run dev"
echo "  Terminal 2: cd apps/web && npm run dev"
echo ""
echo "Then visit: http://localhost:3000"

