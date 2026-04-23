import React from 'react';

const EventCard = ({ event, isRegistered, onRegister, onUnregister }) => {
  const isFull = event.available_seats === 0;
  const instituteName = event.institute_name || 'Все институты';

  return (
    <div className="card">
      <h3>{event.title}</h3>
      <p>{event.category_name} | {event.event_date} {event.event_time}</p>
      <p>{event.description}</p>
      <p>{instituteName}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
        <span>📍 {event.location}</span>
        <span>🎟️ {event.available_seats} / {event.capacity}</span>
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