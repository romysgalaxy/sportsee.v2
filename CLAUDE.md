# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SportSee is a React application built with Vite and React Router. The project uses ES modules and React 19.

## Build & Development Commands

- **Development server**: `npm run dev` - Starts Vite dev server with HMR
- **Production build**: `npm run build` - Creates optimized production build in `dist/`
- **Preview production build**: `npm run preview` - Locally preview production build
- **Linting**: `npm run lint` - Run ESLint on the codebase

## Project Structure

```
/src
  /assets          - Static assets (images, icons, etc.)
  /components      - Reusable components
    ProtectedRoute.jsx - HOC for protecting authenticated routes
  /contexts        - React Context providers
    AuthContext.jsx    - Authentication state and token management
  /pages           - Page components
    Login.jsx      - Login page (unauthenticated)
    Home.jsx       - Home page (protected)
    NotFound.jsx   - 404 error page
  /router          - Routing configuration
    index.jsx      - React Router setup with all routes
  main.jsx         - Application entry point
  *.css            - Component and global styles
/public            - Public static files served as-is
vite.config.js     - Vite configuration
eslint.config.js   - ESLint flat config with React hooks & refresh plugins
```

## Tech Stack & Configuration

- **Build tool**: Vite 7.x with @vitejs/plugin-react (uses Babel for Fast Refresh)
- **React**: Version 19.2 with React DOM
- **Routing**: React Router DOM 7.x with `createBrowserRouter`
- **Authentication**: JWT tokens stored in cookies using js-cookie
- **Linting**: ESLint 9.x with flat config format
  - Includes react-hooks and react-refresh plugins
  - Custom rule: allows unused vars matching pattern `^[A-Z_]`
- **Module system**: ES modules (type: "module" in package.json)

## Authentication & API

### API Endpoints
The backend API runs on `http://localhost:8000` and uses JWT authentication.

- **POST /login** - Authenticate user and receive JWT token
  - Body: `{ "username": "string", "password": "string" }`
  - Returns: `{ "token": "jwt-token", "userId": number }`

- **GET /api/user-info** - Get user profile (requires Bearer token)
- **GET /api/user-activity** - Get activity sessions (requires Bearer token)

### Demo Users
- sophiemartin / password123
- emmaleroy / password789
- marcdubois / password456

### Authentication Flow
1. User logs in via `/login` page
2. JWT token stored in cookie (7-day expiration)
3. `AuthContext` manages authentication state globally
4. Protected routes check authentication before rendering
5. Unauthenticated users redirected to `/login`

## Architecture Notes

- **Routing**: Uses React Router's `createBrowserRouter` with route-based code splitting
- **Protected Routes**: `ProtectedRoute` component wraps authenticated pages
- **State Management**: `AuthContext` provides global auth state via Context API
- **Token Storage**: JWT tokens stored in httpOnly-like cookies via js-cookie
- **Error Handling**: 404 page for unknown routes, auth errors redirect to login
- **Entry Point**: `main.jsx` wraps app with `AuthProvider` and `RouterProvider`
- **Fast Refresh**: Vite's HMR preserves component state during development
- **ESLint**: Configured with flat config system (not legacy .eslintrc)
