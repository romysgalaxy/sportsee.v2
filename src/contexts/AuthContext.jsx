import { createContext, useContext, useState, useEffect } from 'react'
import Cookies from 'js-cookie'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null)
  const [userId, setUserId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedToken = Cookies.get('authToken')
    const storedUserId = Cookies.get('userId')

    if (storedToken && storedUserId) {
      setToken(storedToken)
      setUserId(storedUserId)
    }
    setIsLoading(false)
  }, [])

  const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        throw new Error('Authentication failed')
      }

      const data = await response.json()

      Cookies.set('authToken', data.token, { expires: 7 })
      Cookies.set('userId', data.userId, { expires: 7 })

      setToken(data.token)
      setUserId(data.userId)

      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    Cookies.remove('authToken')
    Cookies.remove('userId')
    setToken(null)
    setUserId(null)
  }

  const isAuthenticated = () => {
    return !!token
  }

  const value = {
    token,
    userId,
    isLoading,
    login,
    logout,
    isAuthenticated,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
