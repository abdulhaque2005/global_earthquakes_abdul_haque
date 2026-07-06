import React, { useEffect, useState, useContext, useRef } from 'react';
import { MapContainer, TileLayer, Popup, CircleMarker, useMap, Tooltip, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import { SocketContext } from '../../context/SocketContext';
import { Search, MapPin } from 'lucide-react';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;
const getMarkerColor = (magnitude) => {
  if (magnitude >= 6) return '#ef4444';
  if (magnitude >= 4.5) return '#f59e0b';
  if (magnitude >= 2.5) return '#eab308';
  return '#10b981';
};
const getMarkerRadius = (magnitude) => {
  return Math.max(magnitude * 2.5, 5); 
};
const MapSearchHeader = ({ mapInstance }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsSearching(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };
  const jumpToLocation = (lat, lon) => {
    if (mapInstance) {
      mapInstance.flyTo([lat, lon], 13, { duration: 1.5 });
    }
    setResults([]);
    setQuery('');
  };
  return (
    <div className="relative w-full mb-6" style={{ zIndex: 9999 }}>
      <form onSubmit={handleSearch} className="flex items-center gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <MapPin size={20} />
          </div>
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search any country, city, or region to zoom..." 
            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 dark:border-[#1e293b] bg-white dark:bg-[#0f172a] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-lg text-lg font-medium"
          />
        </div>
        <button 
          type="submit" 
          disabled={isSearching}
          className="bg-brand-500 hover:bg-brand-600 text-white px-8 py-4 rounded-2xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-brand-500/30 disabled:opacity-70"
        >
          {isSearching ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Search size={20} />
          )}
          <span className="hidden sm:inline">Search Area</span>
        </button>
      </form>
      {results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] rounded-2xl shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto">
          {results.map((r, i) => (
            <div 
              key={i} 
              onClick={() => jumpToLocation(r.lat, r.lon)}
              className="px-6 py-4 cursor-pointer border-b border-slate-100 dark:border-[#1e293b] last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-4 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-500 shrink-0">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-slate-900 dark:text-white font-semibold text-base">{r.display_name.split(',')[0]}</p>
                <p className="text-slate-500 text-sm mt-0.5">{r.display_name.split(',').slice(1).join(', ')}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
// Heatmap Layer Component
const HeatmapLayer = ({ data }) => {
  const map = useMap();
  const heatLayerRef = useRef(null);
  useEffect(() => {
    if (!map) return;
    // Extract valid lat, lng, and intensity (magnitude)
    const heatData = data
      .filter(eq => eq.latitude != null || eq.location?.coordinates)
      .map(eq => [
        eq.latitude || eq.location.coordinates[1],
        eq.longitude || eq.location.coordinates[0],
        eq.magnitude || 1 // intensity
      ]);
    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
    }
    heatLayerRef.current = L.heatLayer(heatData, {
      radius: 25,
      blur: 15,
      maxZoom: 10,
      max: 8.0, // max magnitude for intensity scaling
      gradient: {
        0.2: 'blue',
        0.4: 'lime',
        0.6: 'yellow',
        0.8: 'orange',
        1.0: 'red'
      }
    }).addTo(map);
    return () => {
      if (heatLayerRef.current && map) {
        map.removeLayer(heatLayerRef.current);
      }
    };
  }, [map, data]);
  return null;
};
const EarthquakeMap = ({ initialEarthquakes = [], center = [20, 0], zoom = 2.5 }) => {
  const socket = useContext(SocketContext);
  const [earthquakes, setEarthquakes] = useState(initialEarthquakes);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);
  useEffect(() => {
    setEarthquakes(initialEarthquakes);
  }, [initialEarthquakes]);
  useEffect(() => {
    if (!socket) return;
    socket.on('newEarthquake', (newEq) => {
      setEarthquakes((prev) => [newEq, ...prev]);
    });
    return () => {
      socket.off('newEarthquake');
    };
  }, [socket]);
  return (
    <div className="flex flex-col w-full h-full">
      <MapSearchHeader mapInstance={mapInstance} />
      <div style={{ position: 'relative', height: '600px', width: '100%', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--glass-border)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
      <div style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 1000 }}>
        <button 
          onClick={() => setShowHeatmap(!showHeatmap)}
          style={{ 
            background: 'var(--glass-bg)', backdropFilter: 'blur(10px)', color: 'white',
            border: '1px solid var(--border-color)', padding: '0.5rem 1rem', borderRadius: '8px',
            cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
          }}
        >
          {showHeatmap ? 'Show Markers' : 'Show Heatmap'}
        </button>
      </div>
      <MapContainer 
        ref={setMapInstance}
        key={`${center[0]}-${center[1]}`} 
        center={center} 
        zoom={zoom} 
        minZoom={2}
        style={{ height: '100%', width: '100%' }}
      >
        <LayersControl position="bottomleft">
          <LayersControl.BaseLayer checked name="Google Maps (Asli Naksha)">
            <TileLayer
              attribution='&copy; Google Maps'
              url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
              maxZoom={20}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Google Satellite (Ghar/Makan dekhe)">
            <TileLayer
              attribution='&copy; Google Maps'
              url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
              maxZoom={20}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Dark Mode">
             <TileLayer
                attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                maxZoom={19}
             />
          </LayersControl.BaseLayer>
        </LayersControl>
        {showHeatmap ? (
          <HeatmapLayer data={earthquakes} />
        ) : (
          earthquakes.map((eq) => {
            const lat = eq.latitude || eq.location?.coordinates[1];
            const lng = eq.longitude || eq.location?.coordinates[0];
            if (!lat || !lng) return null;
            return (
              <CircleMarker
                key={eq._id || eq.id}
                center={[lat, lng]}
                radius={getMarkerRadius(eq.magnitude)}
                pathOptions={{
                  fillColor: getMarkerColor(eq.magnitude),
                  fillOpacity: 0.6,
                  color: getMarkerColor(eq.magnitude),
                  weight: 1
                }}
              >
                <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
                  <div style={{ fontWeight: 'bold' }}>
                    Mag {eq.magnitude?.toFixed(1)} Earthquake
                  </div>
                </Tooltip>
                <Popup>
                  <div style={{ padding: '0px', color: '#1e293b' }}>
                    <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2rem', color: getMarkerColor(eq.magnitude), fontWeight: 'bold' }}>
                      Mag {eq.magnitude?.toFixed(1)}
                    </h3>
                    <p style={{ margin: '0 0 5px 0', fontWeight: '500' }}>{eq.place}</p>
                    <p style={{ margin: '0 0 5px 0', fontSize: '0.85rem', color: '#64748b' }}>
                      {new Date(eq.time).toLocaleString()}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.85rem' }}>
                      Depth: {eq.depth} km
                    </p>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })
        )}
      </MapContainer>
    </div>
  </div>
  );
};
export default EarthquakeMap;
