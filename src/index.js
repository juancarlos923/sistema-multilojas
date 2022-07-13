import fs from 'fs';
import express from 'express';
import morgan from 'morgan';
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import router_empresario from './controller/empresario.js';
import router_loja from './controller/loja.js';
import router_cliente from './controller/cliente.js';
import router_catalogo from './controller/catalogo.js';
import router_carrinho from './controller/carrinho.js';
import Empresario from './model/empresario.js';
import Cliente from './model/cliente.js';
import Loja from './model/loja.js';
import DB from './database/migration.js';

const app = express();

app.use(cookieParser());

app.use(express.json());

app.use(morgan('tiny'));

app.use(express.static('src/view'));

app.use(router_empresario);
app.use(router_loja);
app.use(router_cliente);
app.use(router_catalogo);
app.use(router_carrinho);

app.use(fileUpload());

//Login Empresário
app.post('/empresario/createAcess', async (req, res) => {
    const result = await Empresario.permissionAccess(req,res);
    
    if (result.error == 1){
        return res.send(result);
    } else if(result.error == 0){
        const code = await Empresario.createToken(result.id, result.email);
        res.cookie("access_token",code).send({error: 0});
    }
});

//Login Cliente
app.post('/cliente/createAcess', async (req, res) => {
    const result = await Cliente.permissionAccess(req,res);
    if (result.error == 1){
        return res.send(result);
    } else if(result.error == 0){
        const code = await Cliente.createToken(result.id, result.email);
        res.cookie("access_token_cliente",code).send({error: 0});
    }
});

// Foto Produto
app.post('/produto/upload', async function(req, res) {
    if(req.files && req.body.id_produto){
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.redirect('/empresario')
        }
        const result = await Loja.getLojaProduto(req.body.id_produto)
        let sampleFile = req.files.sampleFile;
        
        let dir = `C:/Users/Juan/Desktop/multilojas-final/src/view/uploads/produtos/${result.id_loja}`;
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        try {
            sampleFile.mv(`C:/Users/Juan/Desktop/multilojas-final/src/view/uploads/produtos/${result.id_loja}/${req.body.id_produto}.png`);
        } catch (e) {
            res.redirect('/empresario');
        }
        await Loja.updateProdutoImagem(result.id_loja,req.body.id_produto);
        return res.redirect('/empresario');
    }
    res.redirect('/empresario');
});

//DB.up(); // Executar a criação do Banco de Dados


app.listen(3000, () => console.log('http://localhost:3000/'));