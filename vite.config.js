import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Simple in-memory database for demo syncing
let demoPatients = {};

const mockBackendPlugin = () => ({
  name: 'mock-backend',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url.startsWith('/api/patients')) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          return res.end();
        }
        
        if (req.method === 'GET' && req.url === '/api/patients.json') {
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify(demoPatients));
        }

        if (req.method === 'PUT') {
          let body = '';
          req.on('data', chunk => body += chunk.toString());
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              // Extract ID from URL e.g. /api/patients/Name_Here.json
              const match = req.url.match(/\/api\/patients\/(.+)\.json/);
              if (match) {
                demoPatients[match[1]] = data;
              }
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true }));
            } catch(e) {
              res.statusCode = 400;
              res.end('Bad Request');
            }
          });
          return;
        }
      }
      next();
    });
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), mockBackendPlugin()],
  server: {
    allowedHosts: true
  }
})

