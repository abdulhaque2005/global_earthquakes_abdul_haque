import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../store/slices/userSlice';
import { Users, Shield, Activity, BarChart3, User } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { usersList, loading } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const adminCount = usersList.filter(u => u.role === 'admin').length;
  const userCount = usersList.filter(u => u.role === 'user').length;

  return (
    <div className="w-full max-w-6xl mx-auto py-8 space-y-8">
      <Helmet>
        <title>Admin Dashboard | QuakeVision - Global Earthquake Analytics</title>
        <meta name="description" content="Administration panel for QuakeVision. Manage users, monitor system health, and oversee earthquake tracking settings." />
        <meta name="keywords" content="quakevision admin, administration dashboard, system management, user management portal" />
      </Helmet>

      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-brand-500/10 text-brand-500">
          <Shield size={28} />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Admin Control Panel</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="card flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Registered Users</h3>
            <div className="p-2 rounded-xl bg-brand-500/10 text-brand-500">
              <Users size={20} />
            </div>
          </div>
          <p className="font-display text-4xl font-bold text-slate-900 dark:text-white">{loading ? '...' : usersList.length}</p>
        </div>

        <div className="card flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Admin Accounts</h3>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Shield size={20} />
            </div>
          </div>
          <p className="font-display text-4xl font-bold text-slate-900 dark:text-white">{loading ? '...' : adminCount}</p>
        </div>

        <div className="card flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Standard Users</h3>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <User size={20} />
            </div>
          </div>
          <p className="font-display text-4xl font-bold text-slate-900 dark:text-white">{loading ? '...' : userCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="card">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <Users size={20} className="text-brand-500" /> Manage Users
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Create, update, and manage all users registered on the platform. Assign roles and permissions.</p>
          <Link to="/admin/users" className="btn btn-primary">Go to User Management</Link>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <BarChart3 size={20} className="text-indigo-500" /> System Analytics
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">View global system analytics, API usage, and performance metrics.</p>
          <Link to="/analytics" className="btn btn-primary">View Analytics</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
