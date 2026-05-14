import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ExpenseProvider } from './context/ExpenseContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Expenses } from './pages/Expenses';
import { Budget } from './pages/Budget';
import { Income } from './pages/Income';
import { Insights } from './pages/Insights';
import { Profile } from './pages/Profile';

import ProtectedRoute from './components/ProtectedRoute';

// Layout for authenticated pages
function AppLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-darkBackground text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 mb-16 md:mb-0">
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  );
}

function ProtectedLayout() {
  return (
    <ExpenseProvider>
      <AppLayout />
    </ExpenseProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<ProtectedLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/income" element={<Income />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
