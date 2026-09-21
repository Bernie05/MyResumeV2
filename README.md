# MyResumeV2

Modern, feature-rich resume builder with Next.js 14, TypeScript, Material-UI, and Redux state management.

## Features

✅ **Global State Management** - Centralized Redux store for all resume data  
✅ **Comprehensive Utilities** - Formatting, validation, API, storage, and array/object helpers  
✅ **Custom Hooks** - Reusable hooks for data access and operations  
✅ **Reusable Components** - Material-UI based components with editor support  
✅ **TypeScript** - Full type safety and intellisense  
✅ **Authentication** - NextAuth.js with credentials flow  
✅ **Private Editor** - Owner-only resume editing capabilities  
✅ **Auto-save** - Draft preservation via localStorage  
✅ **Responsive Design** - Mobile-first Material-UI components

## Quick Start

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Configure environment variables
# - AUTH_SECRET: NextAuth JWT secret
# - RESUME_OWNER_PASSWORD: Password for owner login
# - NEXTAUTH_URL: Your app URL

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Documentation

Comprehensive documentation is available in the docs directory:

### [ARCHITECTURE.md](./ARCHITECTURE.md)

System design, project structure, and state management overview.  
Topics: Redux store, custom hooks, component architecture, data flow

### [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md)

Component patterns, reusable UI components, and best practices.  
Topics: Component patterns, Material-UI integration, styling, composition

### [HOOKS_GUIDE.md](./HOOKS_GUIDE.md)

Custom React hooks for data access and operations.  
Topics: useResumeData, useResumeOperations, Redux hooks, patterns

### [DEVELOPMENT.md](./DEVELOPMENT.md)

Development setup, workflows, and best practices.  
Topics: Setup, common tasks, code patterns, testing, debugging, deployment

## Project Structure

```
MyResumeV2/
├── app/                      # Next.js 13+ app router
├── components/               # React components
│   ├── component/           # Reusable UI components (Custom*)
│   ├── resume/              # Resume section components
│   ├── secret/              # Admin components
│   └── utils/               # Component utilities
├── store/                   # Redux state management
│   ├── slices/             # Auth, Resume, Resume Data
│   ├── hooks.ts            # Custom Redux hooks
│   └── index.ts            # Store configuration
├── lib/                     # Utilities and helpers
│   ├── api.ts              # API client
│   ├── array.ts            # Array utilities
│   ├── constants.ts        # Global constants
│   ├── formatting.ts       # Text formatting
│   ├── object.ts           # Object utilities
│   ├── storage.ts          # Local storage manager
│   └── validation.ts       # Data validation
├── types/                   # TypeScript interfaces
├── data/                    # Static data
├── context/                 # React Context providers
├── hook/                    # Custom React hooks
└── public/                  # Static assets
```

## Key Features

### Global State Management

```typescript
import { useResumeData, useResumeOperations } from "@/store/hooks";

const Component = () => {
  const data = useResumeData();
  const { updateExp, addCert } = useResumeOperations();

  // Perform operations
  updateExp(1, { position: "Senior Role" });
};
```

### Comprehensive Utilities

```typescript
// Formatting
import { formatDate, truncateText } from "@/lib/formatting";

// Validation
import { isValidEmail } from "@/lib/validation";

// API calls
import { apiGet, apiPost } from "@/lib/api";

// Array operations
import { sortBy, unique, groupBy } from "@/lib/array";

// Object operations
import { deepMerge, deepClone, pick } from "@/lib/object";

// Local storage
import { themeStorage, resumeDraftStorage } from "@/lib/storage";
```

### Reusable Components

```typescript
import { CustomBox } from '@/components/component/CustomBox'
import { CustomButton } from '@/components/component/CustomButton'
import { CustomAvatar } from '@/components/component/CustomAvatar'

// Use in your components with editor support
<CustomBox targetFieldId="about" editorProps={editorProps}>
  Content
</CustomBox>
```

## Redux Store

### State Shape

```typescript
{
  auth: {
    status: "idle" | "submitting" | "authenticated" | "error";
    error: string | null;
  }
  resumeData: {
    data: ResumeData | null;
    isLoading: boolean;
    error: string | null;
    hasChanges: boolean;
    lastSaved: string | null;
  }
}
```

### Custom Hooks

- `useResumeData()` - Get resume data
- `useResumeLoading()` - Get loading state
- `useResumeError()` - Get error message
- `useResumeHasChanges()` - Check for unsaved changes
- `useResumeOperations()` - All data mutations

## Authentication

### Public Access

- View baseline resume at `/`
- View CV at `/cv`

### Private Access

- Login at `/secret/login`
- Edit resume at `/secret`
- Editor at `/secret/login` (redirects on unauth)

**Authentication:**

- Method: NextAuth.js with credentials flow
- Password: Set via `RESUME_OWNER_PASSWORD` environment variable
- Session: JWT stored in secure HTTP-only cookie

## Utilities

### lib/formatting.ts

- `formatDate()` - Format dates
- `capitalize()` - Capitalize text
- `toTitleCase()` - Title case conversion
- `truncateText()` - Truncate with ellipsis
- `getInitials()` - Extract name initials

### lib/validation.ts

- `isValidEmail()` - Email validation
- `isValidUrl()` - URL validation
- `isValidPhone()` - Phone validation
- `validateRequired()` - Required fields check
- `validateSchema()` - Schema validation

### lib/array.ts

- `sortBy()` - Sort by key
- `groupBy()` - Group by property
- `unique()` - Remove duplicates
- `flatten()` - Flatten nested arrays
- `chunk()` - Split into chunks

### lib/object.ts

- `deepMerge()` - Recursive merge
- `deepClone()` - Deep copy
- `pick()` / `omit()` - Select/exclude keys
- `getDeep()` / `setDeep()` - Nested access

### lib/storage.ts

- `themeStorage` - Theme management
- `resumeDraftStorage` - Draft management
- `authStorage` - Token management
- `preferencesStorage` - User preferences

### lib/api.ts

- `apiGet()` / `apiPost()` - HTTP methods
- `apiUploadFile()` - File upload
- `apiWithRetry()` - Retry logic
- `resumeApi` - Resume endpoints
- `authApi` - Auth endpoints

### components/utils/componentUtils.ts

- `debounce()` - Debounce function
- `throttle()` - Throttle function
- `getEditableFieldStyles()` - Editor styles
- `safeGet()` - Safe nested access

## Environment Variables

Create `.env.local`:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# App
RESUME_OWNER_PASSWORD=your-password-here
NEXT_PUBLIC_API_URL=http://localhost:3000

# Optional
DATABASE_URL=your-database-url
GITHUB_ID=your-github-id
GITHUB_SECRET=your-github-secret
```

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm test             # Run tests
npm run format       # Format with Prettier
npm run type-check   # Check TypeScript
```

## Current State

### Phase 1

- ✅ Global state management with Redux
- ✅ Comprehensive utility libraries
- ✅ Custom hooks for data operations
- ✅ Reusable Material-UI components
- ✅ Complete documentation
- 🔄 Public resume from static data
- 🔄 Private editor with localStorage drafts
- 🔄 Owner authentication

### Phase 2 (Planned)

- [ ] Backend API integration
- [ ] Database persistence
- [ ] Advanced editor features
- [ ] Export to PDF
- [ ] Share resume via URL
- [ ] Analytics and tracking

## Performance

- **Code Splitting** - Route-based lazy loading
- **Memoization** - React.memo with custom comparisons
- **Debouncing** - Input and scroll optimization
- **Image Optimization** - Next.js Image component
- **Bundle Size** - Tree-shaking and compression

## Best Practices

1. ✅ Use custom hooks for state access
2. ✅ Leverage utility functions
3. ✅ Implement proper TypeScript types
4. ✅ Follow Material-UI conventions
5. ✅ Memoize components and callbacks
6. ✅ Validate all user input
7. ✅ Handle loading and error states
8. ✅ Use debounce/throttle for performance

## Contributing

1. Follow the project structure
2. Use TypeScript for type safety
3. Add JSDoc comments for functions
4. Write tests for new features
5. Update documentation
6. Follow commit conventions

## Troubleshooting

### Port 3000 Already in Use

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

### Module Not Found

```bash
rm -rf .next
npm install
npm run dev
```

### Redux State Not Updating

1. Check Redux DevTools
2. Verify action dispatching
3. Review reducer logic
4. Check hook usage

## Resources

- [Architecture Guide](./ARCHITECTURE.md) - System design and structure
- [Component Guide](./COMPONENT_GUIDE.md) - Component patterns
- [Hooks Guide](./HOOKS_GUIDE.md) - Custom hooks reference
- [Development Guide](./DEVELOPMENT.md) - Setup and workflows
- [Next.js Docs](https://nextjs.org/docs)
- [Redux Docs](https://redux.js.org)
- [Material-UI Docs](https://mui.com)
- [TypeScript Docs](https://www.typescriptlang.org)
- [NextAuth.js Docs](https://next-auth.js.org)

## License

MIT License - feel free to use this project for your own resume site!

## Support

For questions or issues:

1. Check the documentation files
2. Review existing code examples
3. Check GitHub issues
4. Create a detailed issue report

---

**Made with ❤️ by Bernie Baltazar**
