import React, { useState, useEffect, useRef, useCallback } from 'react';
import { earthquakeService } from '../../services/earthquakeService';
import { Activity, Globe, MapPin, AlertCircle, ChevronRight, Filter, RefreshCw, Layers, Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import EarthquakeCard from '../../components/Earthquake/EarthquakeCard';
import AddEarthquakeModal from '../../components/Earthquake/AddEarthquakeModal';
const EarthquakeList = () => {
  const [earthquakes, setEarthquakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    place: '',
    minMagnitude: '',
    maxMagnitude: '',
    minDepth: '',
    maxDepth: '',
    sort: '-time'
  });
  const navigate = useNavigate();
  const observer = useRef();
  const lastElementRef = useCallback(node => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore]);
  const fetchEarthquakes = async (pageNum, isNewSearch = false) => {
    try {
      if (isNewSearch) setLoading(true);
      else setLoadingMore(true);
      const params = {
        limit: 50,
        page: pageNum,
        ...filters
      };
      const res = await earthquakeService.getEarthquakes(params);
      const data = res.data || res;
      if (Array.isArray(data)) {
        if (isNewSearch) {
          setEarthquakes(data);
        } else {
          setEarthquakes(prev => [...prev, ...data]);
        }
        setHasMore(data.length === 50); 
      }
    } catch (err) {
      console.error("Failed to load list", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEarthquakes(1, true);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters]);
  useEffect(() => {
    if (page > 1) {
      fetchEarthquakes(page, false);
    }
  }, [page]);
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1);
  };
  const clearFilters = () => {
    setFilters({
      place: '',
      minMagnitude: '',
      maxMagnitude: '',
      minDepth: '',
      maxDepth: '',
      sort: '-time'
    });
    setPage(1);
  };
  return (
    <div className="w-full max-w-[1400px] mx-auto flex flex-col gap-6">
      <Helmet>
        <title>Earthquakes | QuakeVision</title>
      </Helmet>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-xl bg-brand-500/10 border border-brand-500/20">
              <Activity size={20} className="text-brand-500" />
            </div>
            <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
              Global Seismic Log
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-500 text-sm ml-[52px]">
            Live earthquake database from international seismic networks.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            Live Sync
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold shadow-lg shadow-brand-600/25 hover:shadow-brand-600/40 hover:-translate-y-0.5 transition-all duration-200"
          >
            <Plus size={16} /> Record Event
          </button>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-5 items-start">
        <div className="w-full lg:w-72 shrink-0 sticky top-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-white">
              <Filter size={15} className="text-brand-500" /> Filters
            </div>
            <button
              onClick={clearFilters}
              className="text-xs font-semibold text-slate-400 hover:text-red-500 dark:hover:text-red-400 flex items-center gap-1 transition-colors"
            >
              <RefreshCw size={11} /> Reset
            </button>
          </div>
          <div className="p-5 space-y-5">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Location</label>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text" name="place" value={filters.place} onChange={handleFilterChange}
                  placeholder="Search region or city..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Magnitude</label>
              <div className="flex gap-2">
                <input
                  type="number" name="minMagnitude" value={filters.minMagnitude} onChange={handleFilterChange}
                  placeholder="Min"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
                />
                <input
                  type="number" name="maxMagnitude" value={filters.maxMagnitude} onChange={handleFilterChange}
                  placeholder="Max"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Depth (km)</label>
              <div className="flex gap-2">
                <input
                  type="number" name="minDepth" value={filters.minDepth} onChange={handleFilterChange}
                  placeholder="Min"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
                />
                <input
                  type="number" name="maxDepth" value={filters.maxDepth} onChange={handleFilterChange}
                  placeholder="Max"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Sort By</label>
              <select
                name="sort" value={filters.sort} onChange={handleFilterChange}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all cursor-pointer"
              >
                <option value="-time">Newest First</option>
                <option value="time">Oldest First</option>
                <option value="-magnitude">Highest Magnitude</option>
                <option value="magnitude">Lowest Magnitude</option>
                <option value="-depth">Deepest First</option>
                <option value="depth">Shallowest First</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              <Layers size={16} className="text-indigo-500" />
              <span>{earthquakes.length} events found</span>
              {loadingMore && <span className="text-xs text-brand-500 animate-pulse font-medium">• loading more...</span>}
            </div>
          </div>
          {loading && page === 1 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-10 h-10 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin" />
              <p className="text-slate-500 text-sm font-medium">Loading seismic database...</p>
            </div>
          ) : earthquakes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <AlertCircle size={36} className="text-slate-300 dark:text-slate-700" />
              <p className="text-slate-500 text-sm font-medium">No earthquakes match your filters.</p>
              <button onClick={clearFilters} className="text-xs text-brand-500 font-semibold hover:underline">Clear filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {earthquakes.map((eq, index) => {
                const isLast = index === earthquakes.length - 1;
                return (
                  <div key={eq._id || eq.id} ref={isLast ? lastElementRef : null}>
                    <EarthquakeCard earthquake={eq} />
                  </div>
                );
              })}
            </div>
          )}
          {loadingMore && (
            <div className="py-8 flex justify-center">
              <div className="w-6 h-6 rounded-full border-2 border-brand-500/30 border-t-brand-500 animate-spin" />
            </div>
          )}
        </div>
      </div>
      <AddEarthquakeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdded={() => fetchEarthquakes(1, true)}
      />
    </div>
  );
};
export default EarthquakeList;
