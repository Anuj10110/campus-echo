import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import os from 'os'

// Get local IP address for network access
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const localIP = getLocalIP();
const backendHost = process.env.VITE_BACKEND_HOST || localIP;
const backendPort = process.env.VITE_BACKEND_PORT || 5000;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Listen on all interfaces for network access
    // Allow the frontend to call the backend via same-origin /api requests in dev.
    // This also makes auth cookies work cleanly (no cross-origin headaches).
    proxy: {
      '/api': {
        target: `http://${backendHost}:${backendPort}`,
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
