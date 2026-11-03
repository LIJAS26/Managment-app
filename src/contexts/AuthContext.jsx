import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  checkUsernameAvailability,
  createUser,
  getUserById,
  getUsersByEmail,
} from '../services/authApi.js'

const AuthContext = createContext(null)
const USER_ID_KEY = 'authUserId'

function storedUserId() {
  return localStorage.getItem(USER_ID_KEY) || sessionStorage.getItem(USER_ID_KEY)
}

function publicUser(user) {
  const safeUser = { ...user }
  delete safeUser.password
  return safeUser
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchCurrentUser = useCallback(async () => {
    const userId = storedUserId()
    if (!userId) {
      setUser(null)
      setIsLoading(false)
      return null
    }

    try {
      const currentUser = await getUserById(userId)
      setUser(publicUser(currentUser))
      return publicUser(currentUser)
    } catch (error) {
      localStorage.removeItem(USER_ID_KEY)
      sessionStorage.removeItem(USER_ID_KEY)
      setUser(null)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    Promise.resolve()
      .then(() => fetchCurrentUser())
      .catch((error) => {
        console.error('Unable to restore the saved session:', error)
      })
  }, [fetchCurrentUser])

  const login = useCallback(async ({ email, password, remember = true }) => {
    const matches = await getUsersByEmail(email.trim())
    const match = matches.find(
      (candidate) =>
        candidate.email.toLowerCase() === email.trim().toLowerCase() &&
        candidate.password === password,
    )

    if (!match) {
      throw new Error('That email and password combination was not found.')
    }

    const safeUser = publicUser(match)
    if (remember) {
      sessionStorage.removeItem(USER_ID_KEY)
      localStorage.setItem(USER_ID_KEY, String(match.id))
    } else {
      localStorage.removeItem(USER_ID_KEY)
      sessionStorage.setItem(USER_ID_KEY, String(match.id))
    }
    setUser(safeUser)
    return safeUser
  }, [])

  const register = useCallback(async (userData) => {
    const usernameAvailable = await checkUsernameAvailability(userData.username)
    if (!usernameAvailable) {
      throw new Error('That username is already taken.')
    }

    const matchingEmails = await getUsersByEmail(userData.email.trim())
    if (matchingEmails.some((candidate) => candidate.email.toLowerCase() === userData.email.trim().toLowerCase())) {
      throw new Error('An account with that email already exists.')
    }

    const newUser = await createUser({
      ...userData,
      email: userData.email.trim(),
      username: userData.username.trim(),
      fullName: userData.fullName.trim(),
      avatar: userData.avatar || '',
      createdAt: new Date().toISOString(),
    })
    const safeUser = publicUser(newUser)
    localStorage.setItem(USER_ID_KEY, String(newUser.id))
    sessionStorage.removeItem(USER_ID_KEY)
    setUser(safeUser)
    return safeUser
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(USER_ID_KEY)
    sessionStorage.removeItem(USER_ID_KEY)
    setUser(null)
  }, [])

  const isAuthenticated = useCallback(() => Boolean(user), [user])
  const checkUsername = useCallback((username) => checkUsernameAvailability(username), [])

  const value = useMemo(
    () => ({
      user,
      isLoading,
      login,
      register,
      logout,
      isAuthenticated,
      fetchCurrentUser,
      checkUsername,
    }),
    [user, isLoading, login, register, logout, isAuthenticated, fetchCurrentUser, checkUsername],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.')
  }
  return context
}
