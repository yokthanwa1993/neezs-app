# AI Development Rules for Gig Marketplace App

This document provides guidelines for AI developers to follow when working on this project. Adhering to these rules ensures code consistency, maintainability, and alignment with the project's architecture.

## Tech Stack Overview

The application is built with the following technologies:

-   **Framework**: React (with Vite) for the frontend.
-   **Language**: TypeScript for type safety.
-   **UI Components**: `shadcn/ui` is the primary component library, built on top of Radix UI.
-   **Styling**: Tailwind CSS for all styling needs.
-   **Routing**: React Router DOM for all client-side routing.
-   **State Management**: TanStack Query (React Query) for server state and React Context API for global client state (e.g., authentication).
-   **Forms**: React Hook Form with Zod for validation.
-   **Authentication**: Firebase Auth, with a custom Express.js backend to handle LINE Login integration.
-   **Icons**: `lucide-react` for all icons.
-   **Mobile**: Capacitor to wrap the web app into native iOS and Android applications.

## Library Usage Rules

### 1. UI Components

-   **Primary Library**: **Always** use components from `shadcn/ui`. These are located in `src/components/ui`.
-   **Usage**: Import components like `Button`, `Card`, `Input`, `Dialog`, etc., directly from `@/components/ui/...`.
-   **Custom Components**: Only create new components in `src/components/...` if the required functionality is not available in `shadcn/ui`. Do not reinvent the wheel.

### 2. Styling

-   **Method**: Use **Tailwind CSS** utility classes for all styling.
-   **Implementation**: Apply classes directly in the JSX of your components.
-   **Custom CSS**: Avoid writing custom CSS in `.css` files. The existing `globals.css` is for base styles and Tailwind configuration.

### 3. Icons

-   **Library**: Use `lucide-react` for all icons.
-   **Consistency**: Ensure icon style and size are consistent with the surrounding UI.

### 4. Routing

-   **Library**: Use `react-router-dom` for navigation.
-   **Configuration**: All routes are defined in `src/App.tsx`. When adding a new page, add its route to this file.

### 5. State Management

-   **Server State**: For data fetching, caching, and mutations (e.g., API calls), use **TanStack Query (React Query)**.
-   **Global Client State**: For UI state that needs to be shared globally (e.g., auth status, user role, theme), use **React Context API**. Create new contexts in the `src/contexts` directory.
-   **Local State**: Use the `useState` hook for component-level state.

### 6. Forms

-   **Form Logic**: Use **React Hook Form** (`react-hook-form`) for handling all forms.
-   **Validation**: Use **Zod** to define validation schemas. Connect Zod schemas to React Hook Form using `@hookform/resolvers`.

### 7. Notifications (Toasts)

-   **Library**: Use `sonner` for displaying toast notifications.
-   **Implementation**: Use the helper functions provided in `src/utils/toast.ts` (`showSuccess`, `showError`, etc.) to trigger toasts.

### 8. File Structure

-   **Pages**: Place full-page components in `src/pages/`.
-   **Reusable Components**: Place general-purpose components in `src/components/`.
-   **UI Primitives**: `shadcn/ui` components are in `src/components/ui/`. Do not modify these files directly.
-   **Contexts**: Place all React contexts in `src/contexts/`.
-   **Hooks**: Place custom hooks in `src/hooks/`.
-   **Utilities**: Place helper functions and library configurations in `src/lib/`.

By following these rules, we can build a clean, consistent, and scalable application.