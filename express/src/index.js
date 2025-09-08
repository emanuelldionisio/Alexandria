import 'express-async-errors';
import express from 'express';
import morgan from 'morgan';
import router from './routes.js';
import 'dotenv/config';
//import Seed from './database/seeders.js';

const server = express();

server.use(morgan('tiny'));

server.use(express.static('public'));

server.use(express.json());
server.use('/api', router);

server.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
}
);
