import { useAuth } from '@contexts/AuthContext'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/auth/callback')({
  component: AuthCallback,
})

function AuthCallback() {
  const navigate = useNavigate()
  const { login } = useAuth()

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const token = urlParams.get('token')

      if (token) {
        try {
          // Store the token and get user profile
          localStorage.setItem('access_token', token)

          // Get user profile with the token
          const response = await fetch('/api/auth/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (response.ok) {
            const userData = await response.json()
            // Update auth context with user data - we'll need to modify login method
            // For now, let's simulate the login
            localStorage.setItem('user', JSON.stringify(userData))
            window.location.href = '/'
          } else {
            navigate({
              to: '/auth',
              search: { error: 'Failed to get user profile' },
            })
          }
        } catch (error) {
          console.error('Error during Google auth callback:', error)
          navigate({ to: '/auth', search: { error: 'Authentication failed' } })
        }
      } else {
        navigate({ to: '/auth', search: { error: 'No token received' } })
      }
    }

    handleCallback()
  }, [login, navigate])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-32 w-32 animate-spin rounded-full border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Completing sign in...</p>
      </div>
    </div>
  )
}
