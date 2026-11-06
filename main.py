from typing import Annotated
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, Form
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import RedirectResponse
from sqlmodel import SQLModel, Field, Session, create_engine, select
from sqlalchemy import inspect, text
from sqlalchemy.exc import IntegrityError, NoResultFound

SQLITE_URL = "sqlite:///db.sqlite3"
REDIRECT_LOGIN = "/login"
COOKIE_LOGIN = "login"
COOKIE_ROLE = "role"
ROLE_USER = "user"
ROLE_MODERATOR = "moderator"


class Account(SQLModel, table=True):
    __tablename__ = "user"

    login: str = Field(primary_key=True)
    password: str
    fio: str
    phone: str | None = Field(default=None)
    email: str | None = Field(default=None)
    role: str | None = Field(default="user")


class Application(SQLModel, table=True):
    __tablename__ = "record"

    id: int | None = Field(primary_key=True, default=None)
    course: str
    payment: str
    date: str
    user_login: str
    feedback: str | None = Field(default=None)
    status: str | None = Field(default="Новая")


class Credentials(SQLModel):
    login: str
    password: str


class StatusPayload(SQLModel):
    record_id: int
    new_status: str


class FeedbackPayload(SQLModel):
    record_id: int
    new_feedback: str


def build_engine():
    return create_engine(SQLITE_URL)


def open_db():
    return Session(bind=db_engine)


def cookie_value(req: Request, key: str) -> str | None:
    return req.cookies.get(key)


def redirect_to(path: str) -> RedirectResponse:
    return RedirectResponse(path, status_code=302)


@asynccontextmanager
async def on_startup(app: FastAPI):
    startup_engine = build_engine()
    SQLModel.metadata.create_all(bind=startup_engine)

    inspector = inspect(startup_engine)
    column_names = {col["name"] for col in inspector.get_columns("user")}
    with startup_engine.begin() as conn:
        if "phone" not in column_names:
            conn.execute(text("ALTER TABLE user ADD COLUMN phone TEXT"))
        if "email" not in column_names:
            conn.execute(text("ALTER TABLE user ADD COLUMN email TEXT"))

    with Session(bind=startup_engine) as db:
        try:
            db.add(
                Account(
                    login="Admin",
                    password="KorokNET",
                    fio="Администратор",
                    phone="8(900)000-00-00",
                    email="admin@koroknet.ru",
                    role=ROLE_MODERATOR,
                )
            )
            db.commit()
        except IntegrityError:
            db.rollback()

    yield


db_engine = build_engine()
app = FastAPI(lifespan=on_startup)
views = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="./static"))


def render(req: Request, template_name: str, **ctx):
    return views.TemplateResponse(req, template_name, context=ctx)


@app.get("/login")
def login_page(req: Request):
    return render(req, "login.jinja2")


@app.post("/login")
def login_submit(req: Request, credentials: Annotated[Credentials, Form()]):
    with open_db() as db:
        try:
            statement = (
                select(Account)
                .where(Account.login == credentials.login)
                .where(Account.password == credentials.password)
            )
            found = db.exec(statement).one()
        except NoResultFound:
            return render(req, "login.jinja2", error="Неверные данные")

    target = "/admin" if found.role == ROLE_MODERATOR else "/profile"
    reply = redirect_to(target)
    reply.set_cookie(COOKIE_LOGIN, found.login)
    reply.set_cookie(COOKIE_ROLE, found.role)
    return reply


@app.get("/register")
def register_page(req: Request):
    return render(req, "register.jinja2")


@app.post("/register")
def register_submit(req: Request, account: Annotated[Account, Form()]):
    with open_db() as db:
        try:
            db.add(account)
            db.commit()
        except IntegrityError:
            db.rollback()
            return render(req, "register.jinja2", error="Пользователь уже существует")

    return redirect_to(REDIRECT_LOGIN)


@app.get("/profile")
def profile_page(req: Request):
    if cookie_value(req, COOKIE_ROLE) != ROLE_USER:
        return redirect_to(REDIRECT_LOGIN)

    with open_db() as db:
        statement = select(Application).where(
            Application.user_login == cookie_value(req, COOKIE_LOGIN)
        )
        items = db.exec(statement).all()

    return render(
        req,
        "profile.jinja2",
        username=cookie_value(req, COOKIE_LOGIN),
        items=items,
    )


@app.get("/profile/new")
def new_application_page(req: Request):
    if cookie_value(req, COOKIE_ROLE) != ROLE_USER:
        return redirect_to(REDIRECT_LOGIN)

    return render(
        req,
        "new_record.jinja2",
        username=cookie_value(req, COOKIE_LOGIN),
    )


@app.post("/profile/new")
def new_application_submit(req: Request, application: Annotated[Application, Form()]):
    with open_db() as db:
        try:
            application.user_login = cookie_value(req, COOKIE_LOGIN)
            db.add(application)
            db.commit()
        except IntegrityError:
            db.rollback()
            return render(req, "profile.jinja2", error="Не удалось создать заявку")

    return redirect_to("/profile")


@app.post("/status")
def status_submit(req: Request, payload: Annotated[StatusPayload, Form()]):
    with open_db() as db:
        try:
            statement = select(Application).where(Application.id == payload.record_id)
            row = db.exec(statement).one()
            row.status = payload.new_status
            db.commit()
            db.refresh(row)
        except NoResultFound:
            pass

    return redirect_to("/admin")


@app.post("/feedback")
def feedback_submit(req: Request, payload: Annotated[FeedbackPayload, Form()]):
    with open_db() as db:
        try:
            statement = select(Application).where(Application.id == payload.record_id)
            row = db.exec(statement).one()
            row.feedback = payload.new_feedback
            db.commit()
            db.refresh(row)
            return redirect_to("/profile")
        except NoResultFound:
            return render(req, "profile.jinja2", error="Не удалось оставить отзыв")


@app.get("/admin")
def admin_page(req: Request):
    if cookie_value(req, COOKIE_ROLE) != ROLE_MODERATOR:
        return redirect_to(REDIRECT_LOGIN)

    with open_db() as db:
        items = db.exec(select(Application)).all()

    return render(
        req,
        "admin.jinja2",
        username=cookie_value(req, COOKIE_LOGIN),
        items=items,
    )


@app.get("/logout")
def logout_page():
    reply = redirect_to(REDIRECT_LOGIN)
    reply.delete_cookie(COOKIE_LOGIN)
    reply.delete_cookie(COOKIE_ROLE)
    return reply
