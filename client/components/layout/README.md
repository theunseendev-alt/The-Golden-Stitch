# Layout Components Documentation

This directory contains modular components that break down the original monolithic Layout.tsx file into smaller, focused components following the single responsibility principle.

## Component Structure

### 1. Header.tsx

**Purpose**: Main header component with logo, navigation, and user actions
**Contains**:

- Brand logo and company name
- Desktop navigation menu (dynamic based on user role)
- User actions section (authentication, notifications, shopping cart)
- Mobile menu toggle button
- Responsive design

### 2. UserActions.tsx

**Purpose**: Handles all user-related actions and authentication
**Contains**:

- Authentication buttons for non-logged users (Sign In, Get Started)
- Logged-in user information display
- Notification bell with unread count badge
- Shopping cart icon (customer-specific)
- Role-specific action buttons:
  - **Designer**: Profile and Account buttons
  - **Admin**: User management button
  - **All roles**: Settings and Logout buttons

### 3. MobileNavigation.tsx

**Purpose**: Responsive mobile navigation menu
**Contains**:

- Collapsible navigation links
- Mobile-specific user action buttons
- Proper menu state management
- Auto-close functionality on navigation

### 4. Footer.tsx

**Purpose**: Site footer with navigation links and company information
**Contains**:

- Company branding and description
- Navigation sections:
  - For Customers (Browse Designs, How It Works)
  - For Creators (Become Designer, Become Seamstress)
  - Company links (About, Contact, How It Works)
- Legal links (Privacy Policy, Terms of Service)
- Copyright notice

### 5. useLayoutLogic.ts

**Purpose**: Custom hook containing all business logic and state management
**Contains**:

- User authentication state management
- localStorage integration for user data
- Navigation handlers (logout, settings, profile, etc.)
- Role-based navigation link generation
- Menu state management
- Notification handling
- Shopping cart context menu logic

### 6. Layout.tsx

**Purpose**: Main orchestrator component that combines all sub-components
**Contains**:

- Component composition and prop passing
- State coordination between components
- Main layout structure (header, main content, footer)
- Notification panel integration

## Benefits of This Architecture

### 1. **Modularity**

- Each component has a single, clear responsibility
- Easier to understand, test, and maintain
- Better separation of concerns

### 2. **Reusability**

- Components can be reused in different contexts
- Custom hooks can be used in other components
- Props make components flexible and configurable

### 3. **Maintainability**

- Changes to one component don't affect others
- Easier to debug and troubleshoot
- Clear component boundaries

### 4. **Testability**

- Each component can be tested independently
- Custom hook can be tested in isolation
- Mock data can be provided easily

### 5. **Scalability**

- Easy to add new features or modify existing ones
- New components can be added without affecting others
- Better code organization for team development

## Usage

```tsx
import { Layout } from "@/components/layout/Layout";

function App() {
  return (
    <Layout userRole="customer" userName="John Doe">
      <YourPageContent />
    </Layout>
  );
}
```

## Props

### Layout Props

- `children`: React.ReactNode - The content to render inside the layout
- `userRole?: "customer" | "designer" | "seamstress" | "admin" | null` - User's role
- `userName?: string` - User's display name

### Component Dependencies

- `@/components/ui/button` - UI button component
- `@/components/NotificationPanel` - Notification panel component
- `@/hooks/useNotifications` - Notifications hook
- `@/lib/api` - API service
- `lucide-react` - Icon library
- `react-router-dom` - Routing utilities

## File Organization

```
client/components/layout/
├── Header.tsx           # Header with logo, nav, and user actions
├── UserActions.tsx      # User authentication and actions
├── MobileNavigation.tsx # Mobile responsive menu
├── Footer.tsx          # Site footer with links
├── useLayoutLogic.ts   # Business logic and state management
├── Layout.tsx          # Main orchestrator component
└── README.md           # This documentation
```

This modular architecture provides a solid foundation for the application's layout while maintaining clean, maintainable, and scalable code.
