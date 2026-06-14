import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../store/slices/userSlice';
import { Users, Shield, Activity, BarChart3 } from 'lucide-react';
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
    <div style={{ padding: '2rem 0' }}>
      <Helmet>
        <title>Admin Dashboard | QuakeVision - Global Earthquake Analytics</title>
        <meta name="description" content="Administration panel for QuakeVision. Manage users, monitor system health, and oversee earthquake tracking settings." />
        <meta name="keywords" content="quakevision admin, administration dashboard, system management, user management portal" />
      </Helmet>
      
      <div className="flex items-center gap-3 mb-8">
        <Shield color="var(--primary)" size={36} /> 
        <h1 className="text-3xl font-bold m-0">Admin Control Panel</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-panel p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-gray-400 m-0">Total Registered Users</h3>
            <Users color="var(--primary)" size={24} />
          </div>
          <p className="text-4xl font-bold m-0">{loading ? '...' : usersList.length}</p>
        </div>

        <div className="glass-panel p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-gray-400 m-0">Admin Accounts</h3>
            <Shield color="var(--warning)" size={24} />
          </div>
          <p className="text-4xl font-bold m-0">{loading ? '...' : adminCount}</p>
        </div>

        <div className="glass-panel p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-gray-400 m-0">Standard Users</h3>
            <User color="var(--success)" size={24} />
          </div>
          <p className="text-4xl font-bold m-0">{loading ? '...' : userCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Users /> Manage Users</h2>
          <p className="text-gray-400 mb-6">Create, update, and manage all users registered on the platform. Assign roles and permissions.</p>
          <Link to="/admin/users" className="btn btn-primary">Go to User Management</Link>
        </div>
        
        <div className="glass-panel p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><BarChart3 /> System Analytics</h2>
          <p className="text-gray-400 mb-6">View global system analytics, API usage, and performance metrics.</p>
          <Link to="/analytics" className="btn btn-primary">View Analytics</Link>
        </div>
      </div>
    </div>
  );
};

// Mock User Icon since it's not imported at top
const User = ({ color, size }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;

export default AdminDashboard;
