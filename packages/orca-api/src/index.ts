import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import passport from 'passport';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import routes from './routes';
import socket from './socket';
import { initDb } from './db';
import { initPassport } from './authentication';
import fileUpload from 'express-fileupload';

initDb();
initPassport();

const app = express();
const httpServer = createServer(app);

app.use(fileUpload());
app.use(compression());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => res.send('OK'));
app.use('/', routes);

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
});

socket(httpServer);

const PORT = process.env.PORT || process.env.API_PORT;
httpServer.listen({ port: PORT }, () => {
  console.log(`httpServer ready at http://localhost:${PORT}`);
});


// Graceful Shutdown
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

function shutdown() {
  console.log('🔻 Shutting down...');
  httpServer.close(() => {
    console.log('🔌 HTTP server closed');
    process.exit(0);
  });
}
