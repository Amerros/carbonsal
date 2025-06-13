'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const savedToken = Cookies.get('token')
      if (!savedToken) {
        setLoading(false)
        return
      }

      const response = await fetch('/api/auth', {
        headers: {
          'Authorization': `Bearer ${savedToken}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setToken(savedToken)
      } else {
        Cookies.remove('token')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      Cookies.remove('token')
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        setToken(data.token)
        Cookies.set('token', data.token, { expires: 7 })
        toast.success('Succesvol ingelogd!')
        return { success: true }
      } else {
        toast.error(data.error || 'Login mislukt')
        return { success: false, error: data.error }
      }
    } catch (error) {
      toast.error('Er ging iets mis')
      return { success: false, error: 'Network error' }
    }
  }

  const register = async (email, password, companyName, industry, employees) => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, companyName, industry, employees })
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        setToken(data.token)
        Cookies.set('token', data.token, { expires: 7 })
        toast.success('Account succesvol aangemaakt!')
        return { success: true }
      } else {
        toast.error(data.error || 'Registratie mislukt')
        return { success: false, error: data.error }
      }
    } catch (error) {
      toast.error('Er ging iets mis')
      return { success: false, error: 'Network error' }
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    Cookies.remove('token')
    toast.success('Uitgelogd')
  }

  const getAuthHeaders = () => {
    return token ? { 'Authorization': `Bearer ${token}` } : {}
  }

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    getAuthHeaders,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
