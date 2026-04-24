import React, { useState, useEffect } from 'react';
import { eventsApi, ticketsApi, categoriesApi, institutesApi } from '../api';
import EventCard from '../components/EventCard';
import CreateEventPage from '../pages/CreateEventPage';
import EditEventPage from '../pages/EditEventPage';
import StatsPage from '../pages/StatsPage';   // ← добавлен импорт
import '@maxhub/max-ui/dist/styles.css';
import { Textarea,Button, Container, Flex, SearchInput } from '@maxhub/max-ui';

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
  const [showCreate, setShowCreate] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [statsEvent, setStatsEvent] = useState(null);   // ← состояние для статистики

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
      await loadEvents();
      await loadTickets();
    } catch (error) {
      alert('❌ ' + (error.response?.data?.error || 'Ошибка отмены'));
    }
  };

  const isRegistered = (eventId) => registeredTickets.some(t => t.eventId === eventId);

  const refreshEvents = () => {
    loadEvents();
    loadTickets();
  };

  // Обработчики для кнопок меню
  const handleEdit = (event) => {
    setEditingEvent(event);
  };
  
  const handleDelete = async (event) => {
    if (!window.confirm(`Удалить мероприятие "${event.title}"?`)) return;
    try {
      await eventsApi.delete(event.id);
      refreshEvents();
    } catch (error) {
      alert('❌ ' + (error.response?.data?.error || 'Ошибка удаления'));
    }
  };

  const handleStats = (event) => {
    setStatsEvent(event);
  };

  // Если открыто создание
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

  // Если открыто редактирование
  if (editingEvent) {
    return (
      <EditEventPage
        event={editingEvent}
        onClose={() => setEditingEvent(null)}
        onSuccess={() => {
          refreshEvents();
          setEditingEvent(null);
        }}
      />
    );
  }

  // Если открыта статистика
  if (statsEvent) {
    return (
      <StatsPage
        event={statsEvent}
        onClose={() => setStatsEvent(null)}
      />
    );
  }

  // ========== Обычная афиша ==========
  return (
    <div>
      
      {/* Поле поиска */}
        <SearchInput
        type="text"
          defaultValue=""
          mode="secondary"
          value={search}
          placeholder="Поиск"
          onChange={(e) => setSearch(e.target.value)}

        />
        <Container 
        fullWidth="true"
        >
        <Flex
          direction="column"
          gap={12}
          style={{marginTop:"15px"}}
        >
      {/* Кнопки "Дополнительно" и "Добавить мероприятие" */}
      {role === 'admin' && (
          <Button
            appearance="neutral"
            mode="secondary"
            size="medium"
            onClick={() => setShowCreate(true)}
            stretched
          >
            Добавить
          </Button>
        )}
        <Button
          appearance="neutral"
          mode="secondary"
          size="medium"
          onClick={() => setShowFilters(!showFilters)}
          stretched
        >
          {showFilters ? 'Свернуть' : 'Дополнительные параметры'}
        </Button>
     </Flex>
</Container>

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
            role={role}
            onRegister={handleRegister}
            onUnregister={handleUnregister}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStats={handleStats}   // ← передаём обработчик
          />
        ))
      )}
    </div>
  );
};

export default AfishaPage;