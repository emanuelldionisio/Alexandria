import express from 'express'

import Palavra from './models/palavra_chave.js'
import Usuario from './models/usuario.js'
import Segue from './models/segue.js'
import PalavraUsuario from './models/palavra_usuario.js'
import Produto from './models/produto.js'
import Avaliacao from './models/avaliacao.js'
/**
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

router.post('/usuario', async (req, res) => {
    const { nome, tel1, tel2, email, dt_nascimento, pais, estado, cidade, bairro, rua, senha, num_casa } = req.body;
    if (!nome || !email || !senha || !dt_nascimento || !pais || !estado || !cidade || !bairro || !rua || !num_casa) {
        throw new HttpError('Faltam parâmetros', 400);
    }
    const new_user = await Usuario.create({ nome, tel1, tel2, email, dt_nascimento, pais, estado, cidade, bairro, rua, senha, num_casa });
    return res.json(new_user);
});

router.put('/usuarioNome/:id_user', async (req, res) => {
    const id_user = req.params.id_user;
    const { nome } = req.body;
    const updated_user = await Usuario.updateName(id_user, nome);
    return res.json(updated_user);
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

router.post('/palavra_chave/:nome', async (req, res) => {
    const { nome } = req.params
    const created_palavra = await Palavra.create({ nome })
    return res.json(created_palavra)
});

router.get('/palavra_chave', async (req, res) => {
    const palavra = await Palavra.read_all()
    return res.json(palavra)
});

router.get('/palavra_usuario/:id_user', async (req, res) => {
    const id_user = req.params.id_user;
    if (!id_user) {
        throw new HttpError('Faltam parâmetros: id_user', 400);
    }
    const palavras = await PalavraUsuario.readByUsuarioCod(id_user);
    return res.json(palavras);
});

router.delete('/palavra_chave/:nome/:id_user', async (req, res) => {
    const { nome, id_user } = req.params;
    if (!nome || !id_user) {
        throw new HttpError('Faltam parâmetros: nome e/ou id_user', 400);
    }
    await PalavraUsuario.remove({ usuario: id_user, nome });
    if (await PalavraUsuario.readByPalavra(nome).then(users => users.length === 0)) {
        await Palavra.deletar({ nome });
    }
    return res.sendStatus(204);
});

router.post('/palavra_usuario', async (req, res) => {
    const { usuario, nome } = req.body;
    if (!usuario || !nome) {
        throw new HttpError("Os campos 'usuario' e 'nome' são obrigatórios", 400);
    }
    if (await PalavraUsuario.readByUsuarioCod(usuario).then(palavras => palavras.length >= 10)) {
        throw new HttpError("Limite de 10 palavras-chave por usuário atingido", 400);
    }
    const created_palavra_usuario = await PalavraUsuario.create({ usuario, nome });
    return res.json(created_palavra_usuario);
});

router.get('/produto/:id_prod/:tipo', async (req, res) => {
    const id_prod = Number(req.params.id_prod);
    const tipo = req.params.tipo;

    if (!id_prod || (tipo !== 'livro' && tipo !== 'disco')) {
        return res.status(400).json({ message: 'Parâmetros inválidos: id_prod e/ou tipo' });
    }

    try {
        const produto = await Produto.readById(id_prod, tipo);
        if (!produto) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

        return res.json(produto);
    } catch (err) {
        console.error('Erro ao buscar produto:', err);
        return res.status(500).json({ message: 'Erro interno ao buscar produto' });
    }
});

router.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    const usuarios = await Usuario.read_all();
    const usuario = usuarios.find(u => u.email === email);
    if (!usuario) {
        throw new HttpError("usuário não foi encontrado", 404);
    }

    return res.redirect(`/inicial?id_user=${usuario.id}`);
});

export default router;