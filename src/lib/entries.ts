import { createServerFn } from "@tanstack/react-start";

const fakeEntries = [
    { 
        id: 1, 
        author: { username: 'testuser1' } ,
        course: { id: 1, title: 'Основы ООП'},
        payment: { id: 1, title: 'Наличные' },
        startDate: new Date().toLocaleDateString('ru')
    },
    { 
        id: 2, 
        author: { username: 'testuser1' } ,
        course: { id: 2, title: 'Алгоритмы'},
        payment: { id: 2, title: 'Перевод' },
        startDate: new Date().toLocaleDateString('ru')
    },
    { 
        id: 3, 
        author: { username: 'testuser2' } ,
        course: { id: 2, title: 'Алгоритмы'},
        payment: { id: 1, title: 'Наличные' },
        startDate: new Date().toLocaleDateString('ru')
    }
]

export const getEntries = createServerFn()
    .validator((data: {
        username?: string
    }) => data)
    .handler(({ data }) => {
        if (data.username) {
            return fakeEntries.filter(({ author }) => author.username === data.username)
        }

        return fakeEntries
    })