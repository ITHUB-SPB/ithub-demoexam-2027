
import { createFileRoute, redirect } from "@tanstack/react-router";

import { getUser } from "#/lib/login";
import { getEntries } from "#/lib/entries";


export const Route = createFileRoute('/')({
    beforeLoad: async () => {
        const {login} = await getUser();

        if (login === null) {
            throw redirect({to: '/login'})
        }
    },

    loader: async ({context}) => {
        const {entries} = await getEntries({
            data: {username: context.login}
        })
    }
})