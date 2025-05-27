import 'express-async-errors';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import router from './router.js';

const server = express();

server.use(morgan('tiny'));

server.use(express.static('public'));
server.use(express.json());
server.use('/data', router);

server.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
}
);
