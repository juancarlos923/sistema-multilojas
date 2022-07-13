import { Router } from "express";
import Catalogo from '../model/catalogo.js';

const router_catalogo = Router();

router_catalogo.get('/loja/:id', async function(req, res) {
  const id = Number(req.params.id);
  const info = await Catalogo.getLoja(id);
  const produtos = await Catalogo.getProdutos(id);
  let cookies = req.cookies.carrinho_compra;
  var qtd = 0;
  var key;
  for(key in cookies) {
    if(cookies[key].id_loja == id) {
        qtd++;
    }
  }
  let view2 = ``
  for (let i = 0; i < produtos.length; i++) {
    view2 += `
    <div class="col-md-4">
      <div class="card" style="width: 18rem;">
        <img src="${produtos[i].imagem}" class="card-img-top" alt="Foto do Produto">
        <div class="card-body">
          <h5 class="card-title">${produtos[i].nome}</h5>
          <h6 class="card-subtitle mb-2 text-muted">${produtos[i].categoria} | Entrega por: ${produtos[i].forma_entrega}</h6>
          <p class="card-text">${produtos[i].descricao}</p>
          <b class="card-text">R$${produtos[i].preço}</b>
          <a href="/carrinho/${id}/${produtos[i].id_produto}" class="btn btn-primary"><i class="fas fa-shopping-cart"></i> Comprar</a>
        </div>
      </div>
    </div>
    `
  }
  
  if(info.result == 0){
    res.redirect('/')
  } else {
    res.set('Content-Type', 'text/html');

    let view = `
    <!DOCTYPE html>
    <html lang="pt-BR">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
          <meta name="description" content="" />
          <meta name="author" content="" />
          <title>Página de Compras - ${info.nome}</title>
          <link rel="icon" type="image/x-icon" href="/cliente/catalogo/assets/img/favicon.ico" />
          <!-- Font Awesome icons (free version)-->
          <script src="https://use.fontawesome.com/releases/v5.15.4/js/all.js" crossorigin="anonymous"></script>
          <!-- Google fonts-->
          <link href="https://fonts.googleapis.com/css?family=Saira+Extra+Condensed:500,700" rel="stylesheet" type="text/css" />
          <link href="https://fonts.googleapis.com/css?family=Muli:400,400i,800,800i" rel="stylesheet" type="text/css" />
          <!-- Core theme CSS (includes Bootstrap)-->
          <link href="/cliente/catalogo/css/styles.css" rel="stylesheet" />
        </head>
        <body id="page-top">
            <!-- Navigation-->
            <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top" id="sideNav">
                <a class="navbar-brand js-scroll-trigger" href="#page-top">
                    <span class="d-block d-lg-none">${info.nome}</span>
                    <span class="d-none d-lg-block"><img class="img-fluid img-profile rounded-circle mx-auto mb-2" src="/cliente/catalogo/assets/img/logo.png" alt="..." /></span>
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>
                <div class="collapse navbar-collapse" id="navbarResponsive">
                    <ul class="navbar-nav">
                        <li class="nav-item"><a class="nav-link js-scroll-trigger" href="#about">Home</a></li>
                        <li class="nav-item"><a class="nav-link js-scroll-trigger" href="#termos">Termos</a></li>
                        <li class="nav-item"><a class="nav-link js-scroll-trigger" href="#produtos">Produtos</a></li>
                        <li class="nav-item"><a class="nav-link js-scroll-trigger" href="/compra/${id}">Carrinhos de Compras<sup>${qtd}</sup></a></li>
                        <li class="nav-item"><a class="nav-link js-scroll-trigger" href="/carrinho/${id}">Esvaziar Carrinho</a></li>
                    </ul>
                </div>
            </nav>
            <!-- Page Content-->
            <div class="container-fluid p-0">
                <!-- About-->
                <section class="resume-section" id="about">
                    <div class="resume-section-content">
                        <h1 class="mb-0">
                            <span class="text-primary">${info.nome}</span>
                        </h1>
                        <p class="lead mb-5">${info.descricao}</p>
                    </div>
                </section>
                <hr class="m-0" />
                <!-- Termos da Loja -->
                <section class="resume-section" id="termos">
                    <div class="resume-section-content">
                      <h2 class="mb-5">Termos da Loja</h2>
                      <p>${info.termos}</p>
                    </div>
                </section>
                <hr class="m-0" />
                <!-- Produtos -->
                <section class="resume-section" id="produtos">
                    
      <div class="container mx-auto mt-4">
        <h2 class="mb-5">Produtos</h2>
        <div class="row">
          
          ${view2}  
             
        </div>
      </div>
                </section>
            </div>
            <!-- Bootstrap core JS-->
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
            <!-- Core theme JS-->
            
            <script>
              window.addEventListener('DOMContentLoaded', event => {
              
                const sideNav = document.body.querySelector('#sideNav');
                if (sideNav) {
                    new bootstrap.ScrollSpy(document.body, {
                        target: '#sideNav',
                        offset: 74,
                    });
                };

                const navbarToggler = document.body.querySelector('.navbar-toggler');
                const responsiveNavItems = [].slice.call(
                  document.querySelectorAll('#navbarResponsive .nav-link')
                );
                responsiveNavItems.map(function (responsiveNavItem) {
                  responsiveNavItem.addEventListener('click', () => {
                    if (window.getComputedStyle(navbarToggler).display !== 'none') {
                      navbarToggler.click();
                    }
                  });
                });
              
              });
            </script>
        </body>
    </html>

    `

    res.send(Buffer.from(view));
  }
});

export default router_catalogo;