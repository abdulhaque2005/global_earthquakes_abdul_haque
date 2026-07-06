import React, { useState, useEffect, useContext } from 'react';
import { SocketContext } from '../../context/SocketContext';
import { AlertTriangle, Bell, Info, ShieldAlert } from 'lucide-react';
import { earthquakeService } from '../../services/earthquakeService';
import { Helmet } from 'react-helmet-async';
const Alerts = () => {
  const socket = useContext(SocketContext);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchHighRisk = async () => {
      try {
        const res = await earthquakeService.getRecentEarthquakes(1000);
        const data = res.data || res;
        if (Array.isArray(data)) {
            setAlerts(data.filter(eq => eq.magnitude >= 4.5));
        }
      } catch (err) {
        console.error("Failed to load alerts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHighRisk();
  }, []);
  useEffect(() => {
    if (!socket) return;
    socket.emit('subscribeToAlerts');
    socket.on('newEarthquake', (newEq) => {
      if (newEq.magnitude >= 4.5) {
        setAlerts((prev) => [newEq, ...prev]);
      }
    });
    return () => {
      socket.off('newEarthquake');
    };
  }, [socket]);
  return (
    <div className="w-full max-w-4xl mx-auto min-h-[80vh]">
      <Helmet>
        <title>Emergency Alerts | QuakeVision</title>
      </Helmet>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 animate-slide-up">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-red-500 flex items-center gap-2">
            <ShieldAlert size={32} /> Emergency Alerts
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xl">
            Live feed of high-risk seismic events (Magnitude 4.5+). Updates are pushed in real-time.
          </p>
        </div>
        <div className="flex items-center">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping-slow"></span> Active Monitoring
          </div>
        </div>
      </div>
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-10 h-10 rounded-full border-4 border-red-500/30 border-t-red-500 animate-spin" />
          <p className="text-slate-500 font-medium">Scanning for alerts...</p>
        </div>
      ) : alerts.length === 0 ? (
         <div className="card text-center py-20 animate-fade-in">
             <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
               <Info className="text-slate-400" size={32}/>
             </div>
             <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">No Active Alerts</h3>
             <p className="text-slate-500">No high-risk earthquakes have been reported recently. Conditions are stable.</p>
         </div>
      ) : (
        <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-[27px] before:w-0.5 before:bg-red-500/20 dark:before:bg-red-500/10">
          {alerts.map((alert, idx) => (
            <div 
              key={alert._id || alert.id} 
              className="relative pl-16 animate-slide-right"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className="absolute left-[18px] top-6 w-5 h-5 rounded-full bg-slate-50 dark:bg-surface-dark border-4 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)] z-10"></div>
              <div className="card hover:border-red-500/30 transition-colors border border-transparent shadow-sm dark:shadow-none bg-white dark:bg-[#1a1c23]">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="px-2.5 py-1 rounded-md bg-red-500 text-white text-xs font-bold tracking-wider">
                        MAG {alert.magnitude?.toFixed(1)}
                      </span>
                      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {new Date(alert.time).toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2">
                      {alert.place || 'Unknown Location'}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex gap-4">
                      <span>Depth: <strong className="text-slate-700 dark:text-slate-300">{alert.depth} km</strong></span>
                    </p>
                  </div>
                  <div className="p-3 bg-red-500/10 text-red-500 rounded-xl shrink-0 hidden sm:block">
                    <AlertTriangle size={28} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default Alerts;
