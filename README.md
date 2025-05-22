# 📚 BookBuddy

A React application for discovering and managing your reading list, powered by the Open Library API.

## 🛠️ Tech Stack

- **Frontend**: React with TypeScript
- **Routing**: React Router v7
- **Styling**: Tailwind CSS
- **Testing**: Jest + React Testing Library
- **Storage**: localStorage with event-based sync
- **API**: Open Library Search API

## ✨ Features

- 🔍 Search books by title or author
- 📚 View search results in a responsive grid
- 📖 View detailed book information
- ❤️ Save books to reading list
- 💾 Persistent storage across sessions
- 📱 Fully responsive design
- ✅ Comprehensive test coverage

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/carlosruana/book-buddy
cd book-buddy
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open http://localhost:5173 in your browser

### Running Tests

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🤔 Implementation Decisions & Trade-offs

### Testing Strategy
- **Unit Tests**: Component and utility testing with Jest and React Testing Library
- **Test Coverage**:
  - SearchForm component: Input validation, form submission, UI states
  - Reading List Storage: CRUD operations, error handling, event dispatching
- **Mocking**: localStorage and event handling for isolated testing

### Virtualization Strategy
- **Why**: Handle large datasets (60,000+ books) efficiently
- **How**: 
  - Virtual window size of 100 rows
  - Page-based loading (20 items per page)
  - Load threshold of 4 items from end
  - Memoized row and item components

### Grid Layout
- **Why**: Optimal viewing experience across devices
- **How**:
  - Responsive breakpoints (1-4 columns)
  - Dynamic width calculations
  - Consistent gap spacing
  - Container padding optimization

### Data Loading
- **Why**: Balance between performance and user experience
- **How**:
  - Page-based API requests
  - Pre-filling result array
  - Loading state indicators
  - Error boundary implementation

### State Management
- **Why**: Simple but effective data flow
- **How**:
  - React Context for global state
  - localStorage for persistence
  - Custom events for cross-tab sync
  - Memoization for performance

## 🎯 Future Improvements

1. **Enhanced Search**
   - Add filters for publish year
   - Add subject/genre filtering
   - Implement advanced search options

2. **User Experience**
   - Add page transitions/animations
   - Implement dark mode
   - Add keyboard navigation
   - Improve loading states

3. **Testing**
   - Add integration tests
   - Add end-to-end tests
   - Improve test coverage
