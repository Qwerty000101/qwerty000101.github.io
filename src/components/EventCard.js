import React, { useState, useRef, useEffect } from 'react';

const EventCard = ({ event, isRegistered, onRegister, onUnregister, role, onEdit, onDelete, onStats }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const isFull = event.available_seats === 0;
  const instituteName = event.institute_name || 'Все институты';
  const isAdmin = role === 'admin';

  // Закрытие меню при клике вне
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="card" style={{ position: 'relative' }}>
      {/* Кнопка меню для админа */}
      {isAdmin && (
        <div ref={menuRef} style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#fff',
              lineHeight: 1,
              padding: '4px 8px',
              borderRadius: '50%',
            }}
          >
            ⋮
          </button>
          {menuOpen && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '100%',
                background: '#1e293b',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                overflow: 'hidden',
                minWidth: '140px',
              }}
            >
              <button
                onClick={() => { setMenuOpen(false); onEdit(event); }}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '10px 16px',
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                Редактировать
              </button>
              <button
                onClick={() => { setMenuOpen(false); onStats(event); }}   // ← вызов onStats
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '10px 16px',
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                Статистика
              </button>
              <button
                onClick={() => { setMenuOpen(false); onDelete(event); }}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '10px 16px',
                  background: 'none',
                  border: 'none',
                  color: '#ff6b6b',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                Удалить
              </button>
            </div>
          )}
        </div>
      )}

      <h3 style={{ paddingRight: isAdmin ? '36px' : '0' }}>{event.title}</h3>
      <p>{event.category_name} | {event.event_date} {event.event_time}</p>
      <p>{event.description}</p>
      <p>🏛️ {instituteName}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
        <span>📍 {event.location}</span>
        <span>Мест: {event.available_seats} / {event.capacity}</span>
      </div>

      {isRegistered ? (
        <button
          className="btn"
          style={{ background: '#B22222', color: 'white' }}
          onClick={() => onUnregister(event.id)}
        >
          Отменить запись
        </button>
      ) : (
        <button
          className="btn"
          disabled={isFull}
          onClick={() => onRegister(event.id)}
        >
          {isFull ? 'Мест нет' : 'Зарегистрироваться'}
        </button>
      )}
    </div>
  );
};

export default EventCard;