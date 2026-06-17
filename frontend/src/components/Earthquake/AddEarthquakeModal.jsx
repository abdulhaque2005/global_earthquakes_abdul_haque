import React, { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { earthquakeService } from '../../services/earthquakeService';
const AddEarthquakeModal = ({ isOpen, onClose, onAdded }) => {
  const [formData, setFormData] = useState({
    time: new Date().toISOString().slice(0, 16),
    latitude: '',
    longitude: '',
    depth: '',
    magnitude: '',
    place: '',
    riskLevel: 'Low',
    type: 'earthquake'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  if (!isOpen) return null;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        depth: parseFloat(formData.depth),
        magnitude: parseFloat(formData.magnitude),
        time: new Date(formData.time).toISOString()
      };
      await earthquakeService.createEarthquake(payload);
      onAdded(); 
      onClose(); 
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to add earthquake');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#1a1c23] w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-slate-50/50 dark:bg-white/[0.02]">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Add Seismic Event
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-500">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
          <form id="add-earthquake-form" onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Date & Time</label>
                <input 
                  type="datetime-local" 
                  name="time" 
                  required
                  value={formData.time} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Event Type</label>
                <select 
                  name="type" 
                  value={formData.type} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all appearance-none"
                >
                  <option value="earthquake">Earthquake</option>
                  <option value="quarry blast">Quarry Blast</option>
                  <option value="explosion">Explosion</option>
                  <option value="ice quake">Ice Quake</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Magnitude</label>
                <input 
                  type="number" 
                  name="magnitude" 
                  step="0.1"
                  required
                  placeholder="e.g. 5.4"
                  value={formData.magnitude} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Depth (km)</label>
                <input 
                  type="number" 
                  name="depth" 
                  step="0.1"
                  required
                  placeholder="e.g. 10.0"
                  value={formData.depth} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Latitude</label>
                <input 
                  type="number" 
                  name="latitude" 
                  step="any"
                  required
                  min="-90" max="90"
                  placeholder="e.g. 34.0522"
                  value={formData.latitude} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Longitude</label>
                <input 
                  type="number" 
                  name="longitude" 
                  step="any"
                  required
                  min="-180" max="180"
                  placeholder="e.g. -118.2437"
                  value={formData.longitude} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Location Description (Place)</label>
                <input 
                  type="text" 
                  name="place" 
                  required
                  placeholder="e.g. 10km WSW of Los Angeles, CA"
                  value={formData.place} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Risk Level</label>
                <select 
                  name="riskLevel" 
                  value={formData.riskLevel} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all appearance-none"
                >
                  <option value="Low">Low</option>
                  <option value="Moderate">Moderate</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>
          </form>
        </div>
        <div className="px-6 py-4 border-t border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] flex justify-end gap-3 mt-auto">
          <button 
            type="button" 
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="add-earthquake-form"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl font-semibold bg-brand-500 hover:bg-brand-600 text-white transition-colors flex items-center gap-2 shadow-lg shadow-brand-500/30 disabled:opacity-50"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {loading ? 'Saving...' : 'Save Event'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default AddEarthquakeModal;
