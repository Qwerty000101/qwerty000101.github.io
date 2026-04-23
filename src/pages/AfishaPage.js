import React, { useState, useEffect } from 'react';
import { eventsApi, ticketsApi, categoriesApi, institutesApi } from '../api';
import EventCard from '../components/EventCard';
import CreateEventPage from '../pages/CreateEventPage'; // ✅ полноэкранная форма

const AfishaPage = ({ role }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [institute, setInstitute] = useState('');
  const [registeredTickets, setRegisteredTickets] = useState([]);
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [showCreate, setShowCreate] = useState(false); // ← управление всей страницей создания

  // Загрузка категорий
  useEffect(() => {
    categoriesApi.getList()
      .then(data => setCategories(data.categories || []))
      .catch(err => console.error('Ошибка загрузки категорий:', err));
  }, []);

  // Загрузка институтов
  useEffect(() => {
    institutesApi.getList()
      .then(data => setInstitutes(data.institutes || []))
      .catch(err => console.error('Ошибка загрузки институтов:', err));
  }, []);

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

  const loadTickets = async () => {
    try {
      const data = await ticketsApi.getMy();
      const tickets = data.tickets || [];
      const registered = tickets
        .filter(t => t.event_id != null)
        .map(t => ({ eventId: t.event_id, uuid: t.uuid }));
      setRegisteredTickets(registered);
    } catch (error) {
      console.error('Ошибка загрузки билетов:', error);
    }
  };

  useEffect(() => {
    loadEvents();
    loadTickets();
  }, [category, institute]);

  const filteredEvents = search.trim()
    ? events.filter(event =>
        event.title.toLowerCase().includes(search.toLowerCase())
      )
    : events;

  const handleRegister = async (eventId) => {
    try {
      await eventsApi.register(eventId);
      //alert('✅ Вы успешно зарегистрированы! Билет отправлен в бот.');
      await loadEvents();
      await loadTickets();
    } catch (error) {
      alert('❌ ' + (error.response?.data?.error || 'Ошибка регистрации'));
    }
  };

  const handleUnregister = async (eventId) => {
    const ticket = registeredTickets.find(t => t.eventId === eventId);
    if (!ticket) return;
    if (!window.confirm('Отменить регистрацию на это мероприятие?')) return;
    try {
      await ticketsApi.cancel(ticket.uuid);
      //alert('✅ Регистрация отменена');
      await loadEvents();
      await loadTickets();
    } catch (error) {
      alert('❌ ' + (error.response?.data?.error || 'Ошибка отмены'));
    }
  };

  const isRegistered = (eventId) => registeredTickets.some(t => t.eventId === eventId);

  const refreshEvents = () => {
    loadEvents();
  };

  // ========== Показываем страницу создания, если showCreate = true ==========
  if (showCreate) {
    return (
      <CreateEventPage
        onClose={() => setShowCreate(false)}
        onSuccess={() => {
          refreshEvents();
          setShowCreate(false);
        }}
      />
    );
  }

  // ========== Обычная афиша ==========
  return (
    <div>
      {/* Поле поиска */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Поиск"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', padding: '10px', background:"#132a41",color:"white", marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd'}}
        />
      </div>

      {/* Кнопки "Дополнительно" и "Добавить мероприятие" */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <button
          className="btn"
          onClick={() => setShowFilters(!showFilters)}
          style={{ flex: 1, background: '#4a8fe7' }}
        >
          {showFilters ? 'Свернуть' : 'Дополнительные параметры'}
        </button>
        {role === 'admin' && (
          <button
            className="btn"
            onClick={() => setShowCreate(true)}
            style={{ background: '#2e7d32' }}
          >
            Добавить
          </button>
        )}
      </div>

      {/* Расширенные фильтры */}
      {showFilters && (
        <div className="filters">
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Все категории</option>
            {categories.map(c => (
              <option key={c.key} value={c.key}>{c.name}</option>
            ))}
          </select>
          <select value={institute} onChange={(e) => setInstitute(e.target.value)}>
            <option value="">Все институты</option>
            {institutes.map(inst => (
              <option key={inst.key} value={inst.key}>{inst.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Список мероприятий */}
      {loading ? (
        <div className="spinner"></div>
      ) : filteredEvents.length === 0 ? (
        <div className="empty-message">Мероприятий не найдено</div>
      ) : (
        filteredEvents.map(event => (
          <EventCard
            key={event.id}
            event={event}
            isRegistered={isRegistered(event.id)}
            onRegister={handleRegister}
            onUnregister={handleUnregister}
          />
        ))
      )}
    </div>
  );
};

export default AfishaPage;