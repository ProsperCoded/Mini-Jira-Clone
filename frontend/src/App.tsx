import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import Explore from "./pages/Explore";
import Dashboard from "./pages/Dashboard";
import DashboardHome from "./pages/dashboard/DashboardHome";
import DashboardTeams from "./pages/dashboard/DashboardTeams";
import DashboardExplore from "./pages/dashboard/DashboardExplore";
import { TeamPage } from "./pages/TeamPage";
import LoginModal from "./components/auth/LoginModal";
import RegisterModal from "./components/auth/RegisterModal";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./contexts/AuthContext";
import { AuthModalProvider } from "./contexts/AuthModalContext";
import { TaskProvider } from "./contexts/TaskContext";
import { Toaster } from "sonner";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <AuthModalProvider>
        <TaskProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Navbar />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/dashboard" element={<Dashboard />}>
                  <Route index element={<DashboardHome />} />
                  <Route path="teams" element={<DashboardTeams />} />
                  <Route path="explore" element={<DashboardExplore />} />
                </Route>
                <Route path="/team/:teamId" element={<TeamPage />} />
              </Routes>
              <LoginModal />
              <RegisterModal />
              <Toaster richColors position="top-right" />
            </div>
          </Router>
        </TaskProvider>
      </AuthModalProvider>
    </AuthProvider>
  );
}

export default App;
