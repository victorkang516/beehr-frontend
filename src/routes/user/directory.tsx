import { createFileRoute } from '@tanstack/react-router'
import { ProtectedRoute } from '@components/index'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/user/directory')({
  component: UserDirectory,
})

function UserDirectory() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Employee Directory
            </h1>
            <p className="mt-2 text-gray-600">
              Find and connect with your colleagues
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 rounded-lg bg-white p-6 shadow">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search employees..."
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex gap-2">
                <select className="rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none">
                  <option value="">All Departments</option>
                  <option value="engineering">Engineering</option>
                  <option value="marketing">Marketing</option>
                  <option value="sales">Sales</option>
                  <option value="hr">Human Resources</option>
                </select>
                <select className="rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none">
                  <option value="">All Roles</option>
                  <option value="manager">Manager</option>
                  <option value="senior">Senior</option>
                  <option value="junior">Junior</option>
                </select>
              </div>
            </div>
          </div>

          {/* Employee Cards Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Employee Card 1 */}
            <div className="rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-md">
              <div className="flex items-center space-x-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500 text-xl font-semibold text-white">
                  JD
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    John Doe
                  </h3>
                  <p className="text-sm text-gray-600">Software Engineer</p>
                  <p className="text-sm text-gray-500">Engineering</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>📧</span>
                  <span>john.doe@company.com</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>📞</span>
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>📍</span>
                  <span>New York Office</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" className="flex-1">
                  Message
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  View Profile
                </Button>
              </div>
            </div>

            {/* Employee Card 2 */}
            <div className="rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-md">
              <div className="flex items-center space-x-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-xl font-semibold text-white">
                  AS
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Alice Smith
                  </h3>
                  <p className="text-sm text-gray-600">Marketing Manager</p>
                  <p className="text-sm text-gray-500">Marketing</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>📧</span>
                  <span>alice.smith@company.com</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>📞</span>
                  <span>+1 (555) 987-6543</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>📍</span>
                  <span>San Francisco Office</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" className="flex-1">
                  Message
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  View Profile
                </Button>
              </div>
            </div>

            {/* Employee Card 3 */}
            <div className="rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-md">
              <div className="flex items-center space-x-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-500 text-xl font-semibold text-white">
                  MJ
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Mike Johnson
                  </h3>
                  <p className="text-sm text-gray-600">Sales Representative</p>
                  <p className="text-sm text-gray-500">Sales</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>📧</span>
                  <span>mike.johnson@company.com</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>📞</span>
                  <span>+1 (555) 456-7890</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>📍</span>
                  <span>Chicago Office</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" className="flex-1">
                  Message
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  View Profile
                </Button>
              </div>
            </div>

            {/* Employee Card 4 */}
            <div className="rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-md">
              <div className="flex items-center space-x-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500 text-xl font-semibold text-white">
                  SB
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Sarah Brown
                  </h3>
                  <p className="text-sm text-gray-600">HR Specialist</p>
                  <p className="text-sm text-gray-500">Human Resources</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>📧</span>
                  <span>sarah.brown@company.com</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>📞</span>
                  <span>+1 (555) 321-0987</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>📍</span>
                  <span>Austin Office</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" className="flex-1">
                  Message
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  View Profile
                </Button>
              </div>
            </div>
          </div>

          {/* Load More */}
          <div className="mt-8 text-center">
            <Button variant="outline">Load More Employees</Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
