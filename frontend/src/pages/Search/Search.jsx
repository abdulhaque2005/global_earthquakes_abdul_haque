import React, { useState, useEffect, useCallback } from 'react';
import { searchService } from '../../services/searchService';
import { earthquakeService } from '../../services/earthquakeService';
import { Search as SearchIcon, Activity, MapPin, ChevronRight, Calendar, Clock, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
const getMagConfig = (mag) => {
  if (mag >= 7)  return { color: 'text-red-600',    bg: 'bg-red-500/10 border-red-500/20',    bar: 'bg-red-500'    };
  if (mag >= 6)  return { color: 'text-red-500',    bg: 'bg-red-500/10 border-red-500/20',    bar: 'bg-red-400'    };
  if (mag >= 5)  return { color: 'text-orange-500', bg: 'bg-orange-500/10 border-orange-500/20', bar: 'bg-orange-400' };
  if (mag >= 4)  return { color: 'text-amber-600',  bg: 'bg-amber-500/10 border-amber-500/20',  bar: 'bg-amber-400'  };
  return          { color: 'text-emerald-600', bg: 'bg-emerald-500/10 border-emerald-500/20', bar: 'bg-emerald-400' };
};
const ResultRow = ({ eq, navigate, index }) => {
  const cfg = getMagConfig(eq.magnitude);
  return (
    <div
      key={eq._id || eq.id}
      onClick={() => navigate(`/earthquakes/${eq._id || eq.id}`)}
      className="group flex items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-black/30 hover:border-brand-500/30 dark:hover:border-brand-500/30 transition-all duration-200"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className={`flex flex-col items-center justify-center w-14 h-14 shrink-0 rounded-xl border ${cfg.bg}`}>
        <span className={`text-[10px] font-bold tracking-wide uppercase ${cfg.color} opacity-70`}>Mag</span>
        <span className={`text-xl font-black leading-none ${cfg.color}`}>{eq.magnitude?.toFixed(1) ?? '—'}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-tight truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          {eq.place || eq.location || 'Unknown Location'}
        </h3>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Calendar size={11} />
            {new Date(eq.time).toLocaleString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </span>
          <span className="text-slate-300 dark:text-slate-700 text-xs">•</span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Activity size={11} className="text-indigo-400" />
            {eq.depth != null ? `${eq.depth.toFixed(1)} km` : 'N/A'}
          </span>
        </div>
      </div>
      <ChevronRight
        size={18}
        className="text-slate-300 dark:text-slate-700 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all duration-200 shrink-0"
      />
    </div>
  );
};
const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [defaultData, setDefaultData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();
  // Load default recent earthquakes on mount
  useEffect(() => {
    const loadDefaults = async () => {
      try {
        const res = await earthquakeService.getEarthquakes({ limit: 20, sort: '-time' });
        const data = res.data || res;
        setDefaultData(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load default data', err);
      } finally {
        setInitialLoading(false);
      }
    };
    loadDefaults();
  }, []);
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchService.searchEarthquakes(query.trim());
        const data = res.data || res;
        setResults(Array.isArray(data) ? data : []);
      } catch (err) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [query]);
  const displayData = query.trim() ? results : defaultData;
  const isSearching = query.trim().length > 0;
  return (
    <div className="w-full max-w-3xl mx-auto py-6 flex flex-col gap-6">
      <Helmet>
        <title>Search | QuakeVision</title>
      </Helmet>
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/20 mb-4">
          <SearchIcon size={26} className="text-brand-500" />
        </div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Search Database
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
          Search for seismic events by country, city, or region. Recent events shown by default.
        </p>
      </div>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          {loading
            ? <div className="w-4 h-4 rounded-full border-2 border-brand-500/30 border-t-brand-500 animate-spin" />
            : <SearchIcon className="text-slate-400" size={18} />
          }
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter country, city, or place..."
          autoFocus
          className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 shadow-sm transition-all"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>
      <div className="flex items-center justify-between px-1">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {isSearching
            ? `${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`
            : 'Recent Earthquakes'
          }
        </p>
        {!isSearching && (
          <span className="flex items-center gap-1.5 text-xs text-emerald-500 font-semibold">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            Live
          </span>
        )}
      </div>
      <div className="flex flex-col gap-3">
        {initialLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin" />
            <p className="text-slate-400 text-sm font-medium">Loading recent events...</p>
          </div>
        ) : loading && isSearching ? (
          <div className="flex items-center justify-center py-10 gap-3">
            <div className="w-6 h-6 rounded-full border-2 border-brand-500/20 border-t-brand-500 animate-spin" />
            <p className="text-slate-400 text-sm">Searching...</p>
          </div>
        ) : displayData.length === 0 && isSearching ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <SearchIcon size={32} className="text-slate-300 dark:text-slate-700" />
            <p className="text-slate-500 font-medium text-sm">No results for "{query}"</p>
            <button onClick={() => setQuery('')} className="text-xs text-brand-500 font-semibold hover:underline">
              Clear search
            </button>
          </div>
        ) : (
          displayData.map((eq, i) => (
            <ResultRow key={eq._id || eq.id} eq={eq} navigate={navigate} index={i} />
          ))
        )}
      </div>
    </div>
  );
};
export default Search;
