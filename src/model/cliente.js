import Database from '../database/database.js';
import jsonwebtoken from "jsonwebtoken";
import cookieParser from "cookie-parser";

async function createCliente(body){
  const { cpf, email, nome, senha, telefone} = body;
  
  if (!cpf || !email || !senha || !nome || !telefone){
    return { error: 1,mensage: 'Dados insuficientes' };
  }
  
  const db = await Database.connect();

  const sql = `
    SELECT
      *
    FROM
      cliente
    WHERE
      cpf = ?
  `;

  const result = await db.get(sql, [cpf]);
  
  if(result){
    
    return { error: 2, mensage: 'Já existe cadastro com esse CPF.' };
  } else {

    const sql = `
    INSERT INTO
      cliente (cpf, email, nome, senha, telefone)
    VALUES
      (?, ?, ?, ?, ?)
    `;

    await db.run(sql, [cpf, email, nome, senha, telefone]);

    return { error: 0, mensage: 'Cadastro Realizado com Sucesso!' };
  }
}

// Login criar token
async function permissionAccess(req,res){
  
  const { email, senha } = req.body;

  if (!email || !senha){
    return res.send({ mensage: 'Dados insuficientes...' });
  }
  
  const db = await Database.connect();

  const sql = `
    SELECT
      *
    FROM
      cliente
    WHERE
      email = ? and senha = ?
  `;

  const result = await db.get(sql, [email,senha]);
  
  if(!result){
    return { error: 1, mensage: 'Você preencheu seu email/senha Incorreto!' };
  } else {
    return { error: 0, id: result.id_cliente, email: result.email};
  }
}

async function createToken(id,email){
  const code = jsonwebtoken.sign({ id: id, email: email }, "SenhaParaProtegerOToken");
  return code;
}

async function statusAccess(req, res){
  if(req.cookies.access_token_cliente){
    try{
      const result = jsonwebtoken.verify(req.cookies.access_token_cliente, 'SenhaParaProtegerOToken');
      if(result){
        res.status(200).send({status: 0, info: result}); // Autorizado
      }
    } catch {
      res.status(400).send({status: 1}); // Não Autorizado
    }
  }else{
    res.status(401).send({status: 2}); // Sem Autorização
  }
}

async function statusAccessInterno(user){ //verificacao interna
  if(user){
    try{
      const result = jsonwebtoken.verify(user, 'SenhaParaProtegerOToken');
      if(result){
        return {status: 0, info: result}; // Autorizado
      }
    } catch {
      return {status: 1}; // Não Autorizado
    }
  }else{
    return {status: 2}; // Sem Autorização
  }
}

async function exitAccess(req,res){
  res.clearCookie('access_token_cliente').redirect("/cliente/login");
}

async function getDados(id){
  const db = await Database.connect();

  const sql = `
    SELECT
      *
    FROM
      cliente
    WHERE
      id_cliente = ?
  `;

  const result = await db.get(sql, [id]);
  return result;
}

async function editDados(body){
  const db = await Database.connect();
  const { nome, email, cpf, telefone, senha, id_cliente } = body;
  if(!senha){
    console.log(body)
    const sql = `
    UPDATE cliente
    SET email = '${email}', nome = '${nome}', telefone = '${telefone}', cpf = '${cpf}'
    WHERE id_cliente = ${id_cliente};
    `
    const result = await db.run(sql);
    return result;

  } else {

    const sql = `
    UPDATE cliente
    SET email =  '${email}', nome = '${nome}', telefone = '${telefone}', cpf = '${cpf}', senha = '${senha}'
    WHERE id_cliente = ${id_cliente};
    `
    const result = await db.run(sql);
    return result;

  }
}

async function deleteDados(id){
  const db = await Database.connect();
  
  const sql = `DELETE FROM cliente WHERE id_cliente = ?`
  const result = await db.run(sql,[id])
  if(result.changes >= 1){
    return {status: 1};
  } else {
    return {status: 0};
  }
}

async function getcompras(id) {
  const db = await Database.connect();
  
  const sql = `
  SELECT * FROM compras WHERE id_cliente = ?
  `;
  
  const result = await db.all(sql, [id]);
  
  if(result){
    return result;

  } else {

    return { result: 0 };
  }
}

export default { createCliente, permissionAccess, statusAccess, exitAccess, createToken, getDados, editDados, deleteDados, getcompras, statusAccessInterno };

