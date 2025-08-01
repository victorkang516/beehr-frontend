import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@utility/api'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

interface CreateEmployeeModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (employee: any) => void
}

const departments = [
  'Engineering',
  'Marketing',
  'HR',
  'Sales',
  'Finance',
  'Operations',
]

// Yup validation schema
const createEmployeeSchema = yup.object({
  firstName: yup.string().required('First name is required').trim(),
  lastName: yup.string().required('Last name is required').trim(),
  email: yup
    .string()
    .required('Email is required')
    .email('Email is invalid')
    .trim(),
  department: yup.string().required('Department is required'),
  position: yup.string().required('Position is required').trim(),
  role: yup
    .string()
    .oneOf(['HR Admin', 'Manager', 'Employee'], 'Invalid role')
    .default('Employee'),
  joinDate: yup.string().required('Join date is required'),
  phone: yup.string().optional().default(''),
  address: yup.string().optional().default(''),
})

// Type inference from schema
type CreateEmployeeFormData = yup.InferType<typeof createEmployeeSchema>

export default function CreateEmployeeModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateEmployeeModalProps) {
  const queryClient = useQueryClient()

  // React Hook Form with Yup validation
  const form = useForm<CreateEmployeeFormData>({
    resolver: yupResolver(createEmployeeSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      department: '',
      position: '',
      role: 'Employee',
      joinDate: new Date().toISOString().split('T')[0],
      phone: '',
      address: '',
    },
  })

  // TanStack Query mutation for API call
  const createEmployeeMutation = useMutation({
    mutationFn: async (data: CreateEmployeeFormData) => {
      const response = await api.post('/employees', data)
      return response.data
    },
    onSuccess: data => {
      // Invalidate and refetch employees query
      queryClient.invalidateQueries({ queryKey: ['employees'] })

      // Reset form
      form.reset()

      // Call success callback if provided
      onSuccess?.(data)

      // Close modal
      onClose()
    },
    onError: (error: any) => {
      console.error('Failed to create employee:', error)
      // You could show a toast notification here
    },
  })

  const onSubmit = (data: CreateEmployeeFormData) => {
    createEmployeeMutation.mutate(data)
  }

  const handleClose = () => {
    form.reset()
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
            disabled={createEmployeeMutation.isPending}
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* First Name */}
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter first name"
                        {...field}
                        disabled={createEmployeeMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Last Name */}
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter last name"
                        {...field}
                        disabled={createEmployeeMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter email address"
                        {...field}
                        disabled={createEmployeeMutation.isPending}
                      />
                    </FormControl>
                    <FormDescription>
                      Employee will receive an email to set up their password
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Department */}
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={createEmployeeMutation.isPending}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map(dept => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Position */}
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter position title"
                        {...field}
                        disabled={createEmployeeMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Join Date */}
              <FormField
                control={form.control}
                name="joinDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Join Date *</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        disabled={createEmployeeMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Role */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={createEmployeeMutation.isPending}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Employee">Employee</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="HR Admin">HR Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone (Optional) */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="Enter phone number (e.g., +1555123456)"
                        {...field}
                        disabled={createEmployeeMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Address (Optional) */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter address"
                        rows={2}
                        {...field}
                        disabled={createEmployeeMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Form Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                  disabled={createEmployeeMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={createEmployeeMutation.isPending}
                >
                  {createEmployeeMutation.isPending
                    ? 'Adding...'
                    : 'Add Employee'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
