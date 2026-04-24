import React, { useState, useEffect } from 'react';
import AfishaPage from './pages/AfishaPage';
import MyTicketsPage from './pages/MyTicketsPage';
import ProfilePage from './pages/ProfilePage';
import ScannerPage from './pages/ScannerPage';
import { usersApi } from './api';
import './styles.css';
import '@maxhub/max-ui/dist/styles.css';
import { Textarea,Button, Container, Flex, SearchInput } from '@maxhub/max-ui';

function App() {
  const [activeTab, setActiveTab] = useState('afisha');
  const [role, setRole] = useState(null);

  const loadRole = () => {
    usersApi.getMe()
      .then(data => setRole(data.user?.role))
      .catch(console.error);
  };

  useEffect(() => {
    loadRole();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'afisha': return <AfishaPage role={role} />;
      case 'tickets': return <MyTicketsPage />;
      case 'profile': return <ProfilePage onRoleChange={loadRole} />;
      case 'scanner': return <ScannerPage />;
      default: return <AfishaPage />;
    }
  };

  return (
    <div className="app">
      <div className="content">{renderContent()}</div>
      <Flex>
        <Button className={`tab ${activeTab === 'afisha' ? 'active' : ''}`} onClick={() => setActiveTab('afisha')}>
          Афиша
        </Button>
        <Button className={`tab ${activeTab === 'tickets' ? 'active' : ''}`} onClick={() => setActiveTab('tickets')}>
          Билеты
        </Button>
        <Button className={`tab ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
          Профиль
        </Button>
        {(role === 'moderator' || role === 'admin') && (
          <Button className={`tab ${activeTab === 'scanner' ? 'active' : ''}`} onClick={() => setActiveTab('scanner')}>
            Сканер
          </Button>
        )}
      </Flex>
    </div>
  );
}

export default App;