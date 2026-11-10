import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts & Route Protection
import MainLayout from './layouts/MainLayout.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';

// Public & Static Pages
import LandingPage from './pages/LandingPage.jsx';
import AboutPage from './pages/public/AboutPage.jsx';
import ContactPage from './pages/public/ContactPage.jsx';
import HelpPage from './pages/public/HelpPage.jsx';
import ExploreGames from './pages/public/ExploreGames.jsx';

// Enterprise Auth Pages (PART-1 Screens 02 & 03)
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';

// Onboarding Pages (Protected)
import ChooseJourney from './pages/ChooseJourney.jsx';
import OnboardingWizard from './pages/onboarding/OnboardingWizard.jsx';

// Demographic Dashboards (Protected)
import KidsDashboard from './pages/dashboard/KidsDashboard.jsx';
import AdultDashboard from './pages/dashboard/AdultDashboard.jsx';
import SeniorDashboard from './pages/dashboard/SeniorDashboard.jsx';

// Games & Gameplay Arena (Protected)
import GamesLibrary from './pages/games/GamesLibrary.jsx';
import GameDetail from './pages/games/GameDetail.jsx';
import PlayArena from './pages/games/PlayArena.jsx';

// Progress, Analytics & Gamification (Protected)
import ProgressPage from './pages/progress/ProgressPage.jsx';
import AchievementsPage from './pages/progress/AchievementsPage.jsx';
import MissionsPage from './pages/missions/MissionsPage.jsx';
import LeaderboardPage from './pages/leaderboard/LeaderboardPage.jsx';

// Profile & Preferences (Protected)
import ProfilePage from './pages/profile/ProfilePage.jsx';
import SettingsPage from './pages/settings/SettingsPage.jsx';

// Helper to redirect /dashboard to persistent active zone
const DashboardRedirect = () => {
  const activeZone = localStorage.getItem('sparkomind_active_zone') || 'adults';
  return <Navigate to={`/dashboard/${activeZone}`} replace />;
};

export const App = () => {
  return (
    <Routes>
      {/* 1. Public Standalone Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Public Static Pages with Header & Footer */}
      <Route element={<MainLayout />}>
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/explore" element={<ExploreGames />} />
      </Route>

      {/* 2. Protected Interactive Routes (Requires Secure Auth) */}
      <Route element={<ProtectedRoute />}>
        {/* Onboarding Flow: Standalone Luxury Obsidian Portal */}
        <Route path="/onboarding/category" element={<ChooseJourney />} />
        <Route path="/category" element={<ChooseJourney />} />
        <Route path="/select-zone" element={<ChooseJourney />} />
        <Route path="/onboarding" element={<OnboardingWizard />} />

        {/* Authenticated Dashboard Shell */}
        <Route element={<DashboardLayout />}>
          {/* Dashboards */}
          <Route path="/dashboard" element={<DashboardRedirect />} />
          <Route path="/dashboard/kids" element={<KidsDashboard />} />
          <Route path="/dashboard/adults" element={<AdultDashboard />} />
          <Route path="/dashboard/seniors" element={<SeniorDashboard />} />

          {/* Games Catalogue & Play Arena */}
          <Route path="/games" element={<GamesLibrary />} />
          <Route path="/games/:slug" element={<GameDetail />} />
          <Route path="/games/:slug/play/:level" element={<PlayArena />} />
          <Route path="/play/:gameSlug/:level" element={<PlayArena />} />

          {/* Progress, Gamification & Missions */}
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/missions" element={<MissionsPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />

          {/* User Identity & Settings */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* Fallback Catch-all Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
