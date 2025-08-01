import { useAuth } from '@contexts/AuthContext'
import {
  useToast,
  SignInForm,
  OwnerRegistrationForm,
  type SignUpFormData,
} from '@components/index'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { api } from '@utility/api'

export const Route = createFileRoute('/auth')({
  component: AuthPage,
})

type AuthMode = 'signin' | 'register-owner'

function AuthPage() {
  const navigate = useNavigate()
  const { login, isAuthenticated, needsOnboarding } = useAuth()
  const { addToast } = useToast()
  const [mode, setMode] = useState<AuthMode>('signin')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Sign in form state
  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
  })

  // Sign up form state
  const [signUpData, setSignUpData] = useState<SignUpFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    organizationName: '',
    position: 'CEO',
    department: '',
  })

  useEffect(() => {
    if (isAuthenticated && !needsOnboarding()) {
      navigate({ to: '/' })
    } else if (isAuthenticated && needsOnboarding()) {
      navigate({ to: '/onboarding' })
    }
  }, [isAuthenticated, needsOnboarding, navigate])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await api.post('/auth/login', signInData)

      console.log('Sign In Response:', response)

      if (response.status === 200 && response.data) {
        // Check if user needs to complete account setup
        if (response.data.user && !response.data.user.firstLoginCompleted) {
          // Store the token temporarily to check account setup status
          const tempToken = response.data.access_token
          localStorage.setItem('access_token', tempToken)

          // Check if user has an account setup token
          try {
            const statusResponse = await api.get(
              '/employees/account-setup/status'
            )

            if (statusResponse.status === 200 && statusResponse.data) {
              if (
                statusResponse.data.requiresSetup &&
                statusResponse.data.setupToken
              ) {
                // Clear the temporary token since user needs to complete setup
                localStorage.removeItem('access_token')

                // Redirect to first login with token
                navigate({
                  to: '/first-login',
                  search: { token: statusResponse.data.setupToken },
                })
                return
              }
            }
          } catch (err) {
            console.error('Failed to check account setup status:', err)
            // Clear the temporary token on error
            localStorage.removeItem('access_token')
          }

          addToast(
            'warning',
            'Account Setup Required',
            'Please contact your administrator to complete your account setup.'
          )
          return
        }

        await login(signInData.email, signInData.password)
        addToast(
          'success',
          'Welcome back!',
          'You have been successfully signed in.'
        )
      } else {
        addToast(
          'error',
          'Sign In Failed',
          response.error || 'Invalid credentials. Please try again.'
        )
      }
    } catch (error) {
      addToast(
        'error',
        'Connection Error',
        'Unable to connect to the server. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleOwnerSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (signUpData.password !== signUpData.confirmPassword) {
      addToast(
        'error',
        'Password Mismatch',
        'Passwords do not match. Please try again.'
      )
      return
    }

    setLoading(true)

    try {
      const response = await api.post('/auth/register-owner', {
        firstName: signUpData.firstName,
        lastName: signUpData.lastName,
        email: signUpData.email,
        password: signUpData.password,
        organizationName: signUpData.organizationName,
      })

      if (response.status === 200 || response.status === 201) {
        addToast(
          'success',
          'Organization Created Successfully!',
          'Your account has been created and you can now sign in.'
        )
        setMode('signin')
      } else {
        addToast(
          'error',
          'Registration Failed',
          response.error || 'Failed to create account. Please try again.'
        )
      }
    } catch (error) {
      addToast(
        'error',
        'Connection Error',
        'Unable to connect to the server. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = () => {
    // Redirect to Google OAuth endpoint
    window.location.href = 'http://localhost:3001/api/auth/google'
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Left Panel - Visual */}
      <div className="relative hidden overflow-hidden lg:flex lg:w-1/2">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white">
          <div className="max-w-md text-center">
            <h1 className="mb-6 text-4xl leading-tight font-bold">
              {mode === 'signin'
                ? 'Welcome Back to MiniHR'
                : 'Start Your HR Journey'}
            </h1>
            <p className="mb-8 text-xl leading-relaxed text-blue-100">
              {mode === 'signin'
                ? 'Streamline your workforce management with our comprehensive HR platform'
                : 'Create your organization and manage your workforce with ease'}
            </p>
            <div className="space-y-4 text-left">
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 rounded-full bg-blue-300" />
                <span className="text-blue-100">Employee Management</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 rounded-full bg-blue-300" />
                <span className="text-blue-100">Attendance Tracking</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 rounded-full bg-blue-300" />
                <span className="text-blue-100">Leave Management</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 rounded-full bg-blue-300" />
                <span className="text-blue-100">Reporting & Analytics</span>
              </div>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 h-32 w-32 rounded-full bg-white/10 blur-xl" />
        <div className="absolute bottom-20 left-20 h-24 w-24 rounded-full bg-blue-400/20 blur-lg" />
        <div className="absolute top-1/2 right-10 h-16 w-16 rounded-full bg-purple-400/20 blur-md" />
      </div>

      {/* Right Panel - Form */}
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
            {mode === 'signin' ? (
              <SignInForm
                data={signInData}
                setData={setSignInData}
                onSubmit={handleSignIn}
                loading={loading}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                onGoogleAuth={handleGoogleAuth}
                onRegisterOwner={() => setMode('register-owner')}
              />
            ) : (
              <OwnerRegistrationForm
                data={signUpData}
                setData={setSignUpData}
                onSubmit={handleOwnerSignUp}
                loading={loading}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                showConfirmPassword={showConfirmPassword}
                setShowConfirmPassword={setShowConfirmPassword}
                onBack={() => setMode('signin')}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
