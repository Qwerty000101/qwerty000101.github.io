import React, { useEffect, useState } from 'react';

const ProfilePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (window.WebApp) {
      const initData = window.WebApp.initDataUnsafe;
      setUser(initData?.user);
    }
  }, []);

  if (!user) {
    return <div className="card">Загрузка профиля...</div>;
  }

  return (
    <div className="card">
      <h3>👤 Профиль</h3>
      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>Имя:</strong> {user.first_name} {user.last_name}</p>
      <p><strong>Username:</strong> @{user.username}</p>
      <p><strong>Язык:</strong> {user.language_code}</p>
      {user.photo_url && (
        <img src={user.photo_url} alt="Аватар" style={{ width: 80, borderRadius: '50%', marginTop: 8 }} />
      )}
    </div>
  );
};

export default ProfilePage;