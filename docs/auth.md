# Authentication Coding Standards

## Authentication Provider

This project uses **Clerk** as the exclusive authentication provider.

### Rules

1. **ONLY use Clerk** - All authentication must be handled through Clerk
2. **NO custom auth implementations** - Do not build custom authentication flows
3. **NO alternative auth libraries** - Do not use NextAuth, Auth0, Firebase Auth, or any other auth provider

### Documentation

Refer to the official Clerk documentation: https://clerk.com/docs

---

## Server-Side Authentication

**Always use `auth()` from `@clerk/nextjs/server` for server-side authentication.**

### Getting the User ID

```ts
import { auth } from '@clerk/nextjs/server';

export async function someServerFunction() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  // userId is now available and verified
}
```

### Getting Full User Data

```ts
import { currentUser } from '@clerk/nextjs/server';

export async function getFullUserData() {
  const user = await currentUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  // Access user properties: user.id, user.emailAddresses, user.firstName, etc.
}
```

### Server Components

```tsx
// app/dashboard/page.tsx
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Render authenticated content
}
```

---

## Client-Side Authentication

**Use Clerk's React hooks for client-side authentication state.**

### Available Hooks

| Hook | Purpose |
|------|---------|
| `useAuth()` | Access authentication state and methods |
| `useUser()` | Access current user data |
| `useClerk()` | Access Clerk instance for advanced operations |

### Implementation

```tsx
'use client';

import { useAuth, useUser } from '@clerk/nextjs';

export function UserProfile() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <div>Please sign in</div>;
  }

  return <div>Welcome, {user?.firstName}</div>;
}
```

---

## Protected Routes

### Middleware Configuration

Use Clerk middleware to protect routes at the edge:

```ts
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/',
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
```

### Page-Level Protection

For additional protection at the page level:

```tsx
// app/dashboard/page.tsx
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function ProtectedPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return <div>Protected content</div>;
}
```

---

## Authentication UI Components

**Use Clerk's pre-built components for authentication flows.**

### Available Components

| Component | Purpose |
|-----------|---------|
| `<SignIn />` | Sign in form |
| `<SignUp />` | Sign up form |
| `<UserButton />` | User avatar with dropdown menu |
| `<UserProfile />` | Full user profile management |

### Implementation

```tsx
// app/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return <SignIn />;
}
```

```tsx
// app/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return <SignUp />;
}
```

```tsx
// In a header/navbar component
import { UserButton } from '@clerk/nextjs';

export function Header() {
  return (
    <header>
      <UserButton afterSignOutUrl="/" />
    </header>
  );
}
```

---

## Security Requirements

### Critical Rules

1. **Never trust client-provided user IDs** - Always get `userId` from `auth()` on the server
2. **Always verify authentication** - Check for `userId` before any data operation
3. **Use middleware for route protection** - Configure Clerk middleware for protected routes
4. **Never expose Clerk secret keys** - Keep `CLERK_SECRET_KEY` server-side only

### Environment Variables

```env
# Public (safe for client)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...

# Secret (server-only, never expose)
CLERK_SECRET_KEY=sk_...

# Optional: Custom URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

---

## Summary

| Requirement | Rule |
|-------------|------|
| Auth provider | Clerk ONLY |
| Server-side auth | `auth()` from `@clerk/nextjs/server` |
| Client-side auth | `useAuth()`, `useUser()` hooks |
| Route protection | Clerk middleware + page-level checks |
| Auth UI | Clerk pre-built components |
| User identification | From `auth()` ONLY (never trust client) |
