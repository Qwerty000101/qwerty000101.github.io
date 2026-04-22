import React, { useState } from 'react';
import AfishaPage from './pages/AfishaPage';
import MyTicketsPage from './pages/MyTicketsPage';
import ProfilePage from './pages/ProfilePage';
import './styles.css';

function App() {
  const [activeTab, setActiveTab] = useState('afisha');

  const renderContent = () => {
    switch (activeTab) {
      case 'afisha': return <AfishaPage />;
      case 'tickets': return <MyTicketsPage />;
      case 'profile': return <ProfilePage />;
      default: return <AfishaPage />;
    }
  };

  return (
    <div className="app">
      <div className="content">
        {renderContent()}
      </div>
      <div className="tabbar">
        <button 
          className={`tab ${activeTab === 'afisha' ? 'active' : ''}`}
          onClick={() => setActiveTab('afisha')}
        >
          🎟️ Афиша
        </button>
        <button 
          className={`tab ${activeTab === 'tickets' ? 'active' : ''}`}
          onClick={() => setActiveTab('tickets')}
        >
          🎫 Билеты
        </button>
        <button 
          className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          👤 Профиль
        </button>
      </div>
    </div>
  );
}

export default App;