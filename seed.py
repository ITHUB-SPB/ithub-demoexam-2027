import random

courses = ["ОАиП", "ОКС", "ВМ"]
payment_types = ["Наличные", "Перевод"]
statuses = ["Новая", "Идет обучение", "Обучение завершено"]

users = [
    { "login": f"testuser{ix}", "password": f"testpassword{ix}", "fio": f"Тестовый Юзер {ix}" }
    for ix in range(1, 5)
] + [
    { "login": "moderator", "password": "koroknet", "fio": "Модератор", "role": "moderator" }
]

records = [
    { 
        "course": random.choice(courses), 
        "payment": random.choice(payment_types), 
        "date": "2026-10-26",
        "user_login": random.choice(users[:-1])["login"],
        "status": random.choice(statuses)
    }
    for _ in range(50)
]