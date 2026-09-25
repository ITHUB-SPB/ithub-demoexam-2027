import { createServerFn } from "@tanstack/react-start";
import { getPrismaClient } from "../db";
import { hashPassword } from "./hash";

export const register = createServerFn({ method: 'POST' })
    .validator()
    .handler()