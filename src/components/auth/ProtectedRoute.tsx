import { useAuth } from '@contexts/AuthContext'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useMemo } from 'react'
import type { ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
  skipOnboardingCheck?: boolean
}

export const ProtectedRoute = ({
  children,
  skipOnboardingCheck = false,
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, needsOnboarding } = useAuth()
  const navigate = useNavigate()

  // Memoize the onboarding check result to prevent infinite re-renders
  const requiresOnboarding = useMemo(() => {
    return !skipOnboardingCheck && needsOnboarding()
  }, [skipOnboardingCheck, needsOnboarding])

  useEffect(() => {
    // Only navigate if not loading
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate({ to: '/login' })
      } else if (requiresOnboarding) {
        navigate({ to: '/onboarding' })
      }
    }
  }, [isAuthenticated, requiresOnboarding, navigate, isLoading])

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-r-transparent"></div>
          <p className="text-gray-600">Authenticating...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!skipOnboardingCheck && requiresOnboarding) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-32 w-32 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Redirecting to onboarding...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
