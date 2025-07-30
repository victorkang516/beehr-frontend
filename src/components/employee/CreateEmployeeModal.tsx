import { useState } from 'react'
import { cn } from '@utility/index'

interface CreateEmployeeRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  department: string
  position: string
  role?: 'HR Admin' | 'Manager' | 'Employee'
  joinDate: string
  phone?: string
  address?: string
}

interface CreateEmployeeModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (employee: CreateEmployeeRequest) => void
}

const departments = [
  'Engineering',
  'Marketing',
  'HR',
  'Sales',
  'Finance',
  'Operations',
]

export default function CreateEmployeeModal({
  isOpen,
  onClose,
  onSave,
}: CreateEmployeeModalProps) {
  const [formData, setFormData] = useState<CreateEmployeeRequest>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    department: '',
    position: '',
    role: 'Employee',
    joinDate: new Date().toISOString().split('T')[0],
    phone: '',
    address: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim())
      newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Email is invalid'
    if (!formData.password.trim()) newErrors.password = 'Password is required'
    else if (formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters'
    if (!formData.department) newErrors.department = 'Department is required'
    if (!formData.position.trim()) newErrors.position = 'Position is required'
    if (!formData.joinDate) newErrors.joinDate = 'Join date is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSave(formData)
      handleClose()
    }
  }

  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      department: '',
      position: '',
      role: 'Employee',
      joinDate: new Date().toISOString().split('T')[0],
      phone: '',
      address: '',
    })
    setErrors({})
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="bg-opacity-40 fixed inset-0 z-50 flex items-center justify-center bg-gray-500/10 backdrop-blur-sm">
      <div className="mx-4 my-4 h-[80vh] w-full max-w-md overflow-y-auto rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Add New Employee
          </h2>
          <button
            onClick={handleClose}
            className="text-xl text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {/* First Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              First Name *
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={e =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              className={cn(
                'w-full rounded-md border px-3 py-2',
                'focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none',
                errors.firstName ? 'border-red-500' : 'border-gray-200'
              )}
              placeholder="Enter first name"
            />
            {errors.firstName && (
              <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Last Name *
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={e =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              className={cn(
                'w-full rounded-md border px-3 py-2',
                'focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none',
                errors.lastName ? 'border-red-500' : 'border-gray-200'
              )}
              placeholder="Enter last name"
            />
            {errors.lastName && (
              <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={e =>
                setFormData({ ...formData, email: e.target.value })
              }
              className={cn(
                'w-full rounded-md border px-3 py-2',
                'focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none',
                errors.email ? 'border-red-500' : 'border-gray-200'
              )}
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Password *
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={e =>
                setFormData({ ...formData, password: e.target.value })
              }
              className={cn(
                'w-full rounded-md border px-3 py-2',
                'focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none',
                errors.password ? 'border-red-500' : 'border-gray-200'
              )}
              placeholder="Enter password (min 6 characters)"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Department */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Department *
            </label>
            <select
              value={formData.department}
              onChange={e =>
                setFormData({ ...formData, department: e.target.value })
              }
              className={cn(
                'w-full rounded-md border px-3 py-2',
                'focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none',
                errors.department ? 'border-red-500' : 'border-gray-200'
              )}
            >
              <option value="">Select department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            {errors.department && (
              <p className="mt-1 text-xs text-red-500">{errors.department}</p>
            )}
          </div>

          {/* Position */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Position *
            </label>
            <input
              type="text"
              value={formData.position}
              onChange={e =>
                setFormData({ ...formData, position: e.target.value })
              }
              className={cn(
                'w-full rounded-md border px-3 py-2',
                'focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none',
                errors.position ? 'border-red-500' : 'border-gray-200'
              )}
              placeholder="Enter position title"
            />
            {errors.position && (
              <p className="mt-1 text-xs text-red-500">{errors.position}</p>
            )}
          </div>

          {/* Join Date */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Join Date *
            </label>
            <input
              type="date"
              value={formData.joinDate}
              onChange={e =>
                setFormData({ ...formData, joinDate: e.target.value })
              }
              className={cn(
                'w-full rounded-md border px-3 py-2',
                'focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none',
                errors.joinDate ? 'border-red-500' : 'border-gray-200'
              )}
            />
            {errors.joinDate && (
              <p className="mt-1 text-xs text-red-500">{errors.joinDate}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              value={formData.role}
              onChange={e =>
                setFormData({
                  ...formData,
                  role: e.target.value as 'HR Admin' | 'Manager' | 'Employee',
                })
              }
              className="w-full rounded-md border border-gray-200 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="Employee">Employee</option>
              <option value="Manager">Manager</option>
              <option value="HR Admin">HR Admin</option>
            </select>
          </div>

          {/* Phone (Optional) */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone || ''}
              onChange={e =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full rounded-md border border-gray-200 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter phone number (e.g., +1555123456)"
            />
          </div>

          {/* Address (Optional) */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Address
            </label>
            <textarea
              value={formData.address || ''}
              onChange={e =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="w-full rounded-md border border-gray-200 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter address"
              rows={2}
            />
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className={cn(
                'flex-1 rounded-md border border-gray-200 px-4 py-2',
                'text-gray-700 transition-colors duration-200 hover:bg-gray-50'
              )}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={cn(
                'flex-1 rounded-md bg-blue-600 px-4 py-2 text-white',
                'transition-colors duration-200 hover:bg-blue-700'
              )}
            >
              Add Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
