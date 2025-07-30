import {
  CreateEmployeeModal,
  ProtectedRoute,
  RoleProtected,
  useToast,
} from '@components/index'
import { Button } from '@/components/ui/button'
import { cn, api, toastConfig } from '@utility/index'
import { useAuth } from '@contexts/index'
import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'

// Employee type that matches backend response
interface Employee {
  id: number
  firstName: string
  lastName: string
  email: string
  department: string
  position: string
  role: string
  joinDate: string
  phone?: string
  address?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Form data type for creating employee
interface CreateEmployeeRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  department: string
  position: string
  role?: 'Owner' | 'HR Admin' | 'Manager' | 'Employee'
  joinDate: string
  phone?: string
  address?: string
}

type SortField =
  | 'firstName'
  | 'lastName'
  | 'department'
  | 'position'
  | 'role'
  | 'joinDate'
type SortDirection = 'asc' | 'desc'

export const Route = createFileRoute('/admin/employees')({
  component: AdminEmployees,
})

function AdminEmployees() {
  const { user } = useAuth()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortField, setSortField] = useState<SortField>('firstName')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { addToast } = useToast()

  // Get unique departments and statuses for filters
  const departments = Array.from(new Set(employees.map(emp => emp.department)))
  const statuses = ['Active', 'Inactive'] // Based on isActive boolean

  // Load employees from API
  useEffect(() => {
    loadEmployees()
  }, [])

  const loadEmployees = async () => {
    if (!user?.organization?.id) {
      console.error('No organization ID found for user')
      return
    }

    setIsLoading(true)
    try {
      const response = await api.get<Employee[]>(
        `/employees/company/${user.organization.id}`
      )
      if (response.data) {
        setEmployees(response.data)
        console.log('Employees loaded successfully')
      } else if (response.error) {
        const errorConfig = toastConfig.loadingError('Employees')
        addToast(
          errorConfig.type,
          errorConfig.title,
          response.error || errorConfig.message
        )
        console.error('Failed to load employees:', response.error)
      }
    } catch (error) {
      const networkConfig = toastConfig.networkError()
      addToast(networkConfig.type, networkConfig.title, networkConfig.message)
      console.error('Failed to load employees:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Filter and sort employees
  const filteredEmployees = employees
    .filter(employee => {
      const fullName = `${employee.firstName} ${employee.lastName}`
      const matchesSearch =
        fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesDepartment =
        !departmentFilter || employee.department === departmentFilter
      const matchesStatus =
        !statusFilter ||
        (statusFilter === 'Active' && employee.isActive) ||
        (statusFilter === 'Inactive' && !employee.isActive)

      return matchesSearch && matchesDepartment && matchesStatus
    })
    .sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (aValue == null || bValue == null) return 0
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleCreateEmployee = () => {
    setIsCreateModalOpen(true)
  }

  const handleSaveEmployee = async (newEmployeeData: CreateEmployeeRequest) => {
    setIsLoading(true)
    try {
      const response = await api.post<Employee>('/employees', newEmployeeData)
      if (response.data) {
        // Add the new employee to the list
        setEmployees(prev => [...prev, response.data!])
        setIsCreateModalOpen(false)

        // Show success toast using predefined configuration
        const successConfig = toastConfig.employeeCreated(
          `${response.data.firstName} ${response.data.lastName}`
        )
        addToast(
          successConfig.type,
          successConfig.title,
          successConfig.message,
          successConfig.duration
        )

        console.log('Employee created successfully:', response.data)
      } else if (response.error) {
        // Show error toast instead of alert
        addToast('error', 'Failed to Create Employee', response.error)
        console.error('Failed to create employee:', response.error)
      }
    } catch (error) {
      // Show error toast for unexpected errors
      const networkConfig = toastConfig.networkError()
      addToast(
        networkConfig.type,
        networkConfig.title,
        'An unexpected error occurred while creating the employee. Please try again.'
      )
      console.error('Error creating employee:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return '↕️'
    return sortDirection === 'asc' ? '↑' : '↓'
  }

  return (
    <ProtectedRoute>
      <RoleProtected allowedRoles={['Owner', 'HR Admin', 'Manager']}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
              <p className="mt-2 text-gray-600">
                Manage your organization's employees
              </p>
            </div>
            <Button
              onClick={handleCreateEmployee}
              className="flex items-center gap-2"
            >
              <Plus className="size-5" />
              Add Employee
            </Button>
          </div>

          {/* Filters and Search */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              {/* Search */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className={cn(
                    'w-full rounded-md border border-gray-200 px-3 py-2',
                    'focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                  )}
                />
              </div>

              {/* Department Filter */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Department
                </label>
                <select
                  value={departmentFilter}
                  onChange={e => setDepartmentFilter(e.target.value)}
                  className={cn(
                    'w-full rounded-md border border-gray-200 px-3 py-2',
                    'focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                  )}
                >
                  <option value="">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className={cn(
                    'w-full rounded-md border border-gray-200 px-3 py-2',
                    'focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                  )}
                >
                  <option value="">All Statuses</option>
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('')
                    setDepartmentFilter('')
                    setStatusFilter('')
                    setCurrentPage(1)
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      className={cn(
                        'px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase',
                        'cursor-pointer hover:bg-gray-100'
                      )}
                      onClick={() => handleSort('firstName')}
                    >
                      <div className="flex items-center gap-2">
                        Name {getSortIcon('firstName')}
                      </div>
                    </th>
                    <th
                      className={cn(
                        'px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase',
                        'cursor-pointer hover:bg-gray-100'
                      )}
                      onClick={() => handleSort('department')}
                    >
                      <div className="flex items-center gap-2">
                        Department {getSortIcon('department')}
                      </div>
                    </th>
                    <th
                      className={cn(
                        'px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase',
                        'cursor-pointer hover:bg-gray-100'
                      )}
                      onClick={() => handleSort('position')}
                    >
                      <div className="flex items-center gap-2">
                        Position {getSortIcon('position')}
                      </div>
                    </th>
                    <th
                      className={cn(
                        'px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase',
                        'cursor-pointer hover:bg-gray-100'
                      )}
                      onClick={() => handleSort('role')}
                    >
                      <div className="flex items-center gap-2">
                        Role {getSortIcon('role')}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Status
                    </th>
                    <th
                      className={cn(
                        'px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase',
                        'cursor-pointer hover:bg-gray-100'
                      )}
                      onClick={() => handleSort('joinDate')}
                    >
                      <div className="flex items-center gap-2">
                        Join Date {getSortIcon('joinDate')}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {currentEmployees.map(employee => (
                    <tr key={employee.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {employee.firstName} {employee.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {employee.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                        {employee.department}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                        {employee.position}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                        {employee.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={cn(
                            'inline-flex rounded-full px-2 py-1 text-xs font-semibold',
                            employee.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          )}
                        >
                          {employee.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                        {new Date(employee.joinDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-1 justify-between sm:hidden">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing{' '}
                      <span className="font-medium">{startIndex + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(endIndex, filteredEmployees.length)}
                      </span>{' '}
                      of{' '}
                      <span className="font-medium">
                        {filteredEmployees.length}
                      </span>{' '}
                      results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                        className="rounded-l-md rounded-r-none"
                      >
                        Previous
                      </Button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        page => (
                          <Button
                            key={page}
                            variant={
                              page === currentPage ? 'default' : 'outline'
                            }
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="rounded-none"
                          >
                            {page}
                          </Button>
                        )
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="rounded-l-none rounded-r-md"
                      >
                        Next
                      </Button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Create Employee Modal */}
          {isLoading && (
            <div className="bg-opacity-25 fixed inset-0 z-40 flex items-center justify-center bg-black">
              <div className="rounded-lg bg-white p-6 shadow-xl">
                <div className="flex items-center space-x-3">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                  <span className="text-gray-700">Processing...</span>
                </div>
              </div>
            </div>
          )}

          <CreateEmployeeModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSave={handleSaveEmployee}
          />
        </div>
      </RoleProtected>
    </ProtectedRoute>
  )
}
