import { createServerFn } from "@tanstack/react-start";
import { getPrismaClient } from "#/db";

export const createEntry = createServerFn({ method: "POST" })
    .validator()
    .handler()