import express from 'express'

import Palavra from './models/palavra_chave.js'
import Usuario from './models/usuario.js'
import Segue from './models/segue.js'
import PalavraUsuario from './models/palavra_usuario.js'
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

router.post('/disco', (req, res) => {
    const { id_prod, id_usuario, nome, valor, condicao, descricao, artista, ano, gravadora } = req.body;
    if (!id_prod || !id_usuario || !nome || !valor || !condicao || !descricao || !artista || !ano || !gravadora) {
        throw new HttpError('Faltam parâmetros: id_prod, id_usuario, nome, valor, condicao, descricao, artista, ano ou gravadora', 400);
    }
    disco.push({ id_prod, id_usuario, nome, valor, condicao, descricao, artista, ano, gravadora });
    return res.sendStatus(204);
}
);
router.post('/livro', (req, res) => {
    const { id_prod, id_usuario, nome, valor, condicao, descricao, autor, edicao, qtd_pag } = req.body;
    if (!id_prod || !id_usuario || !nome || !valor || !condicao || !descricao || !autor || !edicao || !qtd_pag) {
        throw new HttpError('Faltam parâmetros: id_prod, id_usuario, nome, valor, condicao, descricao, autor, edicao ou qtd_pag', 400);
    }
    livro.push({ id_prod, id_usuario, nome, valor, condicao, descricao, autor, edicao, qtd_pag });
    return res.sendStatus(204);
}
);

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

router.get("/emaid/:email/:senha", (req, res) =>{
    const email = req.params.email;
    const senha = req.params.senha;
    const identificacao = usuario.find(user=>user.email==email && user.senha==senha).cod;
    if (!identificacao) throw new HttpError ("ERRO: Credenciais incorretas.")
    return res.json({ "id": identificacao });
})

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

router.get('/discoUser/:id_user/:modo', (req, res) => {
    const id_user = req.params.id_user;
    const modo = req.query.modo;
    if (!id_user) {
        throw new HttpError('Faltam parâmetros: id_user', 400);
    }
    const discos = Disco.readByUser(id_user, modo);
    return res.json(discos);
    
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