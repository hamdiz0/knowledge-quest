import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import httpProxy from 'http-proxy';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 80;

const useInternalApi = process.env.VITE_USE_INTERNAL_API === 'true';
const externalApiBase = process.env.VITE_EXTERNAL_API_BASE;
const internalApiBase = process.env.VITE_INTERNAL_API_BASE;
const targetUrl = useInternalApi ? internalApiBase : externalApiBase;

const apiProxy = httpProxy.createProxyServer();

app.use('/api', (req, res) => {
  apiProxy.web(req, res, { target: targetUrl }, (error) => {
    console.error('Proxy error:', error);
    res.status(500).send('Proxy error');
  });
});

app.use(express.static(path.join(__dirname, 'dist')));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`api url : ${targetUrl}`);
});