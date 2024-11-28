import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './i18n';
import './index.css';
import 'leaflet/dist/leaflet.css';
import './styles/leaflet.css';
import App from './App';
import { CircularProgress, Box } from '@mui/material';
import reportWebVitals from './reportWebVitals';
import './services/mockApi'; // Import du mock API

const LoadingFallback = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
    </Box>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Suspense fallback={<LoadingFallback />}>
      <App />
    </Suspense>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
