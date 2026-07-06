import React, { useState } from 'react';
import { reportService } from '../../services/reportService';
import { MessageSquare, MapPin, AlertCircle, Send, CheckCircle, Zap } from 'lucide-react';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
const intensityLabel = (val) => {
  if (val <= 2) return { text: 'Very Weak', color: 'text-emerald-500', bg: 'bg-emerald-500' };
  if (val <= 4) return { text: 'Light', color: 'text-lime-500', bg: 'bg-lime-500' };
  if (val <= 6) return { text: 'Moderate', color: 'text-amber-500', bg: 'bg-amber-500' };
  if (val <= 8) return { text: 'Strong', color: 'text-orange-500', bg: 'bg-orange-500' };
  return { text: 'Severe', color: 'text-red-500', bg: 'bg-red-500' };
};
const inputCls = "w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all";
const Reports = () => {
  const [formData, setFormData] = useState({ location: '', intensity: 5, description: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const lbl = intensityLabel(formData.intensity);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.location.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      await reportService.createReport(formData);
      setSuccess(true);
      toast.success('Report submitted successfully!');
      setFormData({ location: '', intensity: 5, description: '' });
      setTimeout(() => setSuccess(false), 6000);
    } catch (err) {
      toast.error('Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full max-w-2xl mx-auto py-8 flex flex-col gap-8">
      <Helmet>
        <title>Report | QuakeVision</title>
      </Helmet>
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-4">
          <MessageSquare size={26} className="text-indigo-500" />
        </div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Did You Feel It?
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
          Community reports help assess earthquake impact. Share your experience to improve seismic monitoring.
        </p>
      </div>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="h-1 w-full bg-gradient-to-r from-brand-500 via-indigo-500 to-purple-500" />
        {success ? (
          <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
            <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mb-5">
              <CheckCircle size={38} className="text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Report Received!</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-xs mx-auto leading-relaxed">
              Your experience has been added to the global database. Thank you for contributing to seismic safety.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold transition-colors"
            >
              Submit Another Report
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                <MapPin size={15} className="text-brand-500" /> Location / City
                <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className={inputCls}
                placeholder="e.g. Mumbai, India"
                required
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                <Zap size={15} className="text-amber-500" /> Shaking Intensity (1–10)
              </label>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-400">1 – Barely felt</span>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold
                  ${formData.intensity <= 2 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                    formData.intensity <= 4 ? 'bg-lime-500/10 border-lime-500/20 text-lime-600' :
                    formData.intensity <= 6 ? 'bg-amber-500/10 border-amber-500/20 text-amber-600' :
                    formData.intensity <= 8 ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' :
                                             'bg-red-500/10 border-red-500/20 text-red-500'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${lbl.bg}`} />
                  {formData.intensity} — {lbl.text}
                </div>
                <span className="text-xs text-slate-400">10 – Extreme</span>
              </div>
              <input
                type="range"
                min="1" max="10"
                value={formData.intensity}
                onChange={e => setFormData({ ...formData, intensity: parseInt(e.target.value) })}
                className="w-full h-2 rounded-full cursor-pointer accent-brand-500 bg-slate-200 dark:bg-slate-700"
              />
              <div className="flex justify-between mt-1.5 px-0.5">
                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                  <span key={n} className={`text-[10px] font-medium ${n === formData.intensity ? 'text-brand-500' : 'text-slate-400'}`}>
                    {n}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                <MessageSquare size={15} className="text-indigo-500" /> Description of Experience
                <span className="text-red-400">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className={`${inputCls} min-h-[130px] resize-none leading-relaxed`}
                placeholder="Describe what you felt, heard, or observed during the event..."
                required
              />
              <p className="text-xs text-slate-400 mt-1.5 ml-1">{formData.description.length} characters</p>
            </div>
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm shadow-lg shadow-brand-600/20 hover:shadow-brand-600/30 hover:-translate-y-0.5 transition-all duration-200"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Submit Experience Report
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
      <p className="text-center text-xs text-slate-400 dark:text-slate-600 leading-relaxed">
        Reports are anonymized and contribute to community seismic impact assessment.
        Data is processed within our global monitoring network.
      </p>
    </div>
  );
};
export default Reports;
