import { createHmac, timingSafeEqual } from "node:crypto";
import {
    getCookie,
    setCookie,
    deleteCookie,
} from "@tanstack/react-start/server";
import { createServerOnlyFn } from "@tanstack/react-start";

const SECRET = process.env.SESSION_SECRET ?? "dev-secret";

function sign(value: string) {
    return createHmac("sha256", SECRET).update(value).digest("hex");
}

export const setSession = createServerOnlyFn(async (userId: number) => {
    const value = String(userId);
    setCookie("session", `${value}.${sign(value)}`, {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
    });
});

export const clearSession = createServerOnlyFn(async () => {
    deleteCookie("session", { path: "/" });
});

export const getSessionUser = createServerOnlyFn(async (): Promise<number | null> => {
    const raw = getCookie("session");
    if (!raw) return null;

    const [value, sig] = raw.split(".");
    if (!value || !sig) return null;

    const expected = sign(value);
    if (
        expected.length !== sig.length ||
        !timingSafeEqual(Buffer.from(expected), Buffer.from(sig))
    )
        return null;

    const id = Number(value);
    return Number.isFinite(id) ? id : null;
});