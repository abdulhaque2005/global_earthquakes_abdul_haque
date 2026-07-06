import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { analyticsService } from '../../services/analyticsService';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { Activity, Globe, AlertTriangle, Map, Layers, BarChart3 } from 'lucide-react';
const COLORS = ['#14b8a6', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];
const Analytics = () => {
  const [data, setData] = useState({
    magnitudeData: [],
    countryData: [],
    riskZones: [],
    monthlyData: [],
    depthData: [],
    networkData: []
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [magRes, countryRes, riskRes, monthRes, depthRes, netRes] = await Promise.all([
          analyticsService.getMagnitudeAnalytics(),
          analyticsService.getCountryAnalytics(),
          analyticsService.getRiskZoneAnalytics(),
          analyticsService.getMonthlyAnalysis(),
          analyticsService.getDepthAnalysis(),
          analyticsService.getNetworkAnalysis()
        ]);
        setData({
          magnitudeData: magRes.data || magRes,
          countryData: countryRes.data || countryRes,
          riskZones: riskRes.data || riskRes,
          monthlyData: monthRes.data || monthRes,
          depthData: depthRes.data || depthRes,
          networkData: netRes.data || netRes
        });
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh] gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-brand-500/30 border-t-brand-500 animate-spin" />
        <p className="text-slate-500 dark:text-slate-400 font-medium">Processing Deep Analytics...</p>
      </div>
    );
  }
  const topCountries = (data.countryData || []).slice(0, 10).map(c => ({
    name: c._id || 'Unknown',
    count: c.totalQuakes || c.count || 0
  }));
  const riskPieData = (data.riskZones || []).map(r => ({
    name: r._id || 'Unknown Risk',
    value: r.count || 0
  }));
  const getDepthLabel = (id) => {
    if (id === 0) return '0-30 km';
    if (id === 30) return '30-70 km';
    if (id === 70) return '70-150 km';
    if (id === 150) return '150-300 km';
    if (id === 300) return '300-500 km';
    if (id === 500) return '500+ km';
    return `${id} km`;
  };
  const depthFormatted = (data.depthData || []).map(d => ({
    range: getDepthLabel(d._id),
    count: d.count || 0
  }));
  const monthlyFormatted = (data.monthlyData || [])
    .map(m => ({
      month: m._id ? `${m._id.year}-${String(m._id.month).padStart(2, '0')}` : 'Unknown',
      count: m.count || 0,
      year: m._id?.year || 0,
      monthNum: m._id?.month || 0
    }))
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.monthNum - b.monthNum;
    });
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-10">
      <Helmet>
        <title>Deep Analytics | QuakeVision</title>
      </Helmet>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-slide-up">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="text-brand-500" size={32} /> Deep Analytics
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Advanced real-time statistical analysis directly from the backend engine.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
            <Activity className="text-brand-500" size={20} /> Monthly Activity Trend
          </h3>
          <div className="h-[300px] w-full">
            {monthlyFormatted.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyFormatted} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMonth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(3, 7, 18, 0.9)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                    itemStyle={{ color: '#14b8a6', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="count" name="Events" stroke="#14b8a6" strokeWidth={3} fillOpacity={1} fill="url(#colorMonth)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-sm">No data available</div>
            )}
          </div>
        </div>
        <div className="card animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
            <Globe className="text-indigo-500" size={20} /> Most Active Regions (Top 10)
          </h3>
          <div className="h-[300px] w-full">
            {topCountries.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topCountries} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" horizontal={false} />
                  <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} width={100} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                    contentStyle={{ backgroundColor: 'rgba(3, 7, 18, 0.9)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                  />
                  <Bar dataKey="count" name="Earthquakes" fill="#6366f1" radius={[0, 4, 4, 0]}>
                    {topCountries.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-sm">No data available</div>
            )}
          </div>
        </div>
        <div className="card animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
            <AlertTriangle className="text-amber-500" size={20} /> Risk Zone Distribution
          </h3>
          <div className="h-[300px] w-full">
            {riskPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {riskPieData.map((entry, index) => {
                      let color = '#64748b';
                      if (entry.name.toLowerCase().includes('critical')) color = '#ef4444';
                      if (entry.name.toLowerCase().includes('high')) color = '#f97316';
                      if (entry.name.toLowerCase().includes('moderate')) color = '#f59e0b';
                      if (entry.name.toLowerCase().includes('low')) color = '#10b981';
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(3, 7, 18, 0.9)', borderRadius: '12px', border: 'none', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-sm">No data available</div>
            )}
          </div>
        </div>
        <div className="card animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
            <Layers className="text-pink-500" size={20} /> Event Depth Classification
          </h3>
          <div className="h-[300px] w-full">
            {depthFormatted.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={depthFormatted} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" vertical={false} />
                  <XAxis dataKey="range" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(236, 72, 153, 0.1)' }}
                    contentStyle={{ backgroundColor: 'rgba(3, 7, 18, 0.9)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                  />
                  <Bar dataKey="count" name="Count" fill="#ec4899" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-sm">No data available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Analytics;
