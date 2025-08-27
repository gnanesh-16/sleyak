# Todlex - Smart Link Organization

## Project Overview
Todlex is a Next.js 15 Kanban board app for organizing links with auto-save on paste, drag-and-drop functionality, and date-based tabs. Built with TypeScript, Tailwind CSS, and shadcn/ui components.

## Architecture
- **Frontend**: Next.js App Router with client-side state management
- **Data Persistence**: Local storage with migration support (`useLocalStorage` hook)
- **UI Components**: shadcn/ui with Radix primitives and Lucide icons
- **Styling**: Tailwind CSS with custom design system (soft blue #64B5F6, light gray #F0F4F8, muted orange #FFAB40)
- **Server Actions**: Metadata fetching via `src/app/actions.ts` using Cheerio
- **AI Integration**: Genkit with Google AI Gemini (currently unused in `src/ai/dev.ts`)

## Key Components
- `Dashboard.tsx`: Main board with date groups and link management
- `KanbanBoard.tsx`: Tab-based interface with drag-and-drop
- `DateLinksList.tsx`: Link display with sorting and grouping
- `LinkItemModal.tsx`: Link editing with metadata preview

## Data Structures
- `LinkItem`: Core link data with URL, title, description, favicon, OG image, todo date
- `DateGroup`: Date-based tabs containing link arrays
- `BoardData`: Top-level structure with dateGroups array

## Developer Workflows
- **Development**: `npm run dev` (port 9002 with Turbopack)
- **AI Development**: `npm run genkit:dev` or `genkit:watch`
- **Build**: `npm run build` then `npm run start`
- **Type Check**: `npm run typecheck`
- **Lint**: `npm run lint`

## Conventions
- **State Management**: Custom hooks (`useLocalStorage`, `useCardGroups`, `useAnalyticsLog`, `useHistory`)
- **Local Storage Key**: `'todlex-board'` with automatic migration from old column structure
- **Date Handling**: ISO strings with `date-fns` for parsing/formatting
- **Link Metadata**: Server-side fetching with timeout and Reddit oEmbed support
- **Analytics**: Event logging for link/tab creation/deletion
- **History**: Soft-delete with trash recovery
- **File Structure**: Feature-based components in `src/components/`, types in `src/types/`, hooks in `src/hooks/`

## Examples
- **Adding Links**: Paste URLs trigger auto-save with metadata fetch
- **Date Tabs**: Auto-sort by date, with "Today/Yesterday" formatting
- **Drag-and-Drop**: `useBoardState` hook manages reordering within tabs
- **Groups**: Select multiple cards for batch operations
- **Sharing**: Generate shareable links with `ShareLinkModal`

## Integration Points
- **Firebase**: Configured but minimally used (potential for auth/analytics)
- **Vercel Speed Insights**: Performance monitoring
- **External APIs**: Link metadata fetching with browser-like headers</content>
<parameter name="filePath">f:\projecys\sleyak\.github\copilot-instructions.md
