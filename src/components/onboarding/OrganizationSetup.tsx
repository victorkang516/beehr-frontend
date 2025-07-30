import { useState, useEffect } from 'react'
import type { OnboardingData } from './OnboardingFlow'

interface OrganizationSetupProps {
  data: OnboardingData['organization']
  onUpdate: (data: OnboardingData['organization']) => void
  onNext: () => void
}

const industries = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Manufacturing',
  'Retail',
  'Consulting',
  'Real Estate',
  'Other',
]

const countries = [
  'United States',
  'Canada',
  'United Kingdom',
  'Germany',
  'France',
  'Australia',
  'Singapore',
  'Malaysia',
  'Other',
]

const timezones = [
  'UTC-8 (PST)',
  'UTC-5 (EST)',
  'UTC+0 (GMT)',
  'UTC+1 (CET)',
  'UTC+8 (SGT)',
  'UTC+10 (AEST)',
]

const employeeCounts = ['1-10', '11-50', '51-200', '201-500', '500+']

export function OrganizationSetup({
  data,
  onUpdate,
  onNext,
}: OrganizationSetupProps) {
  const [formData, setFormData] = useState(data)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    onUpdate(formData)
  }, [formData])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Organization name is required'
    }
    if (!formData.industry) {
      newErrors.industry = 'Industry is required'
    }
    if (!formData.country) {
      newErrors.country = 'Country is required'
    }
    if (!formData.timezone) {
      newErrors.timezone = 'Timezone is required'
    }
    if (!formData.employeeCount) {
      newErrors.employeeCount = 'Employee count is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onNext()
    }
  }

  const handleInputChange = (
    field: keyof OnboardingData['organization'],
    value: string
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="mb-2 text-xl font-semibold text-gray-900">
          Let's set up your organization
        </h2>
        <p className="text-gray-600">
          Tell us about your company so we can customize BeeHR for your needs.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Organization Name *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={e => handleInputChange('name', e.target.value)}
            className={`w-full rounded-md border px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your organization name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="industry"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Industry *
            </label>
            <select
              id="industry"
              value={formData.industry}
              onChange={e => handleInputChange('industry', e.target.value)}
              className={`w-full rounded-md border px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors.industry ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select industry</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
            {errors.industry && (
              <p className="mt-1 text-sm text-red-600">{errors.industry}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="employeeCount"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Number of Employees *
            </label>
            <select
              id="employeeCount"
              value={formData.employeeCount}
              onChange={e => handleInputChange('employeeCount', e.target.value)}
              className={`w-full rounded-md border px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors.employeeCount ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select employee count</option>
              {employeeCounts.map(count => (
                <option key={count} value={count}>
                  {count}
                </option>
              ))}
            </select>
            {errors.employeeCount && (
              <p className="mt-1 text-sm text-red-600">
                {errors.employeeCount}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="country"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Country *
            </label>
            <select
              id="country"
              value={formData.country}
              onChange={e => handleInputChange('country', e.target.value)}
              className={`w-full rounded-md border px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors.country ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select country</option>
              {countries.map(country => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            {errors.country && (
              <p className="mt-1 text-sm text-red-600">{errors.country}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="timezone"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Timezone *
            </label>
            <select
              id="timezone"
              value={formData.timezone}
              onChange={e => handleInputChange('timezone', e.target.value)}
              className={`w-full rounded-md border px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors.timezone ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select timezone</option>
              {timezones.map(timezone => (
                <option key={timezone} value={timezone}>
                  {timezone}
                </option>
              ))}
            </select>
            {errors.timezone && (
              <p className="mt-1 text-sm text-red-600">{errors.timezone}</p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Description (Optional)
          </label>
          <textarea
            id="description"
            value={formData.description || ''}
            onChange={e => handleInputChange('description', e.target.value)}
            rows={3}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Tell us about your organization..."
          />
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => (window.location.href = '/')}
            className="rounded-md bg-gray-300 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-400 focus:ring-2 focus:ring-gray-500 focus:outline-none"
          >
            Quit Demo
          </button>
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  )
}
