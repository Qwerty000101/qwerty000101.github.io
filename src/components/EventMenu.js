import React, { useState, useRef, useEffect } from 'react';

const EventMenu = ({ onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const handleClickOutside = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      setOpen(false);
    }
  };
  useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'absolute', top: '8px', right: '8px' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'white',
          fontSize: '24px',
          cursor: 'pointer',
          lineHeight: 1
        }}
      >
        ⋮
      </button>
      {open && (
        <div style={{
          position: 'absolute',
          right: 0,
          top: '100%',
          background: '#1e3a5f',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          zIndex: 10,
          minWidth: '120px'
        }}>
          <button
            style={{ display: 'block', width: '100%', background: 'none', border: 'none', color: 'white', padding: '8px 12px', cursor: 'pointer', textAlign: 'left' }}
            onClick={() => { setOpen(false); onEdit(); }}
          >
            Редактировать
          </button>
          <button
            style={{ display: 'block', width: '100%', background: 'none', border: 'none', color: '#f44336', padding: '8px 12px', cursor: 'pointer', textAlign: 'left' }}
            onClick={() => { setOpen(false); onDelete(); }}
          >
            Удалить
          </button>
        </div>
      )}
    </div>
  );
};

export default EventMenu;