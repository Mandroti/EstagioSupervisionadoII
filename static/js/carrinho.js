
function chamarModalEndereco(){
    document.getElementById('modalEnderecoNovo').style.display = "block";
   
}

function verificarAutenticacao(){
    const token = localStorage.getItem('token');
    if(token != null && token != "")
    {            
            fetch(apiUrl + "/api/Consumidor/token", { 
                method: 'GET',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`  
                },        
            })
            .then(response => response.json())
            .then(data => {
                var nomeE = localStorage.getItem('user')
                if(data != null)
                {
                    var tabela = `
                    <ul style="padding-left: 0; list-style: none; margin: 0;">
                        <li style="margin-bottom: 5px;">
                            <p style="margin: 0; font-weight: bold; color: grey">Loja: ${nomeE}</p>
                        </li>
                        <li style="margin-bottom: 5px;">
                            <p style="margin: 0; font-weight: bold;">${data.nome}</p>
                        </li>
                        <li style="margin-bottom: 5px;">
                            <p style="margin: 0;">${data.logradouro}, ${data.numero}</p>
                        </li>
                        <li>
                            <p style="margin: 0;">${data.bairro}, ${data.cidadeNome} - ${data.cep}</p>
                        </li>
                    </ul>


                    `;
                    document.getElementById('dadosConsumidor').innerHTML = tabela;
                    
                    carregarDadosPedido();
                }
                else
                {
                    window.location.href = 'login.html';
                }
            })
            .catch(error => {
                console.error("Erro ao realizar a fetch:", error);
                window.location.href = 'login.html?finalizacaoPedido';
            });           
        }
        else{           
            window.location.href = 'login.html?finalizacaoPedido';
        }

}

function carregarDadosPedido(){
    //carregaEndereco();

    
    var tabela = '';
    var valor = 0;
    var produtosRegistrados = JSON.parse(localStorage.getItem('produtosRegistrados')) || [];
    
    console.log(produtosRegistrados);

    if (produtosRegistrados.length > 0) {
        produtosRegistrados.forEach(produto => {
            
            precoProduto = produto.preco * produto.quantidade;
        
            
            valor+= precoProduto;
            tabela +=`            
            <ul style="padding-left: 0; list-style: none; margin: 0;">
                <li style="display: flex;">
                    <div class="row" style="flex: 1; display: flex;">
                        <div style="flex: 1;">
                            <p style="margin: 0; display: inline-block; margin-right: 10px;">
                                <span>${produto.quantidade}</span>
                            </p>
                            <p style="margin: 0; display: inline-block;">
                                <span>${produto.nome}</span>
                            </p>`
                           
            for(var i=0; i<produto.complementoIds.length>0; i++){
                comp = produto.complementoIds[i];
                if(comp.produtoId == produto.produtoId){
                    tabela += `
                            <div> 
                                <span>+ ${comp.nome}</span>                                
                            </div>
                    `
                    valor+= comp.precoVenda;
                    var precoComplemento = comp.precoVenda;
                    precoProduto += precoComplemento;
                }
            }

            for(var i = 0; i < produto.bordaIds.length; i++){
                comp = produto.bordaIds[i];
                
                tabela += `
                    <div> 
                        <span>+ ${comp.descricao}</span>                                
                    </div>
                `;
                valor += comp.preco; 
                precoProduto += comp.preco; 
            }
            
            
            tabela+=`</div>
                    </div>
                                
                    <div style="display: flex; align-items: center;">
                        <p style="margin-right: 8px;">
                            <span>R$${precoProduto.toFixed(2)}</span>
                        </p>
                        <img src="images/excluir.png" alt="Ícone de Deletar" style="width: 20px; height: 20px; margin-top: -13px; margin-right: 12px;" onclick="ExcluirProdutoCarrinho(${produto.produtoId})"/>
                    </div>
                </li>
                <hr style="margin-left: -15px; margin-right: 10px;">
            </ul>
            `;
        });
        
        document.getElementById('valorTotalCompra').textContent = "R$ " + valor.toFixed(2);      
        document.getElementById('tabelaPedidos').innerHTML = tabela;

    } else {
        console.log('Nenhum produto registrado.');
    }
    
}

function ExcluirProdutoCarrinho(id) {
    var produtosRegistrados = JSON.parse(localStorage.getItem('produtosRegistrados'));    
    var precoTotal = parseFloat(localStorage.getItem('precoTotal'));
    console.log(produtosRegistrados);

    for (var i = 0; i < produtosRegistrados.length; i++) {
        if (produtosRegistrados[i].produtoId == id) {

            var complementos = produtosRegistrados[i].complementoIds;
            var valor = 0;
            for (var j = 0; j < complementos.length; j++) {
                valor += complementos[j].precoVenda;
            }

            var bordas = produtosRegistrados[i].bordaIds;
            for(var k = 0; k < bordas.length; k++){
                valor += bordas[k].preco;
            }

            
            precoTotal -= ((parseFloat(produtosRegistrados[i].preco) + valor) * produtosRegistrados[i].quantidade);
            produtosRegistrados.splice(i, 1);
            

            localStorage.setItem('produtosRegistrados', JSON.stringify(produtosRegistrados));
            localStorage.setItem('precoTotal', precoTotal.toFixed(2));
  

            window.location.reload();
            
            return;
        }
    }
    console.log('Produto não encontrado no carrinho.');
}

function adicionarMaisItens(){
    var span = document.getElementById("spanAdicionarMaisItens");
    var fontSize = window.getComputedStyle(span).getPropertyValue('font-size');
    var newSize = parseFloat(fontSize) - 2; // Aumenta 2 pixels

    span.style.fontSize = newSize + 'px';
    var produtos = localStorage.getItem("produtosRegistrados");
    if(produtos == null){
        window.location.href="cardapioNovo.html?exibirFooter=false"; //nao esta funcionando sempre
    }
    else{
  
        window.location.href="cardapioNovo.html?exibirFooter=true";
    }

}

function enviarPedido(){
    localStorage.removeItem('produtosRegistrados');
    localStorage.removeItem('precoTotal');
    localStorage.setItem('quantidadeFooter', 1);
    var entregaEnderecoCadastro = document.getElementById('entrega_endereco_cadastro').checked;
    var retiradaLocal = document.getElementById('retirada_local').checked;

    if (entregaEnderecoCadastro || retiradaLocal) {
        


    } else {            
        alert("Por favor, selecione uma opção de entrega.");
    }
}
