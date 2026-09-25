import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";

import { getPrismaClient } from "../db";
import { verifyHash } from "./hash";


export const useAppSession = createServerOnlyFn()

export const getUser = createServerFn().handler()

export const logout = createServerFn().handler()

export const login = createServerFn()