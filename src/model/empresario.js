import Database from '../database/database.js';
import jsonwebtoken from "jsonwebtoken";
import cookieParser from "cookie-parser";

async function createEmpresario(body){
  const { nome, email, senha, telefone } = body;
  
  if (!email || !senha || !nome || !telefone){
    return { error: 1,mensage: 'Dados insuficientes' };
  }
  
  const db = await Database.connect();

  const sql = `
    SELECT
      *
    FROM
      empresarios
    WHERE
      email = ?
  `;

  const result = await db.get(sql, [email]);
  
  if(result){
    
    return { error: 2, mensage: 'Já existe cadastro com esse e-mail.' };
  } else {

    const sql = `
    INSERT INTO
      empresarios (nome, email, senha, telefone)
    VALUES
      (?, ?, ?, ?)
    `;

    await db.run(sql, [nome, email, senha, telefone]);

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
      empresarios
    WHERE
      email = ? and senha = ?
  `;

  const result = await db.get(sql, [email,senha]);
  
  if(!result){
    return { error: 1, mensage: 'Você preencheu seu email/senha Incorreto!' };
  } else {
    return { error: 0, id: result.id_empresario, email: result.email};
  }
}

async function createToken(id,email){
  const code = jsonwebtoken.sign({ id: id, email: email }, "SenhaParaProtegerOToken");
  return code;
}

async function statusAccess(req, res){
  if(req.cookies.access_token){
    try{
      const result = jsonwebtoken.verify(req.cookies.access_token, 'SenhaParaProtegerOToken');
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

async function exitAccess(req,res){
  res.clearCookie('access_token').redirect("/empresario/login");
}

async function getDados(id){
  const db = await Database.connect();

  const sql = `
    SELECT
      *
    FROM
      empresarios
    WHERE
      id_empresario = ?
  `;

  const result = await db.get(sql, [id]);
  return result;
}

async function editDados(body){
  const db = await Database.connect();
  const { nome, email, telefone, senha, id_empresario } = body;
  if(!senha){
    const sql = `
    UPDATE empresarios
    SET email = '${email}', nome = '${nome}', telefone = '${telefone}'
    WHERE id_empresario = ${id_empresario};
    `
    const result = await db.run(sql);
    return result;

  } else {

    const sql = `
    UPDATE empresarios
    SET email = '${email}', nome = '${nome}', senha = '${senha}', telefone = '${telefone}'
    WHERE id_empresario = ${id_empresario};
    `
    const result = await db.run(sql);
    return result;

  }
}

async function deleteDados(id){
  const db = await Database.connect();
  
  const sql = `DELETE FROM empresarios WHERE id_empresario = ?`
  const result = await db.run(sql,[id])
  if(result.changes >= 1){
    return {status: 1};
  } else {
    return {status: 0};
  }
}

export default { createEmpresario, permissionAccess, statusAccess, exitAccess, createToken, getDados, editDados, deleteDados };