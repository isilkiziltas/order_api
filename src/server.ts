import { createServer } from 'http';
import { app } from './app.js';
import { env } from './config/env.js';

const server = createServer(app);

server.listen(env.PORT, () => {
  console.log(`🚀 [${env.NODE_ENV}] Sunucu http://localhost:${env.PORT} üzerinde çalışıyor.`);
});

// Graceful Shutdown Mekanizması
const shutdown = (signal: string) => {
  console.log(`\n⚠️  ${signal} sinyali alındı. Sunucu kapatılıyor...`);
  server.close(() => {
    console.log('HTTP bağlantıları sonlandırıldı.');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('Kapanma zaman aşımına uğradı, zorla durduruluyor.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));