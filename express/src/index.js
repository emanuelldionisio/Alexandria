import 'express-async-errors';
import express from 'express';
import morgan from 'morgan';
import router from './routes.js';
import 'dotenv/config';
import { is } from 'zod/locales';
import multer from 'multer';
//import Seed from './database/seeders.js';

const server = express();

server.use(morgan('tiny'));

server.use(express.static('public'));

server.use(express.urlencoded({ extended: true }));

server.use(express.json());
server.use('/api', router);

server.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
}
);
