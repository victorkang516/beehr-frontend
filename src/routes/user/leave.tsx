import { createFileRoute } from '@tanstack/react-router'
import { ProtectedRoute } from '@components/index'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/user/leave')({
  component: UserLeave,
})

function UserLeave() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">My Leave</h1>
            <p className="mt-2 text-gray-600">
              Submit leave requests and track your leave history
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Leave Balance Overview */}
            <div className="lg:col-span-1">
              <div className="rounded-lg bg-white p-6 shadow">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                  Leave Balance
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-gray-600">Annual Leave</span>
                    <span className="font-semibold text-green-600">
                      15 days
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-gray-600">Sick Leave</span>
                    <span className="font-semibold text-blue-600">8 days</span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-gray-600">Personal Leave</span>
                    <span className="font-semibold text-purple-600">
                      3 days
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Emergency Leave</span>
                    <span className="font-semibold text-red-600">2 days</span>
                  </div>
                </div>

                <Button className="mt-6 w-full">Request Leave</Button>
              </div>
            </div>

            {/* Leave History */}
            <div className="lg:col-span-2">
              <div className="rounded-lg bg-white p-6 shadow">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                  Recent Leave Requests
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr>
                        <th className="pb-3 text-left text-sm font-medium text-gray-600">
                          Type
                        </th>
                        <th className="pb-3 text-left text-sm font-medium text-gray-600">
                          Dates
                        </th>
                        <th className="pb-3 text-left text-sm font-medium text-gray-600">
                          Days
                        </th>
                        <th className="pb-3 text-left text-sm font-medium text-gray-600">
                          Status
                        </th>
                        <th className="pb-3 text-left text-sm font-medium text-gray-600">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="py-3">
                          <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800">
                            Annual
                          </span>
                        </td>
                        <td className="py-3 text-sm text-gray-600">
                          Dec 25 - Dec 31, 2024
                        </td>
                        <td className="py-3 text-sm text-gray-600">5 days</td>
                        <td className="py-3">
                          <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800">
                            Approved
                          </span>
                        </td>
                        <td className="py-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3">
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
                            Sick
                          </span>
                        </td>
                        <td className="py-3 text-sm text-gray-600">
                          Nov 15 - Nov 16, 2024
                        </td>
                        <td className="py-3 text-sm text-gray-600">2 days</td>
                        <td className="py-3">
                          <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-800">
                            Pending
                          </span>
                        </td>
                        <td className="py-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </Button>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3">
                          <span className="rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-800">
                            Personal
                          </span>
                        </td>
                        <td className="py-3 text-sm text-gray-600">
                          Oct 20, 2024
                        </td>
                        <td className="py-3 text-sm text-gray-600">1 day</td>
                        <td className="py-3">
                          <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800">
                            Approved
                          </span>
                        </td>
                        <td className="py-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 text-center">
                  <Button
                    variant="ghost"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View All Leave History
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
