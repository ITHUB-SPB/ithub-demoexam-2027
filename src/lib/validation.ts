import { z } from 'zod'

export const registerSchema = z.object({
  login: z
    .string()
    .min(6, 'Логин должен содержать минимум 6 символов')
    .regex(/^[a-zA-Z0-9]+$/, 'Логин может содержать только латиницу и цифры'),

  password: z
    .string()
    .min(8, 'Пароль должен содержать минимум 8 символов'),

  fullName: z
    .string()
    .min(1, 'ФИО обязательно')
    .regex(/^[А-Яа-яЁё\s]+$/, 'ФИО может содержать только кириллицу и пробелы'),

  phone: z
    .string()
    .regex(/^8\(\d{3}\)\d{3}-\d{2}-\d{2}$/, 'Телефон в формате 8(XXX)XXX-XX-XX'),

  email: z
    .string()
    .email('Некорректный адрес электронной почты'),
})

export type RegisterInput = z.infer<typeof registerSchema>
export const applicationSchema = z.object({
  courseName: z
    .string()
    .min(1, 'Выберите курс'),

  startDate: z
    .string()
    .regex(
      /^\d{2}\.\d{2}\.\d{4}$/,
      'Дата должна быть в формате ДД.ММ.ГГГГ'
    ),

  paymentMethod: z
    .string()
    .min(1, 'Выберите способ оплаты'),
})

export type ApplicationInput = z.infer<typeof applicationSchema>