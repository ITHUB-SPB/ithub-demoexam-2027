import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/admin')({
  component: () => <div className="p-4">Админ-панель (скоро)</div>,
})