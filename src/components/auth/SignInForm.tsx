import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { cn } from '@utility/index'

interface SignInFormProps {
  data: { email: string; password: string }
  setData: (data: { email: string; password: string }) => void
  onSubmit: (e: React.FormEvent) => void
  loading: boolean
  showPassword: boolean
  setShowPassword: (show: boolean) => void
  onGoogleAuth: () => void
  onRegisterOwner: () => void
}

export const SignInForm = ({
  data,
  setData,
  onSubmit,
  loading,
  showPassword,
  setShowPassword,
  onGoogleAuth,
  onRegisterOwner,
}: SignInFormProps) => (
  <form onSubmit={onSubmit} className="space-y-6">
    {/* Google Sign In */}
    <button
      type="button"
      onClick={onGoogleAuth}
      className="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-700 transition-colors duration-200 hover:bg-gray-50"
    >
      <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      Sign in with Google
    </button>

    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="bg-white px-2 text-gray-500">
          Or sign in with email
        </span>
      </div>
    </div>

    {/* Email Input */}
    <div className="relative">
      <label
        htmlFor="email"
        className="mb-2 block text-sm font-medium text-gray-700"
      >
        Email address
      </label>
      <div className="relative">
        <Mail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
        <input
          id="email"
          type="email"
          required
          value={data.email}
          onChange={e => setData({ ...data, email: e.target.value })}
          className="block w-full rounded-lg border border-gray-300 py-3 pr-3 pl-10 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your email"
        />
      </div>
    </div>

    {/* Password Input */}
    <div className="relative">
      <label
        htmlFor="password"
        className="mb-2 block text-sm font-medium text-gray-700"
      >
        Password
      </label>
      <div className="relative">
        <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          required
          value={data.password}
          onChange={e => setData({ ...data, password: e.target.value })}
          className="block w-full rounded-lg border border-gray-300 py-3 pr-12 pl-10 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your password"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>

    {/* Forgot Password */}
    <div className="flex items-center justify-between">
      <div className="text-sm">
        <Link
          to="/forgot-password"
          className="text-blue-600 hover:text-blue-500"
        >
          Forgot your password?
        </Link>
      </div>
    </div>

    {/* Submit Button */}
    <button
      type="submit"
      disabled={loading}
      className={cn(
        'flex w-full justify-center rounded-lg border border-transparent px-4 py-3 text-sm font-medium text-white shadow-sm',
        'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700',
        'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none',
        'transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50'
      )}
    >
      {loading ? (
        <>
          <svg
            className="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Signing in...
        </>
      ) : (
        'Sign in'
      )}
    </button>

    {/* Owner Registration Link */}
    <div className="space-y-3 text-center">
      <p className="text-sm text-gray-600">
        Don't have an account? Contact your HR admin or manager.
      </p>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">Or</span>
        </div>
      </div>
      <p className="text-sm text-gray-600">
        Want to start your own organization?{' '}
        <button
          type="button"
          onClick={onRegisterOwner}
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          Register as Owner
        </button>
      </p>
    </div>
  </form>
)
