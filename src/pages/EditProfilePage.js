import React, { useState, useEffect } from 'react';
import { usersApi, institutesApi } from '../api';

const EditProfilePage = ({ profile, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    full_name: profile.full_name || '',
    institute: profile.institute || '',
    role: profile.role || 'student',
    group_name: profile.group_name || ''
  });
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    institutesApi.getList().then(res => setInstitutes(res.institutes || []));
  }, []);

  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    if (!form.full_name) {
      setError('ФИО обязательно');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await usersApi.updateProfile(form);
      onSuccess(); // сообщить ProfilePage, что профиль обновлён
      onClose();   // закрыть редактирование
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка обновления');
    } finally {
      setLoading(false);
    }
  };

  // Стили как в CreateEventPage
  const inputStyle = {
    backgroundColor: "#0A1724",
    color: 'white',
    border: '1px solid #666',
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
        <h3>Редактирование профиля</h3>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="card">
        <label style={labelStyle}>ФИО</label>
        <input
          type="text"
          placeholder="Ваше ФИО"
          value={form.full_name}
          onChange={e => updateField('full_name', e.target.value)}
          style={inputStyle}
        />

        <label style={labelStyle}>Институт</label>
        <select
          value={form.institute}
          onChange={e => updateField('institute', e.target.value)}
          style={inputStyle}
        >
          <option value="">Не указан</option>
          {institutes.map(inst => (
            <option key={inst.key} value={inst.key}>{inst.name}</option>
          ))}
        </select>

        <label style={labelStyle}>Статус</label>
        <select
          value={form.role}
          onChange={e => updateField('role', e.target.value)}
          style={inputStyle}
        >
          <option value="student">Студент</option>
          <option value="admin">Администратор</option>
        </select>

        {form.role === 'student' && (
          <>
            <label style={labelStyle}>Группа</label>
            <input
              type="text"
              placeholder="Номер группы"
              value={form.group_name}
              onChange={e => updateField('group_name', e.target.value)}
              style={inputStyle}
            />
          </>
        )}
      </div>

      <button
        className="btn primary"
        onClick={handleSave}
        disabled={loading}
        style={{ marginTop: '16px' }}
      >
        {loading ? 'Сохранение...' : 'Сохранить изменения'}
      </button>
    </div>
  );
};

export default EditProfilePage;