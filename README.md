# Todlex - Smart Link Organization

<div align="center">

![Todlex Logo](https://via.placeholder.com/200x80/64B5F6/FFFFFF?text=Todlex)

*A Next.js Kanban board app for organizing links with auto-save on paste, drag-and-drop functionality, and date-based tabs.*

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)

</div>

## 🚀 Overview

Todlex revolutionizes link management by organizing your discoveries chronologically. Stop shoving URLs into endless folders—experience a living day-by-day canvas that evolves with your workflow. Built around temporal context, Todlex transforms how you capture, organize, and revisit important links.

### ✨ Key Features

- **🎯 Date-Centric Workflow**: Links automatically organized by discovery date
- **⚡ Auto-Save on Paste**: Instant capture with Ctrl+V
- **🎨 Kanban Interface**: Visual drag-and-drop organization
- **🔍 Smart Metadata**: Automatic title, description, favicon, and OG image extraction
- **📅 Temporal Memory**: Revisit content organized by day with "Today/Yesterday" formatting
- **🎛️ Adaptive Tabs**: Date-driven views that evolve with your usage
- **🔄 Flow-State UX**: Keyboard-first interactions for maximum productivity
- **📊 Analytics & History**: Track usage patterns and recover deleted items
- **🤖 AI-Ready Foundation**: Genkit pipeline for future AI enhancements

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui with Radix primitives
- **Icons**: Lucide React
- **State Management**: Custom hooks with local storage persistence
- **Data Fetching**: Server actions with Cheerio for metadata extraction
- **AI Integration**: Genkit with Google AI Gemini (foundation)
- **Analytics**: Vercel Speed Insights
- **Development**: Turbopack for fast HMR

## 🎨 Design System

- **Primary**: Soft blue (#64B5F6) for calm and focus
- **Background**: Light gray (#F0F4F8) for distraction-free environment
- **Accent**: Muted orange (#FFAB40) for highlights and actions
- **Typography**: Geist Sans & Geist Mono for modern readability
- **Layout**: Card-based design with subtle animations

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gnanesh-16/sleyak.git
   cd sleyak
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:9002](http://localhost:9002)

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack on port 9002 |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript compiler check |
| `npm run genkit:dev` | Start AI development server |
| `npm run genkit:watch` | Start AI development with watch mode |

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── actions.ts         # Server actions for metadata fetching
│   ├── dashboard/         # Main dashboard page
│   ├── analytics/         # Usage analytics page
│   ├── history/           # Deleted items recovery
│   ├── settings/          # App settings and preferences
│   └── admin/             # Admin dashboard (conceptual)
├── components/            # React components
│   ├── Dashboard.tsx      # Main board with date groups
│   ├── KanbanBoard.tsx    # Tab-based interface
│   ├── DateLinksList.tsx  # Link display with sorting
│   ├── LinkItemModal.tsx  # Link editing modal
│   └── ui/               # shadcn/ui components
├── hooks/                # Custom React hooks
│   ├── useLocalStorage.ts # Local storage with migration
│   ├── useBoardState.ts   # Kanban state management
│   ├── useCardGroups.ts   # Multi-select operations
│   ├── useAnalyticsLog.ts # Event tracking
│   └── useHistory.ts      # Soft-delete management
├── types/                # TypeScript type definitions
│   ├── kanban.ts         # Core data structures
│   ├── analytics.ts      # Analytics types
│   └── history.ts        # History types
├── lib/                  # Utility functions
└── ai/                   # AI integration (Genkit)
```

## 🏗️ Architecture

### Data Flow
1. **Link Capture**: URLs pasted trigger auto-save to local storage
2. **Metadata Enrichment**: Server actions fetch titles, descriptions, favicons
3. **Temporal Organization**: Links automatically sorted into date-based tabs
4. **State Management**: Custom hooks manage board state with optimistic updates
5. **Persistence**: Local storage with automatic migration from legacy formats

### Core Data Structures

```typescript
interface LinkItem {
  id: string;
  url: string;
  title: string;
  description?: string;
  createdAt: string;        // ISO date string
  todoDate?: string;        // ISO date string
  favicon?: string;         // Favicon URL
  ogImageUrl?: string;      // OpenGraph image URL
  orderInTab?: number;      // Sequential order within tab
}

interface DateGroup {
  dateString: string;       // YYYY-MM-DD format
  title: string;           // "Today", "Yesterday", "October 26, 2023"
  items: LinkItem[];
}

interface BoardData {
  dateGroups: DateGroup[];
}
```

### State Management

Todlex uses a custom hook-based architecture:

- **`useLocalStorage`**: Handles persistence with automatic migration
- **`useBoardState`**: Manages drag-and-drop operations
- **`useCardGroups`**: Multi-select functionality for batch operations
- **`useAnalyticsLog`**: Tracks user interactions and usage patterns
- **`useHistory`**: Implements soft-delete with 24-day recovery window

## 🔧 Development Workflow

### Adding New Features

1. **Define Types**: Add TypeScript interfaces in `src/types/`
2. **Create Components**: Build React components in `src/components/`
3. **Add Hooks**: Implement state management in `src/hooks/`
4. **Update Routing**: Add pages in `src/app/`
5. **Style Components**: Use Tailwind CSS with design system tokens

### Code Conventions

- **File Naming**: PascalCase for components, camelCase for hooks
- **Local Storage Key**: `'todlex-board'` with automatic migration support
- **Date Handling**: ISO strings with `date-fns` for parsing/formatting
- **Component Structure**: Feature-based organization
- **State Updates**: Optimistic updates with error handling

## 🌟 Key Features Deep Dive

### Smart Link Metadata
- Automatic title and description extraction using Cheerio
- Favicon and OpenGraph image fetching
- Special handling for Reddit oEmbed
- Timeout protection and error handling
- Browser-like headers for compatibility

### Date-Based Organization
- Automatic sorting by creation date
- Human-friendly date formatting ("Today", "Yesterday")
- Dynamic tab creation for any date
- Pre-organization for future projects

### Drag and Drop
- Native HTML5 drag-and-drop API
- Visual feedback during operations
- Reordering within and between tabs
- Touch-friendly mobile support

### Analytics & History
- Event logging for link and tab operations
- CSV export functionality
- Soft-delete with 24-day recovery
- Usage pattern insights

## 🤖 AI Integration

Todlex includes a foundational AI pipeline using Genkit:

```bash
# Start AI development server
npm run genkit:dev

# Watch mode for AI development
npm run genkit:watch
```

The AI integration (located in `src/ai/`) provides:
- Google AI Gemini integration
- Extensible pipeline for future enhancements
- Ready for intelligent link categorization
- Potential for content summarization

## 🚀 Deployment

### Production Build

```bash
npm run build
npm run start
```

### Environment Variables

Create a `.env.local` file for environment-specific configuration:

```env
# Optional: Firebase configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain

# Optional: AI configuration
GOOGLE_AI_API_KEY=your_gemini_api_key
```

### Vercel Deployment

This project is optimized for Vercel deployment:

1. Push to GitHub
2. Connect repository to Vercel
3. Configure environment variables
4. Deploy

## 📊 Performance

- **Local Storage**: Efficient client-side persistence
- **Turbopack**: Fast development builds
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js built-in optimization
- **Speed Insights**: Real-time performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript strict mode
- Use Tailwind CSS for styling
- Write tests for new features
- Maintain the existing code style
- Update documentation as needed

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [shadcn/ui](https://ui.shadcn.com/) for beautiful, accessible components
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Radix UI](https://www.radix-ui.com/) for headless component primitives
- [Lucide](https://lucide.dev/) for consistent iconography
- [Vercel](https://vercel.com/) for deployment and analytics

---

<div align="center">

**[🌐 Live Demo](https://your-deployment-url.vercel.app)** | **[📖 Documentation](https://github.com/gnanesh-16/sleyak/wiki)** | **[🐛 Report Bug](https://github.com/gnanesh-16/sleyak/issues)** | **[💡 Request Feature](https://github.com/gnanesh-16/sleyak/issues)**

Made with ❤️ by the Todlex team

</div>