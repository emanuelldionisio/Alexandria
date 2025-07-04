import express from 'express'

// import Palavra from './models/palavra_chave.js'
import Usuario from './models/usuario.js'
import Segue from './models/segue.js'
// import PalavraUsuario from './models/palavra_usuario.js'
import Produto from './models/produto.js'
import Avaliacao from './models/avaliacao.js'
/**
 import { segue } from './data/segue.js'
 import { palavra_usuario } from './data/palavra_usuario.js'
 import { disco } from './data/disco.js'
 import { livro } from './data/livro.js'
 import { avaliacao_disco } from './data/avaliacao_disco.js'
 import { avaliacao_livro } from './data/avaliacao_livro.js'
 import { palavra_chave } from './data/palavra_chave.js'
*/

const router = express.Router()

class HttpError extends Error {
    constructor(message, code=400) {
        super(message);
        this.code = code;
    }
}

router.get('/mediaavaliacao/:id_user', async (req, res) => {
    const id_user = req.params.id_user;
    if (!id_user) {
        throw new HttpError('Faltam parâmetros: id_user', 400);
    }
    const media = await Avaliacao.readMediaUsuario(id_user);
    return res.json(media);
});

router.get('/produtoByUsuario', async (req, res) => {
    const { id_usuario, modo } = req.query;
    if (!id_usuario) {
        throw new HttpError('Faltam parâmetros: id_usuario', 400);
    }
    const produtos = await Produto.readByUsuario(id_usuario, modo);
    return res.json(produtos);
});

router.get('/palavra_chave', async (req, res) => {
    const palavra = await Palavra.read()
    return res.json(palavra)
});

router.post('/palavra_chave/:nome', async (req, res) => {
    const { nome } = req.params
    const created_palavra = await Palavra.create({ nome })
    return res.json(created_palavra)
});

router.post('/usuario', async (req, res) => {
    const { nome, tel1, tel2, email, dt_nascimento, pais, estado, cidade, bairro, rua, senha, num_casa } = req.body;
    if (!nome || !email || !senha || !dt_nascimento || !pais || !estado || !cidade || !bairro || !rua || !num_casa) {
        throw new HttpError('Faltam parâmetros', 400);
    }
    const new_user = await Usuario.create({ nome, tel1, tel2, email, dt_nascimento, pais, estado, cidade, bairro, rua, senha, num_casa });
    return res.json(new_user);
});

router.get('/usuarionome/:id_user', async (req, res) => {
    const id_user = req.params.id_user;
    if (!id_user) {
        throw new HttpError('Faltam parâmetros!'); 
    } 
    const user = await Usuario.readById(id_user);
    return res.json(user.nome);
});

router.get('/seguidores/:id_user', async (req, res) => {
    const id_user = req.params.id_user;
    if (!id_user) {
        throw new HttpError('Faltam parâmetros: id_user', 400);
    }
    const seguidores = await Segue.readSeguidores(id_user);
    return res.json(seguidores);
});

router.get('/seguidos/:id_user', async (req, res) => {
    const id_user = req.params.id_user;
    if (!id_user) {
        throw new HttpError('Faltam parâmetros: id_user', 400);
    }
    const seguidos = await Segue.readSeguidos(id_user);
    return res.json(seguidos);
});

router.delete('/segue', async (req, res) => {
    const { seguido, seguinte } = req.body;
    if (!seguido || !seguinte) {
        throw new HttpError('Faltam parâmetros: seguido e/ou seguinte', 400);
    }
    await Segue.remove({ seguido, seguinte });
    return res.sendStatus(204);
});

router.post('/segue', async (req, res) => {
    const { seguido, seguinte } = req.body;
    if (seguido == seguinte) {
        throw new HttpError('Não é possível seguir a si mesmo', 400);
    }
    if (!seguido || !seguinte) {
        throw new HttpError('Faltam parâmetros: seguido e/ou seguinte', 400);
    }
    await Segue.create({ seguido, seguinte });
    return res.sendStatus(204);
});

router.get('/palavra_usuario/:id_user', async (req, res) => {
    const id_user = req.params.id_user;
    if (!id_user) {
        throw new HttpError('Faltam parâmetros: id_user', 400);
    }
    const palavras = await PalavraUsuario.readByUsuario(id_user);
    return res.json(palavras);
});

export default router;