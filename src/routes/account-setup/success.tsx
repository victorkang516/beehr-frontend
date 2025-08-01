import { useEffect, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@contexts/AuthContext'

export const Route = createFileRoute('/account-setup/success')({
  component: AccountSetupSuccess,
  validateSearch: search => ({
    token: (search as any).token || '',
  }),
})

function AccountSetupSuccess() {
  const navigate = useNavigate()
  const { refreshUser } = useAuth()
  const { token } = Route.useSearch()
  const [isProcessing, setIsProcessing] = useState(true)

  useEffect(() => {
    if (token) {
      // Store the token in localStorage
      localStorage.setItem('token', token)

      // Refresh user data
      refreshUser()
        .then(() => {
          setIsProcessing(false)
          // Redirect to dashboard after 3 seconds
          setTimeout(() => {
            navigate({ to: '/' })
          }, 3000)
        })
        .catch(err => {
          console.error('Failed to refresh user data:', err)
          setIsProcessing(false)
          // Still redirect to login on error
          setTimeout(() => {
            navigate({ to: '/auth' })
          }, 3000)
        })
    } else {
      setIsProcessing(false)
      // No token, redirect to login
      setTimeout(() => {
        navigate({ to: '/auth' })
      }, 3000)
    }
  }, [token, refreshUser, navigate])

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-full max-w-md rounded-lg border bg-white p-6 shadow-md">
        <div className="text-center">
          <div className="mb-4 text-6xl text-green-500">🎉</div>
          <h1 className="mb-2 text-2xl font-bold text-gray-800">
            Account Setup Complete!
          </h1>
          <p className="mb-6 text-gray-600">
            Congratulations! Your account has been successfully set up.
            {token
              ? ' You will be redirected to the dashboard shortly.'
              : ' Please log in to continue.'}
          </p>

          {isProcessing && (
            <div className="mb-4 flex items-center justify-center">
              <div className="mr-2 h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600"></div>
              <span className="text-gray-600">
                {token ? 'Logging you in...' : 'Redirecting to login...'}
              </span>
            </div>
          )}

          <button
            onClick={() => navigate({ to: token ? '/' : '/auth' })}
            className="rounded bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
          >
            {token ? 'Go to Dashboard' : 'Go to Login'}
          </button>
        </div>
      </div>
    </div>
  )
}
