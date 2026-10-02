import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/applications')({
  component: () => <div className="p-4">Страница заявок (скоро)</div>,
})