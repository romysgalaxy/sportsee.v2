# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## SERVEUR

### 1. Authentication
The API uses JWT (JSON Web Token) authentication. To access the endpoints:

First obtain a JWT token by logging in:
`curl -X POST http://localhost:8000/login \
  -H "Content-Type: application/json" \
  -d '{"username": "karldovineau", "password": "password123"}'`
Use the received token in subsequent requests in the Authorization header:
`curl -H "Authorization: Bearer your-jwt-token" http://localhost:8000/user`

Available Users
Currently, the API has three demo users:

username: sophiemartin, password: password123
username: emmaleroy, password: password789
username: marcdubois, password: password456

### 2. Endpoints

Authentication Endpoint
POST api/login - Authenticates a user and returns a JWT token
Required body: { "username": "string", "password": "string" }
Returns: { "token": "jwt-token", "userId": number }

Data Endpoints
All these endpoints require authentication via a Bearer token in the header: Authorization: Bearer <your_token>

Get User Information
GET /api/user-info
Returns user profile information, statistics, and goals.

Get Activity Sessions
GET /api/user-activity?startWeek=<date>&endWeek=<date>
Returns running sessions between two dates.

Parameters:

startWeek: Start date (ISO format)
endWeek: End date (ISO format)