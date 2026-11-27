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
    // минимум 32 символа; в продакшене вынести в переменную окружения
    password: 'koroknet-demoexam-2027-session-secret',
    cookie: {
      secure: false, // локальная разработка по http
      httpOnly: true,
      sameSite: 'lax',
    },
  })
}
