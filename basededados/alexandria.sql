CREATE table usuario(
  cod INTEGER PRIMARY KEY, 
  nome VARCHAR (64),
  tel1 CHAR (13),
  tel2 char (13),
  email varchar (64),
  dt_nascimento DATE,
  pais VARCHAR (20),
  estado VARCHAR (16), 
  cidade VARCHAR (32),
  bairro VARCHAR (32),
  rua VARCHAR (132),
  num_casa INTEGER
);
CREATE table palavra_chave(
  nome VARCHAR (64) PRIMARY KEY
);  
CREATE table livro (
  id_livro INTEGER PRIMARY KEY,
  nome VARCHAR (72),
  valor INTEGER,
  condicao VARCHAR (16),
  descricao VARCHAR (591),
  autor VARCHAR (32),
  

);
CREATE table usuario(
  id_livro INTEGER PRIMARY KEY,
  nome VARCHAR (72),
  valor INTEGER,
  condicao VARCHAR (16),
  descricao VARCHAR (591),
)
