import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Dashboard from './pages/Dashboard';
import TaskFeature from './features/tasks/taskFeature';
import CalendarFeature from './features/calendar/calendarFeature';
import BudgetFeature from './features/budget/budgetFeature';
import LoginSignup from './auth/LoginSignup';
import Account from './pages/account';
import Invite from './pages/invite';
import CustomAppbar from './components/Common/appbar';
import ProtectedRoute from './routes/protectedRoute';

// Page transition variants
const pageVariants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 }
};

const pageTransition = {
  duration: 0.5,
  ease: 'easeInOut'
};

// A wrapper component that applies the motion to each route element
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
        style={{ minHeight: 'calc(100vh - 64px)' }} // subtract AppBar height if needed
      >
        <Routes location={location}>
          <Route path="/login" element={<LoginSignup />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <TaskFeature />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <CalendarFeature />
              </ProtectedRoute>
            }
          />
          <Route
            path="/budget"
            element={
              <ProtectedRoute>
                <BudgetFeature />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route
            path="/invite"
            element={
              <ProtectedRoute>
                <Invite />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      {/* The Appbar is rendered outside of the animated area */}
      <CustomAppbar />
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
