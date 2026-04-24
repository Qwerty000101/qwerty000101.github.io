import React, { useState, useEffect } from 'react';
import { eventsApi, categoriesApi, institutesApi } from '../api';
import '@maxhub/max-ui/dist/styles.css';
import { Textarea, Button, Container, Panel, SearchInput, Form } from '@maxhub/max-ui';

const EditEventPage = ({ event, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    title: event.title || '',
    description: event.description || '',
    category: event.category || '',
    institute_filter: event.institute_filter || '',
    event_date: event.event_date || '',
    event_time: event.event_time || '',
    location: event.location || '',
    capacity: event.capacity ? String(event.capacity) : ''
  });
  const [categories, setCategories] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    categoriesApi.getList().then(res => setCategories(res.categories || []));
    institutesApi.getList().then(res => setInstitutes(res.institutes || []));
  }, []);

  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleUpdate = async () => {
    if (!form.title || !form.event_date || !form.event_time || !form.capacity) {
      setError('Название, дата, время и количество мест обязательны');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await eventsApi.update({ id: event.id, ...form });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка обновления');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    padding: '8px',
    borderRadius: '4px',
    width: '100%',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500'
  };

  return (
    <div className="create-event-page">
      <div className="create-event-header">
        <button onClick={onClose} className="btn" style={{ width: '20%' }}>&larr;</button>
        <h3>Редактирование</h3>
      </div>

      {error && <div className="error-message">{error}</div>}

      <Panel>
        <label style={labelStyle}>Название</label>
        <input
          type="text"
          value={form.title}
          onChange={e => updateField('title', e.target.value)}
          className="modal-input"
          style={inputStyle}
        />

        <label style={labelStyle}>Описание</label>
        <textarea
          value={form.description}
          onChange={e => updateField('description', e.target.value)}
          className="modal-textarea"
          style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
        />

        <label style={labelStyle}>Категория</label>
        <select
          value={form.category}
          onChange={e => updateField('category', e.target.value)}
          className="modal-input"
          style={inputStyle}
        >
          <option value="">Выберите категорию</option>
          {categories.map(c => (
            <option key={c.key} value={c.key}>{c.name}</option>
          ))}
        </select>

        <label style={labelStyle}>Институт</label>
        <select
          value={form.institute_filter}
          onChange={e => updateField('institute_filter', e.target.value)}
          className="modal-input"
          style={inputStyle}
        >
          <option value="">Все институты</option>
          {institutes.map(inst => (
            <option key={inst.key} value={inst.key}>{inst.name}</option>
          ))}
        </select>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Дата</label>
            <input
              type="date"
              value={form.event_date}
              onChange={e => updateField('event_date', e.target.value)}
              className="modal-input"
              style={inputStyle}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Время</label>
            <input
              type="time"
              value={form.event_time}
              onChange={e => updateField('event_time', e.target.value)}
              className="modal-input"
              style={inputStyle}
            />
          </div>
        </div>

        <label style={labelStyle}>Место</label>
        <input
          type="text"
          value={form.location}
          onChange={e => updateField('location', e.target.value)}
          className="modal-input"
          style={inputStyle}
        />

        <label style={labelStyle}>Количество мест</label>
        <input
          type="number"
          value={form.capacity}
          onChange={e => updateField('capacity', e.target.value)}
          className="modal-input"
          style={inputStyle}
        />
      </Panel>

      <button
        className="btn primary"
        onClick={handleUpdate}
        disabled={loading}
        style={{ marginTop: '16px' }}
      >
        {loading ? 'Сохранение...' : 'Сохранить'}
      </button>
    </div>
  );
};

export default EditEventPage;