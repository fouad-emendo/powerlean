import React from 'react';
import ReactDOM from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import './styles.css';
import App from './App';

// Import Amplify configuration
try {
  const config = require('../amplify_outputs.json');
  Amplify.configure(config);
} catch (error) {
  console.warn('Amplify configuration not found:', error);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 