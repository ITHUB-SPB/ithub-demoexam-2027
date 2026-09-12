import { cn } from "cn"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Link } from "@tanstack/react-router"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Вход в аккаунт</h1>
          <p className="text-sm text-balance text-oklch(0.556 0 0) dark:text-oklch(0.708 0 0)">
            Вход
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="login">Логин</FieldLabel>
          <Input id="login" type="text" placeholder="" required />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Пароль</FieldLabel>
          <Input id="password" type="password" required />
        </Field>
        <Field>
          <Button type="submit">Войти</Button>
        </Field>
        <Field>
          <FieldDescription className="text-center">
            Нет аккаунта?{" "}
            <Link to='/register' className="underline underline-offset-4">
              Зарегистрироваться
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
