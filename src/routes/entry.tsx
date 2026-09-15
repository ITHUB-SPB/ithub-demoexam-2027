import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/entry')({
    component: EntryPage,
})

function EntryPage() {
    return <div>Hello "/entry"!</div>
}
