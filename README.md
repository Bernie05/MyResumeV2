# My Creative Resume Site

A professional, modern resume website built with **Next.js 14**, **Tailwind CSS**, **React**, and **TypeScript**. Features a beautiful, fully responsive design with centralized theme management for light and dark modes.

## ✨ Features

- 🎨 **Centralized Theme System** - Single source of truth for all colors and styles (light/dark modes)
- 🌓 **Dark/Light Mode Toggle** - Seamless theme switching with localStorage persistence
- 📱 **Fully Responsive** - Mobile-first design that works on all screen sizes
- ⚡ **High Performance** - Optimized Next.js with TypeScript support
- 🎯 **Sticky Navigation** - Header stays fixed at top while scrolling
- 📊 **Rich Resume Sections** - Skills, experience, education, portfolio, projects, certifications
- 💾 **Easy to Edit** - All data stored in single JSON file for quick updates
- 🎭 **Beautiful Animations** - Smooth transitions and interactive elements
- ♿ **Accessible** - Semantic HTML and keyboard navigation support

## 🏗️ Project Structure

```
MyResumeV2/
├── app/
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Main home page with sections
│   ├── globals.css             # Global styles & CSS variables
│   └── api/resume/
│       └── route.ts            # Resume data API endpoint
├── components/
│   ├── Navbar.tsx              # Sticky header with theme toggle
│   ├── Providers.tsx           # Context & theme providers
│   ├── ThemeRegistry.tsx        # Theme setup
│   ├── ThemeContext.tsx        # Theme state management
│   └── resume/
│       ├── Header.tsx          # Profile header
│       ├── HeroSection.tsx     # Hero/about section
│       ├── Summary.tsx         # Professional summary
│       ├── Experience.tsx      # Work experience
│       ├── Education.tsx       # Education history
│       ├── Skills.tsx          # Skills with progress indicators
│       ├── Portfolio.tsx       # Portfolio/case studies
│       ├── Projects.tsx        # Featured projects
│       ├── Certifications.tsx  # Certifications
│       ├── ServicesSection.tsx # Services offered
│       └── ProfileCard.tsx     # Profile information
├── theme/
│   ├── constants.ts            # Color palettes & Tailwind mappings
│   ├── useThemeClasses.ts      # Hook for theme-aware styling
│   └── useThemeContext.ts      # Theme context hook
├── context/
│   └── ThemeContext.tsx        # Light/dark mode state
├── data/
│   └── resume.ts               # Resume data import
├── public/
│   └── resume.json             # ⭐ ALL RESUME DATA
├── store/
│   ├── index.ts                # Redux setup (if using)
│   └── slices/
│       └── resumeSlice.ts      # Resume state
├── styles/
│   └── theme.css               # CSS variables for theming
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── next.config.js
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone and navigate to project**

```bash
cd MyResumeV2
```

2. **Install dependencies**

```bash
npm install
```

3. **Run development server**

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📝 Editing Your Resume

All resume data is in **`public/resume.json`**. Edit this file to update your resume instantly!

### JSON Structure Example

```json
{
  "personalInfo": {
    "name": "Your Name",
    "title": "Your Title",
    "email": "your@email.com",
    "phone": "+1 (555) 123-4567",
    "location": "City, State",
    "website": "https://yourwebsite.com",
    "linkedin": "https://linkedin.com/in/profile",
    "github": "https://github.com/profile",
    "photoUrl": "https://your-photo.jpg",
    "backgroundUrl": "https://your-bg.jpg",
    "summary": "Your professional summary..."
  },
  "experience": [],
  "education": [],
  "skills": [],
  "projects": [],
  "portfolio": [],
  "certifications": []
}
```

## 🎨 Theme System

### How It Works

The theme system uses a **3-layer approach**:

1. **CSS Variables** (`styles/theme.css`)
   - Global color definitions
   - Light & dark mode values
   - Easy browser-level switching

2. **TypeScript Constants** (`theme/constants.ts`)
   - `THEME_COLORS`: Hex color values
   - `THEME_TAILWIND`: Tailwind class mappings
   - Organized by component type

3. **React Hook** (`theme/useThemeClasses.ts`)
   - `useThemeClasses()` - Get theme classes for components
   - Returns organized styling objects
   - Single source of truth for all components

### Color Palette

**Light Mode:**

- Primary: Blue (#0066cc)
- Background: White
- Text: Gray (#1a1a1a)

**Dark Mode:**

- Primary: Teal (#00cc99)
- Background: Black
- Text: White

### Using Themes in Components

```typescript
import { useThemeClasses } from "@/theme/useThemeClasses";

export default function MyComponent() {
  const { text, bg, card, button } = useThemeClasses();

  return (
    <div className={card.base}>
      <h1 className={text.primary}>Title</h1>
      <p className={text.secondary}>Description</p>
      <button className={button.primary}>Click me</button>
    </div>
  );
}
```

## 📱 Responsive Design

All components follow mobile-first approach:

- Mobile (default)
- Tablet (md: 768px)
- Desktop (lg: 1024px+)

## 🔄 State Management

- **Theme State**: React Context (`ThemeContext.tsx`)
- **Data**: Resume data in JSON file + optional Redux for complex state
- **localStorage**: Theme preference persistence

## 🛠️ Available Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm start        # Start production server
npm run lint     # Run ESLint
```

## 📦 Dependencies

- `next@14.2.35` - React framework
- `react@18` - UI library
- `tailwindcss@3.4.19` - Utility CSS
- `typescript@5` - Type safety
- `lucide-react` - Icon library

## 🎯 Key Features Explained

### Sticky Navigation

Header stays fixed at top while scrolling through sections. Click navigation items to jump to sections smoothly.

### Skills Card Design

- Circular progress indicator showing proficiency
- Theme-matched backgrounds (Blue/Yellow based on mode)
- Proficiency badges and expert indicators
- Responsive grid layout

### Portfolio Section

- Image overlays with hover effects
- Tech stack display
- Client testimonials
- Live demo & GitHub links
- Fully theme-aware styling

### Dark Mode

- Toggle via sun/moon icon in navbar
- Persists in localStorage
- Smooth transitions
- Applied globally across all components

## 💡 Tips

- **Quick color changes**: Edit `theme/constants.ts` THEME_TAILWIND
- **Add new component**: Import `useThemeClasses` hook
- **Create new portfolio item**: Add to `portfolio` array in resume.json
- **Update skills**: Modify `skills` array with categories and proficiency

## 📄 License

Personal project - Feel free to use as template!

## 🤝 Support

For issues or questions, check the component files for implementation examples.
"id": 1,
"company": "Company Name",
"position": "Job Title",
"duration": "2022 - Present",
"location": "City, State",
"description": ["Achievement 1", "Achievement 2", "Achievement 3"]
}
],
"education": [
{
"id": 1,
"school": "University Name",
"degree": "Bachelor of Science",
"field": "Computer Science",
"year": "2019",
"location": "City, State"
}
],
"skills": [
{
"category": "Frontend",
"items": ["React", "Next.js", "TypeScript", "Material-UI"]
}
],
"certifications": [
{
"id": 1,
"name": "Certification Name",
"issuer": "Issuing Organization",
"year": "2023"
}
],
"projects": [
{
"id": 1,
"name": "Project Name",
"description": "Project description",
"technologies": ["React", "Node.js"],
"link": "https://github.com/yourprofile/project"
}
]
}

````

## Build for Production

```bash
npm run build
# or
yarn build
````

Then start the production server:

```bash
npm start
# or
yarn start
```

## Technologies Used

- **Next.js 14** - React framework for production
- **React 18** - UI library
- **Material-UI (MUI)** - Component library with glassmorphism effects
- **Redux Toolkit** - State management
- **React-Redux** - Redux bindings for React
- **TypeScript** - Type safety
- **Emotion** - CSS-in-JS styling

---

**Happy Coding!** 🚀

For more information, visit [Next.js Documentation](https://nextjs.org/docs)
