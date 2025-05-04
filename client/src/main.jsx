import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Provider } from 'react-redux';
import { store } from './redux/store.js';
import { FileProvider } from './context/FileContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <FileProvider>
        <App />
      </FileProvider>
    </Provider>
  </StrictMode>
);
