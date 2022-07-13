import { Router } from "express";
import Loja from '../model/loja.js';

const router_loja = Router();
// cadastro
router_loja.post('/loja/cadastro', async function(req, res) {
  const result = await Loja.createLoja(req.body);
  res.send(result);
});

router_loja.get('/loja/possui/:id', async function(req, res) {
  const id = Number(req.params.id);
  const result = await Loja.verifyLoja(id);
  res.send(result);
});

router_loja.get('/loja/info/:id', async function(req, res) {
  const id = Number(req.params.id);
  const result = await Loja.getLoja(id);
  res.send(result);
});

router_loja.get('/loja/vendas/:id', async function(req, res) {
  const id = Number(req.params.id);
  const result = await Loja.getVendas(id);
  res.send(result);
});

router_loja.get('/loja/produtos/:id', async function(req, res) {
  const id = Number(req.params.id);
  const result = await Loja.getProdutos(id);
  res.send(result);
});

router_loja.post('/loja/produto/cadastro', async function(req, res) {
  const result = await Loja.createProduto(req.body);
  res.send(result);
});

router_loja.put('/loja/produto/update', async function(req, res) {
  const result = await Loja.updateProdutos(req.body);
  res.send(result);
});

router_loja.put('/loja/dados/edit', async function(req, res) {
  const result = await Loja.updateLoja(req.body);
  res.send(result);
});

router_loja.delete('/loja/dados/delete/:id', async function(req, res) {
  const id = Number(req.params.id);
  const result = await Loja.delLoja(id);
  res.send(result);
});



export default router_loja;