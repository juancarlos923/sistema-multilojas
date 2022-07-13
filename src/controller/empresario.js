import { Router } from "express";
import Empresario from '../model/empresario.js';

const router_empresario = Router();
// cadastro
router_empresario.post('/empresario/cadastro/perfil', async function(req, res) {
  const id = await Empresario.createEmpresario(req.body);
  res.send(id)
});

// login
router_empresario.get('/empresario/login/verify', async (req, res) => {
  await Empresario.statusAccess(req,res);
});

router_empresario.get('/empresario/login/exit', async (req, res) => {
  await Empresario.exitAccess(req,res);
});

// dados
router_empresario.get('/empresario/dados/:id', async (req, res) => {
  const id = Number(req.params.id);
  const result = await Empresario.getDados(id);
  res.send(result);
});

router_empresario.put('/empresario/dados/edit', async (req, res) => {
  const result = await Empresario.editDados(req.body)
  res.send(result)
});

router_empresario.delete('/empresario/dados/delete/:id', async (req, res) => {
  const result = await Empresario.deleteDados(Number(req.params.id))
  res.send(result)
});


export default router_empresario;