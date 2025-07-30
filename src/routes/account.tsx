import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@contexts/AuthContext'
import { cn } from '@utility/index'
import { ProtectedRoute } from '@components/index'

export const Route = createFileRoute('/account')({
  component: Account,
})

function Account() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            Not Authenticated
          </h2>
          <p className="text-gray-600">Please log in to view your account.</p>
        </div>
      </div>
    )
  }

  const handleLogout = () => {
    logout(() => navigate({ to: '/login' }))
  }

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
            <p className="mt-2 text-gray-600">
              Manage your personal information and account settings
            </p>
          </div>
          <button
            onClick={handleLogout}
            className={cn(
              'rounded-lg bg-red-600 px-4 py-2 text-white',
              'transition-colors duration-200 hover:bg-red-700',
              'flex items-center gap-2 font-medium'
            )}
          >
            <span className="text-lg">🚪</span>
            Logout
          </button>
        </div>

        {/* Profile Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100">
                <span className="text-3xl font-bold text-blue-600">
                  {user.name
                    .split(' ')
                    .map(n => n[0])
                    .join('')}
                </span>
              </div>
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <h2 className="mb-2 text-2xl font-bold text-gray-900">
                {user.name}
              </h2>
              <p className="mb-1 text-lg text-gray-600">{user.position}</p>
              <p className="mb-1 text-gray-500">{user.department} Department</p>
              <p className="mb-3 font-medium text-blue-600">{user.role}</p>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <span>📧</span>
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>📅</span>
                  <span>
                    Joined {new Date(user.joinDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Personal Information */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Personal Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900">
                  {user.name}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900">
                  {user.email}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900">
                  {user.phone || 'Not provided'}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Address
                </label>
                <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900">
                  {user.address || 'Not provided'}
                </div>
              </div>
            </div>
          </div>

          {/* Work Information */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Work Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Employee ID
                </label>
                <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900">
                  EMP{user.id.toString().padStart(4, '0')}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Department
                </label>
                <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900">
                  {user.department}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Position
                </label>
                <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900">
                  {user.position}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Join Date
                </label>
                <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900">
                  {new Date(user.joinDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Account Actions
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <button
              className={cn(
                'rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50',
                'text-left'
              )}
            >
              <div className="mb-2 text-2xl">🔐</div>
              <div className="font-medium text-gray-900">Change Password</div>
              <div className="text-sm text-gray-500">
                Update your account password
              </div>
            </button>

            <button
              className={cn(
                'rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50',
                'text-left'
              )}
            >
              <div className="mb-2 text-2xl">✏️</div>
              <div className="font-medium text-gray-900">Edit Profile</div>
              <div className="text-sm text-gray-500">
                Update your personal information
              </div>
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
