import { createFileRoute } from '@tanstack/react-router'
import { ProtectedRoute, RoleProtected } from '@components/index'

export const Route = createFileRoute('/admin/leave')({
  component: AdminLeave,
})

function AdminLeave() {
  return (
    <ProtectedRoute>
      <RoleProtected allowedRoles={['Owner', 'HR Admin', 'Manager']}>
        <div className="space-y-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Leave Management
            </h1>
            <p className="mt-2 text-gray-600">
              Manage leave requests and time off
            </p>
          </div>

          {/* Coming Soon */}
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
            <div className="mb-4 text-6xl">🏖️</div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900">
              Leave Management
            </h2>
            <p className="mb-6 text-gray-600">
              This feature is coming soon. You'll be able to manage leave
              requests, track time off, and view leave balances.
            </p>
            <div className="inline-flex items-center rounded-lg bg-blue-100 px-4 py-2 text-blue-700">
              <span className="mr-2">🚀</span>
              Coming Soon
            </div>
          </div>
        </div>
      </RoleProtected>
    </ProtectedRoute>
  )
}
