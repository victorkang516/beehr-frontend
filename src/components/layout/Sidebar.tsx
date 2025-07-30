import { useAuth, useSidebar, type UserRole } from '@contexts/index'
import { cn } from '@utility/index'
import { Link } from '@tanstack/react-router'

import {
  Calendar,
  Clock,
  House,
  PanelRightClose,
  PanelRightOpen,
  UsersRound,
  Users,
} from 'lucide-react'

interface NavigationItem {
  to: string
  label: string
  icon: React.ReactNode
  roles?: UserRole[] // If not specified, accessible to all authenticated users
}

const Sidebar = () => {
  const { isCollapsed, setIsCollapsed } = useSidebar()
  const { hasRole, user, viewMode } = useAuth()

  // Admin navigation items (Owner, HR Admin, Manager)
  const adminNavigationItems: NavigationItem[] = [
    { to: '/', label: 'Home', icon: <House /> },
    {
      to: '/admin/employees',
      label: 'Employees',
      icon: <UsersRound />,
      roles: ['Owner', 'HR Admin', 'Manager'], // Only Owner, HR Admin and Manager can access
    },
    { to: '/admin/leave', label: 'Leave', icon: <Calendar /> },
    {
      to: '/admin/attendance',
      label: 'Attendance',
      icon: <Clock />,
      roles: ['Owner', 'HR Admin', 'Manager'], // Only Owner, HR Admin and Manager can access
    },
  ]

  // User navigation items (Employee)
  const userNavigationItems: NavigationItem[] = [
    { to: '/', label: 'Home', icon: <House /> },
    { to: '/user/leave', label: 'Leave', icon: <Calendar /> },
    { to: '/user/directory', label: 'Directory', icon: <Users /> },
    { to: '/user/timeclock', label: 'TimeClock', icon: <Clock /> },
  ]

  // Determine which navigation to show based on view mode
  const isAdminRole = hasRole(['Owner', 'HR Admin', 'Manager'])
  const showAdminNav = viewMode === 'admin' && isAdminRole
  const navigationItems = showAdminNav
    ? adminNavigationItems
    : userNavigationItems

  // Filter navigation items based on user role
  const filteredNavigationItems = navigationItems.filter(item => {
    if (!item.roles) return true // No role restriction
    return hasRole(item.roles)
  })

  return (
    <div
      className={cn(
        'bg-white text-[#1C1C1C] transition-all duration-300 ease-in-out',
        'fixed top-0 left-0 z-50 h-screen border-r border-gray-200',
        'flex flex-col overflow-y-auto shadow-lg',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h1 className="line-clamp-1 text-xl font-bold text-[#1C1C1C]">
              {user?.organization?.name}
            </h1>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              'hover:bg-gay-200 cursor-pointer rounded-lg p-1.5 transition-colors hover:text-black',
              'border-2 border-gray-200 text-gray-600'
            )}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <PanelRightClose className="size-5" />
            ) : (
              <PanelRightOpen className="size-5" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className={cn('flex-1', isCollapsed ? 'p-2' : 'p-4')}>
        <ul className="space-y-2">
          {filteredNavigationItems.map(item => (
            <li key={item.to}>
              <Link
                to={item.to}
                className={cn(
                  'flex items-center gap-3 rounded-lg p-3',
                  'transition-colors duration-200 hover:bg-gray-300 hover:text-black',
                  '[&.active]:bg-gray-200 [&.active]:text-black',
                  'group text-gray-500',
                  isCollapsed && 'justify-center p-2'
                )}
              >
                <span className="text-xl">{item.icon}</span>
                {!isCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
                {isCollapsed && (
                  <div
                    className={cn(
                      'bg-beegold absolute left-16 rounded px-2 py-1 text-white',
                      'opacity-0 transition-opacity group-hover:opacity-100',
                      'pointer-events-none ml-2 whitespace-nowrap shadow-lg'
                    )}
                  >
                    {item.label}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="space-y-3 border-t border-gray-200 p-4">
        {!isCollapsed ? (
          <div className="text-sm text-[#3A3A3A]">
            <div>🐝 BeeHR Management System</div>
            <div className="mt-1 text-xs font-medium text-[#F6BE00]">
              v1.0.0
            </div>
          </div>
        ) : (
          <div className="text-center text-xs font-medium text-[#F6BE00]">
            v1.0
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar
