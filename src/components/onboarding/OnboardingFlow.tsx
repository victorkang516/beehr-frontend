import { useState } from 'react'
import { OrganizationSetup } from './OrganizationSetup'
import { TeamInvitation } from './TeamInvitation'
import { OnboardingComplete } from './OnboardingComplete'

export interface OnboardingData {
  organization: {
    name: string
    industry: string
    country: string
    timezone: string
    employeeCount: string
    logo?: File
    description?: string
  }
  invitations: {
    email: string
    role: 'Manager' | 'Employee'
    department: string
  }[]
}

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(1)
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    organization: {
      name: '',
      industry: '',
      country: '',
      timezone: '',
      employeeCount: '',
      description: '',
    },
    invitations: [],
  })

  const totalSteps = 3

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateOrganizationData = (orgData: OnboardingData['organization']) => {
    setOnboardingData(prev => ({ ...prev, organization: orgData }))
  }

  const updateInvitationsData = (
    invitations: OnboardingData['invitations']
  ) => {
    setOnboardingData(prev => ({ ...prev, invitations }))
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome to BeeHR! 🐝
          </h1>
          <span className="text-sm text-gray-500">
            Step {currentStep} of {totalSteps}
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-blue-600 transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="rounded-lg bg-white p-6 shadow-lg">
        {currentStep === 1 && (
          <OrganizationSetup
            data={onboardingData.organization}
            onUpdate={updateOrganizationData}
            onNext={handleNext}
          />
        )}
        {currentStep === 2 && (
          <TeamInvitation
            data={onboardingData.invitations}
            onUpdate={updateInvitationsData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {currentStep === 3 && (
          <OnboardingComplete data={onboardingData} onBack={handleBack} />
        )}
      </div>
    </div>
  )
}
