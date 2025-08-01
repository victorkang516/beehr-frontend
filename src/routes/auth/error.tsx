import { createFileRoute, useSearch, Link } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, ArrowLeft, Mail } from 'lucide-react'

export const Route = createFileRoute('/auth/error')({
  component: AuthErrorPage,
  validateSearch: (search: Record<string, unknown>) => ({
    message: search.message as string,
  }),
})

function AuthErrorPage() {
  const { message } = useSearch({ from: '/auth/error' })

  const getErrorInfo = (errorMessage: string) => {
    const decodedMessage = decodeURIComponent(errorMessage || '')

    if (decodedMessage.includes('expired')) {
      return {
        title: 'Link Expired',
        description: 'The activation link has expired for security reasons.',
        action: 'Request a new activation link from your administrator.',
        icon: <AlertTriangle className="h-6 w-6 text-orange-600" />,
        bgColor: 'bg-orange-100',
      }
    }

    if (decodedMessage.includes('Invalid activation link')) {
      return {
        title: 'Invalid Link',
        description: 'The activation link is invalid or has already been used.',
        action: 'Please contact your administrator for a new activation link.',
        icon: <AlertTriangle className="h-6 w-6 text-red-600" />,
        bgColor: 'bg-red-100',
      }
    }

    if (decodedMessage.includes('Token not found')) {
      return {
        title: 'Link Not Found',
        description: 'The activation link could not be found.',
        action: 'Please check the link in your email or request a new one.',
        icon: <AlertTriangle className="h-6 w-6 text-red-600" />,
        bgColor: 'bg-red-100',
      }
    }

    return {
      title: 'Activation Failed',
      description:
        decodedMessage || 'An error occurred during account activation.',
      action: 'Please contact your administrator for assistance.',
      icon: <AlertTriangle className="h-6 w-6 text-red-600" />,
      bgColor: 'bg-red-100',
    }
  }

  const errorInfo = getErrorInfo(message)

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div
            className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${errorInfo.bgColor}`}
          >
            {errorInfo.icon}
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {errorInfo.title}
          </CardTitle>
          <CardDescription>{errorInfo.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{errorInfo.action}</AlertDescription>
          </Alert>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-start space-x-3">
              <Mail className="mt-0.5 h-5 w-5 text-blue-600" />
              <div className="text-sm text-blue-800">
                <p className="mb-1 font-semibold">Need help?</p>
                <p>
                  If you continue to have problems, please:
                  <br />
                  • Check your email for the correct activation link
                  <br />
                  • Contact your HR administrator or manager
                  <br />• Make sure you're using the latest email received
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <Button asChild>
              <Link to="/auth">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Link>
            </Button>

            <Button variant="outline" asChild>
              <Link to="/forgot-password">Try Password Reset Instead</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
