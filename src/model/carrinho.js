import Database from '../database/database.js';

async function getProdutos(id) {
  const db = await Database.connect();
  
  const sql = `
  SELECT * FROM produto WHERE id_produto = ?
  `;
  
  const result = await db.get(sql, [id]);
  
  if(result){
    return result;

  } else {
    return {};
  }
}

export default { getProdutos };