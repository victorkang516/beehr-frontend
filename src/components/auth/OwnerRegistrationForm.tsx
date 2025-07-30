import { Eye, EyeOff, Mail, Lock, User, Building } from 'lucide-react'
import { cn } from '@utility/index'

export interface SignUpFormData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  organizationName?: string
  position: string
  department: string
}

interface OwnerRegistrationFormProps {
  data: SignUpFormData
  setData: (data: SignUpFormData) => void
  onSubmit: (e: React.FormEvent) => void
  loading: boolean
  showPassword: boolean
  setShowPassword: (show: boolean) => void
  showConfirmPassword: boolean
  setShowConfirmPassword: (show: boolean) => void
  onBack: () => void
}

export const OwnerRegistrationForm = ({
  data,
  setData,
  onSubmit,
  loading,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  onBack,
}: OwnerRegistrationFormProps) => (
  <form onSubmit={onSubmit} className="space-y-6">
    {/* Info Banner */}
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <Building className="h-5 w-5 text-blue-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-blue-800">
            Organization Owner Registration
          </h3>
          <div className="mt-2 text-sm text-blue-700">
            <p>
              As an organization owner, you'll have full access to all features
              and can manage your entire workforce. You'll be able to:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
              <li>Create and manage employee accounts</li>
              <li>Set up organizational structure</li>
              <li>Configure HR policies and workflows</li>
              <li>Access all reports and analytics</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    {/* Organization Name */}
    <div>
      <label
        htmlFor="organizationName"
        className="mb-2 block text-sm font-medium text-gray-700"
      >
        Organization name
      </label>
      <div className="relative">
        <Building className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
        <input
          id="organizationName"
          type="text"
          required
          value={data.organizationName || ''}
          onChange={e => setData({ ...data, organizationName: e.target.value })}
          className="block w-full rounded-lg border border-gray-300 py-3 pr-3 pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          placeholder="Acme Corporation"
        />
      </div>
    </div>

    {/* Owner Details */}
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label
          htmlFor="firstName"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          First name
        </label>
        <div className="relative">
          <User className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
          <input
            id="firstName"
            type="text"
            required
            value={data.firstName}
            onChange={e => setData({ ...data, firstName: e.target.value })}
            className="block w-full rounded-lg border border-gray-300 py-3 pr-3 pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            placeholder="John"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="lastName"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Last name
        </label>
        <input
          id="lastName"
          type="text"
          required
          value={data.lastName}
          onChange={e => setData({ ...data, lastName: e.target.value })}
          className="block w-full rounded-lg border border-gray-300 px-3 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          placeholder="Doe"
        />
      </div>
    </div>

    {/* Email */}
    <div>
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
          className="block w-full rounded-lg border border-gray-300 py-3 pr-3 pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          placeholder="john.doe@acme.com"
        />
      </div>
    </div>

    {/* Position (auto-filled as CEO/Owner) */}
    <div>
      <label
        htmlFor="position"
        className="mb-2 block text-sm font-medium text-gray-700"
      >
        Your position
      </label>
      <input
        id="position"
        type="text"
        value={data.position || 'CEO'}
        onChange={e => setData({ ...data, position: e.target.value })}
        className="block w-full rounded-lg border border-gray-300 px-3 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        placeholder="CEO"
      />
    </div>

    {/* Password Fields */}
    <div className="grid grid-cols-2 gap-4">
      <div>
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
            className="block w-full rounded-lg border border-gray-300 py-3 pr-12 pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            placeholder="Create password"
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
      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Confirm password
        </label>
        <div className="relative">
          <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            required
            value={data.confirmPassword}
            onChange={e =>
              setData({ ...data, confirmPassword: e.target.value })
            }
            className="block w-full rounded-lg border border-gray-300 py-3 pr-12 pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            placeholder="Confirm password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </div>

    {/* Action Buttons */}
    <div className="flex space-x-4">
      <button
        type="button"
        onClick={onBack}
        className="flex flex-1 justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
      >
        Back
      </button>
      <button
        type="submit"
        disabled={loading}
        className={cn(
          'flex flex-1 justify-center rounded-lg border border-transparent px-4 py-3 text-sm font-medium text-white shadow-sm',
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
            Registering organization...
          </>
        ) : (
          'Create organization'
        )}
      </button>
    </div>
  </form>
)
