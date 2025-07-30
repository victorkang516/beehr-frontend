import { createRootRoute, Outlet, useLocation } from '@tanstack/react-router'
import { Sidebar, TopBar, ToastProvider } from '@components/index'
import {
  SidebarProvider,
  useSidebar,
  AuthProvider,
  useAuth,
} from '@contexts/index'

const AuthenticatedLayout = () => {
  const { isCollapsed } = useSidebar()

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area with TopBar */}
      <div
        className={`${isCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300 ease-in-out`}
      >
        {/* Top Bar */}
        <TopBar />

        {/* Page Content */}
        <main className="min-h-[calc(100vh-4rem)] p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

const UnauthenticatedLayout = () => {
  return (
    <div className="min-h-screen bg-white">
      <Outlet />
    </div>
  )
}

const Layout = () => {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  // Check if current route is onboarding - show standalone layout
  const isOnboardingPage = location.pathname === '/onboarding'

  // Show loading spinner while validating authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-r-transparent"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated && !isOnboardingPage) {
    return (
      <SidebarProvider>
        <AuthenticatedLayout />
      </SidebarProvider>
    )
  }

  return <UnauthenticatedLayout />
}

export const Route = createRootRoute({
  component: () => (
    <AuthProvider>
      <ToastProvider>
        <Layout />
      </ToastProvider>
    </AuthProvider>
  ),
})
