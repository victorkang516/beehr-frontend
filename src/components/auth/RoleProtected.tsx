import { useAuth, type UserRole } from '@contexts/AuthContext'
import type { ReactNode } from 'react'

interface RoleProtectedProps {
  children: ReactNode
  allowedRoles: UserRole[]
  fallback?: ReactNode
}

export const RoleProtected = ({
  children,
  allowedRoles,
  fallback,
}: RoleProtectedProps) => {
  const { canAccess } = useAuth()

  if (!canAccess(allowedRoles)) {
    return (
      fallback || (
        <div className="flex min-h-96 items-center justify-center">
          <div className="text-center">
            <div className="mb-4 text-6xl">🚫</div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900">
              Access Denied
            </h2>
            <p className="text-gray-600">
              You don't have permission to access this area.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Required roles: {allowedRoles.join(', ')}
            </p>
          </div>
        </div>
      )
    )
  }

  return <>{children}</>
}
