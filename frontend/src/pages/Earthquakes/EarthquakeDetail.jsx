import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { earthquakeService } from '../../services/earthquakeService';
import EarthquakeMap from '../../components/Earthquake/EarthquakeMap';
import { Helmet } from 'react-helmet-async';
import {
  ArrowLeft, Activity, MapPin, Clock, Layers, Target, Radio,
  AlertCircle, Globe, BarChart3, Navigation,
  Compass, Wifi, ShieldAlert, Database
} from 'lucide-react';
const EarthquakeDetail = () => {
  const { id } = useParams();
  const [earthquake, setEarthquake] = useState(null);
  const [nearbyQuakes, setNearbyQuakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await earthquakeService.getEarthquakeById(id);
        const eq = res.data || res;
        setEarthquake(eq);
        if (eq.latitude && eq.longitude) {
          try {
            const nearby = await earthquakeService.getNearby(eq.latitude, eq.longitude, 500, 20);
            setNearbyQuakes(nearby.data || nearby || []);
          } catch (e) {
            setNearbyQuakes([eq]);
          }
        }
      } catch (err) {
        console.error("Failed to load earthquake detail", err);
        setError("Could not retrieve earthquake data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);
  const getMagStyle = (mag) => {
    if (mag >= 7) return { bg: 'bg-gradient-to-br from-red-800 to-red-600', color: 'text-red-200', glow: 'shadow-[0_0_40px_rgba(220,38,38,0.4)]', label: 'EXTREME' };
    if (mag >= 6) return { bg: 'bg-gradient-to-br from-red-700 to-red-500', color: 'text-red-200', glow: 'shadow-[0_0_30px_rgba(239,68,68,0.35)]', label: 'SEVERE' };
    if (mag >= 5) return { bg: 'bg-gradient-to-br from-amber-800 to-amber-500', color: 'text-amber-100', glow: 'shadow-[0_0_25px_rgba(245,158,11,0.3)]', label: 'STRONG' };
    if (mag >= 4) return { bg: 'bg-gradient-to-br from-yellow-700 to-yellow-500', color: 'text-yellow-100', glow: 'shadow-[0_0_20px_rgba(234,179,8,0.25)]', label: 'MODERATE' };
    return { bg: 'bg-gradient-to-br from-emerald-800 to-emerald-500', color: 'text-emerald-100', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.25)]', label: 'LIGHT' };
  };
  const getRiskStyle = (risk) => {
    switch (risk) {
      case 'Critical': return { color: 'text-red-500', bg: 'bg-red-500/10', icon: '🔴' };
      case 'High': return { color: 'text-amber-500', bg: 'bg-amber-500/10', icon: '🟠' };
      case 'Moderate': return { color: 'text-blue-500', bg: 'bg-blue-500/10', icon: '🔵' };
      default: return { color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: '🟢' };
    }
  };
  const getDepthCategory = (depth) => {
    if (depth <= 70) return { label: 'Shallow', color: 'text-red-500' };
    if (depth <= 300) return { label: 'Intermediate', color: 'text-amber-500' };
    return { label: 'Deep', color: 'text-blue-500' };
  };
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6">
        <div className="w-14 h-14 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-brand-500 animate-spin" />
        <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">Loading seismic data...</p>
      </div>
    );
  }
  if (error || !earthquake) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-8">
        <ShieldAlert size={72} className="text-red-500 mb-6 opacity-80" />
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">Data Unavailable</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">{error || "This earthquake record could not be found in the database."}</p>
        <Link to="/earthquakes" className="btn btn-primary"><ArrowLeft size={18} /> Back to Database</Link>
      </div>
    );
  }
  const magStyle = getMagStyle(earthquake.magnitude);
  const riskStyle = getRiskStyle(earthquake.riskLevel);
  const depthCat = getDepthCategory(earthquake.depth);
  const lat = earthquake.latitude || earthquake.location?.coordinates?.[1];
  const lng = earthquake.longitude || earthquake.location?.coordinates?.[0];
  const mapData = nearbyQuakes.length > 0 ? nearbyQuakes : [earthquake];
  return (
    <div className="animate-fade-in w-full max-w-[1300px] mx-auto px-4 sm:px-6 py-8 pb-16 min-h-[85vh]">
      <Helmet>
        <title>Mag {earthquake.magnitude?.toFixed(1)} — {earthquake.place} | QuakeVision</title>
        <meta name="description" content={`Detailed seismic analysis for the ${earthquake.magnitude?.toFixed(1)} magnitude earthquake near ${earthquake.place}.`} />
      </Helmet>
      <Link to="/earthquakes" className="inline-flex items-center gap-2 text-slate-500 font-medium mb-8 px-4 py-2 rounded-xl transition-all hover:bg-brand-500/10 hover:text-brand-500">
        <ArrowLeft size={18} /> Back to Earthquake List
      </Link>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-start mb-10">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${riskStyle.bg} ${riskStyle.color}`}>
              {riskStyle.icon} {earthquake.riskLevel || 'Unknown'} Risk
            </span>
            <span className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-brand-500/10 text-brand-500">
              {earthquake.type || 'earthquake'}
            </span>
            {earthquake.status && (
              <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${earthquake.status === 'reviewed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'}`}>
                {earthquake.status}
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-slate-900 dark:text-white mb-4">
            <MapPin size={36} className="inline text-brand-500 mr-2 -mt-2" />
            {earthquake.place}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-2 text-base">
              <Clock size={18} /> {new Date(earthquake.time).toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'medium' })}
            </span>
            {lat && lng && (
              <span className="flex items-center gap-2 text-base">
                <Compass size={18} /> {lat.toFixed(4)}°, {lng.toFixed(4)}°
              </span>
            )}
          </div>
        </div>
        <div className={`${magStyle.bg} ${magStyle.glow} rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center min-w-[200px] animate-pulse-glow`}>
          <span className={`${magStyle.color} text-xs font-bold uppercase tracking-[0.15em] mb-1`}>{magStyle.label}</span>
          <span className="text-white text-6xl sm:text-7xl font-black leading-none">{earthquake.magnitude?.toFixed(1)}</span>
          <span className={`${magStyle.color} text-sm font-semibold mt-2`}>{earthquake.magType?.toUpperCase() || 'MAG'}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        <div className="card flex items-center gap-5">
          <div className="p-4 bg-indigo-500/10 text-indigo-500 rounded-2xl shrink-0">
            <Layers size={32} />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Depth</div>
            <div className="text-3xl font-black text-slate-900 dark:text-white leading-tight">
              {earthquake.depth?.toFixed(1)} <span className="text-lg text-slate-500 font-medium">km</span>
            </div>
            <span className={`text-xs font-semibold ${depthCat.color}`}>● {depthCat.label} Earthquake</span>
          </div>
        </div>
        <div className="card flex items-center gap-5">
          <div className={`p-4 ${riskStyle.bg} ${riskStyle.color} rounded-2xl shrink-0`}>
            <AlertCircle size={32} />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Risk Assessment</div>
            <div className={`text-3xl font-black leading-tight ${riskStyle.color}`}>{earthquake.riskLevel || 'Unknown'}</div>
            <span className="text-xs text-slate-500 font-medium">Auto-calculated from M & Depth</span>
          </div>
        </div>
        <div className="card flex items-center gap-5">
          <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl shrink-0">
            <Wifi size={32} />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Source Network</div>
            <div className="text-3xl font-black text-slate-900 dark:text-white leading-tight uppercase">{earthquake.net || 'N/A'}</div>
            <span className="text-xs text-slate-500 font-medium">{earthquake.locationSource || 'Seismic Network'}</span>
          </div>
        </div>
      </div>
      <div className="card p-6 sm:p-8 mb-10">
        <h3 className="flex items-center gap-3 text-xl font-bold text-slate-900 dark:text-white mb-6">
          <Database size={24} className="text-brand-500" /> Technical Seismological Data
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Azimuthal Gap', value: earthquake.gap != null ? `${earthquake.gap}°` : 'N/A', icon: <Target size={18} />, desc: 'Coverage gap between stations' },
            { label: 'RMS Residual', value: earthquake.rms != null ? earthquake.rms.toFixed(3) : 'N/A', icon: <Activity size={18} />, desc: 'Travel time residual' },
            { label: 'Stations Used', value: earthquake.nst || 'N/A', icon: <Radio size={18} />, desc: 'Number of seismic stations' },
            { label: 'Min Distance', value: earthquake.dmin != null ? `${earthquake.dmin.toFixed(3)}°` : 'N/A', icon: <Navigation size={18} />, desc: 'Distance to nearest station' },
            { label: 'Horizontal Error', value: earthquake.horizontalError != null ? `${earthquake.horizontalError.toFixed(1)} km` : 'N/A', icon: <Compass size={18} />, desc: 'Location uncertainty' },
            { label: 'Depth Error', value: earthquake.depthError != null ? `${earthquake.depthError.toFixed(1)} km` : 'N/A', icon: <Layers size={18} />, desc: 'Depth uncertainty' },
            { label: 'Mag Error', value: earthquake.magError != null ? `±${earthquake.magError.toFixed(2)}` : 'N/A', icon: <BarChart3 size={18} />, desc: 'Magnitude uncertainty' },
            { label: 'Mag Stations', value: earthquake.magNst || 'N/A', icon: <Globe size={18} />, desc: 'Stations for magnitude calc' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-[#1a1c23] border border-slate-200 dark:border-white/5 transition-all hover:border-brand-500/30">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase mb-2">
                {item.icon} {item.label}
              </div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{item.value}</div>
              <div className="text-xs text-slate-500 mt-1">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-10">
        <h3 className="flex items-center gap-3 text-xl font-bold text-slate-900 dark:text-white mb-3">
          <Globe size={24} className="text-brand-500" /> Epicenter & Nearby Seismic Activity
        </h3>
        <p className="text-slate-500 mb-4">
          Map shows this earthquake's epicenter and nearby events within a 500 km radius from the database.
        </p>
        <div className="card p-2 rounded-3xl">
          <div className="rounded-2xl overflow-hidden h-[500px]">
            <EarthquakeMap
              initialEarthquakes={mapData}
              center={lat && lng ? [lat, lng] : [20, 0]}
              zoom={7}
            />
          </div>
        </div>
      </div>
      <div className="card flex flex-col sm:flex-row justify-between gap-6">
        <div>
          <span className="text-xs text-slate-500 font-bold uppercase">Event Time</span>
          <div className="font-semibold text-slate-900 dark:text-white mt-1">
            {new Date(earthquake.time).toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'long' })}
          </div>
        </div>
        {earthquake.updated && (
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase">Last Updated</span>
            <div className="font-semibold text-slate-900 dark:text-white mt-1">
              {new Date(earthquake.updated).toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'long' })}
            </div>
          </div>
        )}
        <div>
          <span className="text-xs text-slate-500 font-bold uppercase">Record ID</span>
          <div className="font-medium text-slate-400 mt-1 font-mono text-sm">
            {earthquake._id}
          </div>
        </div>
      </div>
    </div>
  );
};
export default EarthquakeDetail;
