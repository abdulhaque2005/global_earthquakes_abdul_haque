import React from 'react';
import { Activity, Calendar, Navigation, AlertTriangle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const getMagConfig = (mag) => {
  if (mag >= 7)  return { bar: 'bg-red-600',    badge: 'bg-red-600/10 text-red-500 border-red-500/25',    label: 'SEVERE'   };
  if (mag >= 6)  return { bar: 'bg-red-500',    badge: 'bg-red-500/10 text-red-500 border-red-500/25',    label: 'STRONG'   };
  if (mag >= 5)  return { bar: 'bg-orange-500', badge: 'bg-orange-500/10 text-orange-500 border-orange-500/25', label: 'MODERATE' };
  if (mag >= 4)  return { bar: 'bg-amber-500',  badge: 'bg-amber-500/10 text-amber-600 border-amber-500/25',   label: 'LIGHT'    };
  return          { bar: 'bg-emerald-500', badge: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/25', label: 'MINOR'    };
};
const getRiskBadge = (risk) => {
  const r = risk?.toLowerCase();
  if (r === 'critical') return 'text-red-500 bg-red-500/8 border-red-500/20';
  if (r === 'high')     return 'text-orange-500 bg-orange-500/8 border-orange-500/20';
  if (r === 'moderate') return 'text-amber-600 bg-amber-500/8 border-amber-500/20';
  if (r === 'low')      return 'text-emerald-600 bg-emerald-500/8 border-emerald-500/20';
  return 'text-slate-400 bg-slate-500/8 border-slate-500/20';
};
const EarthquakeCard = ({ earthquake }) => {
  const navigate = useNavigate();
  const mag = earthquake.magnitude;
  const cfg = getMagConfig(mag);
  const timeStr = earthquake.time
    ? new Date(earthquake.time).toLocaleString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '—';
  return (
    <div
      onClick={() => navigate(`/earthquakes/${earthquake._id || earthquake.id}`)}
      className="group relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-black/40 hover:-translate-y-1 flex flex-col"
    >
      <div className={`h-1 w-full ${cfg.bar} transition-all duration-300 group-hover:h-[3px]`} />
      <div className="p-5 flex flex-col gap-4 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold tracking-[0.15em] text-slate-400 uppercase mb-0.5">Magnitude</span>
            <div className="flex items-baseline gap-1">
              <span className={`font-display text-4xl font-black leading-none ${cfg.bar.replace('bg-', 'text-')}`}>
                {mag?.toFixed(1) ?? '—'}
              </span>
              <span className="text-sm font-bold text-slate-400">M</span>
            </div>
            <span className={`mt-1.5 inline-flex text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full border ${cfg.badge}`}>
              {cfg.label}
            </span>
          </div>
          <div className="text-right flex flex-col items-end gap-1 min-w-0">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
              {earthquake.type || 'Earthquake'}
            </span>
            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <Calendar size={11} className="shrink-0 text-brand-500/70" />
              <span className="text-right leading-tight">{timeStr}</span>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-tight line-clamp-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-200">
            {earthquake.place || earthquake.location || 'Unknown Location'}
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Activity size={12} className="text-indigo-400 shrink-0" />
            <span>{earthquake.depth != null ? `${earthquake.depth.toFixed(1)} km deep` : 'Depth N/A'}</span>
          </div>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Navigation size={12} className="text-emerald-400 shrink-0" />
            <span className="uppercase">{earthquake.net || 'N/A'}</span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg border ${getRiskBadge(earthquake.riskLevel)}`}>
            <AlertTriangle size={10} />
            {earthquake.riskLevel || 'Unknown'} Risk
          </div>
          <div className="flex items-center gap-1 text-slate-400 group-hover:text-brand-500 transition-colors duration-200 text-xs font-semibold">
            Details <ChevronRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
export default EarthquakeCard;
