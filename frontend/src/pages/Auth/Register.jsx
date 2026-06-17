import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { registerUser, googleLogin, clearError } from '../../store/slices/authSlice';
import { UserPlus, Globe } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';
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
    <div className="flex justify-center items-center min-h-[calc(100vh-64px)] px-4 py-8 bg-slate-50 dark:bg-[#0f1115] relative overflow-hidden">
      <Helmet>
        <title>Register | QuakeVision - Global Earthquake Analytics</title>
        <meta name="description" content="Create a QuakeVision account to access real-time earthquake tracking, personalized seismic alerts, and advanced global earthquake analytics." />
      </Helmet>
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-brand-500/20 rounded-full blur-[100px] animate-pulse-glow"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
      <div className="w-full max-w-md bg-white/80 dark:bg-[#1a1c23]/80 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 transition-all duration-500 transform translate-y-0 opacity-100 animate-fade-in">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-brand-500/30">
            <Globe size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">Create Account</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Join to access earthquake analytics</p>
        </div>
        {error && (
          <div className="px-4 py-3 rounded-xl mb-6 bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium text-center animate-fade-in">
            {error}
          </div>
        )}
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
          {fields.map((f) => (
            <div key={f.name}>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">{f.label}</label>
              <input
                type={f.type} name={f.name}
                className={`w-full px-5 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-transparent focus:border-brand-500 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all duration-300 text-slate-900 dark:text-white placeholder-slate-400 shadow-inner ${formik.touched[f.name] && formik.errors[f.name] ? 'border-red-500 focus:ring-red-500/20' : ''}`}
                placeholder={f.placeholder}
                value={formik.values[f.name]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched[f.name] && formik.errors[f.name] && (
                <div className="text-red-500 text-xs font-medium mt-2 ml-1">{formik.errors[f.name]}</div>
              )}
            </div>
          ))}
          <button type="submit" className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-brand-500 dark:hover:bg-brand-600 text-white text-base font-bold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center gap-2 mt-2" disabled={loading}>
            {loading ? (
              <>
                <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700/50"></div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">or sign up with</span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700/50"></div>
        </div>
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              dispatch(googleLogin(credentialResponse.credential));
            }}
            onError={() => {
              toast.error('Google Sign Up Failed');
            }}
            theme={document.documentElement.classList.contains('dark') ? 'filled_black' : 'outline'}
            shape="rectangular"
            text="signup_with"
            size="large"
            width="100%"
          />
        </div>
        <p className="text-center mt-8 text-sm font-medium text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-500 font-bold hover:text-brand-400 transition-colors">Login here</Link>
        </p>
      </div>
    </div>
  );
};
export default Register;
