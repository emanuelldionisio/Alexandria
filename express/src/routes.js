import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import express from 'express';

import { isAuthenticated } from './middleware/auth.js'

import Palavra from './models/palavra_chave.js'
import Usuario from './models/usuario.js'
import Segue from './models/segue.js'
import PalavraUsuario from './models/palavra_usuario.js'
import Produto from './models/produto.js'
import Avaliacao from './models/avaliacao.js'
import Denuncia from './models/denuncia.js'
import Desejo from './models/desejos.js';
import carrinho from './models/carrinho.js';
import segue from './models/segue.js';
import produto from './models/produto.js';


/*
 import { segue } from './data/segue.js'
 import { palavra_usuario } from './data/palavra_usuario.js'
 import { disco } from './data/disco.js'
 import { livro } from './data/livro.js'
 import { avaliacao_disco } from './data/avaliacao_disco.js'
 import { avaliacao_livro } from './data/avaliacao_livro.js'
*/

const router = express.Router()

class HttpError extends Error {
    constructor(message, code=400) {
        super(message);
        this.code = code;
    }
}

router.post('/api/usuario', async (req, res) => {
    try {
        const user = req.body;       
        const newUser = await Usuario.create(user);
        res.status(201).json(newUser);
    } catch (error) {
        throw new HTTPError('Unable to create user', 400);
    }
});



router.get('/mediaavaliacao', isAuthenticated, async (req, res) => {
    const id_user = req.userId;
    if (!id_user) {
        throw new HttpError('Faltam parâmetros: id_user', 400);
    }
    const media = await Avaliacao.readMediaUsuario(id_user);
    return res.json(media);
});

router.get("/palavras/me", isAuthenticated, async (req, res) => {
    const id_user = req.userId;
    const media = await Avaliacao.readMediaUsuario(id_user);
    return res.json(media);
});

router.get("/seguidores/me", isAuthenticated, async (req, res) => {
    const id_user = req.userId;
    const seguidores = await Segue.readSeguidores(id_user);
    return res.json(seguidores);
});

router.get("/seguidos/me", isAuthenticated, async (req, res) => {
    const id_user = req.userId;
    const seguidos = await Segue.readSeguidos(id_user);
    return res.json(seguidos);
});

router.get("/produtos/me", isAuthenticated, async (req, res) => {
    const id_user = req.userId;
    const produtos = await Produto.readByUsuario(id_user, "incluir");
    return res.json(produtos);
});

router.get

export default router;