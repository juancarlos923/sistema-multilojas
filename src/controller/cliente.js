import { Router } from "express";
import Cliente from '../model/cliente.js';

const router_cliente = Router();

// cadastro
router_cliente.post('/cliente/cadastro/perfil', async function(req, res) {
  const result = await Cliente.createCliente(req.body);
  res.send(result)
});

// login
router_cliente.get('/cliente/login/verify', async (req, res) => {
  await Cliente.statusAccess(req,res);
});

router_cliente.get('/cliente/login/exit', async (req, res) => {
  await Cliente.exitAccess(req,res);
});

// dados
router_cliente.get('/cliente/dados/:id', async (req, res) => {
  const id = Number(req.params.id);
  const result = await Cliente.getDados(id);
  res.send(result);
});

router_cliente.put('/cliente/dados/edit', async (req, res) => {
  const result = await Cliente.editDados(req.body)
  res.send(result)
});

router_cliente.delete('/cliente/dados/delete/:id', async (req, res) => {
  const result = await Cliente.deleteDados(Number(req.params.id))
  res.send(result)
});

// compras
router_cliente.get('/cliente/compras/:id', async function(req, res) {
  const id = Number(req.params.id);
  const result = await await Cliente.getcompras(id);
  res.send(result)
});

export default router_cliente;