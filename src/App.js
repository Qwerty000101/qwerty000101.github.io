import React, { useState, useEffect } from 'react';
import AfishaPage from './pages/AfishaPage';
import MyTicketsPage from './pages/MyTicketsPage';
import ProfilePage from './pages/ProfilePage';
import ScannerPage from './pages/ScannerPage';
import { usersApi } from './api';
import './styles.css';

function App() {
  const [activeTab, setActiveTab] = useState('afisha');
  const [role, setRole] = useState(null);

  useEffect(() => {
    usersApi.getMe()
      .then(data => setRole(data.user?.role))
      .catch(console.error);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'afisha': return <AfishaPage role={role} />;
      case 'tickets': return <MyTicketsPage />;
      case 'profile': return <ProfilePage />;
      case 'scanner': return <ScannerPage />;
      default: return <AfishaPage />;
    }
  };

  return (
    <div className="app">
      <div className="content">{renderContent()}</div>
      <div className="tabbar">
        <button className={`tab ${activeTab === 'afisha' ? 'active' : ''}`} onClick={() => setActiveTab('afisha')}>
          Афиша
        </button>
        <button className={`tab ${activeTab === 'tickets' ? 'active' : ''}`} onClick={() => setActiveTab('tickets')}>
          Билеты
        </button>
        <button className={`tab ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
          Профиль
        </button>
        {(role === 'moderator' || role === 'admin' || role === 'teacher') && (
          <button className={`tab ${activeTab === 'scanner' ? 'active' : ''}`} onClick={() => setActiveTab('scanner')}>
            Сканер
          </button>
        )}
      </div>
    </div>
  );
}

export default App;