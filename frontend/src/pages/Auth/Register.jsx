import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { registerUser, clearError } from '../../store/slices/authSlice';
import { UserPlus, Globe } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const Register = () => {
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
    initialValues: { name: '', email: '', password: '', confirmPassword: '' },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().min(6, 'Must be at least 6 characters').required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm your password'),
    }),
    onSubmit: (values) => {
      const { confirmPassword, ...data } = values;
      dispatch(registerUser(data));
    },
  });

  const fields = [
    { name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com' },
    { name: 'password', label: 'Password', type: 'password', placeholder: 'Min. 6 characters' },
    { name: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: 'Re-enter password' },
  ];

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-64px)] px-4 py-8">
      <Helmet>
        <title>Register | QuakeVision - Global Earthquake Analytics</title>
        <meta name="description" content="Create a QuakeVision account to access real-time earthquake tracking, personalized seismic alerts, and advanced global earthquake analytics." />
        <meta name="keywords" content="earthquake registration, sign up quakevision, seismic alerts account, global earthquake tracker sign up" />
      </Helmet>

      <div className="animate-fade-in w-full max-w-md bg-white dark:bg-[#1a1c23] border border-slate-200 dark:border-white/5 rounded-3xl p-8 sm:p-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-brand-500/10 flex items-center justify-center mx-auto mb-4">
            <Globe size={28} className="text-brand-500" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Create Account</h2>
          <p className="text-slate-500 text-sm font-medium">Join to access earthquake analytics</p>
        </div>

        {/* Error */}
        {error && (
          <div className="px-4 py-3 rounded-xl mb-6 bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
          {fields.map((f) => (
            <div key={f.name}>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{f.label}</label>
              <input
                type={f.type} name={f.name}
                className={`input-field w-full ${formik.touched[f.name] && formik.errors[f.name] ? 'border-red-500 focus:ring-red-500/20' : ''}`}
                placeholder={f.placeholder}
                value={formik.values[f.name]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched[f.name] && formik.errors[f.name] && (
                <div className="text-red-500 text-xs font-medium mt-1.5">{formik.errors[f.name]}</div>
              )}
            </div>
          ))}

          <button type="submit" className="btn btn-primary w-full py-3 text-base mt-4 flex items-center justify-center gap-2" disabled={loading}>
            {loading ? (
              <>
                <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Creating account...
              </>
            ) : (
              <><UserPlus size={20} /> Register</>
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-sm font-medium text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-500 font-bold hover:text-brand-400 transition-colors">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
