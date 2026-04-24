import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { eventsApi } from '../api';

const StatsPage = ({ event, onClose }) => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Участники
  const [participants, setParticipants] = useState([]);
  const [showParticipants, setShowParticipants] = useState(false);
  const [search, setSearch] = useState('');

  // Загрузка статистики
  useEffect(() => {
    eventsApi.stats(event.id)
      .then(data => setStats(data.stats))
      .catch(err => setError(err.response?.data?.error || 'Ошибка загрузки'))
      .finally(() => setLoading(false));
  }, [event.id]);

  const handleExport = async () => {
    try {
      await eventsApi.exportXlsx(event.id);
      alert('Файл отправлен в чат с ботом');
    } catch (err) {
      alert('Ошибка экспорта: ' + (err.response?.data?.error || err.message));
    }
  };

  const toggleParticipants = async () => {
    if (showParticipants) {
      setShowParticipants(false);
      return;
    }
    // Загружаем список, если ещё не загружен
    try {
      if (participants.length === 0) {
        const data = await eventsApi.participants(event.id);
        setParticipants(data.participants || []);
      }
      setShowParticipants(true);
    } catch (err) {
      alert('Ошибка загрузки участников: ' + (err.response?.data?.error || err.message));
    }
  };

  const filteredParticipants = search.trim()
    ? participants.filter(p =>
        p.full_name.toLowerCase().includes(search.toLowerCase())
      )
    : participants;

  const inputStyle = {
    padding: '8px',
    borderRadius: '4px',
    width: '100%',
    boxSizing: 'border-box'
  };

  if (loading) return <div className="spinner" />;
  if (error) return <div className="empty-message">Ошибка: {error}</div>;
  if (!stats) return null;

  const { total_seats, available_seats, registered, checked_in } = stats;

  return (
    <div className="create-event-page">
      <div className="create-event-header">
        <button onClick={onClose} className="btn" style={{ width: '20%' }}>&larr;</button>
        <h3>Статистика: {event.title}</h3>
      </div>

      <div className="card">
        <p>Зарегистрировалось: {registered}</p>
        <p>Зарегистрировалось и пришло: {checked_in}</p>
        <p>Всего мест: {total_seats} (свободно: {available_seats})</p>
      </div>

      {/* Кнопки действий */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
        <button className="btn primary" onClick={handleExport} style={{ flex: 1 }}>
          Экспорт в XLSX
        </button>
        <button className="btn" onClick={toggleParticipants} style={{ flex: 1, background: '#4a8fe7' }}>
          {showParticipants ? 'Свернуть' : 'Список участников'}
        </button>
      </div>

      {/* Список участников с поиском */}
      {showParticipants && (
        <div style={{ marginTop: '16px' }}>
          <input
            type="text"
            placeholder="Поиск по ФИО"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ ...inputStyle, marginBottom: '12px' }}
          />
          {filteredParticipants.length === 0 ? (
            <div className="empty-message">Участники не найдены</div>
          ) : (
            <div>
              {filteredParticipants.map((p, idx) => (
                <div key={idx} className="card" style={{ marginBottom: '8px' }}>
                  <p><strong>{p.full_name}</strong></p>
                  <p>Институт: {p.institute_name || '-'}, Группа: {p.group_name || '-'}</p>
                  <p>Статус: {p.status === 'registered' ? 'Зарегистрировался' : 'Пришёл'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StatsPage;