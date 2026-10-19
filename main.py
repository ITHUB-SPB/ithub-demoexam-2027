from typing import Annotated
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, Form
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import RedirectResponse
from sqlmodel import SQLModel, Field, Session, create_engine, select
from sqlalchemy.exc import IntegrityError, NoResultFound


class User(SQLModel, table=True):
    login: str = Field(primary_key=True)
    password: str
    fio: str
    role: str | None = Field(default="user")


class Record(SQLModel, table=True):
    id: int | None = Field(primary_key=True, default=None)
    course: str
    payment: str
    date: str
    user_login: str
    

class Login(SQLModel):
    login: str
    password: str


@asynccontextmanager
async def lifespan(app: FastAPI):
    engine = create_engine('sqlite:///db.sqlite3')
    SQLModel.metadata.create_all(bind=engine)
    yield


engine = create_engine('sqlite:///db.sqlite3')

app = FastAPI(lifespan=lifespan)

templates = Jinja2Templates(directory="templates")
app.mount('/static', StaticFiles(directory="./static"))

@app.get('/login')
def get_login(request: Request):
    return templates.TemplateResponse(request, 'login.html')


@app.post('/login')
def post_login(request: Request, login: Annotated[Login, Form()]):
    with Session(bind=engine) as session:
        try:
            expr = select(User).where(User.login == login.login).where(User.password == login.password)
            user = session.exec(expr).one()
        except NoResultFound:
            return templates.TemplateResponse(
                request, 
                'login.html', 
                context={
                    "error": "Неверные данные"
                }
            )

    response = RedirectResponse(
        '/admin' if user.role == 'moderator' else '/profile', 
        status_code=302
    )
    
    response.set_cookie('login', user.login)
    response.set_cookie('role', user.role)

    return response


@app.get('/register')
def get_register(request: Request):
    return templates.TemplateResponse(request, 'register.html')


@app.post('/register')
def post_register(request: Request, user: Annotated[User, Form()]):
    with Session(bind=engine) as session:
        try:
            session.add(user)
            session.commit()
        except IntegrityError:
            session.rollback()
            return templates.TemplateResponse(
                request, 
                'register.html',
                context={
                    "error": "Пользователь уже существует"
                }
            )

    return RedirectResponse('/login', status_code=302)


@app.get('/profile')
def get_profile(request: Request):
    if request.cookies.get('role') != 'user':
        return RedirectResponse('/login', status_code=302)

    with Session(bind=engine) as session:
        expr = select(Record).where(Record.user_login == request.cookies.get('login'))
        records = session.exec(expr).all()

    return templates.TemplateResponse(
        request, 
        'profile.html', 
        context={
            "login": request.cookies.get('login'),
            "records": records
        }
    )


@app.post('/profile')
def post_profile(request: Request, record: Annotated[Record, Form()]):
    with Session(bind=engine) as session:
        try:
            record.user_login = request.cookies.get('login')
            session.add(record)
            session.commit()
        except IntegrityError:
            session.rollback()
            return templates.TemplateResponse(
                request, 
                'profile.html',
                context={
                    "error": "Не удалось создать заявку"
                }
            )

    return RedirectResponse('/profile', status_code=302)

@app.get('/logout')
def get_logout(request: Request):
    response = RedirectResponse('/login', status_code=302)
    
    response.delete_cookie('login')
    response.delete_cookie('role')

    return response