import { useState, useEffect } from 'react'
import { useNavigate, createFileRoute } from '@tanstack/react-router'
import { api } from '@utility/api'

export const Route = createFileRoute('/account-setup')({
  component: AccountSetup,
  validateSearch: search => ({
    token: (search as any).token || '',
  }),
})

interface AccountSetupData {
  employee: {
    id: number
    firstName: string
    lastName: string
    email: string
    position: string
    department: string
  }
  needsPasswordSetup: boolean
  canLinkGoogle: boolean
  isFirstLogin: boolean
}

function AccountSetup() {
  const navigate = useNavigate()
  const { token } = Route.useSearch()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [setupData, setSetupData] = useState<AccountSetupData | null>(null)
  const [error, setError] = useState('')
  const [step, setStep] = useState<'loading' | 'setup' | 'success'>('loading')

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
    linkGoogle: false,
  })

  useEffect(() => {
    if (!token) {
      setError('Invalid setup token')
      setLoading(false)
      return
    }

    validateToken()
  }, [token])

  const validateToken = async () => {
    try {
      const response = await api.get(`/employees/validate-token/${token}`)
      setSetupData(response.data)
      setStep('setup')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired setup token')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      await api.post(`/employees/complete/${token}`, {
        password: formData.password,
        linkGoogleAccount: formData.linkGoogle,
      })

      setStep('success')

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate({ to: '/login' })
      }, 3000)
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Failed to complete account setup'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoogleAuth = () => {
    // Redirect to Google OAuth with setup token
    window.location.href = `/api/auth/google?setup_token=${token}`
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="w-full max-w-md rounded-lg border bg-white p-6 shadow-md">
          <div className="flex items-center justify-center">
            <div className="mr-2 h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <span>Validating setup token...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error && !setupData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="w-full max-w-md rounded-lg border bg-white p-6 shadow-md">
          <div className="text-center">
            <div className="mb-4 text-4xl text-red-500">⚠️</div>
            <h2 className="mb-2 text-xl font-semibold">Setup Error</h2>
            <p className="mb-4 text-gray-600">{error}</p>
            <button
              onClick={() => navigate({ to: '/login' })}
              className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'success') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="w-full max-w-md rounded-lg border bg-white p-6 shadow-md">
          <div className="text-center">
            <div className="mb-4 text-4xl text-green-500">✅</div>
            <h2 className="mb-2 text-xl font-semibold">
              Account Setup Complete!
            </h2>
            <p className="mb-4 text-gray-600">
              Your account has been successfully set up. You will be redirected
              to the login page.
            </p>
            <button
              onClick={() => navigate({ to: '/login' })}
              className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Continue to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-full max-w-md rounded-lg border bg-white p-6 shadow-md">
        <div className="mb-6">
          <h1 className="mb-2 text-2xl font-bold">
            Complete Your Account Setup
          </h1>
          <p className="text-gray-600">
            Welcome {setupData?.employee.firstName}! Please set up your account
            to continue.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-red-700">
            {error}
          </div>
        )}

        <div className="mb-6 rounded-lg bg-gray-50 p-4">
          <h3 className="mb-2 font-medium">Employee Information</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <p>
              <strong>Name:</strong> {setupData?.employee.firstName}{' '}
              {setupData?.employee.lastName}
            </p>
            <p>
              <strong>Email:</strong> {setupData?.employee.email}
            </p>
            <p>
              <strong>Position:</strong> {setupData?.employee.position}
            </p>
            <p>
              <strong>Department:</strong> {setupData?.employee.department}
            </p>
          </div>
        </div>

        {setupData?.needsPasswordSetup && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData(prev => ({ ...prev, password: e.target.value }))
                }
                required
                minLength={6}
                placeholder="Enter your password"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData(prev => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                required
                minLength={6}
                placeholder="Confirm your password"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {setupData?.canLinkGoogle && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="linkGoogle"
                  checked={formData.linkGoogle}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData(prev => ({
                      ...prev,
                      linkGoogle: e.target.checked,
                    }))
                  }
                  className="rounded"
                />
                <label htmlFor="linkGoogle" className="text-sm text-gray-700">
                  Link Google account for easier login
                </label>
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? (
                <span className="flex items-center justify-center">
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                  Setting up account...
                </span>
              ) : (
                'Complete Setup'
              )}
            </button>
          </form>
        )}

        {setupData?.canLinkGoogle && !setupData?.needsPasswordSetup && (
          <div className="space-y-4">
            <p className="text-center text-sm text-gray-600">
              You can link your Google account to make logging in easier.
            </p>
            <button
              onClick={handleGoogleAuth}
              className="w-full rounded border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              Link Google Account
            </button>
            <button
              onClick={() => navigate({ to: '/login' })}
              className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Continue without Google
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
