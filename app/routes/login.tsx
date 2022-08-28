import type { ActionFunction, } from "@remix-run/node";
import { useActionData, useSearchParams } from "@remix-run/react";
import { json } from "@remix-run/node";
import { createUserSession, login } from "~/utils/session.server";
const mailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

function validateMail(mail: unknown) {
  if (typeof mail !== "string" || !mail.toString().match(mailRegex)) {
    return "Emails must be a valid address";
  }
}

function validatePassword(password: unknown) {
  if (typeof password !== "string" || password.length < 6) {
    return "Passwords must be at least 6 characters long";
  }
}

function validateUrl(url: any) {
  if (!url) return "/";
  if (typeof url === "string" && url.startsWith("/"))
    return url;
  return "/";
}

const badRequest = (data: ActionData) => json(data, { status: 400 })

type ActionData = {
  fields?: {
    email?: string,
    password?: string
  },
  formError?: string,
  fieldErrors?: {
    email?: string,
    password?: string
  }
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const email = form.get("email");
  const password = form.get("password");
  const redirectTo = validateUrl(form.get("redirectTo"));

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof redirectTo !== "string"
  ) {
    return badRequest({ formError: `Form not submitted correctly` })
  }

  const fields = { email, password };
  const fieldErrors = {
    email: validateMail(email),
    password: validatePassword(password),
  };
  if (Object.values(fieldErrors).some(Boolean))
    return badRequest({ fieldErrors, fields })

  const user = await login({ email, password });
  if (!user) {
    return badRequest({
      fields,
      formError: "Email or password is not correct",
    });
  }
  return createUserSession(user.id, redirectTo)
}



export default function LoginRoute() {
  const actionData = useActionData<ActionData>();
  const [searchParams] = useSearchParams();
  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl tracking-tight font-bold text-gray-900">Sign in to your account</h2>
        </div>
        <form className="mt-8 space-y-6" action="#" method="POST">
          <input type="hidden" name="redirectTo" value={searchParams.get("redirectTo") ?? undefined} />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-non relative bloc w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                defaultValue={actionData?.fields?.email}
                aria-invalid={Boolean(actionData?.fieldErrors?.email)}
                aria-errormessage={
                  actionData?.fieldErrors?.email ?
                    "email-error"
                    : undefined
                }
              />
              <div>
                {actionData?.fieldErrors?.email ? (
                  <p
                    className="text-red-500"
                    role="alert"
                    id="email-error"
                  >
                    {actionData.fieldErrors.email}
                  </p>
                ) : null}
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                defaultValue={actionData?.fields?.password}
                aria-invalid={
                  Boolean(
                    actionData?.fieldErrors?.password
                  ) || undefined
                }
                aria-errormessage={
                  actionData?.fieldErrors?.password
                    ? "password-error"
                    : undefined

                }
              />
              {actionData?.fieldErrors?.password ? (
                <p
                  className="text-red-500"
                  role="alert"
                  id="password-error"
                >
                  {actionData.fieldErrors.password}
                </p>
              ) : null}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div id="form-error-message">
              {actionData?.formError ? (
                <p
                  className="text-red-500"
                  role="alert"
                >
                  {actionData.formError}
                </p>
              ) : null}
            </div>
            {/*<div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </a>
            </div>
          </div>
          <div> */}
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
