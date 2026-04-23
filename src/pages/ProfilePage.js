import React, { useEffect, useState } from 'react';
import { usersApi } from '../api';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Пытаемся получить данные с сервера
    usersApi.getMe()
      .then(data => {
        setProfile(data.user);
        setLoading(false);
      })
      .catch(err => {
        console.error('Ошибка загрузки профиля:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="card">Загрузка профиля...</div>;

  if (!profile) {
    return <div className="card">Не удалось загрузить профиль. Возможно, вы не зарегистрированы в боте.</div>;
  }

  const roleMap = {
    student: 'Студент',
    teacher: 'Преподаватель',
    admin: 'Администратор',
    moderator: 'Модератор',
  };
  const roleText = roleMap[profile.role] || profile.role;

  return (
    <div className="card">
      <h3>👤 Профиль</h3>
      <p><strong>ФИО:</strong> {profile.full_name || 'не указано'}</p>
      <p><strong>Институт:</strong> {profile.institute || 'не указан'}</p>
      <p><strong>Группа:</strong> {profile.group_name || 'не указана'}</p>
      <p><strong>Статус:</strong> {roleText}</p>
      <p><strong>ID:</strong> {profile.user_id}</p>
    </div>
  );
};

export default ProfilePage;