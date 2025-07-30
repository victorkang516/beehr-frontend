import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react'
import type { ReactNode } from 'react'
import { api } from '@utility/index'

export type UserRole = 'Owner' | 'HR Admin' | 'Manager' | 'Employee'
export type ViewMode = 'admin' | 'employee'

interface Organization {
  id: number
  name: string
  description?: string
}

interface User {
  id: number
  name: string
  email: string
  department: string
  position: string
  role: UserRole
  joinDate: string
  avatar?: string
  phone?: string
  address?: string
  organization?: Organization
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  viewMode: ViewMode
  login: (email: string, password: string) => Promise<boolean>
  logout: (redirectToLogin?: () => void) => void
  hasRole: (roles: UserRole | UserRole[]) => boolean
  canAccess: (requiredRoles: UserRole[]) => boolean
  needsOnboarding: () => boolean
  refreshUser: () => Promise<void>
  switchToAdminView: () => void
  switchToEmployeeView: () => void
  canSwitchViews: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('admin')

  // Check for existing authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      // Validate token with the backend and restore user state
      validateToken()
    } else {
      // No token found, not loading anymore
      setIsLoading(false)
    }
  }, [])

  const validateToken = async () => {
    try {
      const response = await api.get('/auth/profile')

      if (response.status === 200 && response.data) {
        setUser(response.data)
        setIsAuthenticated(true)
      } else {
        // Token is invalid, remove it
        localStorage.removeItem('access_token')
        setUser(null)
        setIsAuthenticated(false)
      }
    } catch (error) {
      // Token is invalid, remove it
      localStorage.removeItem('access_token')
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    const response = await api.post('/auth/login', { email, password })
    console.log('Login response:', response)
    if (response.status === 200 && response.data) {
      // Store the JWT token
      localStorage.setItem('access_token', response.data.access_token)

      // Set user data from the response
      setUser(response.data.user)
      setIsAuthenticated(true)
      setIsLoading(false) // Ensure loading is false after successful login
      return true
    }

    return false
  }

  const logout = (redirectToLogin?: () => void) => {
    // Remove the JWT token
    localStorage.removeItem('access_token')

    setUser(null)
    setIsAuthenticated(false)
    setIsLoading(false) // Ensure loading is false after logout

    // Redirect to login if callback provided
    if (redirectToLogin) {
      redirectToLogin()
    }
  }

  // Check if user has specific role(s)
  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false
    const roleArray = Array.isArray(roles) ? roles : [roles]
    return roleArray.includes(user.role)
  }

  // Check if user can access based on required roles
  const canAccess = (requiredRoles: UserRole[]): boolean => {
    if (!user || !isAuthenticated) return false
    return requiredRoles.includes(user.role)
  }

  // Check if user needs onboarding (no organization assigned)
  const needsOnboarding = useCallback((): boolean => {
    console.log('Checking onboarding needs for user:', user)
    if (!user || !isAuthenticated) return false
    return !user.organization || !user.organization.id
  }, [user, isAuthenticated])

  // Check if user can switch between views (only admins can)
  const canSwitchViews = (): boolean => {
    return hasRole(['Owner', 'HR Admin', 'Manager'])
  }

  // Switch to admin view
  const switchToAdminView = (): void => {
    if (canSwitchViews()) {
      setViewMode('admin')
      localStorage.setItem('viewMode', 'admin')
    }
  }

  // Switch to employee view
  const switchToEmployeeView = (): void => {
    if (canSwitchViews()) {
      setViewMode('employee')
      localStorage.setItem('viewMode', 'employee')
    }
  }

  // Initialize view mode based on user role and saved preference
  useEffect(() => {
    if (user && isAuthenticated) {
      if (canSwitchViews()) {
        // For admin users, check saved preference or default to admin
        const savedViewMode = localStorage.getItem('viewMode') as ViewMode
        setViewMode(savedViewMode === 'employee' ? 'employee' : 'admin')
      } else {
        // For regular employees, always use employee view
        setViewMode('employee')
      }
    }
  }, [user, isAuthenticated])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        viewMode,
        login,
        logout,
        hasRole,
        canAccess,
        needsOnboarding,
        refreshUser: validateToken,
        switchToAdminView,
        switchToEmployeeView,
        canSwitchViews,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
