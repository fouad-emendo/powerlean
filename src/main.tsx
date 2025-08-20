import React from 'react';
import ReactDOM from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import 'gridstack/dist/gridstack.min.css';
import './styles.css';
import App from './App';

async function configureAmplify() {
  try {
    const response = await fetch('/amplify_outputs.json');
    if (response.ok) {
      const config = await response.json();
      Amplify.configure(config);
      console.log('Amplify configured successfully');
    } else {
      throw new Error('Config file not found');
    }
  } catch (error) {
    console.warn('Amplify configuration not found, app will work without backend features:', error);
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