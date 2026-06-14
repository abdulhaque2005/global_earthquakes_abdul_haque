import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analyticsService';
import { Activity, AlertTriangle, MapPin, Database, TrendingUp, Maximize2, Globe } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Link } from 'react-router-dom';

const StatCard = ({ label, value, unit, icon, colorClass, bgClass, trend, delay }) => (
  <div
    className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:border-brand-500/40 dark:hover:border-brand-500/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-300 animate-fade-in opacity-0"
    style={{ animationDelay: delay, animationFillMode: 'forwards' }}
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${bgClass} ${colorClass}`}>
        {icon}
      </div>
    </div>
    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{label}</p>
    <div className="flex items-baseline gap-1.5">
      <span className="font-display text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</span>
      {unit && <span className="text-slate-400 text-sm font-semibold">{unit}</span>}
    </div>
    {trend && <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium">{trend}</p>}
  </div>
);

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [highestMag, setHighestMag] = useState(null);
  const [deepest, setDeepest] = useState(null);
  const [yearlyTrends, setYearlyTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [summaryData, highestMagData, deepestData, trendsData] = await Promise.all([
          analyticsService.getSummary(),
          analyticsService.getHighestMagnitude(),
          analyticsService.getDeepest(),
          analyticsService.getYearlyTrends(),
        ]);
        setSummary(summaryData.data || summaryData);
        setHighestMag((highestMagData.data || highestMagData)[0]);
        setDeepest((deepestData.data || deepestData)[0]);
        setYearlyTrends(trendsData.data || trendsData);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh] gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin" />
        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm animate-pulse">Loading Analytics Engine...</p>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Records',
      value: summary?.totalEarthquakes?.toLocaleString() ?? '—',
      icon: <Database size={22} />,
      colorClass: 'text-brand-500',
      bgClass: 'bg-brand-500/10',
      trend: 'Globally Analyzed',
      delay: '0ms',
    },
    {
      label: 'Highest Magnitude',
      value: highestMag?.magnitude?.toFixed(1) ?? '—',
      unit: 'M',
      icon: <AlertTriangle size={22} />,
      colorClass: 'text-red-500',
      bgClass: 'bg-red-500/10',
      trend: highestMag?.place?.substring(0, 22) ?? '',
      delay: '100ms',
    },
    {
      label: 'Avg. Depth',
      value: summary?.averageDepth?.toFixed(1) ?? '—',
      unit: 'km',
      icon: <Activity size={22} />,
      colorClass: 'text-indigo-500',
      bgClass: 'bg-indigo-500/10',
      trend: 'Global Mean Depth',
      delay: '200ms',
    },
    {
      label: 'Active Regions',
      value: summary?.totalRegions?.toLocaleString() ?? '—',
      icon: <MapPin size={22} />,
      colorClass: 'text-amber-500',
      bgClass: 'bg-amber-500/10',
      trend: 'Monitoring Active',
      delay: '300ms',
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <Helmet>
        <title>Overview | QuakeVision</title>
      </Helmet>

      {/* Header */}
      <div
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-in opacity-0"
        style={{ animationFillMode: 'forwards' }}
      >
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            System Overview
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Real-time telemetry and historical analysis of global seismic events.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Live Data Feed</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {statCards.map((card, i) => (
          <StatCard key={i} {...card} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Frequency Timeline */}
        <div
          className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 lg:col-span-2 animate-fade-in opacity-0"
          style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
              <TrendingUp className="text-brand-500" size={18} /> Frequency Timeline
            </h3>
            <Link
              to="/analytics"
              className="text-xs font-semibold text-brand-500 hover:text-brand-600 dark:hover:text-brand-400 flex items-center gap-1 transition-colors"
            >
              Full Report <Maximize2 size={11} />
            </Link>
          </div>
          <div className="h-[260px] w-full">
            {yearlyTrends?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={yearlyTrends.slice().reverse()} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" vertical={false} />
                  <XAxis dataKey="_id" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: 12 }}
                    itemStyle={{ color: '#14b8a6', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="count" name="Recorded Events" stroke="#14b8a6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCount)" activeDot={{ r: 5, fill: '#14b8a6', strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">No timeline data available</div>
            )}
          </div>
        </div>

        {/* Severity Distribution */}
        <div
          className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 animate-fade-in opacity-0"
          style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}
        >
          <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 text-sm mb-6">
            <Activity className="text-indigo-500" size={18} /> Severity Distribution
          </h3>
          <div className="h-[260px] w-full">
            {summary?.magnitudeDistribution ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summary.magnitudeDistribution} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" vertical={false} />
                  <XAxis dataKey="_id" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <RechartsTooltip
                    cursor={{ fill: 'rgba(99,102,241,0.06)' }}
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: 12 }}
                    itemStyle={{ color: '#6366f1', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="count" name="Count" fill="#6366f1" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">No distribution data</div>
            )}
          </div>
        </div>
      </div>

      {/* Notable Events Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {highestMag && (
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:border-red-500/30 transition-all duration-300 animate-fade-in opacity-0"
            style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}
          >
            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-5 text-sm">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Maximum Intensity Event
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">Epicenter</p>
                <p className="text-base font-semibold text-slate-800 dark:text-slate-200">{highestMag.location || highestMag.place || 'Unknown'}</p>
              </div>
              <div className="flex gap-8">
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">Magnitude</p>
                  <p className="font-display text-2xl font-bold text-red-500">{highestMag.magnitude?.toFixed(1)} M</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">Depth</p>
                  <p className="font-display text-2xl font-bold text-slate-800 dark:text-slate-200">{highestMag.depth?.toFixed(1)} km</p>
                </div>
              </div>
              {highestMag.time && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs text-slate-400">{new Date(highestMag.time).toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {deepest && (
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/30 transition-all duration-300 animate-fade-in opacity-0"
            style={{ animationDelay: '700ms', animationFillMode: 'forwards' }}
          >
            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-5 text-sm">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span> Maximum Depth Event
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">Epicenter</p>
                <p className="text-base font-semibold text-slate-800 dark:text-slate-200">{deepest.location || deepest.place || 'Unknown'}</p>
              </div>
              <div className="flex gap-8">
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">Depth</p>
                  <p className="font-display text-2xl font-bold text-indigo-500">{deepest.depth?.toFixed(1)} km</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">Magnitude</p>
                  <p className="font-display text-2xl font-bold text-slate-800 dark:text-slate-200">{deepest.magnitude?.toFixed(1)} M</p>
                </div>
              </div>
              {deepest.time && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs text-slate-400">{new Date(deepest.time).toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

