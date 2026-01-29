# UI Coding Standards

## Component Library

This project uses **shadcn/ui** as the exclusive component library.

### Rules

1. **ONLY use shadcn/ui components** - All UI components must come from shadcn/ui
2. **NO custom components** - Do not create custom UI components under any circumstances
3. If a UI element is needed, find the appropriate shadcn/ui component or compose existing shadcn/ui components together

### Installing Components

To add a new shadcn/ui component:

```bash
npx shadcn@latest add <component-name>
```

### Documentation

Refer to the official shadcn/ui documentation: https://ui.shadcn.com

---

## Date Formatting

All date formatting must use **date-fns**.

### Format Standard

Dates should be formatted with ordinal day, abbreviated month, and full year:

```
1st Sep 2025
2nd Aug 2025
3rd Jan 2026
4th Jun 2026
```

### Implementation

```typescript
import { format } from "date-fns";

// Use this format string for all dates
const formattedDate = format(date, "do MMM yyyy");
```

### Format Tokens

| Token | Description | Example |
|-------|-------------|---------|
| `do` | Day of month (ordinal) | 1st, 2nd, 3rd, 4th |
| `MMM` | Abbreviated month | Jan, Feb, Mar |
| `yyyy` | Full year | 2025, 2026 |
