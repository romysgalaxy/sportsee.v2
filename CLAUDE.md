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
    Header.jsx     - Header component with navigation
    Footer.jsx     - Footer component
  /contexts        - React Context providers
    AuthContext.jsx    - Authentication state and token management
  /hooks           - Custom React hooks
    useApi.js      - Hook for API calls with loading/error states
  /pages           - Page components
    Login.jsx      - Login page (unauthenticated)
    Home.jsx       - Home page with charts (protected)
    Profile.jsx    - User profile page (protected)
    NotFound.jsx   - 404 error page
  /router          - Routing configuration
    index.jsx      - React Router setup with all routes
  /services        - API services
    api.js         - Centralized API service with auth headers
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
- **Charts**: Recharts for data visualization (KM, BPM, donut charts)
- **Linting**: ESLint 9.x with flat config format
  - Includes react-hooks and react-refresh plugins
  - Custom rule: allows unused vars matching pattern `^[A-Z_]`
- **Module system**: ES modules (type: "module" in package.json)

## Authentication & API

### API Endpoints
The backend API runs on `http://localhost:8000` and uses JWT authentication.

- **POST /api/login** - Authenticate user and receive JWT token
  - Body: `{ "username": "string", "password": "string" }`
  - Returns: `{ "token": "jwt-token", "userId": number }`

- **GET /api/user-info** - Get user profile and statistics (requires Bearer token)
  - Returns: `{ profile: {...}, statistics: { totalDistance, totalSessions, totalDuration } }`

- **GET /api/user-activity?startWeek=YYYY-MM-DD&endWeek=YYYY-MM-DD** - Get activity sessions (requires Bearer token)
  - Returns array of sessions with distance, duration, heartRate (min, max, average), caloriesBurned

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

### Routing & Authentication
- **Routing**: Uses React Router's `createBrowserRouter` with route-based code splitting
- **Protected Routes**: `ProtectedRoute` component wraps authenticated pages
- **State Management**: `AuthContext` provides global auth state via Context API
- **Token Storage**: JWT tokens stored in httpOnly-like cookies via js-cookie
- **Error Handling**: 404 page for unknown routes, auth errors redirect to login
- **Entry Point**: `main.jsx` wraps app with `AuthProvider` and `RouterProvider`

### API Integration
- **Service Layer**: `apiService` class centralizes all API calls with automatic auth headers
- **Custom Hook**: `useApi` hook manages loading, error, and data states for API calls
- **Token Management**: Automatic Bearer token injection in Authorization header
- **Error Handling**: 401 errors trigger automatic logout and redirect to login
- **Manual Fetching**: Chart navigation uses manual API calls to avoid full page refresh

### Data Visualization (Home Page)
- **KM Chart**: Bar chart showing weekly distances over 4-week periods
  - Navigate by 4-week blocks using arrow buttons
  - Displays average KM across the 4 weeks
  - Manual API fetch on navigation to avoid page refresh

- **BPM Chart**: Composed chart (bars + line) showing heart rate for last 7 days
  - Navigate by 7-day periods using arrow buttons
  - Shows min/max bars and average line
  - Manual API fetch on navigation to avoid page refresh

- **This Week Stats**: Donut chart for weekly goals + duration/distance cards
  - Updates based on latest week from KM data

### Performance Optimization
- **Initial Load**: All charts load data once on mount
- **Navigation**: Manual `fetchKmData` and `fetchBpmData` functions update only chart data
- **Loading States**: Separate loading indicators (`loadingKmNav`, `loadingBpmNav`) for chart navigation
- **Fast Refresh**: Vite's HMR preserves component state during development
- **ESLint**: Configured with flat config system (not legacy .eslintrc)
