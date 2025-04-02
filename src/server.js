import express from 'express';
import { APIs } from './routes/index.js';
import { CONNECT_DB } from './config/mongodb.js';
import cookieParser from 'cookie-parser'
import { corsOptions } from './config/cors.js';
import cors from 'cors'
const app = express();


app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))
// Middleware
app.use('/', APIs);

app.get('/', (req, res) => {
  res.send('Hello World1');
});

// Kết nối MongoDB trước khi start server
(async () => {
  try {
    console.log('1. Connecting to MongoDB Cloud...');
    await CONNECT_DB();
    console.log('2. Connected to MongoDB Cloud ✅');

    // Chỉ start server sau khi kết nối DB thành công
    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    process.exit(1);
  }
})();
