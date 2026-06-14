import React, { useState, useEffect } from 'react';
import EarthquakeMap from '../../components/Earthquake/EarthquakeMap';
import { earthquakeService } from '../../services/earthquakeService';
import { Activity, Globe, Info } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const Home = () => {
  const [earthquakes, setEarthquakes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const response = await earthquakeService.getRecentEarthquakes(500); // Fetch more for the full map
        setEarthquakes(response.data || response);
      } catch (error) {
        console.error('Error fetching recent earthquakes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <Helmet>
        <title>Live Map | QuakeVision</title>
      </Helmet>

      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="text-brand-500" /> Live Global Activity
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Real-time tracking of seismic events. Showing the last 500 recorded events.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/earthquakes" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-500 bg-brand-500/10 px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors">
            <Activity size={14} /> View Data Table
          </Link>
        </div>
      </div>

      {/* Main Map Area */}
      <div className="flex-1 relative glass-panel rounded-2xl overflow-hidden flex flex-col min-h-[500px]">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-[#09090b]/50">
            <div className="w-10 h-10 rounded-full border-4 border-brand-500/30 border-t-brand-500 animate-spin" />
            <p className="text-slate-500 font-medium text-sm">Initializing Map Engine...</p>
          </div>
        ) : (
          <div className="w-full h-full absolute inset-0 z-0">
             <EarthquakeMap initialEarthquakes={earthquakes} center={[22.9, 78.9]} zoom={4.5} />
          </div>
        )}
        
        {/* Floating Legend overlay */}
        <div className="absolute bottom-6 left-6 z-20 glass-panel p-4 rounded-xl shadow-2xl pointer-events-none">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1">
            <Info size={12} /> Magnitude Legend
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">0.0 - 2.5 (Minor)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></span>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">2.6 - 4.5 (Light)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]"></span>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">4.6 - 6.0 (Moderate)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">6.1+ (Strong)</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;
