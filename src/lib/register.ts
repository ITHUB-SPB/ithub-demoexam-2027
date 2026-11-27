import { createServerFn } from '@tanstack/react-start'
import { getPrismaClient } from '../db'
import { hashPassword } from './hash'

type Result = {
  success: true
} | {
  success: false
  message: string
}

const LOGIN_RE = /^[A-Za-z0-9]{6,}$/
const FULLNAME_RE = /^[А-Яа-яЁё\s]+$/
const PHONE_RE = /^8\(\d{3}\)\d{3}-\d{2}-\d{2}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const register = createServerFn({ method: 'POST' })
  .validator((data: {
    login: string,
    password: string,
    fullname: string,
    phone: string,
    email: string,
  }) => data)
  .handler(async ({ data }): Promise<Result> => {
    if (!LOGIN_RE.test(data.login)) {
      return { success: false, message: 'Логин: латиница и цифры, не менее 6 символов' }
    }
    if (data.password.length < 8) {
      return { success: false, message: 'Пароль: не менее 8 символов' }
    }
    if (!FULLNAME_RE.test(data.fullname.trim())) {
      return { success: false, message: 'ФИО: только символы кириллицы и пробелы' }
    }
    if (!PHONE_RE.test(data.phone)) {
      return { success: false, message: 'Телефон: формат 8(XXX)XXX-XX-XX' }
    }
    if (!EMAIL_RE.test(data.email)) {
      return { success: false, message: 'Некорректный адрес электронной почты' }
    }

    const prisma = getPrismaClient()

    const existing = await prisma.user.findUnique({
      where: { login: data.login },
    })
    if (existing) {
      return { success: false, message: 'Пользователь с таким логином уже существует' }
    }

    await prisma.user.create({
      data: { ...data, password: await hashPassword(data.password) },
    })

    return { success: true }
  })
