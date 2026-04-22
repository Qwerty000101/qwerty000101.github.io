import React, { useState, useEffect } from 'react';
import { eventsApi } from '../api';
import EventCard from '../components/EventCard';

const AfishaPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [institute, setInstitute] = useState('');

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await eventsApi.getList({ category, institute });
      setEvents(data.events || []);
    } catch (error) {
      console.error('Ошибка загрузки мероприятий:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [category, institute]);

  const handleRegister = async (eventId) => {
    try {
      await eventsApi.register(eventId);
      alert('✅ Вы успешно зарегистрированы! Билет отправлен в бот.');
      loadEvents();
    } catch (error) {
      alert('❌ ' + (error.response?.data?.error || 'Ошибка регистрации'));
    }
  };

  return (
    <div>
      <div className="filters">
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Все категории</option>
          <option value="sport">Спорт</option>
          <option value="science">Наука</option>
          <option value="culture">Культура</option>
        </select>
        <select value={institute} onChange={(e) => setInstitute(e.target.value)}>
          <option value="">Все институты</option>
          <option value="ИИТ">ИИТ</option>
          <option value="ИЭИ">ИЭИ</option>
          <option value="ЮИ">ЮИ</option>
        </select>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : events.length === 0 ? (
        <div className="empty-message">Мероприятий не найдено</div>
      ) : (
        events.map(event => (
          <EventCard key={event.id} event={event} onRegister={handleRegister} />
        ))
      )}
    </div>
  );
};

export default AfishaPage;