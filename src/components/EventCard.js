import React from 'react';

const EventCard = ({ event, onRegister }) => {
  const isFull = event.available_seats === 0;

  return (
    <div className="card">
      <h3>{event.title}</h3>
      <p>{event.category} | {event.event_date} {event.event_time}</p>
      <p>{event.description}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
        <span>📍 {event.location}</span>
        <span>🎟️ {event.available_seats} / {event.capacity}</span>
      </div>
      <button
        className="btn"
        disabled={isFull}
        onClick={() => onRegister(event.id)}
      >
        {isFull ? 'Мест нет' : 'Зарегистрироваться'}
      </button>
    </div>
  );
};

export default EventCard;