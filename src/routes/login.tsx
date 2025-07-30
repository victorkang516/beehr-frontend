import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/login')({
  component: LoginRedirect,
})

function LoginRedirect() {
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect to the new auth page
    navigate({ to: '/auth', replace: true })
  }, [navigate])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-blue-600"></div>
    </div>
  )
}
