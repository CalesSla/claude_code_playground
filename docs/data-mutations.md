# Data Mutations Guidelines

## Core Principle: Server Actions Only

**ALL data mutations in this application MUST be done via Server Actions.**

This is a strict requirement with no exceptions.

### Prohibited Approaches

Do NOT mutate data using any of the following methods:

- **Route Handlers** (`app/api/**/route.ts`) - Do not use for data mutations
- **Client-side mutations** - Never mutate data directly from Client Components
- **Direct database calls in components** - All DB operations must go through helper functions

### Required Approach

Data mutations must follow this pattern:

1. Create a **Server Action** in a colocated `actions.ts` file
2. The Server Action calls a **helper function** from `/data` directory
3. The helper function executes the **Drizzle ORM** query

---

## Server Actions: Colocated `actions.ts` Files

**All Server Actions MUST be defined in colocated files named `actions.ts`.**

### Structure

```
/app
  /dashboard
    /projects
      page.tsx
      actions.ts      # Server actions for this route
    /settings
      page.tsx
      actions.ts      # Server actions for this route
```

### Requirements

1. **File naming** - Always name the file `actions.ts`
2. **Colocate with route** - Place `actions.ts` next to the `page.tsx` that uses it
3. **Use `'use server'` directive** - Every `actions.ts` file must start with `'use server'`

```ts
// CORRECT: Colocated actions.ts file
// app/dashboard/projects/actions.ts
'use server';

import { createProject } from '@/data/projects';
import { z } from 'zod';

const createProjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});

export async function createProjectAction(params: { name: string; description?: string }) {
  const validated = createProjectSchema.parse(params);
  return createProject(validated);
}
```

```ts
// WRONG: Server action defined inline in a component
// app/dashboard/projects/page.tsx
export default async function ProjectsPage() {
  async function createProject(formData: FormData) { // NEVER DO THIS
    'use server';
    // ...
  }
}
```

---

## Parameter Typing: No FormData

**Server Action parameters MUST be typed objects. The `FormData` type is NOT allowed.**

### Prohibited

```ts
// WRONG: Using FormData
export async function createProjectAction(formData: FormData) {
  const name = formData.get('name'); // NEVER DO THIS
}
```

### Required

```ts
// CORRECT: Using typed parameters
type CreateProjectParams = {
  name: string;
  description?: string;
};

export async function createProjectAction(params: CreateProjectParams) {
  // params is fully typed
}
```

### Handling Forms

When working with HTML forms, convert `FormData` to typed objects in the Client Component before calling the Server Action:

```tsx
// app/dashboard/projects/project-form.tsx
'use client';

import { createProjectAction } from './actions';

export function ProjectForm() {
  async function handleSubmit(formData: FormData) {
    // Convert FormData to typed object in the client
    const params = {
      name: formData.get('name') as string,
      description: formData.get('description') as string || undefined,
    };

    await createProjectAction(params);
  }

  return (
    <form action={handleSubmit}>
      <input name="name" required />
      <textarea name="description" />
      <button type="submit">Create Project</button>
    </form>
  );
}
```

---

## Validation: Zod Required

**ALL Server Actions MUST validate their arguments using Zod.**

### Requirements

1. **Define a Zod schema** for every Server Action's parameters
2. **Validate at the start** of every Server Action
3. **Handle validation errors** appropriately

### Implementation Pattern

```ts
// app/dashboard/projects/actions.ts
'use server';

import { createProject, updateProject, deleteProject } from '@/data/projects';
import { z } from 'zod';

// Define schemas for each action
const createProjectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  description: z.string().max(500).optional(),
});

const updateProjectSchema = z.object({
  id: z.string().uuid('Invalid project ID'),
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
});

const deleteProjectSchema = z.object({
  id: z.string().uuid('Invalid project ID'),
});

// Validate in every action
export async function createProjectAction(params: { name: string; description?: string }) {
  const validated = createProjectSchema.parse(params);
  return createProject(validated);
}

export async function updateProjectAction(params: { id: string; name?: string; description?: string }) {
  const validated = updateProjectSchema.parse(params);
  return updateProject(validated.id, validated);
}

export async function deleteProjectAction(params: { id: string }) {
  const validated = deleteProjectSchema.parse(params);
  return deleteProject(validated.id);
}
```

### Error Handling Pattern

For user-friendly error handling, use `safeParse` instead of `parse`:

```ts
'use server';

import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
});

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function createProjectAction(
  params: { name: string }
): Promise<ActionResult<{ id: string }>> {
  const result = schema.safeParse(params);

  if (!result.success) {
    return {
      success: false,
      error: result.error.errors[0]?.message ?? 'Validation failed'
    };
  }

  const project = await createProject(result.data);
  return { success: true, data: project };
}
```

---

## Database Helper Functions: The `/data` Directory

**All database mutations MUST be implemented as helper functions within the `/data` directory.**

Server Actions must NOT contain direct database calls. They must delegate to helper functions.

### Structure

```
/data
  /projects.ts    # Project queries AND mutations
  /users.ts       # User queries AND mutations
  /tasks.ts       # Task queries AND mutations
```

### Requirements

1. **Use Drizzle ORM exclusively** - All mutations must use Drizzle ORM
2. **DO NOT USE RAW SQL** - No `sql` template literals, no raw query strings
3. **Always filter by `userId`** - Ensure user can only mutate their own data

```ts
// CORRECT: Helper function in /data directory
// /data/projects.ts
import { db } from '@/db';
import { projects } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

export async function createProject(data: { name: string; description?: string }) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const [project] = await db
    .insert(projects)
    .values({
      ...data,
      userId,
    })
    .returning();

  return project;
}

export async function updateProject(projectId: string, data: { name?: string; description?: string }) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const [project] = await db
    .update(projects)
    .set(data)
    .where(and(
      eq(projects.id, projectId),
      eq(projects.userId, userId)
    ))
    .returning();

  return project;
}

export async function deleteProject(projectId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  await db
    .delete(projects)
    .where(and(
      eq(projects.id, projectId),
      eq(projects.userId, userId)
    ));
}
```

```ts
// WRONG: Direct database call in Server Action
// app/dashboard/projects/actions.ts
'use server';

import { db } from '@/db';

export async function createProjectAction(params: { name: string }) {
  // NEVER put database calls directly in actions
  await db.insert(projects).values(params); // WRONG
}
```

---

## Complete Example

Here is a complete example showing all the requirements together:

### Helper Function (`/data/projects.ts`)

```ts
import { db } from '@/db';
import { projects } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

type CreateProjectData = {
  name: string;
  description?: string;
};

export async function createProject(data: CreateProjectData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const [project] = await db
    .insert(projects)
    .values({
      ...data,
      userId,
    })
    .returning();

  return project;
}
```

### Server Action (`app/dashboard/projects/actions.ts`)

```ts
'use server';

import { createProject } from '@/data/projects';
import { z } from 'zod';

const createProjectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).optional(),
});

type CreateProjectParams = z.infer<typeof createProjectSchema>;

export async function createProjectAction(params: CreateProjectParams) {
  const validated = createProjectSchema.parse(params);
  return createProject(validated);
}
```

### Client Component (`app/dashboard/projects/project-form.tsx`)

```tsx
'use client';

import { createProjectAction } from './actions';

export function ProjectForm() {
  async function handleSubmit(formData: FormData) {
    const params = {
      name: formData.get('name') as string,
      description: formData.get('description') as string || undefined,
    };

    await createProjectAction(params);
  }

  return (
    <form action={handleSubmit}>
      <input name="name" required />
      <textarea name="description" />
      <button type="submit">Create Project</button>
    </form>
  );
}
```

---

## Summary

| Requirement | Rule |
|-------------|------|
| Mutation method | Server Actions ONLY |
| Action location | Colocated `actions.ts` files ONLY |
| Parameter types | Typed objects ONLY (no `FormData`) |
| Validation | Zod validation REQUIRED for all actions |
| Database calls | `/data` directory helper functions ONLY |
| ORM | Drizzle ORM ONLY (no raw SQL) |
| Data access | User's own data ONLY (filter by `userId`) |

## Checklist

Before merging any data mutation code, verify:

- [ ] Server Action is in a colocated `actions.ts` file
- [ ] `actions.ts` file has `'use server'` directive at the top
- [ ] Parameters are typed objects (not `FormData`)
- [ ] Zod schema is defined and used to validate parameters
- [ ] Database call is delegated to a `/data` helper function
- [ ] Helper function uses Drizzle ORM (no raw SQL)
- [ ] Helper function filters by `userId` from authenticated session
