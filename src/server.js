import express from 'express';
import http from 'http';
import { APIs } from './routes/index.js';
import { CONNECT_DB } from './config/mongodb.js';
import cookieParser from 'cookie-parser';
import { corsOptions } from './config/cors.js';
import cors from 'cors';
import { env } from './config/environment.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use('/', APIs);

app.get('/', (req, res) => {
  res.send('Hello World1');
});

const server = http.createServer(app);

(async () => {
  try {
    console.log('1. Connecting to MongoDB Cloud...');
    await CONNECT_DB();
    console.log('2. Connected to MongoDB Cloud ✅');

    // Lấy port và host
    const port = process.env.PORT || env.APP_PORT || 3000;
    const host =
      env.BUILD_MODE === 'production'
        ? (env.APP_HOST === 'localhost' ? '0.0.0.0' : env.APP_HOST)
        : env.APP_HOST || 'localhost';

    // Chỉ start server khi đã kết nối DB thành công
    server.listen(port, host, () => {
      console.log(`Hello ${env.AUTHOR}, I am running at http://${host}:${port}/`);
    });

  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    process.exit(1);
  }
})();
