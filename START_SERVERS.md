# Starting TrueHome Servers

## Current Status

✅ Ports have been cleared
✅ .env file is configured
⚠️  Docker needs to be started manually

## Step-by-Step Start Guide

### 1. Start Docker Desktop

**On macOS:**
- Open Docker Desktop application
- Wait until it shows "Docker is running" in the menu bar

**Verify Docker is running:**
```bash
docker ps
```

### 2. Start Docker Services

```bash
cd /Users/jonathanguyen/truehome
npm run docker:up
```

Wait ~30 seconds for PostgreSQL to be ready.

### 3. Set Up Database

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed sample data
npm run db:seed
```

### 4. Start API Server (Terminal 1)

```bash
cd /Users/jonathanguyen/truehome/apps/api
npm run dev
```

You should see:
```
🚀 API server running on http://localhost:4000
```

### 5. Start Web Server (Terminal 2)

```bash
cd /Users/jonathanguyen/truehome/apps/web
npm run dev
```

You should see:
```
- Local:        http://localhost:3000
```

### 6. Open Browser

Visit: **http://localhost:3000**

## Quick Test

Once both servers are running, try searching for:
- `Plano`
- `Main Street`
- `75023`
- `123456789`

## Troubleshooting

**Port already in use?**
```bash
# Kill processes on ports
lsof -ti :3000 | xargs kill -9
lsof -ti :4000 | xargs kill -9
```

**Database connection error?**
- Make sure Docker Desktop is running
- Check: `docker ps` (should show postgres container)
- Restart: `npm run docker:down && npm run docker:up`

**Servers not starting?**
- Check Node version: `node --version` (needs 18+)
- Reinstall: `rm -rf node_modules && npm install`

## All-in-One Script

If you want to start everything at once (after Docker is running):

```bash
cd /Users/jonathanguyen/truehome
./setup-mvp.sh
```

Then in separate terminals:
```bash
# Terminal 1
cd apps/api && npm run dev

# Terminal 2  
cd apps/web && npm run dev
```

