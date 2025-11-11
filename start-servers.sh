#!/bin/bash

# Start TrueHome servers efficiently

echo "🚀 Starting TrueHome servers..."

# Kill any existing processes
pkill -f "nest start" 2>/dev/null
pkill -f "next dev" 2>/dev/null
sleep 2

# Set environment
export DATABASE_URL="postgresql://truehome:truehome@localhost:5432/truehome?schema=public"

# Start API server in background
echo "📡 Starting API server..."
cd /Users/jonathanguyen/truehome/apps/api
npm run dev > /tmp/truehome-api.log 2>&1 &
API_PID=$!
echo "API server PID: $API_PID"

# Wait for API to start
sleep 8

# Start Web server in background
echo "🌐 Starting Web server..."
cd /Users/jonathanguyen/truehome/apps/web
npm run dev > /tmp/truehome-web.log 2>&1 &
WEB_PID=$!
echo "Web server PID: $WEB_PID"

# Wait for web to start
sleep 5

echo ""
echo "✅ Servers starting..."
echo "📡 API: http://localhost:4000 (background)"
echo "🌐 Web: http://localhost:3000"
echo ""
echo "📋 Logs:"
echo "   API: tail -f /tmp/truehome-api.log"
echo "   Web: tail -f /tmp/truehome-web.log"
echo ""
echo "🛑 To stop: pkill -f 'nest start' && pkill -f 'next dev'"
echo ""

# Test endpoints
sleep 3
echo "🔍 Testing API..."
if curl -s http://localhost:4000/search/autocomplete?q=Main > /dev/null 2>&1; then
  echo "✅ API is responding"
else
  echo "⏳ API still starting (check logs if issues persist)"
fi

