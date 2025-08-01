import React, { useState, useEffect } from 'react'
import { createFileRoute, useRouter, useSearch } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { UserCheck, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@contexts/AuthContext'

export const Route = createFileRoute('/first-login')({
  component: FirstLoginPage,
  validateSearch: (search: Record<string, unknown>) => ({
    token: search.token as string,
  }),
})

function FirstLoginPage() {
  const { token } = useSearch({ from: '/first-login' })
  const router = useRouter()
  const { refreshUser } = useAuth()
  const [employeeData, setEmployeeData] = useState<any>(null)
  const [isValidatingToken, setIsValidatingToken] = useState(true)
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: '',
  })
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    if (!token) {
      setError('Invalid setup token')
      setIsValidatingToken(false)
      return
    }

    validateToken()
  }, [token])

  const validateToken = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/employees/account-setup/validate-token/${token}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        }
      )

      if (response.ok) {
        const data = await response.json()
        setEmployeeData(data)
        setIsValidatingToken(false)
      } else {
        const errorData = await response.json().catch(() => ({}))
        setError(errorData.message || 'Invalid or expired setup token')
        setIsValidatingToken(false)
      }
    } catch (err: any) {
      setError('Invalid or expired setup token')
      setIsValidatingToken(false)
    }
  }

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8
    const hasUpper = /[A-Z]/.test(password)
    const hasLower = /[a-z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    return {
      minLength,
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial,
      isValid: minLength && hasUpper && hasLower && hasNumber && hasSpecial,
    }
  }

  const passwordValidation = validatePassword(passwords.newPassword)
  const passwordsMatch = passwords.newPassword === passwords.confirmPassword

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!passwordValidation.isValid) {
      setError('Please ensure your password meets all requirements.')
      return
    }

    if (!passwordsMatch) {
      setError('Passwords do not match.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(
        `http://localhost:3001/api/employees/account-setup/complete/${token}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            newPassword: passwords.newPassword,
          }),
        }
      )

      if (response.ok) {
        const data = await response.json()

        // Store authentication data returned from the backend
        if (data.access_token) {
          localStorage.setItem('access_token', data.access_token)
          localStorage.setItem('user_data', JSON.stringify(data.user))

          // Refresh the auth context to update user state
          try {
            await refreshUser()
            console.log('Auth context refreshed successfully')
          } catch (refreshError) {
            console.error('Failed to refresh auth context:', refreshError)
          }
        }

        setIsSuccess(true)

        // Auto-redirect to dashboard after a short delay
        setTimeout(() => {
          router.navigate({ to: '/' })
        }, 2000)
      } else {
        const errorData = await response.json().catch(() => ({}))
        setError(errorData.message || 'An error occurred. Please try again.')
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'An error occurred. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  if (isValidatingToken) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <UserCheck className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Validating Setup Link
            </CardTitle>
            <CardDescription>
              Please wait while we validate your account setup link...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error && !employeeData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Invalid Setup Link
            </CardTitle>
            <CardDescription>
              The account setup link is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="mt-4">
              <Button
                className="w-full"
                onClick={() => router.navigate({ to: '/auth' })}
              >
                Go to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Welcome to Mini HR!
            </CardTitle>
            <CardDescription>
              Your account has been successfully activated and you're now logged
              in.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <p className="text-sm text-blue-800">
                  <strong>Welcome aboard!</strong>
                  <br />
                  • Your account is now active and you're logged in
                  <br />
                  • Redirecting to your dashboard in a moment...
                  <br />• Complete your profile and start using HR features
                </p>
              </div>

              <Button
                className="w-full"
                onClick={() => router.navigate({ to: '/' })}
              >
                Continue to Dashboard Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <UserCheck className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Complete Your Account Setup
          </CardTitle>
          <CardDescription>
            Welcome! Please create a secure password to activate your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="newPassword">Create Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPasswords.new ? 'text' : 'password'}
                  placeholder="Enter a secure password"
                  value={passwords.newPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPasswords(prev => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() =>
                    setShowPasswords(prev => ({ ...prev, new: !prev.new }))
                  }
                >
                  {showPasswords.new ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {passwords.newPassword && (
                <div className="space-y-1 text-sm">
                  <div
                    className={`flex items-center space-x-2 ${passwordValidation.minLength ? 'text-green-600' : 'text-red-600'}`}
                  >
                    <div
                      className={`h-2 w-2 rounded-full ${passwordValidation.minLength ? 'bg-green-600' : 'bg-red-600'}`}
                    />
                    <span>At least 8 characters</span>
                  </div>
                  <div
                    className={`flex items-center space-x-2 ${passwordValidation.hasUpper ? 'text-green-600' : 'text-red-600'}`}
                  >
                    <div
                      className={`h-2 w-2 rounded-full ${passwordValidation.hasUpper ? 'bg-green-600' : 'bg-red-600'}`}
                    />
                    <span>One uppercase letter</span>
                  </div>
                  <div
                    className={`flex items-center space-x-2 ${passwordValidation.hasLower ? 'text-green-600' : 'text-red-600'}`}
                  >
                    <div
                      className={`h-2 w-2 rounded-full ${passwordValidation.hasLower ? 'bg-green-600' : 'bg-red-600'}`}
                    />
                    <span>One lowercase letter</span>
                  </div>
                  <div
                    className={`flex items-center space-x-2 ${passwordValidation.hasNumber ? 'text-green-600' : 'text-red-600'}`}
                  >
                    <div
                      className={`h-2 w-2 rounded-full ${passwordValidation.hasNumber ? 'bg-green-600' : 'bg-red-600'}`}
                    />
                    <span>One number</span>
                  </div>
                  <div
                    className={`flex items-center space-x-2 ${passwordValidation.hasSpecial ? 'text-green-600' : 'text-red-600'}`}
                  >
                    <div
                      className={`h-2 w-2 rounded-full ${passwordValidation.hasSpecial ? 'bg-green-600' : 'bg-red-600'}`}
                    />
                    <span>One special character</span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPasswords.confirm ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={passwords.confirmPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPasswords(prev => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() =>
                    setShowPasswords(prev => ({
                      ...prev,
                      confirm: !prev.confirm,
                    }))
                  }
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {passwords.confirmPassword && (
                <div
                  className={`flex items-center space-x-2 text-sm ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}
                >
                  <div
                    className={`h-2 w-2 rounded-full ${passwordsMatch ? 'bg-green-600' : 'bg-red-600'}`}
                  />
                  <span>
                    {passwordsMatch
                      ? 'Passwords match'
                      : 'Passwords do not match'}
                  </span>
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={
                isLoading || !passwordValidation.isValid || !passwordsMatch
              }
            >
              {isLoading ? 'Activating Account...' : 'Activate Account'}
            </Button>
          </form>

          <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <p className="text-sm text-yellow-800">
              <strong>Security Note:</strong> This is your first login. After
              setting your password, you'll be able to access all HR system
              features.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
