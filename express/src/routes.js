import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import express from 'express';
import { z } from 'zod';

import { isAuthenticated } from './middleware/auth.js'
import { validate } from './middleware/validate.js';

import Palavra from './models/palavra_chave.js'
import Usuario from './models/usuario.js'
import PalavraUsuario from './models/palavra_usuario.js'
import Produto from './models/produto.js'
import Avaliacao from './models/avaliacao.js'
import usuario from './models/usuario.js';
import produto from './models/produto.js';

const router = express.Router()

class HttpError extends Error {
    constructor(message, code=400) {
        super(message);
        this.code = code;
    }
}

router.post('/usuario', async (req, res) => { // Alice faz
    try {
        const user = req.body;
        const { nome, email, senha } = user;

    
        if (!nome || !email || !senha) {
            throw new HttpError("Preencha todos os campos obrigatórios.", 400);
        }

  
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new HttpError("E-mail inválido.", 400);
        }


        const existingUser = await Usuario.readByEmail(email);
        if (existingUser) {
            throw new HttpError("E-mail já cadastrado.", 409);
        }

      
        const newUser = await Usuario.create(user);

        return res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        if (error instanceof HttpError) {
            return res.status(error.code || 400).json({ message: error.message });
        }
        return res.status(500).json({ message: "Erro interno ao criar usuário." });
    }
});




router.get('/usuario/:id_user/mediaavaliacao', isAuthenticated, validate(
    z.object({
        params: z.object({
            id_user: z.string(),
        })
    })
), async (req, res) => {
    const id_user = req.params.id_user == "me" ? req.userId : req.params.id_user;
    if (!id_user) {
        throw new HttpError('Faltam parâmetros: id_user', 400);
    }
    const media = await Avaliacao.readMediaUsuario(id_user);
    return res.json(media);
});

router.get('/usuario/:id_user/avaliadores', isAuthenticated, async (req, res) => {
    const id_user = req.params.id_user == "me" ? req.userId : req.params.id_user;
    if (!id_user) {
        throw new HttpError('Faltam parâmetros: id_user', 400);
    }
    const avaliadores = await usuario.readAvaliadores(id_user);
    return res.json(avaliadores);
});

router.post("/usuario/:id_user/avaliacao", isAuthenticated, validate(
    z.object({
        body: z.object({
            nota: z.number().min(1).max(5),
            avaliado: z.uuid().or(z.literal("me")),
            descricao: z.string().max(500),
        }),
        params: z.object({
            id_user: z.uuid().or(z.literal("me")),
        })
    })
), async (req, res) => {
    const id_user = req.params.id_user == "me" ? req.userId : req.params.id_user;
    const { nota, avaliado, descricao } = req.body;
    avaliado = req.body.avaliado == "me" ? req.userId : req.body.avaliado;
    if (!id_user || !nota || !avaliado || !descricao) {
        throw new HttpError('Faltam parâmetros: id_user, nota, avaliado, descricao', 400);
    }
    await Usuario.createAvaliacao(id_user, avaliado, nota, descricao);
    return res.status(201).json({ status: 'ok' });
});

router.post("/usuario/:id_user/denuncia", isAuthenticated, validate(
    z.object({
        body: z.object({
            denunciado: z.uuid().or(z.literal("me")),
            descricao: z.string().max(500),
        }),
        params: z.object({
            id_user: z.uuid().or(z.literal("me")),
        })
    })
), async (req, res) => {
    const id_user = req.params.id_user == "me" ? req.userId : req.params.id_user;
    const { denunciado, descricao } = req.body;
    denunciado = req.body.denunciado == "me" ? req.userId : req.body.denunciado;
    if (!id_user || !denunciado || !descricao) {
        throw new HttpError('Faltam parâmetros: id_user, denunciado, descricao', 400);
    }
    await Usuario.createDenuncia(id_user, denunciado, descricao);
    return res.status(201).json({ status: 'ok' });
});

router.get("/usuario/:id_user/denuncia", isAuthenticated, validate(
    z.object({
        params: z.object({
            id_user: z.uuid().or(z.literal("me")),
        })
    })
), async (req, res) => {
    const id_user = req.params.id_user == "me" ? req.userId : req.params.id_user;
    if (!id_user) {
        throw new HttpError('Faltam parâmetros: id_user', 400);
    }
    const denuncias = await Usuario.readDenuncias(id_user);
    return res.json(denuncias);
});

router.get("/usuario/:id_user/img", isAuthenticated, validate(
    z.object({
        params: z.object({
            id_user: z.uuid().or(z.literal("me")),
        })
    })
), async (req, res) => {
    const id_user = req.params.id_user == "me" ? req.userId : req.params.id_user;
    if (!id_user) {
        throw new HttpError('Faltam parâmetros: id_user', 400);
    }
    const { foto_perfil } = await Usuario.readById(id_user);
    return res.json(foto_perfil);
});

router.get("/usuario/:id_user/nome", isAuthenticated, validate(
    z.object({
        params: z.object({
            id_user: z.uuid().or(z.literal("me")),
        })
    })
), async (req, res) => {
    const id_user = req.params.id_user == "me" ? req.userId : req.params.id_user;
    if (!id_user) {
        throw new HttpError('Faltam parâmetros: id_user', 400);
    }
    const { nome } = await Usuario.readById(id_user);
    return res.json(nome);
});

router.put("/usuario/:id_user/nome", isAuthenticated, validate(
    z.object({
        params: z.object({
            id_user: z.uuid().or(z.literal("me")),
        }),
        body: z.object({
            nome: z.string().min(2).max(128),
        })
    })
), async (req, res) => {
    const id_user = req.params.id_user == "me" ? req.userId : req.params.id_user;
    const { nome } = req.body;
    if (!id_user || !nome) {
        throw new HttpError('Faltam parâmetros: id_user, nome', 400);
    }
    await Usuario.updateName(id_user, nome);
    return res.status(204).json({ status: 'ok' });
});

router.get("/usuario/:id_user/palavras", isAuthenticated, validate(
    z.object({
        params: z.object({
            id_user: z.uuid().or(z.literal("me")),
        })
    })
), async (req, res) => {
    const id_user = req.params.id_user == "me" ? req.userId : req.params.id_user;
    if (!id_user) {
        throw new HttpError('Faltam parâmetros: id_user', 400);
    }
    const palavras = await Usuario.readPalavras(id_user);
    return res.json(palavras);
});

router.post("/usuario/:id_user/palavras", isAuthenticated, validate(
    z.object({
        params: z.object({
            id_user: z.uuid().or(z.literal("me")),
        }),
        body: z.object({
            nome: z.string().min(2).max(32),
        })
    })
), async (req, res) => {
    const id_user = req.params.id_user == "me" ? req.userId : req.params.id_user;
    const { nome } = req.body;
    if (!id_user || !nome) {
        throw new HttpError('Faltam parâmetros: id_user, nome', 400);
    }
    await PalavraUsuario.create({ usuario: id_user, nome });
    return res.status(201).json({ status: 'ok' });
});

router.delete("/usuario/:id_user/palavras/:nome", isAuthenticated, validate(
    z.object({
        params: z.object({
            id_user: z.uuid().or(z.literal("me")),
            nome: z.string().min(2).max(32),
        })
    })
), async (req, res) => {
    const id_user = req.params.id_user == "me" ? req.userId : req.params.id_user;
    const nome = req.params.nome;
    if (!id_user || !nome) {
        throw new HttpError('Faltam parâmetros: id_user, nome', 400);
    }
    await PalavraUsuario.remove({ usuario: id_user, nome });
    if (await PalavraUsuario.readByUsuarioCod(id_user).length == 0) {
        await Palavra.deletar({ nome });
    }
    return res.status(204).json({  status: 'ok' });
});

router.get("/usuario/:id_user/seguidores", isAuthenticated, validate(
    z.object({
        params: z.object({
            id_user: z.uuid().or(z.literal("me")),
        })
    })
), async (req, res) => {
    const id_user = req.params.id_user == "me" ? req.userId : req.params.id_user;
    if (!id_user) {
        throw new HttpError('Faltam parâmetros: id_user', 400);
    }
    const seguidores = await Usuario.readSeguidores(id_user);
    return res.json(seguidores);
});

router.get("/usuario/:id_user/seguidos", isAuthenticated, validate(
    z.object({
        params: z.object({
            id_user: z.uuid().or(z.literal("me")),
        })
    })
), async (req, res) => {
    const id_user = req.params.id_user == "me" ? req.userId : req.params.id_user;
    if (!id_user) {
        throw new HttpError('Faltam parâmetros: id_user', 400);
    }
    const seguidos = await Usuario.readSeguidos(id_user);
    return res.json(seguidos);
});

router.post("/usuario/:id_user/seguidos", isAuthenticated, validate(
    z.object({
        params: z.object({
            id_user: z.uuid().or(z.literal("me")),
        }),
        body: z.object({
            seguido: z.uuid().or(z.literal("me")),
        })
    })
), async (req, res) => {
    const id_user = req.params.id_user == "me" ? req.userId : req.params.id_user;
    const { seguido } = req.body;
    seguido = req.body.seguido == "me" ? req.userId : req.body.seguido;
    if (!id_user || !seguido) {
        throw new HttpError('Faltam parâmetros: id_user, seguido', 400);
    }
    await Usuario.seguir(id_user, seguido);
    return res.status(201).json({ status: 'ok' });
});

router.delete("/usuario/:id_user/seguidos", isAuthenticated, validate(
    z.object({
        params: z.object({
            id_user: z.uuid().or(z.literal("me")),
        }),
        body: z.object({
            seguido: z.uuid().or(z.literal("me")),
        })
    })
), async (req, res) => {
    const id_user = req.params.id_user == "me" ? req.userId : req.params.id_user;
    const { seguido } = req.body;
    if (!id_user || !seguido) {
        throw new HttpError('Faltam parâmetros: id_user, seguido', 400);
    }
    await Usuario.deixarDeSeguir(id_user, seguido);
    return res.status(204).json({ status: 'ok' });
});

router.get("/usuario/:id_user/produtos", isAuthenticated, validate(
    z.object({
        params: z.object({
            id_user: z.uuid().or(z.literal("me")),
        }),
        query: z.object({
            search: z.string().max(128).optional(),
        })
    })
), async (req, res) => {
    const id_user = req.params.id_user == "me" ? req.userId : req.params.id_user;
    const search = req.query.search || "";
    if (!id_user) {
        throw new HttpError('Faltam parâmetros: id_user', 400);
    }
    const produtos = await Usuario.readProdutos(id_user, search);
    return res.json(produtos);
});

router.post('/login/:email/:senha', async (req, res) => { // Alice faz
  try {
    const { email, senha } = req.params;

    if (!email || !senha) {
      return res.status(400).json({ erro: 'Preencha todos os campos.' });
    }

    const resultado = await Usuario.readLogin(senha, email);

    if (!resultado || resultado.length === 0) {
      return res.status(401).json({ erro: 'Senha incorreta ou usuário não encontrado.' });
    }

    return res.json(resultado[0]); 
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
});


router.get("/produto/:id_prod/:tipo", isAuthenticated, async (req, res) => { //Oliver faz
     const id_prod = req.params.id_prod;
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

router.get("/usuario/:id_user/:modo/produtos_exibidos", isAuthenticated, async (req, res) => {
    const id_user = req.params.id_user == "me" ? req.userId : req.params.id_user; 
    const modo = req.params.modo;

    if (!id_user, !modo) {
        return res.status(400).json({ message: 'Parâmetros inválidos: id_user'});
        }
    
    try {
        const produto = await Produto.readByUsuario(id_user, modo);
        if (!produto) {
            return res.status(404).json({message: 'Produto não existente' });
        }
    return res.json(produto);
    } catch (err) {
        console.error('Erro ao buscar produto:', err);
        return res.status(500).json({ message: 'Erro interno ao buscar produto' });
    }
});

router.get("/usuario/:id_user/imgq", isAuthenticated, async (req, res) => {
    const id_user = req.params.id_user
    if (!id_user) {
        throw new HttpError('Faltam parâmetros: id_user', 400);
    }
    const { foto_perfil } = await Usuario.readById(id_user);
    return res.json(foto_perfil);
});

export default router;