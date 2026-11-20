import re
from datetime import datetime

from flask import (Flask, flash, redirect, render_template, request,
                   session, url_for)
import pymysql
from werkzeug.security import check_password_hash, generate_password_hash

app = Flask(__name__)
app.secret_key = 'koro4ki-secret-change-me'

STATUSES = ['Новая', 'Идет обучение', 'Обучение завершено']
PAYMENTS = ['Наличными', 'Перевод по номеру телефона']


# --- Подключение к БД (поправьте пароль под свой Open Server / XAMPP) ---
def get_db():
    return pymysql.connect(
        host='localhost', user='root', password='',
        database='korochki', charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor, autocommit=True)


def query(sql, params=(), one=False):
    db = get_db()
    with db.cursor() as cur:
        cur.execute(sql, params)
        return cur.fetchone() if one else cur.fetchall()


def execute(sql, params=()):
    db = get_db()
    with db.cursor() as cur:
        cur.execute(sql, params)
        return cur.lastrowid


# --- Проверки доступа ---
def login_required(f):
    def wrapper(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    wrapper.__name__ = f.__name__
    return wrapper


def admin_required(f):
    def wrapper(*args, **kwargs):
        if 'user_id' not in session or not session.get('is_admin'):
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    wrapper.__name__ = f.__name__
    return wrapper


@app.context_processor
def inject_user():
    if 'user_id' in session:
        return {'user': {'id': session['user_id'],
                         'is_admin': session.get('is_admin', False)}}
    return {'user': None}


# ---------------- Регистрация ----------------
@app.route('/register', methods=['GET', 'POST'])
def register():
    errors = {}
    form = {}

    if request.method == 'POST':
        # диагностика: смотреть в консоль запущенного сервера
        print('POST-данные:', dict(request.form))

        form = {k: request.form.get(k, '').strip()
                for k in ('login', 'full_name', 'phone', 'email')}
        password = request.form.get('password', '')

        if not re.fullmatch(r'[A-Za-z0-9]{6,}', form['login']):
            errors['login'] = 'Логин: только латиница и цифры, не менее 6 символов.'

        if not password:
            errors['password'] = 'Введите пароль.'
        elif ' ' in password:
            errors['password'] = 'Пароль не должен содержать пробелов.'
        elif len(password) < 8:
            errors['password'] = (f'Пароль слишком короткий: {len(password)} '
                                  f'символов, нужно минимум 8.')

        if not re.fullmatch(r'[А-Яа-яЁё\s]+', form['full_name']):
            errors['full_name'] = 'ФИО: только символы кириллицы и пробелы.'

        if not re.fullmatch(r'8\(\d{3}\)\d{3}-\d{2}-\d{2}', form['phone']):
            errors['phone'] = 'Телефон: формат 8(XXX)XXX-XX-XX.'

        if not re.fullmatch(r'[\w.+-]+@[\w-]+\.[\w.-]+', form['email']):
            errors['email'] = 'Введите корректный адрес электронной почты.'

        if not errors:
            existing = query('SELECT id FROM users WHERE login = %s',
                             (form['login'],), one=True)
            if existing:
                errors['login'] = 'Этот логин уже занят.'

        if not errors:
            execute(
                'INSERT INTO users (login, password_hash, full_name, phone, '
                'email) VALUES (%s, %s, %s, %s, %s)',
                (form['login'], generate_password_hash(password),
                 form['full_name'], form['phone'], form['email']))
            return redirect(url_for('login', registered=1))

    return render_template('register.html', errors=errors, form=form)


# ---------------- Авторизация ----------------
@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        login_value = request.form.get('login', '').strip()
        password = request.form.get('password', '')

        if not login_value or not password:
            error = 'Заполните оба поля.'
        else:
            user = query('SELECT * FROM users WHERE login = %s',
                         (login_value,), one=True)
            if not user:
                error = 'Пользователь не найден.'
            elif not check_password_hash(user['password_hash'], password):
                error = 'Неверный пароль.'
            else:
                session['user_id'] = user['id']
                session['is_admin'] = bool(user['is_admin'])
                return redirect(url_for('admin' if user['is_admin'] else 'index'))

    return render_template('login.html', error=error,
                           registered=request.args.get('registered'))


@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))


# ---------------- Формирование заявки ----------------
@app.route('/new_request', methods=['GET', 'POST'])
@login_required
def new_request():
    courses = query('SELECT * FROM courses ORDER BY id')
    errors = {}
    form = {}

    if request.method == 'POST':
        form = {'course_id': request.form.get('course_id', ''),
                'start_date': request.form.get('start_date', '').strip(),
                'payment_method': request.form.get('payment_method', '')}

        course = next((c for c in courses
                       if str(c['id']) == form['course_id']), None)
        if not course:
            errors['course_id'] = 'Выберите курс из списка.'

        d = None
        try:
            d = datetime.strptime(form['start_date'], '%d.%m.%Y')
        except ValueError:
            errors['start_date'] = 'Дата: формат ДД.ММ.ГГГГ.'

        if form['payment_method'] not in PAYMENTS:
            errors['payment_method'] = 'Выберите способ оплаты.'

        if not errors:
            execute(
                'INSERT INTO requests (user_id, course_id, start_date, '
                'payment_method) VALUES (%s, %s, %s, %s)',
                (session['user_id'], course['id'], d.strftime('%Y-%m-%d'),
                 form['payment_method']))
            flash('Заявка отправлена на рассмотрение администратору.',
                  'success')
            return redirect(url_for('new_request'))

    return render_template('new_request.html', courses=courses,
                           errors=errors, form=form)


# ---------------- Просмотр заявок + отзыв ----------------
@app.route('/my_requests', methods=['GET', 'POST'])
@login_required
def my_requests():
    if request.method == 'POST':
        rid = request.form.get('review_request_id', type=int)
        rating = request.form.get('rating', type=int)
        text = request.form.get('text', '').strip()

        done = query(
            'SELECT r.id FROM requests r '
            'LEFT JOIN reviews rv ON rv.request_id = r.id '
            'WHERE r.id = %s AND r.user_id = %s '
            "AND r.status = 'Обучение завершено' AND rv.id IS NULL",
            (rid, session['user_id']), one=True)
        if done and rating is not None and 1 <= rating <= 5 and text:
            execute('INSERT INTO reviews (request_id, rating, text) '
                    'VALUES (%s, %s, %s)', (rid, rating, text))
            flash('Спасибо! Ваш отзыв сохранён.', 'success')
        else:
            flash('Отзыв недоступен: курс ещё не завершён '
                  'или отзыв уже оставлен.', 'error')
        return redirect(url_for('my_requests'))

    requests_ = query(
        'SELECT r.*, c.name AS course_name, rv.rating, rv.text AS review_text '
        'FROM requests r '
        'JOIN courses c ON c.id = r.course_id '
        'LEFT JOIN reviews rv ON rv.request_id = r.id '
        'WHERE r.user_id = %s ORDER BY r.created_at DESC',
        (session['user_id'],))
    return render_template('my_requests.html', requests=requests_)


# ---------------- Панель администратора ----------------
@app.route('/admin', methods=['GET', 'POST'])
@admin_required
def admin():
    if request.method == 'POST':
        rid = request.form.get('request_id', type=int)
        status = request.form.get('status', '')
        if rid and status in STATUSES:
            execute('UPDATE requests SET status = %s WHERE id = %s',
                    (status, rid))
            flash(f'Статус заявки №{rid} изменён на «{status}».', 'success')
            return redirect(url_for('admin',
                                    page=request.args.get('page', 1),
                                    status=request.args.get('status', ''),
                                    q=request.args.get('q', '')))

    status_filter = request.args.get('status', '')
    search = request.args.get('q', '').strip()
    page = max(1, request.args.get('page', 1, type=int))
    per_page = 5

    where, params = [], []
    if status_filter in STATUSES:
        where.append('r.status = %s')
        params.append(status_filter)
    if search:
        where.append('(u.login LIKE %s OR u.full_name LIKE %s)')
        params += [f'%{search}%'] * 2
    where_sql = ('WHERE ' + ' AND '.join(where)) if where else ''

    total = query(
        'SELECT COUNT(*) AS cnt FROM requests r '
        'JOIN users u ON u.id = r.user_id ' + where_sql,
        params, one=True)['cnt']
    pages = max(1, -(-total // per_page))
    page = min(page, pages)

    requests_ = query(
        'SELECT r.*, u.login, u.full_name, u.phone, c.name AS course_name '
        'FROM requests r '
        'JOIN users u ON u.id = r.user_id '
        'JOIN courses c ON c.id = r.course_id '
        + where_sql +
        ' ORDER BY r.created_at DESC LIMIT %s OFFSET %s',
        params + [per_page, (page - 1) * per_page])

    return render_template('admin.html', requests=requests_,
                           statuses=STATUSES, status_filter=status_filter,
                           search=search, page=page, pages=pages)


# ---------------- Главная ----------------
@app.route('/')
def index():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)
