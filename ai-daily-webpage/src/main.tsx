import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Build-time/runtime assertion: prevent mock auth in production
if (import.meta.env.PROD && import.meta.env.VITE_USE_MOCK_AUTH === 'true') {
  // eslint-disable-next-line no-console
  console.error('[SECURITY] VITE_USE_MOCK_AUTH must be false in production.');
  throw new Error('SECURITY: Mock auth is enabled in production');
}

createRoot(document.getElementById("root")!).render(<App />);
