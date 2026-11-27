import { useSession } from '@tanstack/react-start/server'

export type AppSessionData = {
  userId: number
  login: string
  fullname: string
  isAdmin: boolean
}

export function useAppSession() {
  return useSession<AppSessionData>({
    name: 'koroknet',
    password: 'koroknet-demoexam-2027-session-secret',
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: 'lax',
    },
  })
}
