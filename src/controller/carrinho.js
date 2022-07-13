import { Router } from "express";
import Catalogo from '../model/catalogo.js';
import Carrinho from '../model/carrinho.js';
import Cliente from '../model/cliente.js';

const router_carrinho = Router();

router_carrinho.get('/carrinho/:id_loja/:id_produto', async function(req, res) { // salvar no carrinho
    const id_loja = Number(req.params.id_loja);
    const id_produto = Number(req.params.id_produto);
  
    let cookie = req.cookies;
  
    if(!cookie.carrinho_compra){
        var array = [
            {"id_loja":id_loja,"id_produto":id_produto}
        ]
    } else {
        var array = cookie.carrinho_compra;
        array.push({"id_loja":id_loja,"id_produto":id_produto})
    }
    res.cookie('carrinho_compra',array).redirect(`http://localhost:3000/loja/${id_loja}#produtos`);
});

router_carrinho.get('/carrinho/:id_loja/', async function(req, res) { // salvar no carrinho
    const id_loja = Number(req.params.id_loja);
    res.clearCookie('carrinho_compra').redirect(`http://localhost:3000/loja/${id_loja}`);
});

router_carrinho.get('/compra/:id_loja', async function(req, res) { // salvar no carrinho
    const id_loja = Number(req.params.id_loja);
    const info = await Catalogo.getLoja(id_loja);
    if(info.result == 0){
        res.redirect(`/loja/${id_loja}`)
    } else {
        let cookies = req.cookies.carrinho_compra;
        let key;
        let view2 = ``;
        var total = 0;
        for(key in cookies) {
            if(cookies[key].id_loja == id_loja) {
                let result = await Carrinho.getProdutos(cookies[key].id_produto);
                total += result.preço;
                view2 += `
                <div class="col-md-8" style="margin: 10px;">
                    <div class="card-title"><img src="${result.imagem}" style="width: 100px; height: 130px; margin-left: 75px;"/></div>
                    <div class="card-body" style="font-weight: 600; font-size: 16px;">
                        <div class="card" style="color: rgb(5, 106, 124)"><h6>${result.nome}</h6></div>
                        <li class="list-group-item"><b>R$ ${result.preço}</b></li>
                    </div>
                </div>
                <hr>
                `
            }
        }
        let id = await Cliente.statusAccessInterno(req.cookies.access_token_cliente)
        let dados_cliente = await Cliente.getDados(id.info.id);
        res.set('Content-Type', 'text/html');
        let view = `
        <!doctype html>
        <html lang="pt-bt">
        <script>
            checkLogin()
            async function checkLogin() {
                const url0 = '/cliente/login/verify';
                const result = await (await fetch(url0)).json();
                if(result.status != 0){
                    location.href= "/cliente/cadastro";
                }
            }
        </script>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <meta name="description" content="">
            <meta name="author" content="Mark Otto, Jacob Thornton, and Bootstrap contributors">
            <meta name="generator" content="Hugo 0.88.1">
            <title>Carrinho de Compras</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
            <link href="/cliente/carrinho-compras/style.css" rel="stylesheet"/>

            <!-- Bootstrap core CSS -->

            <style>
            .bd-placeholder-img {
                font-size: 1.125rem;
                text-anchor: middle;
                -webkit-user-select: none;
                -moz-user-select: none;
                user-select: none;
            }

            @media (min-width: 768px) {
                .bd-placeholder-img-lg {
                font-size: 3.5rem;
                }
            }
            .nav-link {
                color: white;
            }
            </style>

            
            <!-- Custom styles for this template -->
            <link href="navbar-top-fixed.css" rel="stylesheet">
        </head>
        <body > 
        <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
        <div class="container">
            <a class="navbar-brand" href="/"><img src="/cliente/carrinho-compras/logo_multilojas.jpeg" style="height: 60px; width: 60px; border-radius:6px"/></a><!--logo da loja que o cliente está comprando-->
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarCollapse">
            <ul class="navbar-nav me-auto mb-2 mb-md-0" style="font-size: 16px;">
                <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="/cliente/painel">Dashboard</a>
                </li>
                <li class="nav-item">
                <a class="nav-link active" href="/loja/${id_loja}">Catálogo</a>
                </li>
                <li class="nav-item">
                <a class="nav-link active" href="/cliente/ultimas-compras">Pedidos</a>
                </li>
                <li class="nav-item">
                <a class="nav-link active" href="/carrinho/${id_loja}">Esvaziar Carrinho</a>
                </li>
                <li class="nav-item primary" style="margin: 8px"><a href="/compra/${id_loja}">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="22" fill="currentColor" class="bi bi-cart3" viewBox="0 0 16 16">
                    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </svg></a>
                </li>
                </ul>
                <form class="d-flex">
                </form>
            </div>
        </div>
        </nav>
        <div class="py-5 text-center primary" style="color: rgb(255, 255, 255);">
        <h2>Confirme o seu pedido</h2>

        <p class="lead" style="font-size: 16px;">Confiram os produtos presentes no carrinho. Caso esteja correto seu pedido, prossiga para a etapa de pagamento.</p>
        <hr>
        </div>
        <div class="container-fluid" style="max-width: 400px; border-radius: 7px">
        <div id="dados_cliente" class="card mb-3 list-group-item d-flex justify-content-between bg-light"><a href="/cliente/edicao" style="font-weight: 700; font-size: 16px; text-decoration: none; color: black;">Seus Dados <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16" style="color: rgb(73, 73, 73); margin-left: 5px">
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
        </svg></a>
            <li class="list-group-item">${dados_cliente.nome}</li>
            <li class="list-group-item">${dados_cliente.email}</li>
            <li class="list-group-item">Telefone: ${dados_cliente.telefone}</li>
        </div>
        </div>
        <div class="container-md" style="max-width: 552px; border-radius: 7px;">
            <div class="card mb-3 card-header list-group-item d-flex justify-content-between bg-light">
                <div class="card-head text-center" style="font-size: 20px; font-weight:700; margin-bottom: 10px;">Pedido</div>
                    <li class="list-group-item d-flex justify-content-center bg-dark" style="color:white; font-weight: 600;">Item(s)</li>
                    
                    ${view2}


                    <li class="list-group-item d-flex justify-content-between bg-light text-success">
                    <h6 class="my-0">Valor Total</h6>
                    <li class="list-group-item d-flex justify-content-between bg-dark">
                    <strong style="color: white; font-size: 18px;">R$ ${total}</strong></li>
                </div>
                <button class="w-100 btn btn-primary btn-lg" onclick="pagamento()">Avançar</button>
            </div>
        </div>

        </body>
        
        <footer class="py-3 my-4">
        <nav class="navbar navbar-expand-lg aria-label Twelfth navbar example"></nav>
            <ul class="nav justify-content-center border-bottom pb-3 mb-3">
            <li class="nav-item" style="cursor: pointer;"><a href="/" class="nav-link px-2">Home</a></li>
            <li class="nav-item" style ="cursor: pointer;"><a href="/#contato" class="nav-link px-2">Contato</a></li>
            <li class="nav-item" style="cursor: pointer;"><a href="/cliente/login/" class="nav-link px-2">Login</a></li>
            <li class="nav-item" style="cursor: pointer;"><a href="/#sobre" class="nav-link px-2">Sobre</a></li>
            </ul>
            <p class="text-center text-muted">&copy; 2021-2022 Multilojas</p>
        </nav>
        </footer>
        <script src="../assets/dist/js/bootstrap.bundle.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/feather-icons@4.28.0/dist/feather.min.js" integrity="sha384-uO3SXW5IuS1ZpFPKugNNWqTZRRglnUJK6UAZ/gxOX80nxEkN9NcGZTftn6RzhGWE" crossorigin="anonymous"></script><script src="https://cdn.jsdelivr.net/npm/chart.js@2.9.4/dist/Chart.min.js" integrity="sha384-zNy6FEbO50N+Cg5wap8IKA4M/ZnLJgzc6w2NqACZaK0u0FXfOWRRJOnQtpZun8ha" crossorigin="anonymous"></script><script src="dashboard.js"></script>
        <script src="../assets/dist/js/bootstrap.bundle.min.js"></script>

        <script>
            function pagamento(){
                alert("Você irá ser encaminhado para nossa empresa parceira de pagamento.")
            }
        </script>

        </html>

        `
        res.send(view);
    }
});

export default router_carrinho;