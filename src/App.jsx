import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import ExplorerMode from './pages/ExplorerMode';
import FogMap from './components/FogMap';
import Header from './components/Header';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import AdminLayout from './pages/Admin/AdminLayout';
import QuestManager from './pages/Admin/QuestManager';
import SiteManager from './pages/Admin/SiteManager';
import AIGameMaster from './pages/Admin/AIGameMaster';
import { GamificationProvider } from './context/GamificationContext';

// 1. Protected Route Wrapper
const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? <Outlet /> : <Navigate to="/auth" replace />;
};

// 2. Layout Wrapper (Renders Header + Content)
const MainLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default function App() {
  return (
    <GamificationProvider>
      <Router>
        <div className="min-h-screen bg-brand-bg text-brand-dark font-sans selection:bg-brand-accent selection:text-white">
          <Routes>
            {/* Public Route: Auth */}
            <Route path="/auth" element={<Auth />} />


            {/* Protected Routes (Wrapped in MainLayout) */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/" element={<ExplorerMode />} />
                <Route path="/wanderer" element={<FogMap />} />
                <Route path="/profile" element={<Profile />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="quests" replace />} />
                <Route path="quests" element={<QuestManager />} />
                <Route path="sites" element={<SiteManager />} />
                <Route path="ai-master" element={<AIGameMaster />} />
              </Route>
            </Route>

            {/* Catch all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </GamificationProvider>
  );
}