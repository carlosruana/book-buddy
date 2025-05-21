import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import { BookDetailsPage } from './pages/BookDetailsPage'; // No longer directly used here
// import { SearchPageLayout } from './pages/SearchPageLayout';
import { BookSearchPage } from './pages/BookSearchPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-stripe-surface">
        <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-stripe-border/10">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20">
              <div className="flex items-center">
                <Link to="/" className="group flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-stripe-surface transition-all duration-200">
                  <div className="relative">
                    <span className="text-3xl transform group-hover:scale-110 transition-transform duration-200">📚</span>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-stripe-primary to-purple-600 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-stripe-primary to-purple-600 bg-clip-text text-transparent">
                    BookBuddy
                  </span>
                </Link>
              </div>
              <div className="flex items-center">
                <Link 
                  to="/reading-list" 
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl text-stripe-text-secondary 
                           hover:bg-stripe-surface hover:text-stripe-text transition-all duration-200
                           border border-transparent hover:border-stripe-border/20"
                >
                  <span className="text-2xl">📖</span>
                  <span className="font-medium hidden sm:block">Reading List</span>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<BookSearchPage />} />
            <Route path="/book/:bookKey" element={<BookSearchPage />} />
            
            <Route 
              path="/reading-list" 
              element={
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                  <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                      <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-stripe-primary to-purple-600 bg-clip-text text-transparent">
                        Your Reading List
                      </h1>
                      <p className="text-lg text-stripe-text-secondary">
                        Keep track of the books that catch your interest
                      </p>
                    </div>
                    <div className="bg-white/50 backdrop-blur-sm border border-stripe-border/10 rounded-3xl p-12 text-center shadow-xl">
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-stripe-surface mb-6">
                        <span className="text-4xl">📚</span>
                      </div>
                      <p className="text-lg text-stripe-text-subtle">
                        Your reading list is empty. Start adding books you'd like to read!
                      </p>
                    </div>
                  </div>
                </div>
              } 
            />
          </Routes>
        </main>

        <footer className="mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="border-t border-stripe-border/10 py-8 text-center">
              <p className="text-stripe-text-subtle">
                BookBuddy — Your personal guide to literary discovery
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
