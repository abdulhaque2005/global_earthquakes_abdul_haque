import React, { Suspense, lazy, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import ProtectedRoute from './components/Common/ProtectedRoute';
const Home = lazy(() => import('./pages/Home/Home'));
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const EarthquakeList = lazy(() => import('./pages/Earthquakes/EarthquakeList'));
const EarthquakeDetail = lazy(() => import('./pages/Earthquakes/EarthquakeDetail'));
const Alerts = lazy(() => import('./pages/Alerts/Alerts'));
const Reports = lazy(() => import('./pages/Reports/Reports'));
const Search = lazy(() => import('./pages/Search/Search'));
const Analytics = lazy(() => import('./pages/Analytics/Analytics'));
const AdminDashboard = lazy(() => import('./pages/Dashboard/AdminDashboard'));
const UserManagement = lazy(() => import('./features/users/UserManagement'));
function App() {
  const { theme } = useSelector((state) => state.ui);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [theme]);
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#020817] transition-colors duration-500 relative">
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-brand-500/5 rounded-full blur-[80px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none z-0"></div>
      <Sidebar mobileOpen={mobileMenuOpen} closeMobile={() => setMobileMenuOpen(false)} />
      <div className="flex-1 flex flex-col md:ml-64 h-screen overflow-hidden">
        <Header toggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent p-4 sm:p-6 lg:p-8 animate-fade-in relative z-10">
          <Suspense fallback={
            <div className="flex justify-center items-center h-full">
              <div className="w-12 h-12 rounded-full border-4 border-brand-500/30 border-t-brand-500 animate-spin"></div>
            </div>
          }>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/earthquakes" element={<EarthquakeList />} />
                <Route path="/earthquakes/:id" element={<EarthquakeDetail />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/search" element={<Search />} />
                <Route path="/analytics" element={<Analytics />} />
              </Route>
              <Route element={<ProtectedRoute requiredRole="admin" />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<UserManagement />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
      <ToastContainer 
        theme={theme} 
        position="bottom-right" 
        toastClassName="glass-panel text-sm font-medium border-none shadow-xl"
      />
    </div>
  );
}
export default App;
