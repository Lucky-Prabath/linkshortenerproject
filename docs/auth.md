# Authentication Standards

All authentication in this project is handled exclusively by **Clerk**. No other auth libraries, custom JWT logic, session management, or third-party auth providers should ever be introduced.

---

## Rules

- **Clerk only.** Never implement custom auth logic. Do not use NextAuth, Auth.js, Supabase Auth, or any other authentication solution.
- **`clerkMiddleware` is the enforcement layer.** Route protection is defined in `middleware.ts` using `clerkMiddleware` from `@clerk/nextjs/server`. This is the only place route-level auth rules should live.
- **Never use `authMiddleware`.** It is deprecated. Always use `clerkMiddleware`.
- **Retrieve the current user via Clerk helpers only.** Use `auth()` (server) or `useAuth()` / `useUser()` (client) from `@clerk/nextjs`. Never pass user identity through props, cookies, or custom headers.
- **Store only the Clerk `userId`.** The `user_id` column on the `link` table stores the Clerk `userId` string. Never store full user objects or tokens in the database.

---

## Route Behaviour

| Route        | Unauthenticated     | Authenticated            |
| ------------ | ------------------- | ------------------------ |
| `/`          | Accessible          | Redirect to `/dashboard` |
| `/dashboard` | Redirect to sign-in | Accessible               |
| `/[slug]`    | Accessible          | Accessible               |

- `/dashboard` **must** be a protected route. If an unauthenticated user attempts to access it, Clerk middleware must redirect them to sign-in.
- If an authenticated user visits `/`, they must be redirected to `/dashboard`. Implement this check at the top of the `/` page Server Component using `auth()` and `redirect('/dashboard')`.

---

## Sign In / Sign Up UI

- Sign in and sign up must **always** be triggered as a **Clerk modal** — never navigate to a dedicated `/sign-in` or `/sign-up` page.
- Use the `mode="modal"` prop on `<SignInButton>` and `<SignUpButton>` from `@clerk/nextjs`.
- Do not create custom sign-in or sign-up page routes (`app/sign-in/`, `app/sign-up/`, etc.) unless Clerk's hosted pages are explicitly required for a specific reason.

```tsx
// Correct
<SignInButton mode="modal">
  <Button>Sign in</Button>
</SignInButton>

// Wrong — navigates away from page
<SignInButton>
  <Button>Sign in</Button>
</SignInButton>
```

---

## Accessing Auth State

```ts
// Server Component or Server Action
import { auth } from "@clerk/nextjs/server";

const { userId } = await auth();
if (!userId) redirect("/"); // or handle as needed
```

```ts
// Client Component
import { useAuth } from "@clerk/nextjs";

const { isSignedIn, userId } = useAuth();
```
