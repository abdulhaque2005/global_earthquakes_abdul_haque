import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { toggleTheme } from '../../store/slices/uiSlice';
import { Globe, LogOut, User, Menu, X, Shield, Activity, ChevronDown, Sun, Moon } from 'lucide-react';
const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const handleLogout = () => {
    dispatch(logout());
    setProfileOpen(false);
    setMobileOpen(false);
    navigate('/login');
  };
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Earthquakes', path: '/earthquakes' },
  ];
  if (user?.role === 'admin') {
    navLinks.push({ name: 'Admin', path: '/admin' });
  }
  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'var(--glass-bg)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-color)',
    }}>
      <div style={{
        maxWidth: '1400px', margin: '0 auto',
        padding: '0 1.5rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        height: '64px',
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-main)', fontWeight: 800, fontSize: '1.2rem' }}>
          <div style={{ background: 'var(--primary-light)', padding: '0.5rem', borderRadius: '10px', display: 'flex' }}>
            <Globe size={22} color="var(--primary)" />
          </div>
          <span className="hide-mobile">QuakeVision</span>
        </Link>
        <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {navLinks.map((link) => (
            <Link key={link.name} to={link.path}
              style={{
                padding: '0.5rem 1rem', borderRadius: '8px',
                fontSize: '0.9rem', fontWeight: 500,
                color: isActive(link.path) ? (theme === 'dark' ? 'white' : 'white') : 'var(--text-muted)',
                background: isActive(link.path) ? 'var(--primary)' : 'transparent',
                transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: '0.4rem',
              }}
              onMouseEnter={(e) => { if (!isActive(link.path)) { e.target.style.background = 'var(--primary-light)'; e.target.style.color = 'var(--primary)'; }}}
              onMouseLeave={(e) => { if (!isActive(link.path)) { e.target.style.background = 'transparent'; e.target.style.color = 'var(--text-muted)'; }}}
            >
              {link.name === 'Admin' && <Shield size={14} />}
              {link.name}
            </Link>
          ))}
        </div>
        <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={() => dispatch(toggleTheme())}
            style={{
              background: 'var(--primary-light)', color: 'var(--primary)',
              border: 'none', padding: '0.5rem', borderRadius: '10px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.3s ease',
            }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {user ? (
            <div style={{ position: 'relative' }}>
              <button onClick={() => setProfileOpen(!profileOpen)} style={{
                display: 'flex', alignItems: 'center', gap: '0.6rem',
                background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                borderRadius: '12px', padding: '0.4rem 0.8rem 0.4rem 0.4rem',
                cursor: 'pointer', color: 'var(--text-main)', fontFamily: 'inherit',
                transition: 'all 0.2s',
              }}>
                <div style={{
                  width: '34px', height: '34px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, var(--primary), #818cf8)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '0.85rem', color: 'white',
                }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.2 }}>{user.name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 500 }}>{user.role?.toUpperCase()}</div>
                </div>
                <ChevronDown size={14} style={{ color: 'var(--text-dim)', transition: 'transform 0.2s', transform: profileOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
              </button>
              {profileOpen && (
                <div className="animate-slide-down" style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                  borderRadius: '12px', minWidth: '180px', overflow: 'hidden',
                  boxShadow: 'var(--shadow-lg)',
                }}>
                  <button onClick={handleLogout} style={{
                    width: '100%', padding: '0.75rem 1rem',
                    display: 'flex', alignItems: 'center', gap: '0.6rem',
                    color: '#f87171', background: 'transparent', border: 'none',
                    cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'inherit',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(239,68,68,0.1)'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/login" style={{
                color: 'var(--text-muted)', fontWeight: 500, padding: '0.5rem 1rem',
                borderRadius: '8px', fontSize: '0.9rem', transition: 'all 0.2s',
              }}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>
                Register
              </Link>
            </div>
          )}
        </div>
        <div className="hide-desktop" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button 
            onClick={() => dispatch(toggleTheme())}
            style={{
              background: 'var(--primary-light)', color: 'var(--primary)',
              border: 'none', padding: '0.4rem', borderRadius: '8px', cursor: 'pointer',
            }}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem' }}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="hide-desktop animate-slide-down" style={{
          position: 'absolute', top: '64px', left: 0, right: 0,
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border-color)',
          padding: '1rem',
        }}>
          {navLinks.map((link) => (
            <Link key={link.name} to={link.path}
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.85rem 1rem', borderRadius: '10px', marginBottom: '0.25rem',
                color: isActive(link.path) ? (theme === 'dark' ? 'white' : 'var(--primary)') : 'var(--text-muted)',
                background: isActive(link.path) ? 'var(--primary-light)' : 'transparent',
                fontWeight: 500, fontSize: '0.95rem',
              }}
            >
              <Activity size={16} style={{ opacity: 0.5 }} /> {link.name}
            </Link>
          ))}
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '0.75rem 0' }} />
          {user ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, var(--primary), #818cf8)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, color: 'white', fontSize: '1rem',
                }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem' }}>{user.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>{user.email}</div>
                </div>
              </div>
              <button onClick={handleLogout} className="btn btn-danger" style={{ width: '100%', marginTop: '0.5rem' }}>
                <LogOut size={16} /> Sign Out
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>Login</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
export default Navbar;
