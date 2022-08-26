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
  let urls = ["/"];
  if (urls.includes(url)) {
    return url;
  }
  return "/";
}

const badRequest = (data: any) => json(data, { status: 400 })


export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const loginType = form.get("loginType");
  const email = form.get("email");
  const password = form.get("password");
  const redirectTo = validateUrl(form.get("redirectTo"));
  console.log("form", form, "loginType", loginType, "email", email, "password", password, "redirectTo", redirectTo)

  if (
    typeof loginType !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof redirectTo !== "string"
  ) {
    return badRequest({ formError: `Form not submitted correctly` })
  }

  const fields = { loginType, email, password };
  const fieldErrors = {
    email: validateMail(email),
    password: validatePassword(password),
  };
  if (Object.values(fieldErrors).some(Boolean))
    return badRequest({ fieldErrors, fields })

  console.log("salut");
  switch (loginType) {
    case "login": {
      const user = await login({ email, password });
      console.log({ user });
      if (!user) {
        return badRequest({
          fields,
          formError: "Email or password is not correct",
        });
      }
      return createUserSession(user.id, redirectTo)
    }
    case "register": {
      return badRequest({ fields, formError: "You are not allowed to create users on this server" })
    }
    default: {
      return badRequest({
        fields,
        formError: "Login type invalid"
      })
    }
  }
}



const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg text-purple-900 outline-purple-300 `;
export default function LoginRoute() {
  const actionData = useActionData();
  const [searchParams] = useSearchParams();
  return (
    <div className="flex justify-center items-center content-center">
      <form method="post">
        <h1 className="text-center text-2xl text-white">Login</h1>
        <input type="hidden" name="redirectTo" value={searchParams.get("redirectTo") ?? undefined} />
        <fieldset className="text-center">
          <legend className="sr-only">
            Login or Register ?
          </legend>
          <label>
            <input type="radio" name="loginType" value="login"
              defaultChecked={!actionData?.fields?.loginType || actionData?.fields?.loginType === "login"} />
            {" "}Login</label>
          <label>
            <input
              type="radio"
              name="loginType"
              value="register"
              defaultChecked={
                actionData?.fields?.loginType ===
                "register"
              }
            />{" "}
            Register
          </label>
        </fieldset>
        <label className="text-lg leading-7 text-white">
          Email:
          <input
            type="text"
            className={inputClassName}
            name="email"
            required
            minLength={3}
            defaultValue={actionData?.fields?.email}
            aria-invalid={Boolean(
              actionData?.fieldErrors?.email
            )}
            aria-errormessage={
              actionData?.fieldErrors?.email
                ? "email-error"
                : undefined
            }
          />
          {actionData?.fieldErrors?.email ? (
            <p
              className="text-red-500"
              role="alert"
              id="email-error"
            >
              {actionData.fieldErrors.email}
            </p>
          ) : null}
        </label>
        <label className="text-lg leading-7 text-white">
          Password
          <input
            name="password"
            className={inputClassName}
            required
            defaultValue={actionData?.fields?.password}
            type="password"
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
        </label>
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
        <button className="my-4 py-2 px-7 text-purple-500 font-bold border-2 hover:scale-105 border-purple-500 rounded-lg bg-white" type="submit">Login</button>
      </form>
    </div>
  )
}
