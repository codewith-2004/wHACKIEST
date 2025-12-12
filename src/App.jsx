import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ExplorerMode from './pages/ExplorerMode';

import FogMap from './components/FogMap';
import Header from './components/Header';
import Profile from './pages/Profile';








export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-brand-bg text-brand-dark font-sans selection:bg-brand-accent selection:text-white">
        <Header />
        <Routes>
          <Route path="/" element={<ExplorerMode />} />
          <Route path="/wanderer" element={<FogMap />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}