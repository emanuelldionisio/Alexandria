import express from 'express'

import Palavra from './models/palavra_chave.js'
import Usuario from './models/usuario.js'
import Segue from './models/segue.js'
import PalavraUsuario from './models/palavra_usuario.js'
import Produto from './models/produto.js'
import Avaliacao from './models/avaliacao.js'
import Denuncia from './models/denuncia.js'
import Desejo from './models/desejos.js';
import carrinho from './models/carrinho.js';

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

router.get('/mediaavaliacao/:id_user', async (req, res) => {
    const id_user = req.params.id_user;
    if (!id_user) {
        throw new HttpError('Faltam parâmetros: id_user', 400);
    }
    const media = await Avaliacao.readMediaUsuario(id_user);
    return res.json(media);
});

router.get('/avaliadores/:id_user', async (req, res) => {
    const id_user = req.params.id_user;
    if (!id_user) {
        throw new HttpError('Faltam parâmetros: id_user', 400);
    }
    const avaliadores = await Avaliacao.readAvaliadores(id_user);
    return res.json(avaliadores);
});

router.get('/denuncias/:id_user', async (req, res) => {
    const id_user = req.params.id_user;
    if (!id_user) {
        throw new HttpError('Faltam parâmetros: id_user', 400);
    }
    const denuncias = await Denuncia.readByUsuario(id_user);
    return res.json(denuncias);
});

router.post('/avaliar', async (req, res) => {
    const { cod_avaliador, cod_avaliado, nota, descricao } = req.body;
    if (!cod_avaliador || !cod_avaliado || !nota || !descricao) {
        throw new HttpError('Faltam parâmetros: cod_avaliador, cod_avaliado, nota e/ou descricao', 400);
    }
    const avaliacao = await Avaliacao.create({ cod_avaliador, cod_avaliado, nota, descricao });
    return res.sendStatus(204);
});

router.post('/produtoByUsuario', async (req, res) => {
    const { id_usuario, modo, filtros } = req.body;
    if (!id_usuario) {
        throw new HttpError('Faltam parâmetros: id_usuario', 400);
    }
    const produtos = await Produto.readByUsuario(id_usuario, modo, filtros);
    return res.json(produtos);
});

router.post('/cadastroUsuario', async (req, res) => {
    const { nome, tel1, tel2, email, dt_nascimento, pais, estado, cidade, bairro, rua, senha, num_casa } = req.body;
    if (!nome || !email || !senha || !dt_nascimento || !pais || !estado || !cidade || !bairro || !rua || !num_casa) {
        throw new HttpError('Faltam parâmetros', 400);
    }
    const new_user = await Usuario.create({ nome, tel1, tel2, email, dt_nascimento, pais, estado, cidade, bairro, rua, senha, num_casa });
    if (!new_user) {
        throw new HttpError('Erro ao cadastrar usuário', 500);
    }
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

router.post('/login/:email/:senha', async (req, res) => {
  const { email, senha } = req.params;
  if (!email || !senha) {
    return res.status(400).json({ erro: 'Coloque um email e senha' });
  }
  const resultado = await Usuario.readLogin(senha, email)
  if (resultado.length === 0) {
    return res.status(401).json({ erro: 'Não foi encontrado email e senha correspondentes' });
  }
  return res.json(resultado)
});

router.get('/livro', async (req, res) => {
    const { id_user, modo } = req.query;
    const livros = await Produto.readLivrosDisponiveis(id_user, modo);
    return res.json(livros);
});

router.get('/disco', async (req, res) => {
    const { id_user, modo } = req.query;
    const discos = await Produto.readDiscosDisponiveis(id_user, modo);
    return res.json(discos);
});

router.post('/denunciar', async (req, res) => {
    const { denunciante, denunciado, descricao } = req.body;
    try {
        const denuncia = await Denuncia.create({ denunciante, denunciado, descricao });
        return res.status(201).json(denuncia);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.get('/vendedores', async (req, res) => {
    const {id_user} = req.query;
    const vendedores = await Usuario.readVendedoresDisponíveis(id_user);
    return res.json(vendedores);
});

router.post('/Desejos', async (req, res) => {
  const { id_usuario, id_prod, tipo } = req.body;
  try {
    const novoDesejo = await Desejo.adicionar(id_usuario, id_prod, tipo);
    res.status(201).json({
      success: true,
      message: 'Produto adicionado à lista de desejos',
      data: novoDesejo
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/Carrinho', async (req, res) => {
  const { id_usuario, id_prod, tipo } = req.body;
  try {
    const Addcart = await Carrinho.adicionar(id_usuario, id_prod, tipo);
    res.status(201).json({
      success: true,
      message: 'Produto adicionado ao seu carrinho',
      data: Addcart
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;