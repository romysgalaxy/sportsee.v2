import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { Login } from '../pages/Login'
import Home from '../pages/Home'
import { NotFound } from '../pages/NotFound'
import Profile from '../pages/Profile'
import Header from '../components/Header'
import Footer from '../components/Footer'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/home',
    element: (
      <ProtectedRoute>
        <Header />
        <Home />
        <Footer />
      </ProtectedRoute>
    ),
  },
    {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <Header />
        <Profile />
        <Footer />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <NotFound />,
  },
])
