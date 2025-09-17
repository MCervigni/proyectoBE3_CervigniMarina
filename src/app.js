import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { config } from './config/config.js';
import { specs, swaggerUi } from './config/swagger.js';

mongoose.set('strictQuery', false);

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js';

const app = express();
const connection = mongoose.connect(config.MONGO_URL, {
  dbName: config.DB_NAME
});

app.use(express.json());
app.use(cookieParser());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/mocks', mocksRouter);

app.listen(config.PORT, () => console.log(`Listening on ${config.PORT}`));