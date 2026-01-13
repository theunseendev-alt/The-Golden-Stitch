# The Golden Stitch

A full-stack fashion marketplace connecting customers with fashion designers and seamstresses.

## Overview

The Golden Stitch is a production-ready fashion marketplace platform where:

- **Customers** can browse and order custom fashion designs
- **Designers** can showcase and monetize their designs
- **Seamstresses** can accept orders and create garments
- **Admins** can manage the platform and users

## Features

- Multi-role authentication system (Customer, Designer, Seamstress, Admin)
- Real-time order tracking and notifications
- Right-click context menus with role-based actions
- Note-taking system for feedback and changes
- Responsive design with modern UI components
- JWT-based authentication with refresh tokens
- Custom timeline setting for seamstresses (override default difficulty-based estimates)
- Enhanced user navigation with actual account names displayed
- Streamlined navigation menus without redundant "Browse Designs" links
- Clean UI with settings buttons removed from main dashboard content areas

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS
- **Backend**: Express.js + TypeScript
- **Database**: Prisma ORM + SQLite/PostgreSQL
- **Authentication**: JWT with bcrypt
- **UI**: Radix UI + Lucide React icons

## CI/CD

The project uses GitHub Actions for automated CI/CD pipelines.

- **Triggers**: Push and pull requests to main/master branches
- **Build**: Installs dependencies, runs tests, builds client and server functions
- **Deploy**: Automatically deploys to Netlify on successful builds to main/master

### Secrets Configuration

See [Security Documentation](docs/security/) for setting up required secrets:
- GitHub repository secrets for Netlify authentication
- Netlify environment variables for production

### Rollback Instructions

To rollback a deployment:
1. Go to Netlify dashboard > Deploys
2. Find the previous successful deploy
3. Click "Publish deploy" or use Netlify CLI: `netlify deploy --prod=false` then promote the desired deploy.

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## Documentation

- [Technical Documentation](DOCUMENTATION.md)
- [Right-Click Functions](right-click-functions-explanation.md)

## License

This project is private and proprietary.
