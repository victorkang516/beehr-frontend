import { createFileRoute } from '@tanstack/react-router'
import { ProtectedRoute } from '@components/index'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export const Route = createFileRoute('/user/timeclock')({
  component: UserTimeClock,
})

function UserTimeClock() {
  const [isClockedIn, setIsClockedIn] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every second
  useState(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  })

  const handleClockInOut = () => {
    setIsClockedIn(!isClockedIn)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">TimeClock</h1>
            <p className="mt-2 text-gray-600">
              Track your work hours and manage your time
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Clock In/Out Section */}
            <div className="lg:col-span-1">
              <div className="rounded-lg bg-white p-6 shadow">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                  Time Clock
                </h2>

                {/* Current Time Display */}
                <div className="mb-6 text-center">
                  <div className="text-4xl font-bold text-gray-900">
                    {currentTime.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </div>
                  <div className="text-lg text-gray-600">
                    {currentTime.toLocaleDateString([], {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>

                {/* Status */}
                <div className="mb-6 text-center">
                  <div
                    className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium ${
                      isClockedIn
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div
                      className={`mr-2 h-2 w-2 rounded-full ${
                        isClockedIn ? 'bg-green-500' : 'bg-gray-500'
                      }`}
                    ></div>
                    {isClockedIn ? 'Clocked In' : 'Clocked Out'}
                  </div>
                </div>

                {/* Clock In/Out Button */}
                <Button
                  onClick={handleClockInOut}
                  size="lg"
                  className={`w-full text-lg font-semibold ${
                    isClockedIn
                      ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                      : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                  }`}
                >
                  {isClockedIn ? 'Clock Out' : 'Clock In'}
                </Button>

                {/* Today's Summary */}
                <div className="mt-6 border-t pt-4">
                  <h3 className="mb-3 font-semibold text-gray-900">
                    Today's Summary
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Clock In:</span>
                      <span className="font-medium">9:00 AM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Break Time:</span>
                      <span className="font-medium">45 min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hours Worked:</span>
                      <span className="font-medium text-blue-600">
                        7.25 hrs
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity & Weekly Summary */}
            <div className="space-y-6 lg:col-span-2">
              {/* Weekly Summary */}
              <div className="rounded-lg bg-white p-6 shadow">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                  This Week's Hours
                </h2>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">40.0</div>
                    <div className="text-sm text-gray-600">Total Hours</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">8.0</div>
                    <div className="text-sm text-gray-600">Avg/Day</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      2.5
                    </div>
                    <div className="text-sm text-gray-600">Break Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">0</div>
                    <div className="text-sm text-gray-600">Overtime</div>
                  </div>
                </div>
              </div>

              {/* Recent Time Entries */}
              <div className="rounded-lg bg-white p-6 shadow">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                  Recent Time Entries
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr>
                        <th className="pb-3 text-left text-sm font-medium text-gray-600">
                          Date
                        </th>
                        <th className="pb-3 text-left text-sm font-medium text-gray-600">
                          Clock In
                        </th>
                        <th className="pb-3 text-left text-sm font-medium text-gray-600">
                          Clock Out
                        </th>
                        <th className="pb-3 text-left text-sm font-medium text-gray-600">
                          Break
                        </th>
                        <th className="pb-3 text-left text-sm font-medium text-gray-600">
                          Total Hours
                        </th>
                        <th className="pb-3 text-left text-sm font-medium text-gray-600">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="py-3 text-sm text-gray-900">Today</td>
                        <td className="py-3 text-sm text-gray-600">9:00 AM</td>
                        <td className="py-3 text-sm text-gray-600">--</td>
                        <td className="py-3 text-sm text-gray-600">45 min</td>
                        <td className="py-3 text-sm font-medium text-blue-600">
                          7.25 hrs
                        </td>
                        <td className="py-3">
                          <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800">
                            Active
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 text-sm text-gray-900">
                          Yesterday
                        </td>
                        <td className="py-3 text-sm text-gray-600">8:30 AM</td>
                        <td className="py-3 text-sm text-gray-600">5:30 PM</td>
                        <td className="py-3 text-sm text-gray-600">1 hr</td>
                        <td className="py-3 text-sm font-medium text-gray-900">
                          8.0 hrs
                        </td>
                        <td className="py-3">
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800">
                            Complete
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 text-sm text-gray-900">Jan 26</td>
                        <td className="py-3 text-sm text-gray-600">9:15 AM</td>
                        <td className="py-3 text-sm text-gray-600">6:00 PM</td>
                        <td className="py-3 text-sm text-gray-600">45 min</td>
                        <td className="py-3 text-sm font-medium text-gray-900">
                          8.0 hrs
                        </td>
                        <td className="py-3">
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800">
                            Complete
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 text-sm text-gray-900">Jan 25</td>
                        <td className="py-3 text-sm text-gray-600">8:45 AM</td>
                        <td className="py-3 text-sm text-gray-600">5:45 PM</td>
                        <td className="py-3 text-sm text-gray-600">1 hr</td>
                        <td className="py-3 text-sm font-medium text-gray-900">
                          8.0 hrs
                        </td>
                        <td className="py-3">
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800">
                            Complete
                          </span>
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
                    View Full Time History
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
