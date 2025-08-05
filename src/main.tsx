import React from 'react';
import ReactDOM from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import 'gridstack/dist/gridstack.min.css';
import './styles.css';
import App from './App';

// Import Amplify configuration
async function configureAmplify() {
  try {
    const config = await import('../amplify_outputs.json');
    Amplify.configure(config.default);
  } catch (error) {
    console.warn('Amplify configuration not found:', error);
  }
}

configureAmplify();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 