---
description: Read this before implementing or modifying any server actions in the project.
---

# Server Actions Standards

All data mutations in this project must be performed via **Next.js Server Actions**. No API routes (`app/api/`) should be used for mutations.

---

## Rules

- **Server actions only for mutations.** Never use API route handlers for create, update, or delete operations.
- **Client components call server actions.** Server actions must be imported and called from `"use client"` components, not invoked directly from Server Components.
- **File naming and colocation.** Server action files must be named `actions.ts` and placed in the same directory as the component that calls them.
- **No `FormData`.** All data passed into server actions must use explicit TypeScript types. Never use the `FormData` type as a parameter.
- **Validate with Zod.** All inputs must be validated using Zod at the top of every server action before any business logic or database access.
- **Auth check first.** Every server action must call `auth()` from `@clerk/nextjs/server` and verify a logged-in user exists before proceeding with any database operation. Return early (or throw) if no user is found.
- **Use `/data` helpers for DB access.** Database operations must go through the helper functions in the `/data` directory. Never import or call Drizzle queries directly inside a server action.
- **Never throw errors.** Server actions must not throw exceptions. Instead, always return a typed object with either a `success` property or an `error` property (e.g. `{ success: true, data: ... }` / `{ error: "Unauthorized" }`).

---

## Server Action Structure

```ts
'use server';

import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { createLink } from '@/data/links'; // helper from /data

const createLinkSchema = z.object({
  originalUrl: z.string().url(),
});

export async function createLinkAction(input: {
  originalUrl: string;
}): Promise<
  | { success: true; data: Awaited<ReturnType<typeof createLink>> }
  | { error: string }
> {
  // 1. Auth check
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  // 2. Validate input
  const result = createLinkSchema.safeParse(input);
  if (!result.success) return { error: result.error.errors[0].message };

  // 3. Delegate to /data helper
  const data = await createLink({
    userId,
    originalUrl: result.data.originalUrl,
  });
  return { success: true, data };
}
```

---

## File Structure Example

```
app/
  dashboard/
    _components/
      create-link-form.tsx   ← "use client" component
      actions.ts             ← server actions for this feature
```
