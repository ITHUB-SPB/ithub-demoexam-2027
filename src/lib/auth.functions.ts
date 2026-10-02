// src/lib/auth.functions.ts
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { prisma } from '../db'

// ============================================================
//  РЕГИСТРАЦИЯ
// ============================================================

const registerSchema = z.object({
  login: z
    .string()
    .min(6, 'Логин должен быть не менее 6 символов')
    .regex(/^[a-zA-Z0-9]+$/, 'Логин может содержать только латиницу и цифры'),
  password: z.string().min(8, 'Пароль должен быть не менее 8 символов'),
  fullName: z
    .string()
    .regex(/^[А-Яа-яЁё\s]+$/, 'ФИО может содержать только символы кириллицы и пробелы'),
  phone: z
    .string()
    .regex(/^8\(\d{3}\)\d{3}-\d{2}-\d{2}$/, 'Телефон должен быть в формате 8(XXX)XXX-XX-XX'),
  email: z.string().email('Некорректный email'),
})

export type RegisterResult =
  | { success: true }
  | { success: false; fieldErrors: Record<string, string>; formError?: string }

export const register = createServerFn({ method: 'POST' })
  .validator(registerSchema)
  .handler(async ({ data }): Promise<RegisterResult> => {
    const existing = await prisma.user.findFirst({
      where: { OR: [{ login: data.login }, { email: data.email }] },
    })
    if (existing) {
      if (existing.login === data.login) {
        return { success: false, fieldErrors: { login: 'Такой логин уже занят' } }
      }
      return { success: false, fieldErrors: { email: 'Такая почта уже зарегистрирована' } }
    }

    try {
      await prisma.user.create({
        data: {
          login: data.login,
          password: data.password, // В реальном проекте — хешировать!
          fullName: data.fullName,
          phone: data.phone,
          email: data.email,
          role: 'USER',
        },
      })
      return { success: true }
    } catch (e) {
      console.error(e)
      return { success: false, fieldErrors: {}, formError: 'Ошибка сервера. Попробуйте позже.' }
    }
  })

// ============================================================
//  АВТОРИЗАЦИЯ
// ============================================================

const loginSchema = z.object({
  login: z.string().min(1, 'Введите логин'),
  password: z.string().min(1, 'Введите пароль'),
})

export type LoginResult =
  | { success: true; role: 'USER' | 'ADMIN'; userId: number; fullName: string }
  | { success: false; fieldErrors: Record<string, string>; formError?: string }

export const login = createServerFn({ method: 'POST' })
  .validator(loginSchema)
  .handler(async ({ data }): Promise<LoginResult> => {
    try {
      const user = await prisma.user.findUnique({ where: { login: data.login } })

      if (!user || user.password !== data.password) {
        return {
          success: false,
          fieldErrors: {},
          formError: 'Неверный логин или пароль',
        }
      }

      return {
        success: true,
        role: user.role,
        userId: user.id,
        fullName: user.fullName,
      }
    } catch (e) {
      console.error(e)
      return { success: false, fieldErrors: {}, formError: 'Ошибка сервера. Попробуйте позже.' }
    }
  })