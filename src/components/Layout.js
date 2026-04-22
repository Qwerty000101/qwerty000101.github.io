import React from 'react';
import { Tabs, Tabbar, TabbarItem } from '@maxhub/max-ui';

const Layout = ({ children, activeTab, onTabChange }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
        {children}
      </div>
      <Tabbar>
        <TabbarItem
          selected={activeTab === 'afisha'}
          onClick={() => onTabChange('afisha')}
        >
          🎟️ Афиша
        </TabbarItem>
        <TabbarItem
          selected={activeTab === 'tickets'}
          onClick={() => onTabChange('tickets')}
        >
          🎫 Билеты
        </TabbarItem>
        <TabbarItem
          selected={activeTab === 'profile'}
          onClick={() => onTabChange('profile')}
        >
          👤 Профиль
        </TabbarItem>
      </Tabbar>
    </div>
  );
};

export default Layout;