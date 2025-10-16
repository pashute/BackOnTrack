# Frontend Setup Guide

## Vue.js Frontend Skeleton

The frontend has been scaffolded with the following structure:

### Technology Stack
- **Vue 3** (Composition API)
- **Vite** (Build tool)
- **Pinia** (State management)
- **Tailwind CSS** (Styling)
- **Axios** (API communication - ready for backend integration)

### Project Structure
```
src/
├── components/
│   ├── ChatWindow.vue       # Main chat interface
│   ├── OutlineSidebar.vue   # Discussion outline sidebar
│   ├── BranchNode.vue       # Recursive branch tree component
│   ├── HighlightItem.vue    # Individual highlight display
│   └── DetailTabs.vue       # Detailed information tabs
├── stores/
│   └── conversationStore.js # Pinia store for conversation state
├── App.vue                  # Main app layout
├── main.js                  # App entry point
└── style.css                # Global styles with Tailwind

```

### Features Implemented

#### 1. Chat Window
- Message display (user/AI)
- Input field with send button
- Quick action buttons (Continue, Go Back)
- Typing indicator for AI responses
- Auto-scroll to latest message

#### 2. Outline Sidebar
- Collapsible branch tree structure
- Highlight display with status indicators:
  - ✓ Discussed (green)
  - → Current (blue, bold)
  - ○ Planned (gray)
- Hover tooltips showing reconstruction info
- Direction badges (Request/Response)
- Branch switching functionality

#### 3. Detail Tabs
- Tabbed interface for detailed information
- HTML content rendering
- Individual tab close buttons
- Close all tabs functionality
- Hidden by default, shown when needed

#### 4. Responsive Design
- Mobile-friendly layout
- Collapsible sidebar on mobile
- Floating menu button for mobile navigation
- Tailwind breakpoints for different screen sizes

### Running the Frontend

```bash
# Install dependencies (already done)
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will run on `http://localhost:5173`

### State Management

The Pinia store (`conversationStore.js`) manages:
- Conversation object with branches
- Messages array
- Highlights array
- Branch creation and switching
- Message and highlight addition
- Highlight status updates

### Next Steps

1. **Backend Integration**
   - Connect ChatWindow to Express API
   - Implement actual AI response handling
   - Add WebSocket for real-time updates (optional)

2. **Enhanced Features**
   - Implement verification discussion flow
   - Add branch detection logic
   - Integrate highlight reconstruction
   - Add detail tab population from API

3. **UI Polish**
   - Add animations and transitions
   - Improve mobile experience
   - Add loading states
   - Error handling and user feedback

### API Proxy Configuration

Vite is configured to proxy `/api` requests to `http://localhost:3000` (Express backend).

Update `vite.config.js` if your backend runs on a different port.
