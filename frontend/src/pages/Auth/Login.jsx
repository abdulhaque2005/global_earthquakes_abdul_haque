import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { login, clearError } from '../../store/slices/authSlice';
import { LogIn, Globe } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: (values) => {
      dispatch(login(values));
    },
  });

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-64px)] px-4 py-8">
      <Helmet>
        <title>Login | QuakeVision - Global Earthquake Analytics</title>
        <meta name="description" content="Log in to your QuakeVision account to access real-time earthquake analytics, personalized alerts, and advanced seismic data tracking." />
        <meta name="keywords" content="earthquake login, quakevision account, seismic data portal, earthquake analytics dashboard" />
      </Helmet>

      <div className="animate-fade-in w-full max-w-md bg-white dark:bg-[#1a1c23] border border-slate-200 dark:border-white/5 rounded-3xl p-8 sm:p-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-brand-500/10 flex items-center justify-center mx-auto mb-4">
            <Globe size={28} className="text-brand-500" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Welcome Back</h2>
          <p className="text-slate-500 text-sm font-medium">Login to access the analytics dashboard</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="px-4 py-3 rounded-xl mb-6 bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
            <input
              type="email" name="email"
              className={`input-field w-full ${formik.touched.email && formik.errors.email ? 'border-red-500 focus:ring-red-500/20' : ''}`}
              placeholder="you@example.com"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && <div className="text-red-500 text-xs font-medium mt-1.5">{formik.errors.email}</div>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
            <input
              type="password" name="password"
              className={`input-field w-full ${formik.touched.password && formik.errors.password ? 'border-red-500 focus:ring-red-500/20' : ''}`}
              placeholder="Enter your password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password && <div className="text-red-500 text-xs font-medium mt-1.5">{formik.errors.password}</div>}
          </div>

          <button type="submit" className="btn btn-primary w-full py-3 text-base mt-2 flex items-center justify-center gap-2" disabled={loading}>
            {loading ? (
              <>
                <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Logging in...
              </>
            ) : (
              <><LogIn size={20} /> Login</>
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-sm font-medium text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-500 font-bold hover:text-brand-400 transition-colors">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
