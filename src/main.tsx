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
    console.log('Amplify configured successfully');
  } catch (error) {
    console.warn('Amplify configuration not found, app will work without backend features:', error);
    // Configure with minimal config to prevent errors
    Amplify.configure({
      aws_project_region: 'us-east-1',
    });
  }
}

configureAmplify();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 