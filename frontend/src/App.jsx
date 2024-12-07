import React from "react";
import Dashboard from "./components/dashboard.jsx"; 

const App = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">Paper Trading Platform</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
                Demo Account
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main>
        <Dashboard />
      </main>

      <footer className="border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 text-center text-sm text-gray-500">
            Paper Trading Platform - Demo Version
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;