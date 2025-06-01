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

router.get("/emaid/:email", (req, res) =>{
    const email = req.params.email;
    const identificacao = usuario.find(user=>user.email==email)
    if (!identificacao) throw new HttpError ("ERRO: Usuário não identificado.")
    return res.json(identificacao)
})

router.get('/segue', (req, res) => {
    const id_user = req.query.id_user;
    if (!id_user) {
        return res.json(segue);
    }
    return res.json(segue.filter(obj => obj.seguido == id_user || obj.seguinte == id_user));
});

router.delete('/segue', (req, res) => {
    const { seguido, seguinte } = req.body;
    if (!seguido || !seguinte) {
        throw new HttpError('Faltam parâmetros: seguido e/ou seguinte', 400);
    }
    const index = segue.findIndex(obj => obj.seguido == seguido && obj.seguinte == seguinte);
    if (!segue[index]) {
        throw new HttpError('Relação de seguimento não encontrada', 404);
    }
    segue.splice(index, 1);
    return res.sendStatus(204);
});

router.post('/segue', (req, res) => {
    const { seguido, seguinte } = req.body;
    if (seguido == seguinte) {
        throw new HttpError('Não é possível seguir a si mesmo', 400);
    }
    if (!seguido || !seguinte) {
        throw new HttpError('Faltam parâmetros: seguido e/ou seguinte', 400);
    }
    if (segue.find(obj => obj.seguido == seguido && obj.seguinte == seguinte)) {
        throw new HttpError('Relação de seguimento já existe', 409);
    }
    segue.push({ seguinte: seguinte, seguido: seguido });
    return res.sendStatus(204);
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
    const modo = req.query.modo;
    if (!id_user) {
        return res.json(disco);
    }
    if (modo === "perfil") { 
        return res.json(disco.filter(obj => obj.id_usuario == id_user));
    } else {
        return res.json(disco.filter(obj => obj.id_usuario != id_user));
    }
});

router.get('/livro', (req, res) => {
    const id_user = req.query.id_user;
    const modo = req.query.modo;
    if (!id_user) {
        return res.json(livro);
    }
    if (modo === "perfil") { 
        return res.json(livro.filter(obj => obj.id_usuario == id_user));
    } else {
    return res.json(livro.filter(obj => obj.id_usuario != id_user));
    }
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