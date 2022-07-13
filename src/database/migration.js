import Database from './database.js';

async function up() {
  const db = await Database.connect();

  const sql1 = `
  CREATE TABLE compras (
    id_compra INTEGER PRIMARY KEY AUTOINCREMENT,
    descricao VARCHAR(100) NULL,
    valor_total DECIMAL(7,2) NOT NULL,
    forma_pagamento VARCHAR(14) NOT NULL,
    entrega VARCHAR(3) NOT NULL,
    status VARCHAR(14) NOT NULL,
    id_cliente INTEGER,
    id_loja INTEGER,
    data TIMESTAMP NOT NULL UNIQUE,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
    FOREIGN KEY (id_loja) REFERENCES lojas(id_loja)
  );
  `;
  const sql2 = `
  CREATE TABLE produto (
    id_produto INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(50) NOT NULL,
    descricao VARCHAR(100) NULL,
    categoria VARCHAR(14) NOT NULL,
    preço NUMERIC(6,2) NOT NULL,
    forma_entrega VARCHAR(14) NOT NULL,
    imagem VARCHAR(200),
    id_loja INTEGER,
    FOREIGN KEY (id_loja) REFERENCES lojas(id_loja)
  );
  `;
  const sql3 = `
  CREATE TABLE itens_produto (
    id_compra INTEGER,
    id_produto INTEGER,
    FOREIGN KEY (id_compra) REFERENCES compra(id_compra),
    FOREIGN KEY (id_produto) REFERENCES produto(id_produto)
  );
  `;
  const sql4 = `
  CREATE TABLE empresarios (
    id_empresario INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(60) NOT NULL,
    nome VARCHAR(50) NOT NULL,
    senha VARCHAR(50) NOT NULL,
    telefone VARCHAR(20) NOT NULL
  );  
  `;
  const sql5 = `
  CREATE TABLE lojas (
    id_loja INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(40) NOT NULL,
    descricao VARCHAR(200),
    telefone VARCHAR(20) NOT NULL,
    termos VARCHAR(300),
    cnpj VARCHAR(18) NOT NULL,
    id_empresario INTEGER UNIQUE,
    FOREIGN KEY (id_empresario) REFERENCES empresarios(id_empresario)
  );
  `;
  
  const sql6 = `
  CREATE TABLE cliente (
    id_cliente INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(50) NOT NULL,
    email VARCHAR(60) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    senha VARCHAR(20) NOT NULL,
    cpf VARCHAR(20) NOT NULL
  );
  `;

  const sql7 = `
  INSERT INTO cliente (nome, email, telefone, senha, cpf)
  VALUES ('Juan Carlos', 'teste@teste.com', '(88)97777-4444', 'teste', '111.222.333-44');
  `;
  
  const sql8 = `
  INSERT INTO empresarios (nome, email, telefone, senha)
  VALUES ('Júlio Caio', 'teste@teste.com', '(88)27777-4444', 'teste');
  `;
  
  const sql9 = `
  INSERT INTO lojas (nome, descricao, telefone, termos, cnpj, id_empresario)
  VALUES ('Shope E-Book', 'Nós vendemos E-BOOK!', '(22)27777-4444', 'Envio online! Entrega garantidade!', '00.000.000/0001-91', 1);
  `;
  
  const sql10 = `
  INSERT INTO produto (nome, descricao, categoria, preço, forma_entrega, imagem, id_loja)
  VALUES ('O homem mais Rico da Babilônia', 'Livro é de leitura obrigatória.', 'Livro', 27.2, 'E-mail', 'https://images.vexels.com/media/users/3/214981/isolated/preview/7b8e4754b7104c5612588d7970273f36-icone-da-loja.png', 1);
  `;
  
  const sql11 = `
  INSERT INTO compras (descricao, valor_total, forma_pagamento, entrega, status, id_cliente, id_loja, data)
  VALUES ('Os livros é para ser entregue no email cadastrado.', 22.2, 'Pix', 'Sim', 'Em processo', 1, 1, '2022-18-06 12:08:00');
  `;
  
  const sql12 = `
  INSERT INTO itens_produto (id_compra, id_produto)
  VALUES (1, 1);
  `;
  
  /* await db.run(sql1);
  await db.run(sql2);
  await db.run(sql3);
  await db.run(sql4);
  await db.run(sql5);
  await db.run(sql6);

  await db.run(sql7);
  await db.run(sql8);
  await db.run(sql9);
  await db.run(sql10);
  await db.run(sql11); 
  await db.run(sql12); */
}

export default { up };