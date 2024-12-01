const body = document.querySelector('body'),
    sidebar = body.querySelector('nav'),
    toggle = body.querySelector(".toggle"),
    searchBtn = body.querySelector(".search-box"),
    modeSwitch = body.querySelector(".toggle-switch"),
    modeText = body.querySelector(".mode-text");

toggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
})

searchBtn.addEventListener("click", () => {
    sidebar.classList.remove("close");
})

document.addEventListener('DOMContentLoaded', function() {
    let dropdownLinks = document.querySelectorAll('.tabela');

    dropdownLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            let dropdownMenu = link.querySelector('.tabela-menu');
            dropdownMenu.style.display = (dropdownMenu.style.display === 'block') ? 'none' : 'block';
        });
    });
});

function confirmarExclusaoBorda() {
    const token = localStorage.getItem("token");
    
    fetch(apiUrl + '/api/Borda/' + bordaIdExcluir, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}` 
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao excluir borda');
        }
        
        
        document.getElementById('modalExcluirBorda').style.display = 'none';
        location.reload();

        return response.text();
    })
    .then(data => {
        console.log('Borda ID:', data);
    })
    .catch(error => console.error('Erro ao deletar o ID:', error));
}

function confirmarExclusaoTamanho() {
    const token = localStorage.getItem("token");
    
    fetch(apiUrl + '/api/Tamanho/' + tamanhoIdExcluir, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}` 
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao excluir tamanho');
        }
        
        
        document.getElementById('modalExcluirTamanho').style.display = 'none';
        location.reload();

        return response.text();
    })
    .then(data => {
        console.log('Tamanho ID:', data);
    })
    .catch(error => console.error('Erro ao deletar o ID:', error));
}



function confirmarExclusaoP() {
    const token = localStorage.getItem("token");
    
    fetch(apiUrl + '/api/Produto/' + idProduto, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}` 
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao excluir produto');
        }
        
        
        document.getElementById('modalExcluirProduto').style.display = 'none';
        location.reload();

        return response.text();
    })
    .then(data => {
        console.log('Produto ID:', data);
    })
    .catch(error => console.error('Erro ao deletar o ID:', error));
}

var categoriaIdTamanho = 0;
//LISTAR PIZZAS 
async function listarPizzas() { //traz todas as pizzas
    event.preventDefault();

    const id = localStorage.getItem("id");    
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(apiUrl + `/api/Categoria/Estabelecimento/${id}/Pizza`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        console.log(data);

        let tabela = '';

        for (var i = 0; i < data.length; i++) {
            
            tabela += `
            <div style="margin-top:1%; max-height: 80vh; overflow-x: hidden;">
                <div class="row">
                    <div class="col-xl-12 col-lg-9">
                        <div class="card card-stats mb-4 mb-xl-2" style="border-color: rgb(4, 214, 50);">
                            <div class="card-body">
                                <div class="row align-items-center">
                                    <div class="col d-flex align-items-center">
                                        <h5 class="card-title text-uppercase text-muted mb-0">${data[i].nome}</h5>
                                        <button class="btn btn-transparent border-0 ml-2" style="color: #2f65fa;" onclick="pausarCategoria(${data[i].categoriaId}, '${data[i].nome}')">Pausar</button>
                                        <button class="btn btn-transparent border-0 ml-2" style="color: #2f65fa;" onclick="EditarCategoria(${data[i].categoriaId})">Editar</button>
                                    </div>
                                </div>
                            </div>
                            <hr>
                            <div class="card-body">
                                <div class="row align-items-center">
                                    <div class="col-12">
                                        <div class="card mb-3" style="border: 3px dotted rgb(0, 175, 38);">
                                            <h5 class="card-header" style="color: #c9113f;">TAMANHO</h5>
                                            <div id="tamanhos">     `                                      
                                            
            const card = await carregaTamanho(data[i].categoriaId);
            tabela += card;
            
                tabela += `
                                            </div>
                                <div class="card-body" style="background-color: rgb(203, 240, 203); padding: 10px;">
                                    <button class="btn btn-transparent border-0 ml-2" type="submit" style="font-size: 12px; padding: 3px 10px; color: rgb(0, 175, 38);" onclick="adicionarTamanho(${data[i].categoriaId})"><strong>+ Adicionar Tamanho</strong></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-12">
                            <div class="card mb-3" style="border: 3px dotted rgb(0, 175, 38);">
                                <h5 class="card-header" style="color: #c9113f;">BORDAS E MASSAS</h5>
                                <div id="bordas">

                `;          
                
            const card2 = await carregaBordas(data[i].categoriaId);
            tabela += card2;
            
                tabela += `
                                </div>
                            <div class="card-body" style="background-color: rgb(203, 240, 203); padding: 10px;">
                                <button class="btn btn-transparent border-0 ml-2" type="submit" style="font-size: 12px; padding: 3px 10px; color: rgb(0, 175, 38);" onclick="adicionarBordas(${data[i].categoriaId})"><strong>+ Adicionar Item</strong></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-12">
                        <div class="card mb-3" style="border: 3px dotted rgb(0, 175, 38);">
                            <h5 class="card-header" style="color: #c9113f;">SABORES</h5>
                            <div id="sabores">
                `;

                
            const card3 = await carregarSabores(data[i].categoriaId);
            tabela += card3;

                tabela += `
                </div>
                                <div class="card-body" style="background-color: rgb(203, 240, 203); padding: 10px;">
                                    <button class="btn btn-transparent border-0 ml-2" type="submit" style="font-size: 12px; padding: 3px 10px; color: rgb(0, 175, 38);" onclick="adicionarSabor(${data[i].categoriaId})"><strong>+ Adicionar Sabor</strong></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
                `;
                                        
    }

        document.getElementById('tabelaPizzas').innerHTML = tabela;
    } catch (error) {
        console.error('Erro:', error);
    }
}
async function carregaTamanho(id) {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(apiUrl + `/api/Tamanho?CategoriaId=${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        console.log(data);

        let tabela = '';
        let tamanhos = '';
        let descricaoExistentes = []; 

        for (var i = 0; i < data.length; i++) {            
                descricaoExistentes.push(data[i].descricao);

                tabela += `                       
                <div class="col d-flex align-items-center" style="background-color: #f5f5f5; min-height: 60px;">    
                    <div class="d-flex align-items-center flex-grow-1">                                                       
                        <h6 class="card-title text-muted mb-0" style="margin-left: 2%; flex-grow: 1;">${data[i].descricao}</h6>
                    </div>
                    <div class="col-auto d-flex align-items-center">                                                   
                        <button class="btn btn-transparent border-0 ml-2" style="color: #2f65fa;" onclick="excluirIdTamanho(${data[i].tamanhoId}, ${data[i].categoriaId})">Excluir</button>
                    </div>  
                </div><p></p>`     

                
                
                tamanhos += 
                `
                <div class="row">
                    <div class="col-12">
                        <label for="input_${data[i].tamanhoId}" id="${data[i].tamanhoId}" class="modal-title" style="margin-top: 7px; font-size: 17px;">${data[i].descricao}</label>
                    </div>
                </div>
                <div class="row">
                    <div class="col-8">
                        <input type="text" class="form-control" id="valor_${data[i].tamanhoId}" required>
                    </div>
                    <div class="col-1">
                        <button type="button" class="btn btn-success btn-block" onclick="cadastrarValores('${data[i].tamanhoId}', document.getElementById('valor_${data[i].tamanhoId}').value)">Adicionar</button>
                    </div>
                </div>              
                `;
            }
        
        document.getElementById('tamanhosDisponiveis').innerHTML = tamanhos;
        document.getElementById('tamanhosDisponiveisEditarSabores').innerHTML = tamanhos;
        return tabela;
    } catch (error) {
        console.error('Erro:', error);
    }
}
function adicionarBordas(id){
    const modal = document.getElementById('modalAdicionarBordas');
    modal.style.display = 'block';
    categoriaIdTamanho = id;
}
function adicionarTamanho(id) {
    const modal = document.getElementById('modalAdicionarTamanho');
    modal.style.display = 'block';
    categoriaIdTamanho = id;
}
var prod = 0;
function exibirSabores(produtoId,categoriaId){
    const token = localStorage.getItem("token");
    prod = produtoId;
    
    localStorage.setItem("produtoid",prod);

    document.getElementById('modalEditarSabores').style.display = 'block';
    fetch(apiUrl+`/api/Produto/${produtoId}`, {             
        method: 'GET',
        headers: {   
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }          
    })
    .then(response => response.json())
    .then(data => {
        
        document.getElementById('updateDecricaoSabor').value = data.descricao; 
        document.getElementById('updateNomeSabor').value = data.nome; 
        document.getElementById('updateImagemSabor').src = "http://www.aguiadelivery.com.br:6060/api/Storage/"+data.imagem; 
        //carregaTamanho(categoriaId);
        //AQUI PARA TRAZER OS VALORES
        carregaPrecosTamanhos(categoriaId);
        
    })
    .catch(error => console.error('Erro:', error));

    event.preventDefault();
}
function adicionarSabor(id){
    const modal = document.getElementById('modalAdicionarSabor');
    modal.style.display = 'block';
    categoriaIdTamanho = id;
    carregaTamanho(id);
}
async function carregaBordas(id){
    const token = localStorage.getItem("token");
    
    try {
        const response = await fetch(apiUrl + `/api/Borda?CategoriaId=${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        console.log(data);

        let tabela = '';

        for (var i = 0; i < data.length; i++) {
            let precoNumerico = parseFloat(data[i].preco);
            let precoFormatado = precoNumerico.toFixed(2);
            tabela += `                       
            <div class="col d-flex align-items-center" style="background-color: #f5f5f5; min-height: 60px;">    
                <div class="d-flex align-items-center flex-grow-1">                                                       
                    <h6 class="card-title text-muted mb-0" style="margin-left: 2%; flex-grow: 1;">${data[i].descricao}</h6>
                </div>
                <div class="col-auto d-flex align-items-center">                                                     
                    <p class="mb-0 mr-3" style="color: red; font-size: 20px; margin-right: 25px"><strong>${precoFormatado}</strong></p>
                    <button class="btn btn-transparent border-0 ml-2" style="color: #2f65fa;" onclick="exibirIdBorda(${data[i].bordaId}, ${data[i].categoriaId})">Editar</button>

                    <button class="btn btn-transparent border-0 ml-2" style="color: #2f65fa;" onclick="excluirIdBorda(${data[i].bordaId}, ${data[i].categoriaId})">Excluir</button>

                </div>  
            </div>
            <p></p>`                                                                                       
        }
        return tabela;
    } catch (error) {
        console.error('Erro:', error);
    }
}

var bordaIdExcluir;
function excluirIdBorda(bordaId){
    bordaIdExcluir = bordaId
    document.getElementById('modalExcluirBorda').style.display = 'block';
}

var tamanhoIdExcluir;
function excluirIdTamanho(tamanhoId){
    tamanhoIdExcluir = tamanhoId;
    document.getElementById('modalExcluirTamanho').style.display = 'block';
}

var borda = 0;
var cat = 0;
function exibirIdBorda(bordaId,categoriaId) {
    const token = localStorage.getItem("token");
    borda = bordaId;
    cat = categoriaId;
    document.getElementById('modalEditarBorda').style.display = 'block';
    fetch(apiUrl+`/api/Borda/${bordaId}`, {             
        method: 'GET',
        headers: {   
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }          
    })
    .then(response => response.json())
    .then(data => {
        
        document.getElementById('updateNomeBorda').value = data.descricao; 
        document.getElementById('updatePrecoBorda').value = data.preco; 

        
    })
    .catch(error => console.error('Erro:', error));

    event.preventDefault();
}
async function carregarSabores(id){ 
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(apiUrl + '/api/Produto/Estabelecimento/26?CategoriaId='+id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        console.log(data);

        let tabela = '';

        const precosPromises = data.map(async produto => {
            try {
                const produtoResponse = await fetch(apiUrl + '/api/Produto/' + produto.produtoId, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }          
                });
                const produtoData = await produtoResponse.json();
                if (produtoData.precos && produtoData.precos.length > 0) {
                    const precos = produtoData.precos.map(preco => preco.preco);
                    precos.sort((a, b) => a - b);
                    return precos[0];
                } else {
                    return null;
                }
            } catch (error) {
                console.error('Erro ao obter dados do produto:', error);
                return null;
            }
        });

        const precos = await Promise.all(precosPromises);

        for (let i = 0; i < data.length; i++) {
            tabela += `                       
            <div class="col d-flex align-items-center" style="background-color: #f5f5f5; min-height: 60px;">
                <div class="d-flex align-items-center flex-grow-1">
                    <img src="${apiStorage}/${data[i].imagem}" alt="Descrição da imagem" style="max-width: 50px; max-height: 50px;">
                    <h6 class="card-title text-muted mb-0" style="margin-left: 2%; flex-grow: 1;">${data[i].nome}</h6>
                </div>
                <div class="col-auto d-flex align-items-center">
                    <p class="mb-0 mr-3" style="color: red; font-size: small; margin-right: 25px">
                        A partir de <strong style="color: red; font-size: 20px; margin-right: 25px" id="preco_${data[i].produtoId}">${precos[i] ? parseFloat(precos[i]).toFixed(2) : 'Não disponível'}</strong>
                    </p>
                    <button class="btn btn-transparent border-0 ml-2" style="color: #2f65fa;" onclick="exibirSabores(${data[i].produtoId},${data[i].categoriaId})">Editar</button>
                    <button class="btn btn-transparent border-0 ml-2" style="color: #2f65fa;" onclick="excluirP(${data[i].produtoId})">Excluir</button>
                   
                </div>  
            </div>         
            <p></p>`;
        }

        return tabela;
    } catch (error) {
        console.error('Erro:', error);
    }
}

var idProduto = 0;
function excluirP(id) {

    idProduto = id;
    const modal = document.getElementById('modalExcluirProduto');
    modal.style.display = 'block';

    // Adicionando uma função para fechar o modal
    const fecharModal = document.getElementById('fecharModalProduto');
    fecharModal.addEventListener('click', function(){
        modal.style.display = 'none';
    });

    const fechar = document.getElementById('fecharModalProdutoo');
    fechar.addEventListener('click', function(){
        modal.style.display = 'none';
    });
    event.preventDefault();
}

function cadastrarValores(id, valor){//TESTANDO 

    const token = localStorage.getItem('token');
    const produto = localStorage.getItem('pizzaSabor');  

    const dadosProduto = {
        produtoId: produto,
        tamanhoId: id,       
        preco: valor
        };

    fetch(apiUrl + '/api/TamanhoPreco',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',    
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(dadosProduto),
    })
    .then(response => response.json())
    .then(data =>{
        console.log(data)
    })
    .catch(error => console.error('Erro:', error.message || error));

}


function irParaComum(){//exibe os produtos comuns no cardapio
    window.location.href = 'categoriaDashboard.html';
}



function fecharModalTamanho(){//FECHA AS MODAL DO PIZZADASHBOARD.HTML
    document.getElementById('modalAdicionarTamanho').style.display = 'none';
    document.getElementById('modalAdicionarBordas').style.display = 'none'; 
    document.getElementById('modalAdicionarTamanho').style.display = 'none';     
    document.getElementById('modalEditarBorda').style.display = 'none'; 
    document.getElementById('modalExcluirBorda').style.display = 'none'; 
    document.getElementById('modalEditarSabores').style.display = 'none';
    document.getElementById('modalAdicionarSabor').style.display = 'none';
    document.getElementById('modalAdicionarSabor').style.display = 'none';
   
    document.getElementById('modalEditarCategoria').style.display = 'none';
    location.reload();
}

//CADASTRAR
function cadastrarTamanho() { //cadastra os tamanhos das pizzas
    const token = localStorage.getItem('token');
    const nome = document.getElementById('insertNome').value;
    const checkboxes = document.querySelectorAll('input[name="inlineRadioOptions"]');
    let saboresSelecionados = [];

    checkboxes.forEach(function (checkbox) {
        if (checkbox.checked) {
            saboresSelecionados.push(checkbox.value);
        }
    });

    console.log('Sabores selecionados:', saboresSelecionados);

    saboresSelecionados.forEach(function (qtde) {
        const dados = {
            descricao: nome,
            categoriaId: categoriaIdTamanho,
            limite_Sabores: qtde,
            active: true,
        };

        fetch(apiUrl + '/api/Tamanho', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',    
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(dados),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao cadastrar tamanho');
            } else {
                window.location.href = 'pizzaDashboard.html';
            }
            return response.text();
        })
        .then(data => {
            console.log('Categoria cadastrada com sucesso:', data);
        })
        .catch(error => console.error('Erro:', error));
    });

    event.preventDefault();
}
function cadastrarBordas() {    //cadastra as bordas das pizzas
    const token = localStorage.getItem('token');
    const nome = document.getElementById('NomeBorda').value;
    const valor = document.getElementById('insertPreco').value;
    
        const dados = {
            descricao: nome,
            categoriaId: categoriaIdTamanho,
            preco: valor,
            active: true
        };

        fetch(apiUrl + '/api/Borda', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',    
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(dados),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao cadastrar bordas');
            } else {
                window.location.href = 'pizzaDashboard.html';
            }
            return response.text();
        })
        .then(data => {
            console.log('Borda cadastrada com sucesso:', data);
        })
        .catch(error => console.error('Erro:', error));

    event.preventDefault();
}
function cadastrarSabores() { //cadastra os sabores das pizzas
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    const nome = document.getElementById('nomeProduto').value;
    const descricao = document.getElementById('descricaoProduto').value;
    const imagem = imageBase64;

    const dadosProduto = {
        estabelecimentoId: id,
        nome: nome,
        categoriaId: categoriaIdTamanho,
        descricao: descricao,
        imagem: imagem,            
        active: true,
        preco: 0
    };

    fetch(apiUrl + '/api/Produto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',    
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(dadosProduto),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao cadastrar o produto');
        } 
        return response.json(); 
    })
    .then(data => {
        var pizzaSabor = data.produtoId;
        localStorage.setItem("pizzaSabor", pizzaSabor); 

        console.log('Produto cadastrado com sucesso:', data);
        document.getElementById('detalhes').classList.remove('active');
        document.getElementById('complements').classList.add('active');
        
       
    })    
    .catch(error => console.error('Erro:', error.message || error));

    event.preventDefault();
}

var imageBase64 = "";

function encodeImageFileAsURL(element) {
    var file = element.files[0];
    var reader = new FileReader();
    reader.onloadend = function() {     
      imageBase64 = reader.result;      
    }
    reader.readAsDataURL(file);
}

//EDITAR
function editarBordas(){//401 NAO AUTORIZADO para editar bordas das pizzas
    const token = localStorage.getItem("token");

    var descricao = document.getElementById('updateNomeBorda').value;
    var preco = document.getElementById('updatePrecoBorda').value;
    const dados = {
        bordaId: borda,
        descricao: descricao,
        preco: preco,
        categoriaId: cat,
        active: true
    }

    fetch(apiUrl+'/api/Borda/'+borda, {             
        method: 'PUT',
        headers: {   
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dados) 
    })
    .then(response => response.json())
    .then(data => {
        
        document.getElementById('updateNomeBorda').value = data.descricao; 
        document.getElementById('updatePrecoBorda').value = data.preco; 
        location.reload();
        
    })
    .catch(error => console.error('Erro:', error));

    event.preventDefault();
}




//nao esta utilizando
async function carregaSabores(id){
    const token = localStorage.getItem("token");
    
    try {
        const response = await fetch(apiUrl + `/api/Borda?CategoriaId=${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        console.log(data);

        let tabela = '';

        for (var i = 0; i < data.length; i++) {
            let precoNumerico = parseFloat(data[i].preco);
            let precoFormatado = precoNumerico.toFixed(2);
            tabela += `                       
            <div class="col d-flex align-items-center" style="background-color: #f5f5f5; min-height: 60px;">    
                <div class="d-flex align-items-center flex-grow-1">                                                       
                    <h6 class="card-title text-muted mb-0" style="margin-left: 2%; flex-grow: 1;">${data[i].descricao}</h6>
                </div>
                <div class="col-auto d-flex align-items-center">                                                     
                    <p class="mb-0 mr-3" style="color: red; font-size: 20px; margin-right: 25px"><strong> ${precoFormatado}</strong></p>
                    <button class="btn btn-transparent border-0 ml-2" style="color: #2f65fa;">Editar</button>
                    <button id="btnExcluir" class="btn btn-transparent border-0 ml-2" style="color: #2f65fa; display: none;">
                        <img src="images/delete.png" alt="" width="20" height="20"/>
                    </button>

                </div>  
            </div>
            <p></p>`                                                                                       
        }
        return tabela;
    } catch (error) {
        console.error('Erro:', error);
    }
}
function buscarCat(){
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    fetch(apiUrl+`/api/Categoria/Estabelecimento/${id}`, { 
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        var tabela = `<table class="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Imagem</th>
                                <th scope="col">Nome</th>   
                                <th scope="col">Status</th>                              
                                <th scope="col">Opções</th>
                            </tr>
                        </thead>
                        <tbody>`;

        for (var i = 0; i < data.length; i++) {
            var card = carregarCategoria(data[i]);
            tabela += card;
        }

        tabela += `</tbody></table>`;
        document.getElementById('tabelaCategoria').innerHTML = tabela;
    })
    .catch(error => console.error('Erro:', error));

    event.preventDefault();
}
function removerCategoria() {
    const token = localStorage.getItem("token");
    fetch(apiUrl+'/api/Categoria/'+idCategoria, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}` 
        }
    })
    .then(response => {
            if (!response.ok) {
              throw new Error('Erro ao excluir Categoria');
            }
            else{
                window.location.href = "buscarCategoria.html"
            }
            return response.text();
    })
    .then(data => {
        console.log('Categoria ID:', data);
    })
    .catch(error => console.error('Erro ao deletar o ID:', error));

    event.preventDefault();
}

function carregarDadosCategoria(id){
    fetch(apiUrl+`/api/Categoria/${id}`, {             
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }          
    })
    .then(response => response.json())
    .then(data => {
        idCliente = data.consumidorId;
        document.getElementById('updateNome').value = data.nome; 
    })
    .catch(error => console.error('Erro:', error));

    event.preventDefault();
}

function carregarCategoria(data){
    var row = `
        <tr>
            <th scope="row">${data.categoriaId}</th>
            <td>${data.nome}</td>
            <td>${data.active}</td>
            <td>
                <div>
                    <a class="btn table-action" href="#">
                        <i class="action-icon fas fa-edit" onclick="editarCategoria(${data.categoriaId})" style="margin-right: 12px;"></i>
                        <i class="action-icon fas fa-trash" onclick="excluirCategoria(${data.categoriaId})"></i>
                    </a>                         
                </div>
            </td>
        </tr>
    `;

    return row;
}
function buscarCategoria(){ 
    var nome = document.getElementById('nomeCategoria').value;
    const token = localStorage.getItem("token");
    fetch(apiUrl+'/api/Categoria/PorNome?Nome='+ nome, { 
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        var tabela = `<table class="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Imagem</th>
                                <th scope="col">Nome</th>   
                                <th scope="col">Status</th>                              
                                <th scope="col">Opções</th>
                            </tr>
                        </thead>
                        <tbody>`;

        for (var i = 0; i < data.length; i++) {
            var card = carregarCategoria(data[i]);
            tabela += card;
        }

        tabela += `</tbody></table>`;
        document.getElementById('tabelaCategoria').innerHTML = tabela;
    })
    .catch(error => console.error('Erro:', error));

    event.preventDefault();
}
function pegaCategoria(){
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    fetch(apiUrl+`/api/Categoria/Estabelecimento/${id}`, { 
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        }
    })
    .then(response => response.json())
    .then(data => {
        
        for (var i = 0; i < data.length; i++) {
            if (data[i].nome === nomeCategoria) {
                categoriaSelecionada = data[i].categoriaId;
                
                criaVariacao();
            }
        }      
    })
    .catch(error => console.error('Erro:', error));

    event.preventDefault();
}


//EDITAR SABORES
function registrarSabores(){ //NAO ESTA FUNCIONANDO
    const token = localStorage.getItem("token");
    
    var nome = document.getElementById('updateNomeSabor').value; 
    var descricao = document.getElementById('updateDecricaoSabor').value;     
    var imagem = imageBase64;
    var categoria = localStorage.getItem("cat");

    const dados = {
        categoriaId: categoria,
        nome: nome,
        descricao: descricao,
        imagem: imagem,
        active: true,
    };
    
    fetch(apiUrl+'/api/Produto/'+prod,{             
        method: 'PUT',
        headers:{
            'Content-Type': 'application/json',    
            'Authorization': `Bearer ${token}`             
        },
        body: JSON.stringify(dados)           
    })
    .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao editar categoria');
        }
        else{
            window.location.href = "pizzaDashboard.html"
        }
        return response.text();
      })
      .then(data => {
        console.log('Categoria editada com sucesso:', data);
      })
      .catch(error => console.error('Erro:', error));
      event.preventDefault();
}

//TRAZENDO VALORES DAS PIZZAS POR TAMANHOS
async function carregaPrecosTamanhos(id) {
    const token = localStorage.getItem("token");
    localStorage.setItem("cat",id);
    try {
        const response = await fetch(apiUrl + `/api/Tamanho?CategoriaId=${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        console.log(data);
        let descricaoExistentes = []; 

        for (var i = 0; i < data.length; i++) {            
            descricaoExistentes.push(data[i]);          
        }
        localStorage.setItem('descricaoExistentes', JSON.stringify(descricaoExistentes))

        var produto = localStorage.getItem("produtoid");
        fetch(apiUrl +'/api/TamanhoPreco/PorProduto/'+produto,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(data =>{
            const descricaoExistentesSalvas = JSON.parse(localStorage.getItem('descricaoExistentes'));
            var tamanhos = '';
            for(var i=0; i<data.length; i++){
                for(var j = 0; j<descricaoExistentesSalvas.length; j++)
                {
                    if(descricaoExistentesSalvas[j].tamanhoId == data[i].tamanhoId){
                        console.log(data)                     
                        
                        tamanhos += 
                        `
                        <div class="row">
                            <div class="col-12">
                                <label for="input_${data[i].tamanhoId}" id="${data[i].tamanhoId}" class="modal-title" style="margin-top: 7px; font-size: 17px;">${descricaoExistentesSalvas[j].descricao}</label>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-11">
                                <input type="text" placeholder="${data[i].preco.toFixed(2)}" class="form-control" id="valor_${data[i].tamanhoId}" required>
                            </div>
                            <div class="col-1">
                                <button type="button" class="btn btn-success btn-block" onclick="cadastrarValores('${data[i].tamanhoId}', document.getElementById('valor_${data[i].tamanhoId}').value)">Adicionar</button>
                            </div>
                        </div>
                        `;
                    }
                }
            }
 
        document.getElementById('tamanhosDisponiveisEditarSabores').innerHTML = tamanhos;
        })
        .catch(error => console.error('Erro:', error.message || error));    

    } catch (error) {
        console.error('Erro:', error);
    }
}