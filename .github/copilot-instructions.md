---
applyTo: "**/*"
---

# Overview

Modern React application with TanStack Router and component library. Features routing, state management, and UI components with a documentation system powered by Model Context Protocol.

## Directory Structure

- `src/` - Main application source code
  - `components/` - React components
    - `ui/` - shadcn/ui component library (buttons, forms, dialogs, etc.)
  - `hooks/` - React hooks for state management
  - `lib/` - Core libraries and utilities
  - `routes/` - Page components and routes with TanStack Router
- `mcp/` - Model Context Protocol server
  - `tools/` - MCP tool implementations for documentation management
  - `utils/` - MCP utility functions
- `public/` - Static assets

## Technical Features

- TanStack Router for type-safe routing
- React 19 with TypeScript
- shadcn/ui component system
- Tailwind CSS v4 for styling
- Vite+ for build tooling
- Bun runtime and package manager (managed through Vite+)
- Vite+ for linting, formatting, and testing
- Model Context Protocol for documentation
