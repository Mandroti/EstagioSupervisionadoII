function carregaDadosPedido(){
    localStorage.removeItem('produtosRegistrados')
    var pedido = localStorage.getItem("pedidoId");
    fetch(apiUrl +'/api/Pedido/?IdPedido='+ pedido, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(dado => {
        console.log(dado);
        const dataISO = dado.createAt;
        const date = new Date(dataISO);
    
        const options = {
            timeZone: 'America/Sao_Paulo',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };
    
        const formattedDate = new Intl.DateTimeFormat('pt-BR', options).format(date);

        var pedidoHTML = 
        `
        <h3>Pedido ${dado.pedidoId}</h3>
        <p>${formattedDate}</p>
        `;
      
        document.getElementById('pedido_').innerHTML = pedidoHTML;

        //rota para saber o status do pedido
        fetch(apiUrl +'/api/Status?pedidoId='+ pedido, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => {
            if (!response.ok) {
            throw new Error('Erro na requisição: ' + response.status);
            }
            return response.json(); // ou response.text(), dependendo do formato esperado
        })
        .then(data => {
            
            var variavel = data.status;

            var statusPedidoHTML;

            var timeline_;    

            if(variavel === 2){
                document.getElementById('btnCancelarPedido').style.display = 'none';
                timeline_ = `
                        <li class="enviado">
                            <a>Pedido Enviado</a>
                        </li>
                        <li class="enviado">
                            <a>Pedido em Preparo</a>
                        </li>
                        <li>
                            <a>Pedido Pronto</a>
                        </li>
                        <li>
                            <a>Pedido Entregue</a>
                        </li>
                `;
                statusPedidoHTML = `
                    <button class="btn btn-success btn-sm">
                        Pedido em Produção
                    </button>
                `;
            }else if(variavel === 3 || variavel === 4){
                document.getElementById('btnCancelarPedido').style.display = 'none';
                timeline_ = `
                 <li class="enviado">
                            <a>Pedido Enviado</a>
                        </li>
                        <li class="enviado">
                            <a>Pedido em Preparo</a>
                        </li>
                        <li class="enviado">
                            <a>Pedido Pronto</a>
                        </li>
                        <li>
                            <a>Pedido Entregue</a>
                        </li>
                `;
                statusPedidoHTML = `
                    <button class="btn btn-success btn-sm">
                        Pedido Pronto
                    </button>
                `;
            }else if (variavel === 12 || variavel === 13) {
                document.getElementById('timeline').style.display = 'none'; 
                document.getElementById('btnCancelarPedido').style.display = 'none';
                statusPedidoHTML = `
                    <button class="btn btn-danger btn-sm">
                        Pedido Cancelado
                    </button>
                `;
                 timeline_ = `
                        <li>
                            <a>Pedido Enviado</a>
                        </li>
                        <li>
                            <a>Pedido em Preparo</a>
                        </li>
                        <li>
                            <a>Pedido Pronto</a>
                        </li>
                        <li>
                            <a>Pedido Entregue</a>
                        </li>
                `;
                
            }else if (variavel === 0 || variavel === 1) {
                document.getElementById('btnCancelarPedido').style.display = 'block';
                statusPedidoHTML = `
                    <button class="btn btn-success btn-sm">
                        Pedido Enviado
                    </button>
                `;
                timeline_ = `
                        <li class="enviado">
                            <a>Pedido Enviado</a>
                        </li>
                        <li>
                            <a>Pedido em Preparo</a>
                        </li>
                        <li>
                            <a>Pedido Pronto</a>
                        </li>
                        <li>
                            <a>Pedido Entregue</a>
                        </li>
                `;
            }else  if(variavel === 14){
                document.getElementById('btnCancelarPedido').style.display = 'none';
                statusPedidoHTML = `
               <button class="btn btn-sm" style="background-color: lightgrey;">
                    Pedido Finalizado
                </button>
            `;
                timeline_ = `
                <li class="enviado">
                           <a>Pedido Enviado</a>
                       </li>
                       <li class="enviado">
                           <a>Pedido em Preparo</a>
                       </li>
                       <li class="enviado">
                           <a>Pedido Pronto</a>
                       </li>
                       <li class="enviado">
                           <a>Pedido Entregue</a>
                       </li>
               `;
            }else {
                document.getElementById('btnCancelarPedido').style.display = 'none';
                statusPedidoHTML = `
                    <button class="btn btn-success btn-sm">
                        Pedido em Andamento
                    </button>
                    
                `;
                timeline_ = `
                        <li class="enviado">
                            <a>Pedido Enviado</a>
                        </li>
                        <li class="enviado">
                            <a>Pedido em Preparo</a>
                        </li>
                        <li class="enviado">
                            <a>Pedido Pronto</a>
                        </li>
                        <li>
                            <a>Pedido Entregue</a>
                        </li>
                `;
            }

            document.getElementById('statusPedido_').innerHTML = statusPedidoHTML;
            document.getElementById('statusTimeline').innerHTML = timeline_;
        
            var produtosHTML = '';
            var produtos = dado.pedido_Produtos;
            for(var i=0; i<produtos.length; i++){
                produtosHTML += 
                `
                <li class="list-group-item">
                    <div class="d-flex">
                        <div class="flex-fill">
                            <div class="row">
                                <div class="col-8 col-md-10">
                                    <b style="margin-left: -20px;">${produtos[i].descricao}</b>
                                </div>
                                <div class="col-4 col-md-2">
                                    <b class="mb-0">R$ ${produtos[i].precoUnitario.toFixed(2)}</b>
                                </div>                                                
                            </div>
                `
        
                // if (produtos[i].pedido_Produto_Complementos != null) {
                //     var complementos = produtos[i].pedido_Produto_Complementos; 
                //     for (var j = 0; j < complementos.length; j++) { 
                //         produtosHTML +=
                //             `
                //             <div class="row">
                //                 <div class="col-8 col-md-10">
                //                     <p style="color: gray; margin-left: -20px;">1X Bacon</p>
                //                 </div>
                //                 <div class="col-4 col-md-2">
                //                     <p class="mb-0" style="color: gray; ">+R$ ${complementos[j].Preco.toFixed(2)}</p> <!-- Alterei para complementos[j] -->
                //                 </div>                                           
                //             </div>
                //             `;
                //     }
                // }
                
                produtosHTML += `
                        </div>
                    </div>
                </li>       
                `;
            }
        
            document.getElementById('produtos_').innerHTML = produtosHTML;
        
            // Exibindo subtotal
            var subTotal = 
            `
            <div class="col-8 col-md-10">
                <p style="color: gray;">Subtotal</p>
            </div>
            <div class="col-4 col-md-2">
                <p style="color: gray;">+R$ ${dado.precoTotalPedido.toFixed(2)}</p>
            </div>
            `;
            document.getElementById('sub_').innerHTML = subTotal;
        
            // Exibindo taxa de entrega
            var entrega = 
            `
            <div class="col-8 col-md-10 ">
                <p style="color: gray;">Taxa de Entrega</p>
            </div>
            <div class="col-4 col-md-2">
                <p style="color: gray;">+R$ ${dado.precoFrete.toFixed(2)}</p>
            </div>
            `;
            document.getElementById('entrega_').innerHTML = entrega;
        
            // Exibindo total
            var total = 
            `
            <div class="col-8 col-md-10">
                <b style="color: rgb(199, 8, 8); font-size: 18px;">TOTAL</b>
            </div>
            <div class="col-4 col-md-2">
                <b style="color: rgb(199, 8, 8); font-size: 18px;">R$ ${dado.precoTotalPedido.toFixed(2)}</b>
            </div>
            `;
            document.getElementById('total_').innerHTML = total;
        
            // Exibindo forma de pagamento
            var forma = "";
           
            if(dado.formaPagamento == 0){
                forma = "Dinheiro"
            }else if(dado.formaPagamento == 1){
                forma = "Pix";
            }else{
                forma = "Cartão";
            }
        
            var pagamento = 
            `
            <li class="list-unstyled">Formas de Pagamento</li>
            <li style="color: gray;">${forma} - R$ ${dado.precoTotalPedido.toFixed(2)}</li>
            `;
            document.getElementById('pagamento_').innerHTML = pagamento;
        
            forma = ""
            if(dado.formaEntrega == 0){
                forma = "Retirada no Local";
            }else{
                forma = "Entrega no Endereço";
            }
    
           
            var entrge = '';
            entrge = 
            `
            <li class="list-unstyled">${forma}</li> 
            `;
            if(forma == 1){
                entrge += 
                `
                <li class="list-unstyled">${dado.enderecoLogradouto}, ${dado.enderecoNumero} </li> 
                <li class="list-unstyled">${dado.enderecoBairro} </li> 
                `;
            }
            document.getElementById('ret_').innerHTML = entrge;

        })
        .catch(error => {
            console.error('Erro:', error);
        });


    
    
    })    
    
    .catch(error => console.error('Erro:', error));
}

function CancelarPedidoConsumidor() {
    var pedido = localStorage.getItem("pedidoId");
    fetch(apiUrl+'/api/Status/' + pedido + '/12', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ PedidoId: pedido })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao atualizar status do pedido');
        }
        return response.json();
    })
    .then(data => { 
      
        location.reload();
    })
    .catch(error => console.error('Erro:', error));
}

var modal = document.getElementById("modal");
var btnConfirmar = document.getElementById("btn-confirmar");
var btnCancel = document.getElementById("btn-cancelar");

btnConfirmar.addEventListener("click", function() {
    modal.style.display = "none";
    cancelarPedido();
});

btnCancel.addEventListener("click", function() {
    modal.style.display = "none";
});

var closeBtn = document.getElementsByClassName("close")[0];
closeBtn.addEventListener("click", function() {
    modal.style.display = "none";
});

function mostrarModal(){
    modal.style.display = "block";
}

function cancelarPedido() {   
    var pedido = localStorage.getItem("pedidoId");
    const token = localStorage.getItem("token");

    fetch(apiUrl + '/api/Pedido/' + pedido, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}` 
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao obter o status do Pedido');
        }
        return response.json(); 
    })
    .then(pedidoData => {
        if (pedidoData.status === 'em produção') {
            
            return fetch(apiUrl + '/api/Pedido/' + pedido, {
                method: 'PUT', //PRECISO SO ALTERAR O STATUS PARA CANCELAR
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            });
        } else {
            
            document.getElementById('modalNaoCancelou').style.display = 'block';
            throw new Error('Cancelamento não permitido');
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao excluir Pedido');
        }
        document.getElementById('modalCancelou').style.display = 'block';
        return response.text();
    })
    .then(data => {
        console.log('Pedido ID:', data);
    })
    .catch(error => console.error('Erro:', error));

    event.preventDefault();
}
