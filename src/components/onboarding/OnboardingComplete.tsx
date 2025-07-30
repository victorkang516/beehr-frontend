import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '@contexts/index'
import { api } from '@utility/index'
import type { OnboardingData } from './OnboardingFlow'

interface OnboardingCompleteProps {
  data: OnboardingData
  onBack: () => void
}

export function OnboardingComplete({ data, onBack }: OnboardingCompleteProps) {
  const navigate = useNavigate()
  const auth = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleComplete = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Validate required fields before submission
      const { organization } = data
      if (
        !organization.name ||
        !organization.industry ||
        !organization.country ||
        !organization.timezone ||
        !organization.employeeCount
      ) {
        throw new Error('Please fill in all required organization fields')
      }

      // Debug: Log the data being sent
      console.log('Sending organization data:', data.organization)

      // Submit organization data to backend
      const response = await api.post('/organizations', data.organization)

      if (response.error) {
        throw new Error(response.error)
      }

      console.log('Organization created successfully:', response.data)

      // TODO: Send team invitations
      if (data.invitations.length > 0) {
        console.log('Sending invitations to:', data.invitations)
        // Implementation for sending invitations will be added later
      }

      // Refresh user data to get updated organization info
      // This will trigger a profile fetch which should include the new organization
      await auth.refreshUser()

      // Navigate to main dashboard
      navigate({ to: '/' })
    } catch (err) {
      console.error('Error completing onboarding:', err)
      setError(err instanceof Error ? err.message : 'Failed to complete setup')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSendInvitations = () => {
    // TODO: Implement invitation sending logic
    console.log('Sending invitations to:', data.invitations)
    alert(`Invitations will be sent to ${data.invitations.length} team members`)
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="mb-2 text-xl font-semibold text-gray-900">
          🎉 You're all set!
        </h2>
        <p className="text-gray-600">
          Review your organization details and team invitations before
          completing setup.
        </p>
      </div>

      {/* Organization Summary */}
      <div className="mb-6 rounded-lg bg-gray-50 p-6">
        <h3 className="mb-4 text-lg font-medium text-gray-900">
          Organization Details
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-500">
              Organization Name
            </label>
            <p className="text-gray-900">{data.organization.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">
              Industry
            </label>
            <p className="text-gray-900">{data.organization.industry}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">
              Country
            </label>
            <p className="text-gray-900">{data.organization.country}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">
              Timezone
            </label>
            <p className="text-gray-900">{data.organization.timezone}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">
              Employee Count
            </label>
            <p className="text-gray-900">{data.organization.employeeCount}</p>
          </div>
          {data.organization.description && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-500">
                Description
              </label>
              <p className="text-gray-900">{data.organization.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Team Invitations Summary */}
      {data.invitations.length > 0 && (
        <div className="mb-6 rounded-lg bg-blue-50 p-6">
          <h3 className="mb-4 text-lg font-medium text-gray-900">
            Team Invitations ({data.invitations.length})
          </h3>
          <div className="space-y-3">
            {data.invitations.map((invitation, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-md border border-blue-200 bg-white p-3"
              >
                <div className="flex items-center space-x-4">
                  <span className="font-medium text-gray-900">
                    {invitation.email}
                  </span>
                  <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                    {invitation.role}
                  </span>
                  <span className="text-sm text-gray-500">
                    {invitation.department}
                  </span>
                </div>
                <span className="text-xs font-medium text-green-600">
                  Ready to send
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-md bg-blue-100 p-3">
            <p className="text-sm text-blue-800">
              📧 Invitation emails will include a secure link that expires in 7
              days.
            </p>
          </div>
        </div>
      )}

      {data.invitations.length === 0 && (
        <div className="mb-6 rounded-lg bg-yellow-50 p-6">
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No Team Invitations
          </h3>
          <p className="text-gray-600">
            You can invite team members later from your dashboard.
          </p>
        </div>
      )}

      {/* Next Steps */}
      <div className="mb-6 rounded-lg bg-green-50 p-6">
        <h3 className="mb-4 text-lg font-medium text-gray-900">
          What happens next?
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-center">
            <span className="mr-3 h-2 w-2 rounded-full bg-green-500"></span>
            Your organization will be created
          </li>
          {data.invitations.length > 0 && (
            <li className="flex items-center">
              <span className="mr-3 h-2 w-2 rounded-full bg-green-500"></span>
              Invitation emails will be sent to your team members
            </li>
          )}
          <li className="flex items-center">
            <span className="mr-3 h-2 w-2 rounded-full bg-green-500"></span>
            You'll be redirected to your BeeHR dashboard
          </li>
          <li className="flex items-center">
            <span className="mr-3 h-2 w-2 rounded-full bg-green-500"></span>
            You can start managing your team and HR processes
          </li>
        </ul>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-red-500">⚠️</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Setup Failed</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="rounded-md border border-gray-300 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
        >
          Back
        </button>
        <div className="space-x-3">
          {data.invitations.length > 0 && (
            <button
              type="button"
              onClick={handleSendInvitations}
              className="rounded-md border border-blue-600 px-6 py-2 text-blue-600 transition-colors hover:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              Preview Invitations
            </button>
          )}
          <button
            type="button"
            onClick={handleComplete}
            disabled={isSubmitting}
            className="flex items-center space-x-2 rounded-md bg-green-600 px-6 py-2 text-white transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {isSubmitting && (
              <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
            )}
            <span>
              {isSubmitting ? 'Creating Organization...' : 'Complete Setup'}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
