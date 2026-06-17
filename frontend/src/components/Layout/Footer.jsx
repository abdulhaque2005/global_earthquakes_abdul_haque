import React from 'react';
import { Globe } from 'lucide-react';
const Footer = () => {
  return (
    <footer style={{
      padding: '2rem 1.5rem',
      textAlign: 'center',
      color: 'var(--text-dim)',
      borderTop: '1px solid var(--glass-border)',
      marginTop: 'auto',
      fontSize: '0.85rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
        <Globe size={14} color="var(--primary)" />
        <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>QuakeVision</span>
      </div>
      <p>&copy; {new Date().getFullYear()} Global Earthquakes Tracker. All rights reserved.</p>
    </footer>
  );
};
export default Footer;
