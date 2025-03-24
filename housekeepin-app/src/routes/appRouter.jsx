import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import LoginSignup from '../auth/LoginSignup';
import ProtectedRoute from './protectedRoute';
import OnboardWizard from '../onboarding/OnboardWizard';
import TaskFeature from '../features/tasks/taskFeature';
import CalendarFeature from '../features/calendar/calendarFeature';
import BudgetFeature from '../features/budget/budgetFeature';
import NotFound from '../pages/NotFound';

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginSignup />} />
      <Route path="/onboarding" element={<OnboardWizard />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tasks" element={<TaskFeature />} />
        <Route path="/calendar" element={<CalendarFeature />} />
        <Route path="/budget" element={<BudgetFeature />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
