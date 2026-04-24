import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@maxhub/max-ui/dist/styles.css';
import { MaxUI } from '@maxhub/max-ui';
import { createRoot } from 'react-dom/client';

const Root = () => (
    <MaxUI>
        <App />
    </MaxUI>
)

createRoot(document.getElementById('root')).render(<Root />);