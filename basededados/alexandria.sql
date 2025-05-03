CREATE table palavra_chave(
  nome VARCHAR (64) PRIMARY KEY
);

CREATE table usuario(
  cod INTEGER PRIMARY KEY, 
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
  num_casa INTEGER,
);

CREATE table livro (
  id_prod INTEGER PRIMARY KEY,
  nome VARCHAR (128),
  valor INTEGER,
  condicao VARCHAR (16),
  descricao VARCHAR (512),
  autor VARCHAR (32),
  edicao VARCHAR (32),
  qtd_pag INTEGER,
 );
 
 CREATE table disco(
  id_prod INTEGER PRIMARY KEY,
  nome VARCHAR (128),
  valor INTEGER,
  condicao VARCHAR (16),
  descricao VARCHAR (512),
  artista VARCHAR (32),
  ano INTEGER,
  gravadora VARCHAR (32),
);

CREATE TABLE carrinho_livro(
  cod_usuario INTEGER,
  id_prod INTEGER,
  FOREIGN KEY (cod_usuario) REFERENCES usuario (cod),
  FOREIGN KEY (id_prod) REFERENCES livro (id_prod),
  PRIMARY KEY (cod_usuario, id_prod)
);

CREATE TABLE carrinho_disco(
  cod_usuario INTEGER,
  id_prod INTEGER,
  FOREIGN KEY (cod_usuario) REFERENCES usuario (cod),
  FOREIGN KEY (id_prod) REFERENCES disco (id_prod),
  PRIMARY KEY (cod_usuario, id_prod)
);

CREATE TABLE desejos_livro(
  cod_usuario INTEGER,
  id_prod INTEGER,
  FOREIGN KEY (cod_usuario) REFERENCES usuario (cod),
  FOREIGN KEY (id_prod) REFERENCES livro (id_prod),
  PRIMARY KEY (cod_usuario, id_prod)
);

CREATE TABLE desejos_disco(
  cod_usuario INTEGER,
  id_prod INTEGER,
  FOREIGN KEY (cod_usuario) REFERENCES usuario (cod),
  FOREIGN KEY (id_prod) REFERENCES disco (id_prod),
  PRIMARY KEY (cod_usuario, id_prod)
);

CREATE TABLE avaliacao_livro(
  cod_usuario INTEGER,
  id_prod INTEGER,
  nota INTEGER,
  descricao VARCHAR (512),
  FOREIGN KEY (cod_usuario) REFERENCES usuario (cod),
  FOREIGN KEY (id_prod) REFERENCES livro (id_prod),
  PRIMARY KEY (cod_usuario, id_prod)
);

CREATE TABLE avaliacao_disco(
  cod_usuario INTEGER,
  id_prod INTEGER,
  nota INTEGER,
  descricao VARCHAR (512),
  FOREIGN KEY (cod_usuario) REFERENCES usuario (cod),
  FOREIGN KEY (id_prod) REFERENCES disco (id_prod),
  PRIMARY KEY (cod_usuario, id_prod)
);

CREATE TABLE denuncia(
  denunciante INTEGER,
  denunciado INTEGER,
  PRIMARY KEY (denunciante, denunciado),
  FOREIGN key (denunciante) REFERENCES usuario (cod),
  FOREIGN KEY (denunciado) REFERENCES usuario (cod)
);

CREATE TABLE segue(
  seguinte INTEGER,
  seguido INTEGER,
  PRIMARY KEY (seguinte, seguido),
  FOREIGN key (seguinte) REFERENCES usuario (cod),
  FOREIGN KEY (seguido) REFERENCES usuario (cod)
);

CREATE TABLE palavra_usuario(
  usuario INTEGER,
  palavra VARCHAR(64),
  PRIMARY KEY (usuario, palavra),
  FOREIGN KEY (usuario) REFERENCES usuario (cod),
  FOREIGN KEY (palavra) REFERENCES palavra_chave (nome)
 );
 
 CREATE TABLE palavra_livro(
  prod INTEGER,
  palavra VARCHAR(64),
  PRIMARY KEY (prod, palavra),
  FOREIGN KEY (prod) REFERENCES livro (id_prod),
  FOREIGN KEY (palavra) REFERENCES palavra_chave (nome)
 );
 
 CREATE TABLE palavra_disco(
  prod INTEGER,
  palavra VARCHAR(64),
  PRIMARY KEY (prod, palavra),
  FOREIGN KEY (prod) REFERENCES disco (id_prod),
  FOREIGN KEY (palavra) REFERENCES palavra_chave (nome)
 ); 