# TrueHome

A Carfax for homes - comprehensive property history and insights platform.

## Overview

TrueHome provides detailed property history reports including:
- Ownership history
- Sales records
- Building permits and inspections
- Contractor work history
- Rental property history
- Insurance claims
- Risk assessments
- Comparable properties

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Backend**: NestJS, TypeScript
- **Database**: PostgreSQL with PostGIS
- **ORM**: Prisma
- **Search**: OpenSearch/Elasticsearch
- **Cache**: Redis
- **Storage**: S3-compatible (MinIO for local dev)

## Getting Started

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- PostgreSQL client tools (optional)

### Setup

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Start Docker services (PostgreSQL, Redis, OpenSearch, MinIO):
\`\`\`bash
npm run docker:up
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env
# Edit .env with your configuration
\`\`\`

4. Generate Prisma client and run migrations:
\`\`\`bash
npm run db:generate
npm run db:migrate
\`\`\`

5. Start development servers:
\`\`\`bash
npm run dev
\`\`\`

- Frontend: http://localhost:3000
- API: http://localhost:4000
- Prisma Studio: `npm run db:studio`

## Project Structure

\`\`\`
truehome/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/           # NestJS backend API
├── packages/
│   ├── db/            # Prisma schema and migrations
│   ├── config/        # Shared configuration
│   └── shared/        # Shared utilities and types
└── infra/             # Infrastructure as code
\`\`\`

## Development

- `npm run dev` - Start all services in development mode
- `npm run build` - Build all packages
- `npm run lint` - Lint all packages
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

## License

Private - All rights reserved
