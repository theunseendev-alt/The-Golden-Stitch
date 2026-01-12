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
