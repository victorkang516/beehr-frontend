import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '@contexts/index'
import { useState, useRef, useEffect } from 'react'
import { cn } from '@utility/index'
import { ChevronDown, User, LogOut, Shield, Eye, Settings } from 'lucide-react'

const TopBar = () => {
  const {
    user,
    logout,
    viewMode,
    switchToAdminView,
    switchToEmployeeView,
    canSwitchViews,
  } = useAuth()
  const navigate = useNavigate()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleProfileClick = () => {
    setIsDropdownOpen(false)
    navigate({ to: '/account' })
  }

  const handleLogout = () => {
    setIsDropdownOpen(false)
    logout(() => navigate({ to: '/auth' }))
  }

  const handleViewSwitch = () => {
    if (viewMode === 'admin') {
      switchToEmployeeView()
    } else {
      switchToAdminView()
    }
    setIsDropdownOpen(false)
  }

  if (!user) return null

  return (
    <div className="relative flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      {/* Left side - Current view indicator */}
      <div className="flex items-center space-x-3">
        {canSwitchViews() && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            {viewMode === 'admin' ? (
              <>
                <Shield className="size-4 text-blue-600" />
                <span className="font-medium text-blue-600">Admin View</span>
              </>
            ) : (
              <>
                <User className="size-4 text-green-600" />
                <span className="font-medium text-green-600">
                  Employee View
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {/* User Profile Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={cn(
            'flex cursor-pointer items-center gap-2 rounded-lg p-2',
            'transition-colors duration-200 hover:bg-gray-200 hover:text-black',
            'border-2 border-gray-200 text-gray-200'
          )}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F6BE00]">
            <span className="text-sm font-bold text-white">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <span
            className={cn(
              'transform transition-transform duration-200',
              isDropdownOpen ? 'rotate-180' : 'rotate-0'
            )}
          >
            <ChevronDown className="size-5" color="#4a5565" />
          </span>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 z-50 mt-4 w-64 rounded-lg border border-gray-200 bg-white shadow-xl">
            {/* User Info Section */}
            <div className="border-b border-gray-200 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                  <span className="text-base font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-[#1C1C1C]">
                    {user.name}
                  </div>
                  <div className="text-xs text-[#3A3A3A]">{user.role}</div>
                  <div className="text-xs text-[#3A3A3A]">
                    {user.organization?.name || 'BeeHR Inc.'}
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <button
                onClick={handleProfileClick}
                className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-base font-medium text-gray-500 transition-colors duration-200 hover:bg-gray-200 hover:text-black"
              >
                <span>
                  <User />
                </span>
                Profile
              </button>

              <button className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-base font-medium text-gray-500 transition-colors duration-200 hover:bg-gray-200 hover:text-black">
                <span>
                  <Settings />
                </span>
                Settings
              </button>

              {/* View Switcher - Only for admins */}
              {canSwitchViews() && (
                <>
                  <div className="my-2 border-t border-gray-100"></div>
                  <button
                    onClick={handleViewSwitch}
                    className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-base font-medium text-gray-500 transition-colors duration-200 hover:bg-gray-200 hover:text-black"
                  >
                    {viewMode === 'admin' ? (
                      <>
                        <span>
                          <Eye />
                        </span>
                        <div>
                          <div className="text-sm">Switch to Employee View</div>
                          <div className="text-xs text-gray-400">
                            See what employees see
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <span>
                          <Shield />
                        </span>
                        <div>
                          <div className="text-sm">Switch to Admin View</div>
                          <div className="text-xs text-gray-400">
                            Access admin features
                          </div>
                        </div>
                      </>
                    )}
                  </button>
                </>
              )}

              <div className="my-2 border-t border-gray-100"></div>
              <button
                onClick={handleLogout}
                className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-base font-medium text-gray-500 transition-colors duration-200 hover:bg-gray-200 hover:text-black"
              >
                <span>
                  <LogOut />
                </span>
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TopBar
