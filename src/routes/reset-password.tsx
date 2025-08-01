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
import { Lock, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { api } from '@utility/api'

export const Route = createFileRoute('/reset-password')({
  component: ResetPasswordPage,
  validateSearch: (search: Record<string, unknown>) => ({
    token: search.token as string,
  }),
})

function ResetPasswordPage() {
  const { token } = useSearch({ from: '/reset-password' })
  const router = useRouter()
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
      router.navigate({ to: '/auth' })
    }
  }, [token, router])

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
      await api.post('/auth/reset-password', {
        token,
        newPassword: passwords.newPassword,
      })
      setIsSuccess(true)
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'An error occurred. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
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
              Password Reset Successfully
            </CardTitle>
            <CardDescription>
              Your password has been updated. You can now log in with your new
              password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              onClick={() => router.navigate({ to: '/auth' })}
            >
              Continue to Login
            </Button>
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
            <Lock className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Reset Your Password
          </CardTitle>
          <CardDescription>
            Create a new secure password for your account
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
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPasswords.new ? 'text' : 'password'}
                  placeholder="Enter new password"
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
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPasswords.confirm ? 'text' : 'password'}
                  placeholder="Confirm new password"
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
              {isLoading ? 'Updating Password...' : 'Update Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
