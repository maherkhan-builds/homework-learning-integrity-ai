import React from 'react';
import ChatInterface from './components/ChatInterface';

const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 antialiased">
      {/* Header */}
      <header className="sticky top-0 z-10 w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg p-4 flex items-center justify-center">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Learning Integrity AI
        </h1>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex justify-center items-center py-6 px-4 sm:px-6 lg:px-8">
        <ChatInterface />
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 z-10 w-full bg-gray-800 text-gray-300 py-3 text-center text-sm shadow-inner mt-auto">
        <p>&copy; {new Date().getFullYear()} Learning Integrity AI. All rights reserved.</p>
        <p className="mt-1">
          Designed to guide your learning, not provide answers.
        </p>
      </footer>
    </div>
  );
};

export default App;
