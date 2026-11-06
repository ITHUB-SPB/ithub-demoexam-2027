CREATE TABLE user (
    login TEXT PRIMARY KEY,
    password TEXT NOT NULL,
    fio TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    role TEXT
);

CREATE TABLE record (
    id INTEGER PRIMARY KEY,
    course TEXT NOT NULL,
    payment TEXT NOT NULL,
    date TEXT NOT NULL,
    user_login TEXT NOT NULL,
    feedback TEXT,
    status TEXT,
    FOREIGN KEY (user_login) REFERENCES user (login)
);
