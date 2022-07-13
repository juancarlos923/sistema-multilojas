import Database from '../database/database.js';

async function createLoja(body){
  const { nome, descricao, telefone, termos, cnpj, id_empresario } = body;

  if (!nome || !telefone || !cnpj || !id_empresario){
    return { error: 1,mensage: 'Dados insuficientes.' };
  }

  const db = await Database.connect();

  const sql = `
    SELECT
      *
    FROM
      lojas
    WHERE
      id_empresario = ?
  `;

  const result = await db.get(sql, [id_empresario]);
  
  if(result){
    
    return { error: 1, mensage: 'Você já tem uma loja.' };

  } else {

    const sql = `
    INSERT INTO
      lojas (nome, descricao, telefone, termos, cnpj, id_empresario)
    VALUES
      (?, ?, ?, ?, ?, ?)
    `;

    await db.run(sql, [nome, descricao, telefone, termos, cnpj, id_empresario]);

    return { error: 0, mensage: 'Cadastro Realizado com Sucesso!' };
  }
}

async function verifyLoja(id){
  const db = await Database.connect();

  const sql = `
    SELECT
      *
    FROM
      lojas
    WHERE
      id_empresario = ?
  `;

  const result = await db.get(sql, [id]);
  
  if(result){
    
    return { result: 1, loja: result.id_loja };

  } else {

    return { result: 0 };
  }
}

async function createProduto(body){
  
  const db = await Database.connect();
  const { nome, descricao, categoria, preco, forma_entrega, id_loja } = body;
  const imagem = "/uploads/produtos/produto_pendente.png"
  if(!nome || !descricao || !categoria || !preco || !forma_entrega || !id_loja){
    return {error: 1, mensage: "Dados incompleto!"};
  }
  const sql = `
  INSERT INTO
    produto (nome, descricao, categoria, preço, forma_entrega, imagem, id_loja)
  VALUES
    (?, ?, ?, ?, ?, ?, ?)
  `;

  const result = await db.run(sql,[nome, descricao, categoria, preco, forma_entrega, imagem, id_loja]);
  
  if(result){
    return { error: 0, mensage: result };

  } else {

    return { error: 2, mensage: "Houve um erro no cadastro do Produto." };
  }
}

async function getVendas(id){
  const db = await Database.connect();
  
  const sql = `
  SELECT * FROM compras WHERE id_loja = ?
  `;
  
  const result = await db.all(sql, [id]);
  
  if(result){
    return result;

  } else {

    return { result: 0 };
  }
}

async function getProdutos(id){
  const db = await Database.connect();
  
  const sql = `
  SELECT * FROM produto WHERE id_loja = ?
  `;

  const result = await db.all(sql, [id]);
  
  if(result){
    return result;

  } else {

    return { result: 0 };
  }
}

async function updateProdutos(body){
  const db = await Database.connect();
  
  const { id_produto, nome, descricao, preco, categoria, forma_entrega } = body;
  
  if(!id_produto){
    return {error: 1, mensage: "Dados insuficientes."}
  }
  if(nome){
    let sql = `
    UPDATE produto
      SET nome = ?
    WHERE id_produto = ${id_produto};
    `;
    await db.run(sql, [nome]);
  }
  if(descricao){
    let sql = `
    UPDATE produto
      SET descricao = ?
    WHERE id_produto = ${id_produto};
    `;
    db.run(sql, [descricao]);
  }
  if(preco){
    let sql = `
    UPDATE produto
      SET preço = ?
    WHERE id_produto = ${id_produto};
    `;
    db.run(sql, [preco]);
  }
  if(categoria){
    let sql = `
    UPDATE produto
      SET categoria = ?
    WHERE id_produto = ${id_produto};
    `;
    await db.run(sql, [categoria]);
  }
  if(forma_entrega){
    let sql = `
    UPDATE produto
      SET forma_entrega = ?
    WHERE id_produto = ${id_produto};
    `;
    await db.run(sql, [forma_entrega]);
  }
  return {error: 0, mensage: "Sucesso na atualização de dados!"}
}

async function updateProdutoImagem(id_loja,id_produto){
  const db = await Database.connect();
  
  const imagem = `/uploads/produtos/${id_loja}/${id_produto}.png`;

  if(!id_produto){
    return {error: 1, mensage: "Dados insuficientes."}
  } else {
    let sql = `
    UPDATE produto
      SET imagem = ?
    WHERE id_produto = ${id_produto};
    `;
    await db.run(sql, [imagem]);
  }
  return {error: 0, mensage: "Sucesso na atualização de dados!"}
}

async function getLojaProduto(id){
  const db = await Database.connect();
  
  const sql = `
  SELECT id_loja FROM produto WHERE id_produto = ?
  `;

  const result = await db.get(sql, [id]);
  
  if(result){
    return result;

  } else {

    return { result: 0 };
  }
}

async function getLoja(id){
  const db = await Database.connect();
  
  const sql = `
  SELECT * FROM lojas WHERE id_loja = ?
  `;

  const result = await db.get(sql, [id]);
  
  if(result){
    return result;

  } else {

    return { result: 0 };
  }
}

async function updateLoja(body){
  const db = await Database.connect();
  
  const { cnpj, descricao, id_empresario, nome, telefone, termos } = body;

  if(!id_empresario){
    return {error: 1, mensage: "Dados insuficientes."}
  }
  if(cnpj){
    let sql = `
    UPDATE lojas
      SET cnpj = ?
    WHERE id_empresario = ${id_empresario};
    `;
    await db.run(sql, [cnpj]);
  }
  if(descricao){
    let sql = `
    UPDATE lojas
      SET descricao = ?
    WHERE id_empresario = ${id_empresario};
    `;
    db.run(sql, [descricao]);
  }
  if(nome){
    let sql = `
    UPDATE lojas
      SET nome = ?
    WHERE id_empresario = ${id_empresario};
    `;
    db.run(sql, [nome]);
  }
  if(telefone){
    let sql = `
    UPDATE lojas
      SET telefone = ?
    WHERE id_empresario = ${id_empresario};
    `;
    await db.run(sql, [telefone]);
  }
  if(termos){
    let sql = `
    UPDATE lojas
      SET termos = ?
    WHERE id_empresario = ${id_empresario};
    `;
    await db.run(sql, [termos]);
  }
  return {error: 0, mensage: "Sucesso na atualização de dados!"}
}

async function delLoja(id){
  const db = await Database.connect();
  
  const sql = `DELETE FROM lojas WHERE id_empresario = ?`
  const result = await db.run(sql,[id])
  if(result.changes >= 1){
    return {status: 1};
  } else {
    return {status: 0};
  }
}

export default { createLoja, verifyLoja, getVendas, getProdutos, createProduto, updateProdutos, updateProdutoImagem, getLojaProduto, getLoja, updateLoja, delLoja };