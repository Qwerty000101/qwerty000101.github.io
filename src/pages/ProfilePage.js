import React, { useEffect, useState } from 'react';
import { usersApi } from '../api';
import EditProfilePage from './EditProfilePage';

const ProfilePage = ({ onRoleChange }) => {
  const [profile, setProfile] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const fetchProfile = () => {
    setLoading(true);
    usersApi.getMe()
      .then(data => {
        setProfile(data.user);
        setLoading(false);
      })
      .catch(err => {
        console.error('Ошибка загрузки профиля:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProfile();
    if (window.WebApp?.initDataUnsafe?.user?.photo_url) {
      setPhotoUrl(window.WebApp.initDataUnsafe.user.photo_url);
    }
  }, []);

  if (loading) return <div className="card">Загрузка профиля...</div>;
  if (!profile) return <div className="card">Не удалось загрузить профиль.</div>;

  if (editing) {
    return (
      <EditProfilePage
        profile={profile}
        onClose={() => setEditing(false)}
        onSuccess={() => {
          fetchProfile();
          if (onRoleChange) onRoleChange(); // уведомить App о возможной смене роли
        }}
      />
    );
  }

  const roleMap = { student: 'Студент', admin: 'Администратор', moderator: 'Модератор' };
  const roleText = roleMap[profile.role] || profile.role;

  return (
    <div className="card">
      <h3>Профиль</h3>
      {photoUrl && <img src={photoUrl} alt="Аватар" style={{ width: 80, borderRadius: '50%', marginBottom: 8 }} />}
      <p><strong>ФИО:</strong> {profile.full_name || 'не указано'}</p>
      <p><strong>Институт:</strong> {profile.institute_name || 'не указан'}</p>
      {profile.group_name && <p><strong>Группа:</strong> {profile.group_name}</p>}
      <p><strong>Статус:</strong> {roleText}</p>
      <p><strong>ID:</strong> {profile.user_id}</p>
      <button className="btn" onClick={() => setEditing(true)} style={{ marginTop: '12px' }}>
        Изменить профиль
      </button>
    </div>
  );
};

export default ProfilePage;