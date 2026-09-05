import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  return (
    <div className="min-h-screen">
      <div className="relative py-16 px-6">
        
      </div>
    </div>
  )
}
