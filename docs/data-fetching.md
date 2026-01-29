# Data Fetching Guidelines

## Core Principle: Server Components Only

**ALL data fetching in this application MUST be done via Server Components.**

This is a strict requirement with no exceptions.

### Prohibited Approaches

Do NOT fetch data using any of the following methods:

- **Route Handlers** (`app/api/**/route.ts`) - Do not use for data fetching
- **Client Components** - Never fetch data in components marked with `'use client'`
- **Client-side fetch calls** - No `useEffect` + `fetch` patterns
- **Third-party client-side data fetching libraries** - No React Query, SWR, or similar for data fetching

### Required Approach

Data fetching must follow this pattern:

1. Fetch data in a **Server Component**
2. Pass the data as props to Client Components when interactivity is needed

```tsx
// CORRECT: Server Component fetches data
// app/dashboard/page.tsx
import { getProjects } from '@/data/projects';

export default async function DashboardPage() {
  const projects = await getProjects();

  return <ProjectList projects={projects} />;
}
```

```tsx
// WRONG: Client Component fetching data
'use client';

export default function DashboardPage() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch('/api/projects').then(/* ... */); // NEVER DO THIS
  }, []);
}
```

---

## Database Queries: The `/data` Directory

**All database queries MUST be implemented as helper functions within the `/data` directory.**

### Structure

```
/data
  /projects.ts    # Project-related queries
  /users.ts       # User-related queries
  /tasks.ts       # Task-related queries
  /...
```

### Requirements

1. **Use Drizzle ORM exclusively** - All queries must use Drizzle ORM
2. **DO NOT USE RAW SQL** - No `sql` template literals, no raw query strings
3. **One concern per file** - Organize by domain/entity

```ts
// CORRECT: Using Drizzle ORM
// /data/projects.ts
import { db } from '@/db';
import { projects } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function getProjectById(projectId: string, userId: string) {
  return db.query.projects.findFirst({
    where: and(
      eq(projects.id, projectId),
      eq(projects.userId, userId)
    ),
  });
}
```

```ts
// WRONG: Using raw SQL
export async function getProjectById(projectId: string) {
  return db.execute(sql`SELECT * FROM projects WHERE id = ${projectId}`); // NEVER DO THIS
}
```

---

## Security: User Data Isolation

**A logged-in user can ONLY access their own data. This is a critical security requirement.**

### Mandatory Rules

1. **Every query MUST filter by `userId`** - No exceptions
2. **Always get `userId` from the authenticated session** - Never trust client input for user identification
3. **Validate ownership before any read, update, or delete operation**

### Implementation Pattern

```ts
// /data/projects.ts
import { db } from '@/db';
import { projects } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

export async function getProjects() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  return db.query.projects.findMany({
    where: eq(projects.userId, userId),
  });
}

export async function getProjectById(projectId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  // ALWAYS filter by userId to ensure user can only access their own data
  return db.query.projects.findFirst({
    where: and(
      eq(projects.id, projectId),
      eq(projects.userId, userId)
    ),
  });
}

export async function updateProject(projectId: string, data: UpdateProjectData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  // Verify ownership before update
  return db
    .update(projects)
    .set(data)
    .where(and(
      eq(projects.id, projectId),
      eq(projects.userId, userId)
    ));
}

export async function deleteProject(projectId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  // Verify ownership before delete
  return db
    .delete(projects)
    .where(and(
      eq(projects.id, projectId),
      eq(projects.userId, userId)
    ));
}
```

### Security Checklist

Before merging any data access code, verify:

- [ ] Query filters by `userId` from authenticated session
- [ ] `userId` is obtained from `auth()`, not from request parameters
- [ ] All CRUD operations verify ownership
- [ ] No raw SQL is used
- [ ] Query is in a `/data` helper function, not inline in a component

---

## Summary

| Requirement | Rule |
|-------------|------|
| Data fetching location | Server Components ONLY |
| Database queries | `/data` directory helper functions ONLY |
| ORM | Drizzle ORM ONLY (no raw SQL) |
| Data access | User's own data ONLY (filter by `userId`) |
| User identification | From `auth()` session ONLY (never trust client) |
