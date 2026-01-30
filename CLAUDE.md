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
  /assets       - Static assets (images, icons, etc.)
  App.jsx       - Main application component
  main.jsx      - Application entry point
  *.css         - Component and global styles
/public         - Public static files served as-is
vite.config.js  - Vite configuration
eslint.config.js - ESLint flat config with React hooks & refresh plugins
```

## Tech Stack & Configuration

- **Build tool**: Vite 7.x with @vitejs/plugin-react (uses Babel for Fast Refresh)
- **React**: Version 19.2 with React DOM
- **Routing**: React Router DOM 7.x
- **Linting**: ESLint 9.x with flat config format
  - Includes react-hooks and react-refresh plugins
  - Custom rule: allows unused vars matching pattern `^[A-Z_]`
- **Module system**: ES modules (type: "module" in package.json)

## Architecture Notes

- The project uses Vite's Fast Refresh for hot module replacement during development
- ESLint is configured with the flat config system (not legacy .eslintrc)
- All source files are in `/src`, with the entry point at `main.jsx`
- React Router is installed but not yet configured in the application
