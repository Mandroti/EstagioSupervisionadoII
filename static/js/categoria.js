//MODAL
function fecharModalCategoria2(){
    document.getElementById('modalAdicionarCategoria').style.display = 'none';
    document.getElementById('modalAdicionarProduto').style.display = 'none';
    location.reload();
     
}
function adicionarCategoria(){
    const modal = document.getElementById('modalAdicionarCategoria');
    modal.style.display = 'block';
    event.preventDefault();
}
function excluirCategoria(id) {
    const modal = document.getElementById('modalExcluirCategoria');
    modal.style.display = 'block';


    idCategoria = id;

    const fecharModal = document.getElementById('fecharModalCategoria');
    fecharModal.addEventListener('click', function(){
        modal.style.display = 'none';
    });

    const fechar = document.getElementById('fecharModalCategoriaa');
    fechar.addEventListener('click', function(){
        modal.style.display = 'none';
    });
}
function editarCategoria(id){
    const modal = document.getElementById('modalEditarCategoria');
    modal.style.display = 'block';
    event.preventDefault();

    carregarDadosCategoria(id);
    idCategoria = id;
    carregaTamanho();
    

    const fecharModal = document.getElementById('modalEditarCategoria');
    fecharModal.addEventListener('click', function(){
        modal.style.display = 'none';
    });
}
function fecharModalCategoria(){

    // location.reload();
    const modal = document.getElementById('modalAdicionarCategoria');
    document.getElementById('modalAdicionarProduto').style.display = 'none';
    
    modal.style.display = 'none';
    document.getElementById('modalEditarCategoria').style.display = 'none';
   
    modal.style.display = 'none';
    document.getElementById('modalEditarProduto').style.display = 'none';

    modal.style.display = 'none';
    document.getElementById('modalAdicionarTamanho').style.display = 'none';
}

//PUT NA CATEGORIA 
function registraCategoria(){

    const token = localStorage.getItem("token");
    
    var nome = document.getElementById('updateNome').value; 
    var imagem = imageBase64;
    
    var radioButtons = document.getElementsByName('inlineRadioOptions');
    var categoriaSelecionada = '';

    radioButtons.forEach(function (radio) {
        if (radio.checked) {
            categoriaSelecionada = radio.value;
        }
    });

    if(categoriaSelecionada == 'pizza'){        
        categoriaSelecionada = 1;
    }else if(categoriaSelecionada == 'bebida'){
        categoriaSelecionada = 2;
    }else{
        categoriaSelecionada = 0;
    }
   
    const dados = {
        categoriaId: idCategoria,
        nome: nome,
        imagem: imagem,
        tipo: categoriaSelecionada,
        active: true
    };

    fetch(apiUrl+'/api/Categoria/'+idCategoria,{             
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
            window.location.href = "categoriaDashboard.html"
        }
        return response.text();
      })
      .then(data => {
        console.log('Categoria editada com sucesso:', data);
      })
      .catch(error => console.error('Erro:', error));
      event.preventDefault();  
}
function registraCategoriaPizza(){ // NAO AUTORIZADA
    const token = localStorage.getItem("token");
    
    var nome = document.getElementById('updateNome').value; 
    var min = document.getElementById('updateMin').value; 
    var max = document.getElementById('updateMax').value; 
    var imagem = imageBase64;

    const dados = {
        categoriaId: CategoriaId,
        nome: nome,
        imagem: imagem,
        tipo: 1,
        active: true,
        max_Complementos: parseInt(min),
        min_Complementos: parseInt(max)
    };
    

    fetch(apiUrl+'/api/Categoria/'+CategoriaId,{             
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

var adicionarItemCategoria = 0;
var idCategoriaTeste = 0;
async function listarCategorias() {
    event.preventDefault();

    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(apiUrl + `/api/Categoria/Estabelecimento/${id}`, {
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
            <div style="margin-top:1%;  max-height: 80vh; overflow-x: hidden; ">
            <div class="row">
                <div class="col-xl-12 col-lg-9">
                    <div class="card card-stats mb-4 mb-xl-2" style="border-color: rgb(4, 214, 50);">
                        <div class="card-body" >
                            <div class="row align-items-center">
                                <div class="col d-flex align-items-center">
                                    <h5 class="card-title text-uppercase text-muted mb-0"><strong>${data[i].nome}</strong></h5>
                                    <button class="btn btn-transparent border-0 ml-2" style="color: #2f65fa;" onclick="pausarCategoria(${data[i].categoriaId}, '${data[i].nome}')">Pausar</button>
                                    
                                    <button class="btn btn-transparent border-0 ml-2" style="color: #2f65fa;" onclick="EditarCategoria(${data[i].categoriaId})">Editar</button>
                                    <button class="btn btn-transparent border-0 ml-2" style="color: #2f65fa;" onclick="ExcluirProdutoCategoria(${data[i].categoriaId})">Editar Produtos</button>
                              </div>                                      
                            </div>
                        </div>
                        <hr>
                            <div class="card-body">
            `;

            const card = await carregarCategoria(data[i]);
            tabela += card;

            tabela += `</div>
                            <div class="col" style="background-color: rgb(203, 240, 203);">
                                    <button class="btn btn-transparent border-0 ml-2" type="submit" style="font-size: 15px; color: rgb(0, 175, 38);" onclick="adicionarProduto(${data[i].categoriaId})"><strong>+ Adicionar item</strong></button>
                                    
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <p></p>`;
        }

        document.getElementById('tabelaCategoriasProdutos').innerHTML = tabela;

        try {
            const response = await fetch(apiUrl + `/api/Categoria/Estabelecimento/${id}/Pizza`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            console.log(data.length)
        
            var categoriasHTML;

            if (data.length === 0) {
                categoriasHTML = `
                <button class="btn btn-lg btn-success" type="submit" style="font-size: 14px;" onclick="adicionarCategoria()">+ Adicionar Categoria</button>
                <button class="btn btn-lg btn-success" type="submit" style="font-size: 14px; display: none" onclick="irParaPizza()"><i class="fas fa-eye"></i> Categoria Pizza</button>
                <button class="btn btn-lg" type="submit" style="font-size: 14px; background-color: #5eab87; color: white;" onclick="verCardapio()">Ver Cardápio</button>
            `;   
            }
            else{
                categoriasHTML = `
                <button class="btn btn-lg btn-success" type="submit" style="font-size: 14px;" onclick="adicionarCategoria()">+ Adicionar Categoria</button>
                <button class="btn btn-lg btn-success" type="submit" style="font-size: 14px;" onclick="irParaPizza()"><i class="fas fa-eye"></i> Categoria Pizza</button>
                <button class="btn btn-lg" type="submit" style="font-size: 14px; background-color: #5eab87; color: white;" onclick="verCardapio()">Ver Cardápio</button>
            `;
            }
        
            document.getElementById('categorias_').innerHTML = categoriasHTML;
        } catch (error) {
            console.error('Erro:', error);
        }
        
        
        
        
        
    
    } catch (error) {
        console.error('Erro:', error);
    }
}
async function carregarCategoria(data) {
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(apiUrl + `/api/Produto/Estabelecimento/${id}?CategoriaId=${data.categoriaId}&Active=true`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const dado = await response.json();
        console.log(dado);

        let row = '';
        for (var i = 0; i < dado.length; i++) {
            
            let precoNumerico = parseFloat(dado[i].preco);
            let precoFormatado = precoNumerico.toFixed(2);




            row += `<div class="row align-items-center">
            <div class="col d-flex align-items-center" style="background-color: #f5f5f5; min-height: 60px;">

                    <div class="d-flex align-items-center flex-grow-1">
                        <img src="${apiStorage}/${dado[i].imagem}" alt="Descrição da imagem" style="max-width: 50px; max-height: 50px;">

                        <h6 class="card-title text-muted mb-0" style="margin-left: 2%; flex-grow: 1;">${dado[i].nome}</h6>
                    </div>
                    <div class="col-auto d-flex align-items-center">
                        <p class="mb-0 mr-3" style="color: red; font-size: 20px; margin-right: 25px"><strong>${precoFormatado}</strong></p>
                       
                        
                        <button class="btn btn-transparent border-0 ml-2" style="color: #2f65fa;" onclick="editarProduto(${dado[i].produtoId}, ${dado[i].categoriaId})">Editar</button>
                        <button id="btnExcluir_${dado[i].produtoId}" class="btn btn-transparent border-0 ml-2" style="color: #2f65fa; display: none;" onclick="excluirProduto(${dado[i].produtoId})">
                            <img src="images/delete.png" alt="" width="20" height="20"/>
                        </button>

                    </div>  

            </div>         
        </div>
        <p></p>`;
        } 
        return row;
    } catch (error) {
        console.error('Erro:', error);
        return ''; 
    }
}

var CategoriaId = 0;
function EditarCategoria(id) {
    const modal = document.getElementById('modalEditarCategoria');
    if (modal) {
        modal.style.display = 'block';
        CategoriaId = id;
     
        carregarDadosCategoria(id);
        event.preventDefault();
    }
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
        document.getElementById('updateImagem').value = data.imagem; 
        // if(data.tipo == 1)
        // {
        //     document.getElementById('pizza').checked;
        // }
        // else{
        //     document.getElementById('comum').checked;
        // }
    })
    .catch(error => console.error('Erro:', error));

    event.preventDefault();
}

//PRODUTO
async function ExcluirProdutoCategoria(categoriaId) {
    try {
        const id = localStorage.getItem("id");
        const token = localStorage.getItem("token");

        const response = await fetch(apiUrl + `/api/Produto/Estabelecimento/${id}?CategoriaId=${categoriaId}&Active=true`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        console.log(data);

        // Aqui você precisa percorrer os produtos da categoria e alternar a visibilidade do botão de exclusão
        for (let i = 0; i < data.length; i++) {
            const btnExcluir = document.getElementById(`btnExcluir_${data[i].produtoId}`); // Id do botão de exclusão específico para cada produto
            if (btnExcluir) {
                // Alternar a visibilidade do botão de exclusão
                btnExcluir.style.display = btnExcluir.style.display === "none" ? "block" : "none";
            }
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}
function adicionarProduto(id){
    const modal = document.getElementById('modalAdicionarProduto');
    modal.style.display = 'block';
    adicionarItemCategoria = id;
    fetchCategoria();
    event.preventDefault();    
}
function fetchCategoria() {
    var id = localStorage.getItem("id");
    var token = localStorage.getItem("token");
   

    fetch(apiUrl +`/api/Categoria/Estabelecimento/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        var selectCategoria = document.getElementById('inputCategoria');
        selectCategoria.innerHTML = `<option value="0" disabled>Selecione uma Opção</option>`;

        data.forEach(function (categoria) {
            var option = document.createElement('option');
            option.value = categoria.categoriaId;
            option.textContent = categoria.nome;

            if (categoria.categoriaId === adicionarItemCategoria) {
                option.selected = true; 
            }

            option.addEventListener('click', function() {
                pegarCat(categoria);
            });

            selectCategoria.appendChild(option);
        });
    })
    .catch(error => console.error('Erro:', error));
}
async function buscarNomeCategoria(nome){
    const id = localStorage.getItem("id");
    
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(apiUrl + '/api/Categoria/' + nome, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        console.log("data: "+data);

        return data.nome;
    } catch (error) {
        console.error('Erro:', error);
        return null; // Ou trate o erro de outra forma, se necessário
    }
}
async function buscarCategoriaNovo(){ 
    var nome = document.getElementById('produtoBuscar').value;
    const token = localStorage.getItem("token");

    if (!nome) {
        window.location.href = 'categoriaDashboard.html';
        return; // Retorna para evitar a execução do restante do código
    }
    try {

        
        const response = await fetch(apiUrl + '/api/Produto/PorNome?Nome=' + nome, {
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
            let nomeCategoria = await buscarNomeCategoria(data[i].categoriaId); // Espera o nome da categoria

            tabela += `
            <div style="margin-top:1%;  max-height: 80vh; overflow-x: hidden;">
            <div class="row">
                <div class="col-xl-12 col-lg-9">
                    <div class="card card-stats mb-4 mb-xl-2" style="border-color: rgb(4, 214, 50);">
                        <div class="card-body">
                            <div class="row align-items-center">
                                <div class="col d-flex align-items-center">
                                    <h5 class="card-title text-uppercase text-muted mb-0"><strong>${nomeCategoria}</strong></h5>
                                    <button class="btn btn-transparent border-0 ml-2" style="color: #2f65fa;" onclick="pausarCategoria(${data[i].categoriaId}, '${data[i].nome}')">Pausar</button>
                                    <button class="btn btn-transparent border-0 ml-2" style="color: #2f65fa;" onclick="EditarCategoria(${data[i].categoriaId})">Editar</button>
                                    <button class="btn btn-transparent border-0 ml-2" style="color: #2f65fa;" onclick="ExcluirProdutoCategoria(${data[i].categoriaId})">Editar Produtos</button>
                                </div>
                            </div>
                        </div>
                        <hr>
                        <div class="card-body">
                            <div class="row align-items-center">
                                <div class="col d-flex align-items-center" style="background-color: #f5f5f5; min-height: 60px;">
                                    <div class="d-flex align-items-center flex-grow-1">
                                        <img src="http://www.aguiadelivery.com.br:6060/api/Storage/${data[i].imagem}" alt="Descrição da imagem" style="max-width: 50px; max-height: 50px;">
                                        <h6 class="card-title text-muted mb-0" style="margin-left: 2%; flex-grow: 1;">${data[i].nome}</h6>
                                    </div>
                                    <div class="col-auto d-flex align-items-center">
                                        <p class="mb-0 mr-3" style="color: red; font-size: 20px; margin-right: 25px;"><strong>${precoFormatado}</strong></p>
                                        
                                        <button class="btn btn-transparent border-0 ml-2" style="color: #2f65fa;" onclick="editarProduto(${data[i].produtoId}, ${data[i].categoriaId})">Editar</button>
                                        <button id="btnExcluir_${data[i].produtoId}" class="btn btn-transparent border-0 ml-2" style="color: #2f65fa; display: none;" onclick="excluirProduto(${data[i].produtoId})">
                                            <img src="images/delete.png" alt="" width="20" height="20"/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <p></p>
                        </div>
                        <div class="col" style="background-color: rgb(203, 240, 203);">
                            <button class="btn btn-transparent border-0 ml-2" type="submit" style="font-size: 15px; color: rgb(0, 175, 38);" onclick="adicionarProduto(${data[i].categoriaId})"><strong>+ Adicionar item</strong></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
            `;
        }

        document.getElementById('tabelaCategoriasProdutos').innerHTML = tabela;
    } catch (error) {
        console.error('Erro:', error);
    }

    event.preventDefault();
}
var idProduto = 0;
function editarProduto(id, idcat){
    const modal = document.getElementById('modalEditarProduto');
    modal.style.display = 'block';
    event.preventDefault();

    carregarDadosProduto(id);
    idProduto = id;
    idCategoriaTeste = idcat;
   
    
    // Adicionando uma função para fechar o modal
    const fecharModal = document.getElementById('fecharModalEditarProduto');
    fecharModal.addEventListener('click', function(){
        modal.style.display = 'none';
    });

}
function carregarDadosProduto(id){
    fetch(apiUrl+`/api/Produto/${id}`, {             
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }          
    })
    .then(response => response.json())
    .then(data => {
        fetchCategoriaEditar();
        
        document.getElementById('updateProduto').value = data.nome;
        document.getElementById('updateValor').value = data.preco;
        document.getElementById('updateCategoria').value = data.categoriaId;
        document.getElementById('updateDescricao').value = data.descricao;        
      
        document.getElementById('previewImage').src  = "http://www.aguiadelivery.com.br:6060/api/Storage/"+data.imagem;
        localStorage.setItem('urlImagem', data.imagem);

    
    })
    .catch(error => console.error('Erro:', error));

    event.preventDefault();
}
function fetchCategoriaEditar() {
    var id = localStorage.getItem("id");
    var token = localStorage.getItem("token");

    fetch(apiUrl + `/api/Categoria/Estabelecimento/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        var selectCategoria = document.getElementById('updateCategoria');

        selectCategoria.innerHTML = `<option value="0" disabled>Selecione uma Opção</option>`;

        data.forEach(function (categoria) {
            var option = document.createElement('option');
            option.value = categoria.categoriaId;
            option.textContent = categoria.nome;

            option.addEventListener('click', function() {
                
                pegarCat(categoria);
            });

            selectCategoria.appendChild(option);
        });

        var selectCategoria = document.getElementById('updateCategoria');

        selectCategoria.innerHTML = `<option value="0" disabled>Selecione uma Opção</option>`;

        data.forEach(function (categoria) {
            var option = document.createElement('option');
            option.value = categoria.categoriaId;
            option.textContent = categoria.nome;

            option.addEventListener('click', function() {
                
                pegarCat(categoria);
            });

            selectCategoria.appendChild(option);
        });

    })
    .catch(error => console.error('Erro:', error));
}
// PARA CARREGAR NO SELECT AS CATEGORIAS EXISTENTES
var categoriaSelecionada = 0; // vazio para armazenar a categoria selecionada
function pegarCat(categoria){
    categoriaSelecionada = categoria.categoriaId;
}
var idProduto = 0;
function excluirProduto(id) {

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
}

function confirmarExclusao() {
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
        
        // Aqui, esconda a modal
        ///listarPizzas();
        document.getElementById('modalExcluirProduto').style.display = 'none';
        location.reload();
        
        return response.text();
    })
    .then(data => {
        console.log('Produto ID:', data);
    })
    .catch(error => console.error('Erro ao deletar o ID:', error));

    // Previne o recarregamento da página
    event.preventDefault();
}


function criarProduto(){

    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");


    var nome = document.getElementById('nomeProduto').value; 
    var valor = document.getElementById('valorProduto').value;
    var categoria = adicionarItemCategoria;
    var descricao = document.getElementById('descricaoProduto').value;
    var imagem =imageBase64;  


    const dados = {
        estabelecimentoId: id, nome: nome, descricao: descricao, imagem: imagem, 
        preco: valor, categoriaId: categoria, active: true
    };       

    fetch(apiUrl+'/api/Produto',{             
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',    
            'Authorization': `Bearer ${token}`             
        },
        body: JSON.stringify(dados)           
    })
    .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao cadastrar produto');
        }
        else{
            window.location.href = "categoriaDashboard.html"
            console.log(response)
        }
        return response.text();
      })
      .then(data => {
        console.log('Produto cadastrado com sucesso:', data);
      })
      .catch(error => console.error('Erro:', error));
      event.preventDefault();  
}
function registrarProduto(){
    var urlImg = localStorage.getItem('urlImagem');
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");

    var nome = document.getElementById('updateProduto').value; 
    var valor = document.getElementById('updateValor').value;
    var categoria = idCategoriaTeste;    
    var descricao = document.getElementById('updateDescricao').value;
    var imagem = imageBase64;  

  
    let dados = {
        produtoId: idProduto, 
        estabelecimentoId: id, 
        nome: nome, 
        descricao: descricao, 
        preco: valor, 
        active: true, 
        categoriaId: categoria,
        imagem: urlImg //esta gravando direto sem passar para base 64, preciso converter para base 64 antes de enviar 
    };

    if(imagem.length > 0) {        
        dados.imagem = imagem;
    }

    
    fetch(apiUrl+'/api/Produto/'+idProduto,{             
        method: 'PUT',
        headers:{
            'Content-Type': 'application/json',    
            'Authorization': `Bearer ${token}`             
        },
        body: JSON.stringify(dados)           
    })
    .then(response=> response.json())
    .then(data => {
        console.log('Produto editado com sucesso:', data);
        window.location.href = "categoriaDashboard.html"

    })
    .catch(error => console.error('Erro:', error));
    event.preventDefault();  
}




//PAUSAR CATEGORIA
var idCategoria = 0;
var nomeCategoria = '';
function pausarCategoria(id, nome) {

    idCategoria = id;
    nomeCategoria = nome;
    const modal = document.getElementById('modalPausarCategoria');
    modal.style.display = 'block';

    // Adicionando uma função para fechar o modal
    const fecharModal = document.getElementById('fecharModalCategoria');
    fecharModal.addEventListener('click', function(){
        modal.style.display = 'none';
    });

  
}




function confirmarPausa(){
    const token = localStorage.getItem("token");
    
    const dados = {
        categoriaId: idCategoria, active: false, nome: nomeCategoria
    };        

    fetch(apiUrl+'/api/Categoria/'+idCategoria, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados) 
    })
    .then(response => {
            if (!response.ok) {
              throw new Error('Erro ao pausar categoria');
            }
            else{
                window.location.href = "categoriaDashboard.html"
            }
            return response.text();
    })
    .then(data => {
        console.log('categoria ID:', data);
    })
    .catch(error => console.error('Erro ao deletar o ID:', error));

    event.preventDefault();
}


//PARTE DAS PIZZAS
function irParaPizza(){
    window.location.href = 'pizzaDashboard.html';
}


// CARREGA ESTABELECIMENTO CARDAPIO
function verCardapio() { 
    var id = localStorage.getItem("id");
    var token = localStorage.getItem("token");
  
    fetch(apiUrl + `/api/Estabelecimento/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => {
       
        console.log(data);
        logo = data.logo;
        nomeEstab = data.nome;
        localStorage.setItem('logo', logo);
        localStorage.setItem('nomeEstab', nomeEstab);        
        
        // Abre cardapioNovo.html em uma nova guia
        window.open("cardapioNovo.html", "_blank");
        
    })
    .catch(error => console.error('Erro:', error));  
}


//CRIAR CATEGORIA
function criarCategoria() {  

    const token = localStorage.getItem('token');
    const nome = document.getElementById('insertNome').value;
    const imagem = imageBase64;
    const radioButtons = document.getElementsByName('inlineRadioOptions');
    let categoriaSelecionada = null;
    nomeCategoria = document.getElementById('insertNome').value;

    var min = document.getElementById('nomeCategoriaComplementoMin').value;
    var max = document.getElementById('nomeCategoriaComplementoMax').value;

    radioButtons.forEach(function (radio) {
        if (radio.checked) {
            categoriaSelecionada = radio.value;
            
        }
    });
    
    if (categoriaSelecionada === 'pizza') {
        categoriaSelecionada = 1;        
    }
    else{
        categoriaSelecionada = 0;
    }
  
    const dados = {
      nome: nome,
      imagem: imagem,
      tipo: categoriaSelecionada,
      active: true,
      max_Complementos: max,
      min_Complementos: min //if min > 1 complemento obrigatorio
    };

    fetch(apiUrl +'/api/Categoria', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(dados),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao cadastrar categoria');
      } else {
        
      
        return response.json(); 
      }    
    })
    .then(data => {
      categoriaCriada = data.categoriaId;
        
      if(categoriaSelecionada!=1){
        document.getElementById('basic').classList.remove('active');
        document.getElementById('complementos').classList.add('active');
      }
      else{        
        fecharModalCategoria();
      }

    
    
      console.log('Categoria cadastrada com sucesso:', data.categoriaId);
    })
    .catch(error => console.error('Erro:', error));

    event.preventDefault();
}  
function registraCategoria(){

    const token = localStorage.getItem("token");
    
    var nome = document.getElementById('updateNome').value; 
    var imagem = document.getElementById('updateImagem').value;
    
    var radioButtons = document.getElementsByName('inlineRadioOptions');
    var categoriaSelecionada = '';

    radioButtons.forEach(function (radio) {
        if (radio.checked) {
            categoriaSelecionada = radio.value;
            
        }
    });
    
    if (categoriaSelecionada === 'pizza') {
        categoriaSelecionada = 1;
      
    }
    else{
        categoriaSelecionada = 0;
    }
   
    const dados = {
        categoriaId: CategoriaId,
        nome: nome,
        imagem: imagem,
        tipo: categoriaSelecionada,
        active: true
    };

    fetch(apiUrl+'/api/Categoria/'+CategoriaId,{             
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
            
            if(categoriaSelecionada === 1)
            {
                window.location.href = "pizzaDashboard.html"
            }
            else{
                window.location.href = "categoriaDashboard.html"
            }
        }
        return response.text();
      })
      .then(data => {
        console.log('Categoria editada com sucesso:', data);
      })
      .catch(error => console.error('Erro:', error));
      event.preventDefault();  
}


//COMPLEMENTOS E VARIACOES 
function carregarComplementosExistentes() {
    // TRAZER TODOS COMPLEMENTOS DE TODAS CATEGORIAS NAO TEM AINDA
    const id = localStorage.getItem("id");
    var token = localStorage.getItem("token");
    fetch(apiUrl + '/api/Categoria/Estabelecimento/' + id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            let tabela = ''; // Declare a variável fora do loop externo
            let nomesAdicionados = []; // Array para armazenar nomes já adicionados

            for (let j = 0; j < data.length; j++) {
                var oldId = data[j].categoriaId;
                fetch(apiUrl + '/api/Complemento?CategoriaId=' + oldId, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                     
                    .then(response => response.json())
                    .then(dado => {

                        // tabela += `
                     
                        // `;

                        for (let i = 0; i < dado.length; i++) {
                            console.log('DADOS DOS COMPLEMENTO' + dado[i].nome);

                            
                            if (!nomesAdicionados.includes(dado[i].nome)) {
                                nomesAdicionados.push(dado[i].nome);
                                tabela += `
                                    <tr>
                                        <td>${dado[i].nome}</td>
                                        <td>R$ ${dado[i].precoVenda}</td>
                                        <td><button class="btn btn-success" onclick="adicionarComplementoExistente(${dado[i].complementoId}, this)">Adicionar</button></td>
                                    </tr>
                                `;
                            }
                        }

                        document.getElementById('tabelaComplementos').innerHTML = tabela;
                    })
                    .catch(error => console.error('Erro:', error));
            }
        })
        .catch(error => console.error('Erro:', error));
}
function carregarComplementosExistentesEditar() {
    const id = localStorage.getItem("id");
    fetch(apiUrl + '/api/Categoria/Estabelecimento/' + id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            let tabela = ''; 
            let nomesAdicionados = []; 

            for (let j = 0; j < data.length; j++) {
                
                fetch(apiUrl + '/api/Complemento?CategoriaId=' + CategoriaId, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(response => response.json())
                    .then(dado => {
                       
                        for (let i = 0; i < dado.length; i++) {
                            console.log('DADOS DOS COMPLEMENTO' + dado[i].nome);

                            if (!nomesAdicionados.includes(dado[i].nome)) {
                                nomesAdicionados.push(dado[i].nome);
                                tabela += `
                                    <tr>
                                        <td>${dado[i].nome}</td>
                                        <td>R$ ${dado[i].precoVenda.toFixed(2)}</td>

                                        <td colspan="2" class="d-flex justify-content-end" style="margin-left: 13px"> 
                                            <button class="btn btn-warning ml-2" onclick="EditarComplementoExistente_(${dado[i].complementoId}, ${CategoriaId})" style="margin-right:10px">Editar</button>
                                            <button class="btn btn-danger ml-2" onclick="ExcluirComplementoExistente_(${dado[i].complementoId})">Excluir</button>
                                        </td>
                                    </tr>
                                `;
                            }
                        }
                        document.getElementById('tabelaComplementosEditar').innerHTML = tabela;
                    })
                    .catch(error => console.error('Erro:', error));
            }
        })
        .catch(error => console.error('Erro:', error));
}
function adicionarComplementoExistente(id,button){
    const token = localStorage.getItem("token");
    fetch(apiUrl + '/api/Complemento/'+id,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`           
        }
    })
    .then(response => response.json())
    .then(data => {
        var nome = data.nome;
        var preco = data.precoVenda;
        var categoriaid = categoriaCriada;
        const dados ={
            nome: nome, precoCusto: null, externalId: 0, precoVenda: preco, active: true, categoriaId: categoriaid
        }

        fetch(apiUrl + '/api/Complemento/',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(dados)   
        })
        .then(response => {
            if (!response.ok) {
              throw new Error('Erro ao cadastrar complemento');
            }
           
          })
          .then(data => {
            var row = button.closest('tr');
            row.parentNode.removeChild(row);
          })
        .catch(error => console.error('Erro:', error));
        
    })
    .catch(error => console.error('Erro:', error));
}
var complementoAtual = 0;
var categoriaAtual = 0;
function EditarComplementoExistente_(id,categoria){
    const token = localStorage.getItem("token");
    complementoAtual = id;
    categoriaAtual = categoria;
    document.getElementById('myModalComple').style.display = 'block';

    fetch(apiUrl+`/api/Complemento/${id}`, {             
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }          
    })
    .then(response => response.json())
    .then(data => {
       
        console.log(data)
        
        document.getElementById('nomeCompl').value = data.nome;
        document.getElementById('precoCompl').value = data.precoVenda.toFixed(2);
     
       
    })
    .catch(error => console.error('Erro:', error));

    event.preventDefault();
}
function ExcluirComplementoExistente_(id){
    localStorage.setItem('complemento_', id);
    document.getElementById('modalExcluirComplemento').style.display = 'block';
    event.preventDefault();
}

var contCard = 0;
function adicionarComplementoC(){
    contCard++;
    // <button type="button" id="submit" class="btn btn-primary btn-block" style="background-color: #ce2c2c; border-color: transparent; text-decoration: none; border-radius: 3px; margin-left: 10px;" onclick="excluirLayoutComplementos()">Excluir</button>
    const conteudoHtml = 
    `
    <div class="card" id="${contCard}" style="border-color: transparent; background-color: #f5f5f5 ;padding: 20px; border-radius: 0px; margin-top: 20px;">                                                  
        
            <div style="display: flex; align-items: center;">
                <label for="insertComplemento" class="modal-title" style="font-size: 17px;">Nome </label>
                <input type="text" class="form-control" id="nomeComplemento" required style="margin-right: 2%;">
                <label for="insertPrecos" class="modal-title" style="font-size: 17px; margin-left: 10px;">Preço </label>
                <input type="text" class="form-control" id="precoComplemento" required style="margin-right: 2%;">
                
            </div>
            <div class="d-flex justify-content-between">
                <div class="d-flex">
                   
                </div>
            </div>                                            
            <hr/>
            <div style="display: flex; justify-content: flex-end;">                                    
                <button type="submit" id="submit" class="btn btn-primary btn-block w-20" style="background-color: #0dad23; border-color: transparent; text-decoration: none;" onclick="criarComplemento()">CADASTRAR</button>           
            </div>  
    </div>    
    `
    const divTesteCategoria = document.getElementById('testecategoria');
    divTesteCategoria.insertAdjacentHTML('beforeend', conteudoHtml);
    event.preventDefault();
}
function adicionarComplementoCategoria(){
    contCard++;
    const conteudoHtml = 
    `
    <div class="card" id="${contCard}" style="border-color: transparent; background-color: #f5f5f5 ;padding: 20px; border-radius: 0px; margin-top: 20px;">                                                  
        <label for="insertNome" class="modal-title" style="margin-top: 7px; font-size: 17px;">Nome </label>
        <div style="display: flex; flex-direction: row-reverse;">
            <input type="text" class="form-control" id="nomeCategoriaComplemento" required style="order: 2; margin-right: 2%;">
            <button type="button" id="submit" class="btn btn-primary btn-block w-20" style="background-color: #ce2c2c; border-color: transparent; text-decoration: none; border-radius: 3px; width: 10%; order: 1;" onclick="excluirLayoutComplementos()">Excluir</button>
        </div>
        
            

            <div class="d-flex justify-content-between">
                <div class="d-flex">
                    
                </div>
                <div class="d-flex align-items-center">
                    <input type="checkbox" id="subscribeNews" name="subscribe" value="newsletter" style="margin-right: 5px;" />
                    <label for="subscribeNews" style="margin-bottom: -2px;">Complemento Obrigatório</label>
                </div>
            </div>                                            
            <hr/>

            <div id="novosComplementos"">
                         



            </div>

            <button type="button" id="submit" class="btn btn-primary btn-block w-20" style="background-color: #0dad23; border-color: transparent; text-decoration: none; padding: 10px; width: 10%; margin-top: 20px;" onclick="adicionarItemComplemento('${contCard}')">+ Adicionar Item</button>           
    </div>    
    `
    const divTesteCategoria = document.getElementById('testecategoria');
    divTesteCategoria.insertAdjacentHTML('beforeend', conteudoHtml);
    event.preventDefault();
}
function adicionarComplementoV(){
    contCard++;
    const conteudoHtml = 
    `
    <div class="card" id="${contCard}" style="border-color: transparent; background-color: #f5f5f5 ;padding: 20px; border-radius: 0px; margin-top: 20px;">                                                  
        <label for="insertNome" class="modal-title" style="margin-top: 7px; font-size: 17px;">Nome </label>
        <div style="display: flex; flex-direction: row-reverse;">
            <input type="text" class="form-control" id="nomeCategoriaComplemento" required style="order: 2; margin-right: 2%;">
            <button type="button" id="submit" class="btn btn-primary btn-block w-20" style="background-color: #0dad23; border-color: transparent; text-decoration: none; border-radius: 3px; width: 10%; order: 1; margin-left: 5px" onclick="criarGrupoVariacao()">Adicionar</button>
          </div>
        
                                               
            <hr/>

            <div id="novosComplementos"">
                         
            </div>

            <button type="button" id="submit" class="btn btn-primary btn-block w-20" style="background-color: #0dad23; border-color: transparent; text-decoration: none; padding: 10px; width: 10%; margin-top: 20px;" onclick="adicionarItemComplemento('${contCard}')">+ Adicionar Itens</button>           
    </div>    
    `
    const divTesteCategoria = document.getElementById('testevaraicao');
    divTesteCategoria.insertAdjacentHTML('beforeend', conteudoHtml);
    event.preventDefault();
}
function excluirLayoutComplementos(){
    var cardASerExcluido = event.target.closest('.card');
    if (cardASerExcluido) {
        cardASerExcluido.remove();
    } else {
        console.log("Card não encontrado para exclusão.");
    }
}  
var categoriaCriada = 0;
function criarComplemento(){    
    const token = localStorage.getItem('token');
    const nome = document.getElementById('nomeComplemento').value;
    const precoVenda = document.getElementById('precoComplemento').value;
    const dados = {
        nome: nome,
        precoVenda: precoVenda,
        active: true,
        categoriaId: categoriaCriada
      };

    fetch(apiUrl + '/api/Complemento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(dados),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao cadastrar categoria');
        } 
        
        return response.text();
      })
      .then(data => {
        console.log('Categoria cadastrada com sucesso:', data);
        document.getElementById('nomeComplemento').value = '';
        document.getElementById('precoComplemento').value = '';
      })
      .catch(error => console.error('Erro:', error));
  
      event.preventDefault();
}
const dadosComplementos = []; 
function adicionarItemComplemento(cardId) {
    var complementoCounter = document.getElementById(cardId).querySelectorAll('.complemento-row').length + 1;
  
    var row = `
      <div class="complemento-row" style="display: flex; flex-direction: row; margin-top: 15px">
        <input type="text" class="form-control w-100" id="nomeCategoriaComplemento${complementoCounter}" placeholder="Variação" required> 
        <button type="button" id="submit" class="btn btn-primary btn-block w-20" style="background-color: #0dad23; border-color: transparent; text-decoration: none; border-radius: 3px; width: 10%; order: 1; margin-left: 5px" onclick="criarVariacoes(${complementoCounter})">Adicionar</button>
        <button type="button" class="btn btn-primary btn-block w-20" style="width: 10%; margin-left: 3%; background-color: #ce2c2c; border-color: transparent; text-decoration: none; border-radius: 3px;" onclick="excluirComplementoCategoria(this)">Excluir</button>      

        </div>`;
  
    const divNovosComplementos = document.getElementById(cardId).querySelector('#novosComplementos');
    divNovosComplementos.insertAdjacentHTML('beforeend', row);

   
    event.preventDefault();
}
function excluirComplementoCategoria(botao) {
    var itemASerExcluido = botao.parentElement;
    itemASerExcluido.remove();
}
var grupoCriado;
function criarGrupoVariacao(){
    const token = localStorage.getItem("token");
    

    var valorCampo = document.getElementById('nomeCategoriaComplemento').value

    const dados = {
        active: true,
        categoriaId: categoriaCriada,
        titulo: valorCampo
    };       

    fetch(apiUrl+'/api/Variacao/Grupo?CategoriaId='+categoriaCriada,{             
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',    
            'Authorization': `Bearer ${token}`             
        },
        body: JSON.stringify(dados)           
    })
    .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao cadastrar produto');
        }        
        return response.json();
      })
      .then(data => {
        grupoCriado = data.grupoId;
        
        console.log('Variacao cadastrada com sucesso:', data);
       
      })
      .catch(error => console.error('Erro:', error));
      event.preventDefault();  
}
function criarVariacoes(complementoCounter){ //ESTA DANDO NOT FOUND CADASTRAR ITEM DA VARIACAO
    const token = localStorage.getItem("token");

    var nome = document.getElementById('nomeCategoriaComplemento'+complementoCounter).value;


    const dados = {
        grupoId: grupoCriado,
        name: nome, 
        active: true,
        preco: 0.0,
       
    };

    fetch(apiUrl + '/api/Produto/GrupoVariacao/Variacao', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dados)
        })
        .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao cadastrar produto');
        }
        return response.json();
        })
        .then(data => {
        console.log('Produto cadastrado com sucesso:', data);
        })
        .catch(error => console.error('Erro:', error));
      
    
      event.preventDefault();
}
function ExcluirComplemento(){
    const token = localStorage.getItem("token");
    var complemento_ = localStorage.getItem("complemento_")
    
    fetch(apiUrl+'/api/Complemento/'+complemento_, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}` 
        }
    })
    .then(response => {
            if (!response.ok) {
              throw new Error('Erro ao excluir complemento');
            }
            else{
                window.location.href = "categoriaDashboard.html"
            }
            return response.text();
    })
    .then(data => {
        console.log('Complemento ID:', data);
    })
    .catch(error => console.error('Erro ao deletar o ID:', error));

    event.preventDefault();
}

//401 nao auorizado, quero cadastrar um complemento ja na categoria criada
function AdicionarComplemento_(){
    const token = localStorage.getItem("token");
    var nome = document.getElementById('nomeComplNovo').value;
    var preco = document.getElementById('precoComplNovo').value;


    const dados = {
        nome: nome,
        precoVenda: preco,
        categoriaId: CategoriaId,
        active: true,
    }

    fetch(apiUrl + '/api/Complemento',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dados)   
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao cadastrar complemento');
        }        
        document.getElementById('myModalCompleNovo').style.display = 'none';
    })

    .catch(error => console.error('Erro:', error));       

    event.preventDefault();
}
function EditarComplementoExistente(){
    event.preventDefault();

    const token = localStorage.getItem("token");

    var nome = document.getElementById('nomeCompl').value;
    var preco = document.getElementById('precoCompl').value;


    const dados = {
        complementoId: complementoAtual,
        nome: nome,
        precoVenda: preco,
        categoriaId: categoriaAtual
    }

    fetch(apiUrl + '/api/Complemento/'+complementoAtual,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dados)   
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao cadastrar complemento');
        }
        
        })
        .then(data => {
            carregarComplementosExistentesEditar();
            document.getElementById('myModalComple').style.display = 'none';
            
        })
    .catch(error => console.error('Erro:', error));       

   
}


function AbreModal_(event){
    document.getElementById('myModalCompleNovo').style.display = 'block';
   
    event.preventDefault();
}



var nomeCategoria = '';
var imageBase64 = "";
function encodeImageFileAsURL(element) {
    var file = element.files[0];
    var reader = new FileReader();
    reader.onloadend = function() {
      
      imageBase64 = reader.result;
      
    }
    reader.readAsDataURL(file);
}

var idCategoria = 0;

const categoriaDiv = document.getElementById('categoriaDiv');
const radios = categoriaDiv.querySelectorAll('input[name="inlineRadioOptions"]');

var categoriaSelecionada = 0;

