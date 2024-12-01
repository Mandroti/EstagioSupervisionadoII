//CARDAPIONOVO.HTML
function fecharModalF(modalId) {
    document.getElementById(modalId).style.display = "none";
}

function estilo(){ //cardapioNovo 
    logo = localStorage.getItem('logo');
    nomeEstab = localStorage.getItem('nomeEstab');

    var estado = localStorage.getItem('estado');

    document.getElementById('estadoEstabelecimento').innerText = estado;

    if (estado === 'Fechado') {
        document.getElementById('estadoEstabelecimento').style.color = 'red';  // Cor vermelha para fechado
        document.getElementById('carrinhoIcon').style.display = 'none';
        document.getElementById('modalFechado').style.display = 'block';
    } else {
        document.getElementById('estadoEstabelecimento').style.color = 'green';  // Cor verde para aberto ou outro estado
    }



    document.getElementById('capaEstabelecimento').style.backgroundImage = `url('${apiStorage}/${logo}')`;
    
    tabela = ''
    tabela += `
    <div class="header-content" style="display: flex; justify-content: center; align-items: flex-start; padding: 10px;">
    <a href="estabelecimentos.html" style="position: absolute; top: 0; left: 0;">
        <img src="images/seta.png" alt="Voltar" style="width: auto; height: 30px; border-color: transparent; margin: 5px 3px">
    </a>


        <img src="${apiStorage}/${logo}" style="width: 30%;">
    </div>
    `;

    var nome = `<span style="font-size: 15px; font-weight: bold; color: black;">${nomeEstab}</span>`;
    document.getElementById('nomeEst').innerHTML = nome;
    localStorage.setItem('user',nome)

    document.getElementById('capaEstabelecimento').innerHTML = tabela;

    localStorage.removeItem('idsRegistrados');
    localStorage.removeItem('sabores');
    localStorage.setItem('precoDaPizza',0)


    carregarCategorias();
}

function carregarCategorias() {
    id = localStorage.getItem('id');

    const promises = [];

    const promise1 = fetch(apiUrl + '/api/Categoria/Estabelecimento/' + id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => response.json())
        .then(data => {
            console.log("CATEGORIAS DISPONIVEIS: "+data);
            var tabela = '';

            for (let i = 0; i < data.length; i++) {
                tabela += `
                <button class="buttonMenu" style="font-size: 15px; color: gray; font-weight: bold;" onclick="scrollToAnchor('${data[i].categoriaId}')">
                    ${data[i].nome}
                </button>
                `;
            
                promises.push(carregarProdutos(data[i].categoriaId));
            }

            document.getElementById('categoriasEstabelecimento').innerHTML = tabela;
        })
        .catch(error => console.error('Erro:', error));

    promises.push(promise1);

  
    const promise2 = fetch(apiUrl + `/api/Categoria/Estabelecimento/${id}/Pizza`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => response.json())
        .then(data => {
            console.log("CAIU NA PIZZA: "+data);
            var tabela = '';

            for (let i = 0; i < data.length; i++) {
                tabela += `
                    <button class="buttonMenu" style="font-size: 15px; color: gray; font-weight: bold;" onclick="scrollToAnchor('${data[i].categoriaId}')">
                        ${data[i].nome}
                    </button>
                `;
               
                promises.push(carregarPizzaTamanho(data[i].categoriaId));
            }

            document.getElementById('categoriasEstabelecimento').innerHTML += tabela;
        })
        .catch(error => console.error('Erro:', error));

    promises.push(promise2);

    Promise.all(promises)
        .then(() => {
            console.log('Todas as chamadas assíncronas foram concluídas.');
        })
        .catch(error => console.error('Erro ao esperar pelas chamadas assíncronas:', error));
}

function scrollToAnchor(anchorId) {
    var target = document.getElementById(anchorId);
    if (target) {
        var offset = -100; // Ajuste o valor conforme necessário
        window.scrollTo({
            top: target.offsetTop + offset,
            behavior: 'smooth'
        });
    }
}


function carregarPizzaTamanho(idCategoria)
{
    var id = localStorage.getItem('id');

    fetch(apiUrl + `/api/Produto/Estabelecimento/${id}?CategoriaId=${idCategoria}`, { //vai trazer todas pizzas da categoria
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => {
        fetch(apiUrl + `/api/Categoria/${idCategoria}`, {//vai trazer o nome da categoria
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(dado => {
            
            var nomeCategoria = dado.nome;
           

            localStorage.setItem('nomeCategoria', nomeCategoria);

            var tabela = '';

            tabela = `<div id="${idCategoria}"><p style="margin-left: 11px; margin-bottom: -2px; padding: 8px; font-size: 20px">${nomeCategoria}</p>`;

            fetch(apiUrl + '/api/Tamanho?CategoriaId='+idCategoria, {//pega os tamanhos que a categoria tem 
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            .then(response => response.json())
            .then(data => {        
                
                for (let i = 0; i < data.length; i++) {

                    fetch(apiUrl + `/api/Categoria/${idCategoria}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                    })
                    .then(response => response.json())
                    .then(dado => { 
                       var _imagem = dado.imagem;
                       localStorage.setItem('_imagem', _imagem);
                    })
                    .catch(error => console.error('Erro:', error));

                    var imagem = localStorage.getItem("_imagem");
                    tabela += `
                    <div class="card" style="background-color: #fff; margin-right: 20px; margin-left:20px; margin-top: 10px; margin-bottom: 1px;" onclick="abrirDetalhesPizza(${data[i].categoriaId},${data[i].limite_Sabores},${data[i].tamanhoId})">
                        <div style="flex:2; padding:5px;">           
                            <p style="color: #333333"; font-size: 25px; font-weight: bold">${data[i].descricao}</p>              
                            <p class="text-secondary subText" style="font-size: 11px; color:grey">${data[i].limite_Sabores} Sabores</p>
                        </div>     
                        <div style="flex:1;overflow:hidden; margin-top:5px;">               
                            <img src="${apiStorage}/${imagem}" alt="I" style="border-color:transparent; width:80%; padding: 10px;">
                        </div>
                    </div>       
                    `;
                }
                        
                tabela += `</div>`;
             
                document.getElementById('cardapio').innerHTML += tabela;
                
                categoriasCarregadas[idCategoria] = true;
        
            })
            .catch(error => console.error('Erro:', error));
           
        })
        .catch(error => console.error('Erro:', error));
    })
    .catch(error => console.error('Erro:', error));
}

var categoriasCarregadas = {};
function carregarProdutos(idCategoria) {
    var id = localStorage.getItem('id');

    fetch(apiUrl + `/api/Produto/Estabelecimento/${id}?CategoriaId=${idCategoria}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        fetch(apiUrl + `/api/Categoria/${idCategoria}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(dado => {
            
            var nomeCategoria = dado.nome;
            
            localStorage.setItem('nomeCategoria', nomeCategoria);

            var tabela = `<div id="${idCategoria}"><p style="margin-left: 11px; margin-bottom: -2px; padding: 8px; font-size: 20px">${nomeCategoria}</p>`;

            for (let i = 0; i < data.length; i++) {
                tabela += `
                <div class="card" onclick="abrirDetalhesProduto(${data[i].produtoId})" style="margin-bottom: -7px;"> 
                    <div class="image">
                        <img src="${apiStorage}/${data[i].imagem}" alt="Imagem do Produto" style="border-color: #fff;">
                    </div>       
                    <div class="info">
                        <p style="margin-top: 2px; margin-bottom: 3px; color: #333333"; font-size: 25px; font-weight: bold;>${data[i].nome}</p>
                        <p style="font-size: 11px; color:grey">${data[i].descricao}</p>
                        <p class="price" style="color: #77a773; margin-bottom: -2px">R$${data[i].preco.toFixed(2)}</p>
                    </div>
                    <div class="line" style="margin-top: -5px; margin-bottom: -5px;"></div>
                </div>
                `;
            }

            tabela += `</div>`;
           
            document.getElementById('cardapio').innerHTML += tabela;
            categoriasCarregadas[idCategoria] = true;
        })
        .catch(error => console.error('Erro:', error));
    })
    .catch(error => console.error('Erro:', error));
}

function carregarProdutosPizza(idCategoria) {
    var id = localStorage.getItem('id');
    fetch(apiUrl + `/api/Produto/Estabelecimento/${id}?CategoriaId=${idCategoria}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => {
        fetch(apiUrl + `/api/Categoria/${idCategoria}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(dado => {
            var nomeCategoria = dado.nome;
            localStorage.setItem('nomeCategoria', nomeCategoria);

            var tabela = `<div id="${idCategoria}"><h4 style="margin-left: 17px; margin-bottom: -2px;">${nomeCategoria}</h4>`;

            for (let i = 0; i < data.length; i++) {
               
                tabela += `
                <div class="card" onclick="abrirDetalhesProduto(${data[i].categoriaId})" style="margin-bottom: -7px;"> 
                    <div class="image">
                        <img src="${apiStorage}/${data[i].imagem}" alt="Imagem do Produto" style="border-color: #fff;">
                    </div>       
                    <div class="info">
                        <h4 style="margin-top: 2px; margin-bottom: 3px;">${data[i].nome}</h4>
                        <p style="font-size: 13px;">${data[i].descricao}</p>
                        <p class="price" style="color: #65B741; margin-bottom: -2px">R$${data[i].preco.toFixed(2)}</p>
                    </div>                    
                </div>
              
                `;
            }

            tabela += `</div>`;

            // Limpar o conteúdo existente antes de adicionar os novos dados
            document.getElementById('cardapioPizza').innerHTML = tabela;
            categoriasCarregadas[idCategoria] = true;
        })
        .catch(error => console.error('Erro:', error));
    })
    .catch(error => console.error('Erro:', error));
}

var produto;
function abrirDetalhesProduto(produtoId) {
    produto = produtoId;
    idCa = 0;
    localStorage.setItem('idCa', idCa);
    const novaPagina = `cardapioDetalhe.html?produtoId=${produtoId}`;
    localStorage.setItem('produto', produto);
    window.location.href = novaPagina;

}

var idCa = 0;
var limite = 0;
function abrirDetalhesPizza(Categoria, qtde, tamanho) {   
    produto = 0;
    localStorage.setItem("tamanhoID", tamanho);
    localStorage.setItem('produto', produto);
    idCa = Categoria;
    limite = qtde;
    localStorage.setItem('limite', limite);
    const novaPagina = `cardapioDetalhe.html?categoriaId=${Categoria}`;
    localStorage.setItem('idCa', idCa);
    window.location.href = novaPagina;

}

function valoresFooter() {
    var precoTotal = parseFloat(localStorage.getItem("precoTotal")); 
    var precoTotalFormatado = precoTotal.toFixed(2); 

    var produtosRegistrados = JSON.parse(localStorage.getItem('produtosRegistrados'));
    
    var qtde = produtosRegistrados.length;
    var tabela = '';
    tabela += `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 2px;">
            <div style="display: flex; align-items: center;">
                <img src="images/bag.png" alt="Ícone de Carrinho" style="width: 24px; height: 24px; margin-right: 8px; border-color: transparent;">
                <b style="font-size: 16px; color: white;">${qtde} itens</b>
            </div>

            <button id="fecharPedidoBtn" style="font-size: 16px; color: white; background-color: transparent; border-color: transparent; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;" onclick="fecharPedido()">Fechar Pedido</button>

            <b style="font-size: 16px; color: white; padding: 0px 18px">R$ ${precoTotalFormatado}</b>
        </div>
    `;
    document.getElementById('fotercompras').innerHTML = tabela;
}

function fecharPedido(){   
    window.location.href = "carrinhoNovo.html";
}


//PESQUISAR PRODUTOS
function searchClicked() { 
    const searchTerm = document.getElementById("search-input").value;
    const id = localStorage.getItem("id");
   
    if (searchTerm.trim() !== ""){
        fetch(apiUrl + `/api/Produto/${id}/PorNome?Nome=${searchTerm}&Active=true`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(data => {
            let tabela = '';

            if(data.length > 0) {
                document.getElementById('cardapio').innerHTML = '';
                for(let i = 0; i < data.length; i++){
                    tabela += `
                        <div class="card" onclick="abrirDetalhesProduto(${data[i].produtoId})" style="margin-bottom: -7px;"> 
                            <div class="image">
                                <img src="${apiStorage}/${data[i].imagem}" alt="Imagem do Produto" style="border-color: #fff;">
                            </div>       
                            <div class="info">
                                <h4 style="margin-top: 2px; margin-bottom: 3px;">${data[i].nome}</h4>
                                <p style="font-size: 13px;">${data[i].descricao}</p>
                                <p class="price" style="color: #65B741; margin-bottom: -2px">R$${data[i].preco.toFixed(2)}</p>
                            </div>
                            <div class="line" style="margin-top: -5px; margin-bottom: -5px;"></div>
                        </div>
                    `;
                }
            } else {
                tabela = `<p style="text-align: center; font-size: 16px; color: #888;">Nenhum produto localizado</p>`;
            }

            document.getElementById('cardapio').innerHTML = tabela;
        })
        .catch(error => console.error('Erro:', error));
    } else {
        document.getElementById('cardapio').innerHTML = '';
        carregarCategorias();
    }
}



//HORARIOS DE FUNCIONAMENTO 
function transformarDia(numeroDia) {
    var diasSemana = ['Domingo','Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return diasSemana[numeroDia];
}

function buscarHorarios(){
    var id = localStorage.getItem('id');
    fetch(apiUrl + `/api/Horario?EstabelecimentoId=${id}`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => {
        var tabela = `<tr>
                        <th>Dia</th>
                        <th>Horário Inicial</th>
                        <th>Horário Final</th>
                    </tr>`;

        for(var i=0; i<data.length; i++){
            var diaDaSemana = transformarDia(data[i].dia);
            tabela += `
                <tr>
                    <td>${diaDaSemana}</td>
                    <td>${data[i].abre}</td>
                    <td>${data[i].fecha}</td>
                </tr>               
            `;
        }
        document.getElementById('horasFuncionamento').innerHTML = tabela;
    })
    .catch(error => console.error('Erro:', error));
}