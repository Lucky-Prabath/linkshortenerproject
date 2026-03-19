
---
description: Read this before creating or modifying UI components in the project.
---


# UI Component Standards

All UI in this project is built with **shadcn/ui**. Do not hand-roll custom components for anything shadcn already provides.

---

## Rules

- **shadcn/ui only.** Every UI primitive — buttons, inputs, dialogs, tables, dropdowns, toasts, badges, etc. — must use the corresponding shadcn/ui component.
- **Never create custom equivalents.** If a shadcn component exists for the use case, use it. Do not write bespoke HTML + Tailwind replacements.
- **Add components via the CLI.** Install new shadcn components with `npx shadcn@latest add <component>`. Do not copy-paste component code manually.
- **Do not modify files in `components/ui/`.** These are owned by shadcn and will be overwritten on upgrades. Extend behaviour by composing them in a wrapper component outside `components/ui/`.
- **Tailwind utility classes only for layout/spacing.** Apply Tailwind classes to shadcn components for layout, spacing, and sizing. Do not override their internal styles with custom CSS.

---

## Adding a Component

```bash
npx shadcn@latest add <component-name>
# e.g.
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add table
```

Components are added to `components/ui/` and are immediately importable:

```tsx
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
```

---

## Composition Pattern

When you need reusable behaviour on top of a shadcn primitive, wrap it — don't modify the source:

```tsx
// components/confirm-dialog.tsx  ✅ Correct
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ConfirmDialog({ onConfirm }: { onConfirm: () => void }) {
  return (
    <Dialog>
      <DialogContent>
        <p>Are you sure?</p>
        <DialogFooter>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

---

## Reference

- Available components: https://ui.shadcn.com/docs/components
- Project config: [components.json](../components.json)
