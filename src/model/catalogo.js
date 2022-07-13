import Database from '../database/database.js';

async function getLoja(id) {
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

async function getProdutos(id) {
  const db = await Database.connect();
  
  const sql = `
  SELECT * FROM produto WHERE id_loja = ?
  `;
  
  const result = await db.all(sql, [id]);
  
  if(result){
    return result;

  } else {
    return {};
  }
}

export default { getLoja, getProdutos };