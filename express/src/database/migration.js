import Database from './database.js';
 
async function up() {
  const db = await Database.connect();

    const palavra_chave = `CREATE table palavra_chave(
        cod INTEGER PRIMARY KEY AUTOINCREMENT,
        nome VARCHAR (64) 
    );`;
    const usuario = `CREATE table usuario(
        cod INTEGER PRIMARY KEY AUTOINCREMENT, 
        nome VARCHAR (64),
        tel1 CHAR (16),
        tel2 char (16),
        email varchar (64),
        dt_nascimento DATE,
        pais VARCHAR (32),
        estado VARCHAR (16), 
        cidade VARCHAR (32),
        bairro VARCHAR (32),
        rua VARCHAR (128),
        senha VARCHAR (32),
        num_casa INTEGER
    );`;
    const livro = `CREATE table livro (
        id_prod INTEGER PRIMARY KEY AUTOINCREMENT,
        nome VARCHAR (128),
        valor INTEGER,
        condicao VARCHAR (16),
        descricao VARCHAR (512),
        autor VARCHAR (32),
        edicao VARCHAR (32),
        qtd_pag INTEGER,
        id_usuario INTEGER,
        FOREIGN KEY (id_usuario) REFERENCES usuario (cod)
    );`;
    const disco = `CREATE table disco(
        id_prod INTEGER PRIMARY KEY AUTOINCREMENT,
        nome VARCHAR (128),
        valor INTEGER,
        condicao VARCHAR (16),
        descricao VARCHAR (512),
        artista VARCHAR (32),
        ano INTEGER,
        gravadora VARCHAR (32),
        id_usuario INTEGER,
        FOREIGN KEY (id_usuario) REFERENCES usuario (cod)
    );`;
    const carrinho_livro = `CREATE TABLE carrinho_livro(
        cod_usuario INTEGER,
        id_prod INTEGER,
        FOREIGN KEY (cod_usuario) REFERENCES usuario (cod),
        FOREIGN KEY (id_prod) REFERENCES livro (id_prod),
        PRIMARY KEY (cod_usuario, id_prod)
    );`;
    const carrinho_disco = `CREATE TABLE carrinho_disco(
        cod_usuario INTEGER,
        id_prod INTEGER,
        FOREIGN KEY (cod_usuario) REFERENCES usuario (cod),
        FOREIGN KEY (id_prod) REFERENCES disco (id_prod),
        PRIMARY KEY (cod_usuario, id_prod)
    );`;
    const desejos_livro = `CREATE TABLE desejos_livro(
        cod_usuario INTEGER,
        id_prod INTEGER,
        FOREIGN KEY (cod_usuario) REFERENCES usuario (cod),
        FOREIGN KEY (id_prod) REFERENCES livro (id_prod),
        PRIMARY KEY (cod_usuario, id_prod)
    );`;
    const desejos_disco = `CREATE TABLE desejos_disco(
        cod_usuario INTEGER,
        id_prod INTEGER,
        FOREIGN KEY (cod_usuario) REFERENCES usuario (cod),
        FOREIGN KEY (id_prod) REFERENCES disco (id_prod),
        PRIMARY KEY (cod_usuario, id_prod)
    );`;
    const avaliacao_livro = `CREATE TABLE avaliacao_livro(
        cod_usuario INTEGER,
        id_prod INTEGER,
        nota INTEGER,
        descricao VARCHAR (512),
        FOREIGN KEY (cod_usuario) REFERENCES usuario (cod),
        FOREIGN KEY (id_prod) REFERENCES livro (id_prod),
        PRIMARY KEY (cod_usuario, id_prod)
    );`;
    const avaliacao_disco = `CREATE TABLE avaliacao_disco(
        cod_usuario INTEGER,
        id_prod INTEGER,
        nota INTEGER,
        descricao VARCHAR (512),
        FOREIGN KEY (cod_usuario) REFERENCES usuario (cod),
        FOREIGN KEY (id_prod) REFERENCES disco (id_prod),
        PRIMARY KEY (cod_usuario, id_prod)
    );`;
    const denuncia = `CREATE TABLE denuncia(
        denunciante INTEGER,
        denunciado INTEGER,
        PRIMARY KEY (denunciante, denunciado),
        FOREIGN key (denunciante) REFERENCES usuario (cod),
        FOREIGN KEY (denunciado) REFERENCES usuario (cod)
    );`;
    const segue = `CREATE TABLE segue(
        seguinte INTEGER,
        seguido INTEGER,
        PRIMARY KEY (seguinte, seguido),
        FOREIGN key (seguinte) REFERENCES usuario (cod),
        FOREIGN KEY (seguido) REFERENCES usuario (cod)
    );`;
    const palavra_usuario = `CREATE TABLE palavra_usuario(
        usuario INTEGER,
        palavra VARCHAR(64),
        PRIMARY KEY (usuario, palavra),
        FOREIGN KEY (usuario) REFERENCES usuario (cod),
        FOREIGN KEY (palavra) REFERENCES palavra_chave (nome)
    );`;
    const palavra_livro = `CREATE TABLE palavra_livro(
        prod INTEGER,
        palavra VARCHAR(64),
        PRIMARY KEY (prod, palavra),
        FOREIGN KEY (prod) REFERENCES livro (id_prod),
        FOREIGN KEY (palavra) REFERENCES palavra_chave (nome)
    );`;
    const palavra_disco = `CREATE TABLE palavra_disco(
        prod INTEGER,
        palavra VARCHAR(64),
        PRIMARY KEY (prod, palavra),
        FOREIGN KEY (prod) REFERENCES disco (id_prod),
        FOREIGN KEY (palavra) REFERENCES palavra_chave (nome)
    );`;

 
    for (const query of [
        palavra_chave,
        usuario,
        livro,
        disco,
        carrinho_livro,
        carrinho_disco,
        desejos_livro,
        desejos_disco,
        avaliacao_livro,
        avaliacao_disco,
        denuncia,
        segue,
        palavra_usuario,
        palavra_livro,
        palavra_disco
    ]) {
        await db.run(query);
    }

}
 
export default { up };