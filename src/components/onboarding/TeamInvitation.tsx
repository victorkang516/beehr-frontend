import { useState } from 'react'
import type { OnboardingData } from './OnboardingFlow'
import { Button } from '@/components/ui/button'

interface TeamInvitationProps {
  data: OnboardingData['invitations']
  onUpdate: (data: OnboardingData['invitations']) => void
  onNext: () => void
  onBack: () => void
}

const roles = ['Manager', 'Employee'] as const
const departments = [
  'Human Resources',
  'Engineering',
  'Marketing',
  'Sales',
  'Finance',
  'Operations',
  'Customer Support',
  'Other',
]

interface InvitationForm {
  email: string
  role: 'Manager' | 'Employee'
  department: string
}

export function TeamInvitation({
  data,
  onUpdate,
  onNext,
  onBack,
}: TeamInvitationProps) {
  const [invitations, setInvitations] =
    useState<OnboardingData['invitations']>(data)
  const [currentInvitation, setCurrentInvitation] = useState<InvitationForm>({
    email: '',
    role: 'Employee',
    department: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateInvitation = () => {
    const newErrors: Record<string, string> = {}

    if (!currentInvitation.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentInvitation.email)) {
      newErrors.email = 'Please enter a valid email address'
    } else if (invitations.some(inv => inv.email === currentInvitation.email)) {
      newErrors.email = 'This email has already been invited'
    }

    if (!currentInvitation.department) {
      newErrors.department = 'Department is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const addInvitation = () => {
    if (validateInvitation()) {
      const newInvitations = [...invitations, { ...currentInvitation }]
      setInvitations(newInvitations)
      onUpdate(newInvitations)
      setCurrentInvitation({
        email: '',
        role: 'Employee',
        department: '',
      })
      setErrors({})
    }
  }

  const removeInvitation = (index: number) => {
    const newInvitations = invitations.filter((_, i) => i !== index)
    setInvitations(newInvitations)
    onUpdate(newInvitations)
  }

  const handleNext = () => {
    onNext()
  }

  const handleInputChange = (field: keyof InvitationForm, value: string) => {
    setCurrentInvitation(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="mb-2 text-xl font-semibold text-gray-900">
          Invite your team members
        </h2>
        <p className="text-gray-600">
          Add team members to your organization. You can always invite more
          people later.
        </p>
      </div>

      {/* Add Invitation Form */}
      <div className="mb-6 rounded-lg bg-gray-50 p-4">
        <h3 className="mb-4 text-sm font-medium text-gray-900">
          Add Team Member
        </h3>

        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              value={currentInvitation.email}
              onChange={e => handleInputChange('email', e.target.value)}
              className={`w-full rounded-md border px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="role"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Role *
            </label>
            <select
              id="role"
              value={currentInvitation.role}
              onChange={e =>
                handleInputChange(
                  'role',
                  e.target.value as 'Manager' | 'Employee'
                )
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {roles.map(role => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="department"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Department *
            </label>
            <select
              id="department"
              value={currentInvitation.department}
              onChange={e => handleInputChange('department', e.target.value)}
              className={`w-full rounded-md border px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors.department ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            {errors.department && (
              <p className="mt-1 text-sm text-red-600">{errors.department}</p>
            )}
          </div>
        </div>

        <Button type="button" onClick={addInvitation}>
          Add Invitation
        </Button>
      </div>

      {/* Invitations List */}
      {invitations.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-3 text-sm font-medium text-gray-900">
            Pending Invitations ({invitations.length})
          </h3>
          <div className="space-y-3">
            {invitations.map((invitation, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-md border border-gray-200 bg-white p-3"
              >
                <div className="flex-1">
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
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeInvitation(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {invitations.length === 0 && (
        <div className="py-8 text-center text-gray-500">
          <p>No team members added yet.</p>
          <p className="text-sm">
            You can add team members now or skip this step and invite them
            later.
          </p>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleNext}>
          {invitations.length > 0 ? 'Send Invitations' : 'Skip for Now'}
        </Button>
      </div>
    </div>
  )
}
