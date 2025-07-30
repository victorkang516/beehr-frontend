import { createFileRoute, Link } from '@tanstack/react-router'
import { ProtectedRoute } from '@components/index'
import { Button } from '@/components/ui/button'
import { useAuth } from '@contexts/index'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const { user, hasRole, viewMode } = useAuth()
  const isAdminRole = hasRole(['Owner', 'HR Admin', 'Manager'])
  const showAdminDashboard = viewMode === 'admin' && isAdminRole

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {showAdminDashboard ? 'Admin Dashboard' : 'My Dashboard'}
          </h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {user?.name}! ({user?.role})
          </p>

          {/* Temporary Onboarding Button for Testing */}
          <div className="mt-4">
            <Button asChild>
              <Link to="/onboarding">🐝 Start Onboarding Flow (Demo)</Link>
            </Button>
          </div>
        </div>

        {/* Render different content based on role */}
        {showAdminDashboard ? <AdminDashboard /> : <UserDashboard />}
      </div>
    </ProtectedRoute>
  )
}

// Admin Dashboard Component
function AdminDashboard() {
  return (
    <>
      {/* Admin Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="mr-4 rounded-full bg-blue-100 p-3 text-2xl text-blue-600">
              👥
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Employees
              </p>
              <p className="text-2xl font-bold text-gray-900">245</p>
              <p className="text-xs text-green-600">+12 this month</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="mr-4 rounded-full bg-green-100 p-3 text-2xl text-green-600">
              ✅
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Present Today</p>
              <p className="text-2xl font-bold text-gray-900">238</p>
              <p className="text-xs text-green-600">97.1% attendance</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="mr-4 rounded-full bg-orange-100 p-3 text-2xl text-orange-600">
              �️
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Leave Requests
              </p>
              <p className="text-2xl font-bold text-gray-900">23</p>
              <p className="text-xs text-yellow-600">15 pending</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="mr-4 rounded-full bg-purple-100 p-3 text-2xl text-purple-600">
              📋
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Open Positions
              </p>
              <p className="text-2xl font-bold text-gray-900">8</p>
              <p className="text-xs text-blue-600">3 urgent</p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Charts and Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Employee Leave Overview */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Leave Requests Overview
          </h3>
          <div className="space-y-4">
            {[
              {
                employee: 'John Doe',
                type: 'Annual Leave',
                dates: 'Dec 25-31',
                status: 'Pending',
                color: 'bg-yellow-100 text-yellow-800',
              },
              {
                employee: 'Sarah Johnson',
                type: 'Sick Leave',
                dates: 'Nov 15-16',
                status: 'Approved',
                color: 'bg-green-100 text-green-800',
              },
              {
                employee: 'Mike Chen',
                type: 'Personal',
                dates: 'Dec 20',
                status: 'Pending',
                color: 'bg-yellow-100 text-yellow-800',
              },
              {
                employee: 'Emma Davis',
                type: 'Annual Leave',
                dates: 'Jan 2-5',
                status: 'Approved',
                color: 'bg-green-100 text-green-800',
              },
            ].map((request, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b pb-3"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {request.employee}
                  </p>
                  <p className="text-sm text-gray-600">
                    {request.type} • {request.dates}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${request.color}`}
                >
                  {request.status}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/leave">View All Leave Requests</Link>
            </Button>
          </div>
        </div>

        {/* Employee Attendance Overview */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Attendance Overview
          </h3>
          <div className="space-y-4">
            {[
              {
                employee: 'John Doe',
                clockIn: '9:00 AM',
                clockOut: 'In Progress',
                hours: '6.5',
                status: 'Present',
              },
              {
                employee: 'Sarah Johnson',
                clockIn: '8:45 AM',
                clockOut: 'In Progress',
                hours: '6.8',
                status: 'Present',
              },
              {
                employee: 'Mike Chen',
                clockIn: 'Not Clocked',
                clockOut: '-',
                hours: '0',
                status: 'Absent',
              },
              {
                employee: 'Emma Davis',
                clockIn: '9:15 AM',
                clockOut: 'In Progress',
                hours: '6.2',
                status: 'Present',
              },
            ].map((record, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b pb-3"
              >
                <div>
                  <p className="font-medium text-gray-900">{record.employee}</p>
                  <p className="text-sm text-gray-600">
                    {record.clockIn} - {record.clockOut}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{record.hours} hrs</p>
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      record.status === 'Present'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {record.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/attendance">View Full Attendance</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Department Overview */}
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Department Overview
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              name: 'Engineering',
              employees: 45,
              present: 42,
              status: 'Full Capacity',
              color: 'bg-blue-100 text-blue-800',
            },
            {
              name: 'Sales',
              employees: 32,
              present: 30,
              status: 'Hiring',
              color: 'bg-green-100 text-green-800',
            },
            {
              name: 'Marketing',
              employees: 18,
              present: 17,
              status: 'Active',
              color: 'bg-purple-100 text-purple-800',
            },
            {
              name: 'HR',
              employees: 8,
              present: 8,
              status: 'Stable',
              color: 'bg-gray-100 text-gray-800',
            },
            {
              name: 'Finance',
              employees: 12,
              present: 11,
              status: 'Complete',
              color: 'bg-yellow-100 text-yellow-800',
            },
            {
              name: 'Operations',
              employees: 25,
              present: 24,
              status: 'Expanding',
              color: 'bg-indigo-100 text-indigo-800',
            },
          ].map((dept, index) => (
            <div key={index} className="rounded-lg border p-4">
              <div className="mb-2 flex items-start justify-between">
                <h4 className="font-medium text-gray-900">{dept.name}</h4>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${dept.color}`}
                >
                  {dept.status}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {dept.employees}
              </p>
              <p className="text-sm text-gray-500">employees</p>
              <p className="text-sm text-green-600">
                {dept.present} present today
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

// User Dashboard Component
function UserDashboard() {
  return (
    <>
      {/* User Personal Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Button
          variant="ghost"
          className="h-auto rounded-lg border bg-white p-6 shadow-sm hover:bg-gray-50"
          asChild
        >
          <Link to="/user/leave">
            <div className="flex items-center">
              <div className="mr-4 rounded-full bg-green-100 p-3 text-2xl text-green-600">
                🏖️
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Leave Balance
                </p>
                <p className="text-2xl font-bold text-gray-900">15 days</p>
                <p className="text-xs text-blue-600">Annual Leave</p>
              </div>
            </div>
          </Link>
        </Button>

        <Button
          variant="ghost"
          className="h-auto rounded-lg border bg-white p-6 shadow-sm hover:bg-gray-50"
          asChild
        >
          <Link to="/user/timeclock">
            <div className="flex items-center">
              <div className="mr-4 rounded-full bg-blue-100 p-3 text-2xl text-blue-600">
                ⏰
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Today's Hours
                </p>
                <p className="text-2xl font-bold text-gray-900">7.5 hrs</p>
                <p className="text-xs text-green-600">Clocked in at 9:00 AM</p>
              </div>
            </div>
          </Link>
        </Button>

        <Button
          variant="ghost"
          className="h-auto rounded-lg border bg-white p-6 shadow-sm hover:bg-gray-50"
          asChild
        >
          <Link to="/user/directory">
            <div className="flex items-center">
              <div className="mr-4 rounded-full bg-purple-100 p-3 text-2xl text-purple-600">
                👥
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Team Members
                </p>
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-xs text-gray-500">Engineering Dept</p>
              </div>
            </div>
          </Link>
        </Button>
      </div>

      {/* User Quick Actions & Status */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Personal Leave Status */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            My Leave Status
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-green-50 p-4 text-center">
                <p className="text-2xl font-bold text-green-600">15</p>
                <p className="text-sm text-green-600">Annual Leave</p>
              </div>
              <div className="rounded-lg bg-blue-50 p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">8</p>
                <p className="text-sm text-blue-600">Sick Leave</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-sm text-gray-600">Pending Request</span>
                <span className="text-sm font-medium text-yellow-600">
                  Dec 25-31 (Annual)
                </span>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-sm text-gray-600">Last Approved</span>
                <span className="text-sm font-medium text-green-600">
                  Nov 15-16 (Sick)
                </span>
              </div>
            </div>
            <Button asChild className="w-full">
              <Link to="/user/leave">Manage Leave</Link>
            </Button>
          </div>
        </div>

        {/* Personal Time Tracking */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            My Time Clock
          </h3>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">7.5 hrs</div>
              <p className="text-sm text-gray-600">Today's Work Time</p>
              <div className="mt-2 inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm text-green-800">
                <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                Currently Clocked In
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Clock In:</span>
                <span className="font-medium">9:00 AM</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Break Time:</span>
                <span className="font-medium">45 min</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">This Week:</span>
                <span className="font-medium text-blue-600">37.5 hrs</span>
              </div>
            </div>
            <Button asChild className="w-full bg-green-600 hover:bg-green-700">
              <Link to="/user/timeclock">Open TimeClock</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Team Directory Preview */}
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">My Team</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              name: 'Alice Smith',
              role: 'Marketing Manager',
              status: 'Online',
              avatar: 'AS',
              color: 'bg-green-500',
            },
            {
              name: 'Mike Johnson',
              role: 'Software Engineer',
              status: 'Away',
              avatar: 'MJ',
              color: 'bg-blue-500',
            },
            {
              name: 'Sarah Brown',
              role: 'HR Specialist',
              status: 'Online',
              avatar: 'SB',
              color: 'bg-purple-500',
            },
            {
              name: 'David Lee',
              role: 'DevOps Engineer',
              status: 'Offline',
              avatar: 'DL',
              color: 'bg-gray-500',
            },
            {
              name: 'Emma Wilson',
              role: 'Product Manager',
              status: 'Online',
              avatar: 'EW',
              color: 'bg-pink-500',
            },
            {
              name: 'John Davis',
              role: 'UI Designer',
              status: 'Away',
              avatar: 'JD',
              color: 'bg-orange-500',
            },
          ].map((member, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 rounded-lg border p-3"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold text-white ${member.color}`}
              >
                {member.avatar}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {member.name}
                </p>
                <p className="text-xs text-gray-500">{member.role}</p>
              </div>
              <div
                className={`h-2 w-2 rounded-full ${
                  member.status === 'Online'
                    ? 'bg-green-500'
                    : member.status === 'Away'
                      ? 'bg-yellow-500'
                      : 'bg-gray-400'
                }`}
              ></div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Button variant="ghost" asChild>
            <Link to="/user/directory">View Full Directory →</Link>
          </Button>
        </div>
      </div>
    </>
  )
}
