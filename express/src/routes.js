import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import { z } from 'zod';
import multer from 'multer';

import { isAuthenticated } from './middleware/auth.js'
import { validate } from './middleware/validate.js';
import uploadConfig from './config/multer.js';

import SendMail from './services/SendMail.js';


import ImagemUsuario from './models/imagem_usuario.js'
import Palavra from './models/palavra_chave.js'
import Usuario from './models/usuario.js'
import PalavraUsuario from './models/palavra_usuario.js'
import Produto from './models/produto.js'
import Avaliacao from './models/avaliacao.js'
import usuario from './models/usuario.js';
import produto from './models/produto.js';
import carrinho from './models/carrinho.js';
import { id } from 'zod/v4/locales';

const router = express.Router()

class HttpError extends Error {
    constructor(message, code=400) {
        super(message);
        this.code = code;
    }
}

router.post('/usuario', 
    //validate (
    //z.object({
        //body: z.object({
            //name:z.string(),
            //email:z.string(),
            //password: z.string().min(5),
        //}),
    //})
//),
 async (req, res) => { //Alice faz
    try {
        const user = req.body;    
        const newUser = await Usuario.create(user);
        
        delete newUser.senha;
        try {
            await SendMail.createNewUser(user.email);
            } catch (mailErr) {
            console.error('Erro ao enviar e-mail de boas-vindas:', mailErr);
            }
        
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        if (error.code === 'P2002' || /duplicate/i.test(error.message || '')) {
            return res.status(409).json({ status: 'error', message: 'Email já cadastrado' });
        }
    return res.status(400).json({ status: 'error', message: error.message || 'Unable to create user' });
    }
});

router.get('/usuario/:id_user/', isAuthenticated, validate(
    z.object({
        params: z.object({
            id_user: z.uuid().or(z.literal("me")),
        })
    })
), async (req, res) => {
    try {
        const id_user = req.params.id_user == "me" ? req.userId : req.params.id_user;
        if (!id_user) {
            throw new HttpError('Faltam parâmetros: id_user', 400);
        }
        const user = await Usuario.readById(id_user);
        return res.json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: error.message || 'Erro interno do servidor' });
    }
}
);

router.get('/usuario/:id_user/mediaavaliacao', isAuthenticated, validate(
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
    try {
        const id_user = req.params.id_user == "me" ? req.userId : req.params.id_user;
        let { nota, avaliado, descricao } = req.body;
        avaliado = req.body.avaliado == "me" ? req.userId : req.body.avaliado;
        if (!id_user || !nota || !avaliado || !descricao) {
            throw new HttpError('Faltam parâmetros: id_user, nota, avaliado, descricao', 400);
        }
        await Usuario.createAvaliacao(id_user, avaliado, nota, descricao);
        return res.status(201).json({ status: 'ok' });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message || 'Erro ao criar avaliação' });
    }
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
    try {
        const id_user = req.params.id_user == "me" ? req.userId : req.params.id_user;
        let { denunciado, descricao } = req.body;
        denunciado = req.body.denunciado == "me" ? req.userId : req.body.denunciado;
        if (!id_user || !denunciado || !descricao) {
            throw new HttpError('Faltam parâmetros: id_user, denunciado, descricao', 400);
        }
        await Usuario.createDenuncia(id_user, denunciado, descricao);
        return res.status(201).json({ status: 'ok' });
    } catch (error) {
        if (error.message == "Faltam parâmetros: id_user, denunciado, descricao") {
            return res.status(400).json({ status: 'error', message: error.message });
        }
        return res.status(500).json({ status: 'error', message: 'Erro ao criar denúncia' });
    }
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
    const user = await Usuario.readById(id_user);
    if (!user.foto_de_perfil) {
        return res.json(null);
    }
    return res.json(user.foto_de_perfil.path);
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
    try {
        const id_user = req.params.id_user == "me" ? req.userId : req.params.id_user;
        const { nome } = req.body;
        if (!id_user || !nome) {
            throw new HttpError('Faltam parâmetros: id_user, nome', 400);
        }
        await Usuario.updateName(id_user, nome);
        return res.status(204).json({ status: 'ok' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: error.message || 'Erro interno do servidor' });
    }
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
    try {
        const id_user = req.params.id_user == "me" ? req.userId : req.params.id_user;
        const { nome } = req.body;
        if (!id_user || !nome) {
            throw new HttpError('Faltam parâmetros: id_user, nome', 400);
        }
        await PalavraUsuario.create({ usuario: id_user, nome });
        return res.status(201).json({ status: 'ok' });
    } catch (error) {
        if (error.message === "A palavra já está associada ao usuário" || error.message === "O usuário já atingiu o limite de 10 palavras-chave") {
            return res.status(409).json({ status: 'error', message: error.message });
        } else {
            console.error(error);
            return res.status(500).json({ status: 'error', message: 'Erro interno do servidor' });
        }
    }
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
    let { seguido } = req.body;
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

router.post("/signin", async (req, res) => { //Alice faz
      try {
    
    const incoming = {
      email: req.body?.email ?? req.body?.id_user,
      senha: req.body?.senha ?? req.body?.password
    };

    
    const schema = z.object({
      email: z
        .string({ required_error: "O campo email é obrigatório." })
        .min(1, "O campo email é obrigatório.")
        .email("Formato de email inválido."),
      senha: z
        .string({ required_error: "O campo senha é obrigatório." })
        .min(1, "O campo senha é obrigatório."),
    });

 
    const parsed = schema.safeParse(incoming);
    if (!parsed.success) {
      const message = parsed.error.errors[0]?.message || "Dados inválidos.";
      return res.status(400).json({ auth: false, message });
    }

    const { email, senha } = parsed.data;

    
    const user = await Usuario.readByEmail(email);
    if (!user) {
      return res.status(404).json({ auth: false, message: "Usuário não encontrado." });
    }

    
    const senhaCorreta = await bcrypt.compare(senha, user.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ auth: false, message: "Senha incorreta." });
    }

    
    const token = jwt.sign(
      { userId: user.cod },
      process.env.JWT_SECRET,
      { expiresIn: "3600000" }
    );

    return res.json({ auth: true, token });
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ auth: false, message: "Erro interno ao fazer login." });
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

router.get("/usuario/:id_user/:modo/produtos_exibidos", isAuthenticated, validate(
    z.object({
        params: z.object({
                id_user: z.uuid().or(z.literal('me')),
                modo: z.string().max(30),
        })
    })
), async (req, res) => {
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

router.post("/usuario/:id_user/:obj/criarproduto", isAuthenticated, validate(
    z.object({
        params: z.object({
            id_user: z.uuid().or(z.literal("me")),
            tipo: z.string().max(16),
            }),
    }),
), async (req, res) => {
    try {
        const id_user = req.params.id_user == "me" ? req.userId : req.params.id_user;
        const obj = req.params.obj;

        produto = await Produto.create(id_user, obj);

        return res.status(201).json({ status: 'ok', produto });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Erro interno do servidor' });
    }
})

router.post("/usuario/:id_user/img", isAuthenticated, multer(uploadConfig).single('image'), async (req, res) => {
    try {
        const id_user = req.params.id_user == "me" ? req.userId : req.params.id_user;
        if (!req.file) {
            return res.status(400).json({ status: 'error', message: 'Arquivo de imagem não fornecido' });
        }
        const path = `/imgs/${req.file.filename}`;
        await ImagemUsuario.create(id_user, path);    
        const user = await Usuario.readById(id_user);
        return res.status(201).json({ status: 'ok', path: user.foto_de_perfil.path });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Erro interno do servidor' });
    }
});

router.put("/usuario/:id_user/img", isAuthenticated, multer(uploadConfig).single('image'), async (req, res) => {
    try {
        const id_user = req.params.id_user == "me" ? req.userId : req.params.id_user;
        if (!req.file) {
            return res.status(400).json({ status: 'error', message: 'Arquivo de imagem não fornecido' });
        }
        const path = `/imgs/${req.file.filename}`;
        await ImagemUsuario.update(id_user, path);    
        const user = await Usuario.readById(id_user);
        return res.status(200).json({ status: 'ok', path: user.foto_de_perfil.path });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: 'Erro interno do servidor' });
    }
});

router.post("/carrinho", async (req, res) => {
  try {
    const { id_usuario, id_prod, tipo } = req.body;

    // 1. Salva no banco
    const item = await carrinho.adicionar(id_usuario, id_prod, tipo);

    // 2. Busca o produto completo
    const produto = await Produto.readById(id_prod, tipo);

    // 3. Busca o e-mail REAL do usuário
    const dadosUsuario = await Usuario.readById(id_usuario);
    const destinatario = dadosUsuario.email;

    // 4. Envia o e-mail
    await SendMail.produtoAdicionadoCarrinho(
      destinatario,
      {
        nome: produto.nome,
        id_prod: produto.id_prod,
        tipo: tipo
      },
      id_usuario
    );

    return res.status(200).json(item);

  } catch (error) {
    console.error("ERRO NO CONTROLLER DO CARRINHO:", error);
    return res.status(400).json({ message: error.message });
  }
});

export default router;