export const COURSES = [
  'Основы алгоритмизации и программирования',
  'Основы веб-дизайна',
  'Основы проектирования баз данных',
] as const

export const PAYMENT_TYPES = [
  'Наличными',
  'Переводом по номеру телефона',
] as const

export const ENTRY_STATUSES = [
  'Новая',
  'Идет обучение',
  'Обучение завершено',
] as const

export const STATUS_NEW = ENTRY_STATUSES[0]
export const STATUS_DONE = ENTRY_STATUSES[2]

export const ADMIN_LOGIN = 'Admin'
