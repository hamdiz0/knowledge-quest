# AGENTS.md - AI Coding Agent Guidelines

This document provides guidelines for AI coding agents working in the Knowledge Quest educational app codebase.

## Project Overview

Knowledge Quest is a gamified learning platform combining a platform-jumping game with AI-generated quiz content. The monorepo contains:
- `front/` - React frontend (Vite + Tailwind CSS)
- `back/` - Node.js/Express backend with Google Gemini API integration

## Build/Lint/Test Commands

### Frontend (`/front`)

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (Vite HMR)
npm run build        # Production build to /dist
npm run lint         # Run ESLint
npm run preview      # Preview production build
npm run start        # Start production server (Express)
```

### Backend (`/back`)

```bash
npm install          # Install dependencies
npm run dev          # Start with nodemon (auto-restart)
npm run start        # Start production server
```

### Docker

```bash
docker-compose up --build    # Build and run both services
# Frontend: http://localhost:3001
# Backend:  http://localhost:3000
```

### Testing

**No testing framework is currently configured.** If adding tests:
- Frontend: Consider Vitest (recommended for Vite projects)
- Backend: Consider Jest or Mocha

To run a single test (once configured):
```bash
# Vitest example
npx vitest run src/components/MyComponent.test.jsx

# Jest example
npx jest path/to/file.test.js
```

## Code Style Guidelines

### Language & Module System

| Directory | Language | Module System |
|-----------|----------|---------------|
| `front/`  | JavaScript (JSX) | ES Modules (`import/export`) |
| `back/`   | JavaScript | CommonJS (`require/module.exports`) |

**TypeScript is not used in this project.**

### Formatting

- **Quotes**: Single quotes preferred (`'string'`)
- **Semicolons**: Inconsistent in codebase; prefer including them for clarity
- **Indentation**: 2 spaces
- **Line length**: No strict limit, but aim for readability
- **Trailing commas**: Use in multiline arrays/objects

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Variables/Functions | camelCase | `playerPos`, `handleAnswerSelect` |
| React Components | PascalCase | `KnowledgeQuest`, `GameArea` |
| Constants | SCREAMING_SNAKE_CASE | `API_KEY`, `MAX_LIVES` |
| Files (Components) | PascalCase.jsx | `App.jsx` |
| Files (Utilities) | camelCase.js | `Api.js` |
| CSS Classes | Tailwind utilities | `bg-blue-500 text-white` |

### Import Order

Organize imports in this order with blank lines between groups:

```javascript
// 1. External dependencies
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { Sparkles, Book, Trophy } from 'lucide-react';

// 2. Internal modules/components
import backendApi from './api/Api.js';

// 3. Styles
import './App.css';
```

### React Patterns

- **Hooks**: Use functional components with hooks (`useState`, `useEffect`, `useRef`)
- **State**: Local state with `useState`; no global state management library
- **Refs**: Use `useRef` for DOM references and mutable values that don't trigger re-renders
- **Effects**: Clean up timers/intervals in `useEffect` return functions

```javascript
// Effect cleanup example
useEffect(() => {
  const timer = setTimeout(() => {
    setTimeLeft(timeLeft - 1);
  }, 1000);
  return () => clearTimeout(timer);
}, [timeLeft]);
```

### Error Handling

**Backend:**
```javascript
try {
  const response = await axios.post(url, data);
  res.json(response.data);
} catch (error) {
  console.error("API Error:", error.response?.data || error.message);
  res.status(500).json({ error: "Internal Server Error" });
}
```

**Frontend:**
```javascript
try {
  const response = await backendApi.post('/questions', payload);
  setQuestions(response.data);
} catch (error) {
  console.error('Failed to fetch questions:', error);
  // Show user-friendly error message
}
```

### API Client Usage

Use the centralized Axios client in `front/src/api/Api.js`:

```javascript
import backendApi from './api/Api.js';

// POST request
const response = await backendApi.post('/questions', { topic, questionCount });
```

### Styling

- **Framework**: Tailwind CSS
- **Approach**: Utility-first classes inline
- **Custom CSS**: Minimal, in `App.css` for Tailwind directives only

```jsx
<button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl">
  Start Game
</button>
```

## Environment Variables

### Frontend (`.env` in `/front`)

```bash
PORT=80                              # Production server port
VITE_USE_INTERNAL_API=true           # Use internal API proxy
VITE_INTERNAL_API_BASE=/api          # Internal API base path
VITE_EXTERNAL_API_BASE=http://...    # External API URL
```

**Note**: Frontend env vars must be prefixed with `VITE_` to be exposed to client code.

### Backend (`.env` in `/back`)

```bash
PORT=3000              # Server port
GEMINI_KEY=your_key    # Google Gemini API key
```

## Project Structure

```
educational-app/
├── front/
│   ├── src/
│   │   ├── App.jsx           # Main game component
│   │   ├── App.css           # Tailwind imports
│   │   ├── main.jsx          # React entry point
│   │   └── api/
│   │       └── Api.js        # Axios API client
│   ├── public/               # Static assets
│   ├── dist/                 # Build output (gitignored)
│   ├── server.js             # Production Express server
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── eslint.config.js
├── back/
│   ├── src/
│   │   ├── server.js         # HTTP server entry
│   │   └── app.js            # Express routes
│   └── package.json
├── docker-compose.yml
└── README.md
```

## ESLint Rules

Key rules from `front/eslint.config.js`:

- `no-unused-vars`: Error (ignores vars starting with uppercase or underscore)
- React Hooks rules: Enforced via `eslint-plugin-react-hooks`
- React Refresh: Enforced via `eslint-plugin-react-refresh`

Run linting before committing:
```bash
cd front && npm run lint
```

## Common Patterns

### Game State Management

The game uses a string-based state machine:
```javascript
const [gameState, setGameState] = useState('start');
// States: 'start' | 'loading' | 'playing' | 'gameover' | 'victory'
```

### Keyboard Input Handling

```javascript
const keysPressed = useRef({});

useEffect(() => {
  const handleKeyDown = (e) => { keysPressed.current[e.key] = true; };
  const handleKeyUp = (e) => { keysPressed.current[e.key] = false; };
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
  };
}, []);
```

## Tips for AI Agents

1. **No TypeScript**: This is a pure JavaScript project
2. **Component size**: `App.jsx` is large (~540 lines); consider extracting components when adding features
3. **No tests exist**: Add tests if making significant changes
4. **Backend is simple**: Single route for generating questions via Gemini API
5. **Docker-first**: The app is designed to run in Docker containers
6. **Tailwind only**: Don't add CSS files; use Tailwind utility classes
