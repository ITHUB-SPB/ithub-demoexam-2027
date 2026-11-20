import pymysql

from app import app, execute, query
from werkzeug.security import generate_password_hash

STATEMENTS = [
    "CREATE DATABASE IF NOT EXISTS korochki CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci",
    """CREATE TABLE IF NOT EXISTS korochki.users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  login VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100) NOT NULL,
  is_admin TINYINT(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB""",
    """CREATE TABLE IF NOT EXISTS korochki.courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
) ENGINE=InnoDB""",
    """CREATE TABLE IF NOT EXISTS korochki.requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  course_id INT NOT NULL,
  start_date DATE NOT NULL,
  payment_method ENUM('Наличными','Перевод по номеру телефона') NOT NULL,
  status ENUM('Новая','Идет обучение','Обучение завершено') NOT NULL DEFAULT 'Новая',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_req_user FOREIGN KEY (user_id) REFERENCES korochki.users(id) ON DELETE CASCADE,
  CONSTRAINT fk_req_course FOREIGN KEY (course_id) REFERENCES korochki.courses(id)
) ENGINE=InnoDB""",
    """CREATE TABLE IF NOT EXISTS korochki.reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  request_id INT NOT NULL UNIQUE,
  rating TINYINT NOT NULL,
  text TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_rev_request FOREIGN KEY (request_id) REFERENCES korochki.requests(id) ON DELETE CASCADE
) ENGINE=InnoDB""",
]

with app.app_context():
    # 1) создаём базу и таблицы — подключаемся БЕЗ указания базы
    db = pymysql.connect(host='localhost', user='root', password='',
                         charset='utf8mb4',
                         cursorclass=pymysql.cursors.DictCursor)
    with db.cursor() as cur:
        for stmt in STATEMENTS:
            cur.execute(stmt)
    db.commit()
    db.close()

    # 2) наполняем справочники — теперь база точно существует
    if not query('SELECT id FROM courses LIMIT 1'):
        for name in ('Основы алгоритмизации и программирования',
                     'Основы веб-дизайна',
                     'Основы проектирования баз данных'):
            execute('INSERT INTO courses (name) VALUES (%s)', (name,))

    if not query('SELECT id FROM users WHERE login = %s', ('Admin',)):
        execute(
            'INSERT INTO users (login, password_hash, full_name, phone, '
            'email, is_admin) VALUES (%s, %s, %s, %s, %s, 1)',
            ('Admin', generate_password_hash('KorokNET'),
             'Администратор портала', '8(000)000-00-00',
             'admin@korochki.ru'))

print('База готова: таблицы созданы, курсы и администратор Admin/KorokNET добавлены.')
