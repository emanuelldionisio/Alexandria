import express from 'express'

import { usuario } from './data/usuario.js'
import { segue } from './data/segue.js'
import { palavra_usuario } from './data/palavra_usuario.js'
import { disco } from './data/disco.js'
import { livro } from './data/livro.js'
import { avaliacao_disco } from './data/avaliacao_disco.js'
import { avaliacao_livro } from './data/avaliacao_livro.js'

const router = express.Router()

class HttpError extends Error {
    constructor(message, code=400) {
        super(message);
        this.code = code;
    }
}

router.get('/usuario', (req, res) => {
    const id_user = req.query.id_user;
    if (!id_user) {
        return res.json(usuario)
    } 
    if (! usuario.find(obj => obj.cod == id_user)) {
        throw new HttpError('Usuário não existe ;-;'); 
    }
    return res.json(usuario.find(obj => obj.cod == id_user));
});

router.get('/segue', (req, res) => {
    const id_user = req.query.id_user;
    if (!id_user) {
        return res.json(segue);
    }
    return res.json(segue.filter(obj => obj.seguido == id_user || obj.seguinte == id_user));
});

router.get('/palavra_usuario', (req, res) => {
    const id_user = req.query.id_user;
    if (!id_user) {
        return res.json(palavra_usuario);
    }
    return res.json(palavra_usuario.filter(obj => obj.usuario == id_user));
});

router.get('/disco', (req, res) => {
    const id_user = req.query.id_user;
    if (!id_user) {
        return res.json(disco);
    }
    return res.json(disco.filter(obj => obj.id_usuario == id_user));
});

router.get('/livro', (req, res) => {
    const id_user = req.query.id_user;
    if (!id_user) {
        return res.json(livro);
    }
    return res.json(livro.filter(obj => obj.id_usuario == id_user));
});

router.get('/avaliacao_disco', (req, res) => {
    const id_user = req.query.id_user;
    if (!id_user) {
        return res.json(avaliacao_disco);
    }
    return res.json(avaliacao_disco.filter(obj => disco.find(obj2 => obj2.id_prod == obj.id_prod && obj2.id_usuario == id_user)));
});

router.get('/avaliacao_livro', (req, res) => {
    const id_user = req.query.id_user;
    if (!id_user) {
        return res.json(avaliacao_livro);
    }
    return res.json(avaliacao_livro.filter(obj => livro.find(obj2 => obj2.id_prod == obj.id_prod && obj2.id_usuario == id_user)));
});


export default router;