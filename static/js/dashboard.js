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

function carregarPedidos() {
    var id = localStorage.getItem("id");
    fetch(apiUrl + `/api/Pedido/Estabelecimento/${id}?Active=true`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {        
        data.sort((a, b) => new Date(a.createAt) - new Date(b.createAt)); // Ordem crescente

        document.getElementById('pendentes').innerHTML = "";
        
        data.forEach(pedido => {
            var tipo;
            if (pedido.formaEntrega == 1) {
                tipo = "Entrega";
            } else {
                tipo = "Retirada";
            }
            
            var pag;
            if (pedido.formaPagamento == 2) {
                pag = "Cartão";
            } else if (pedido.formaPagamento == 0) {
                pag = "Dinheiro";
            } else {
                pag = "Pix";
            }

            var dados = {
                nome: pedido.consumidorNome,
                endereco: pedido.enderecoLogradouro + ", " + pedido.enderecoNumero,              
                tipoEntrega: tipo, 
                tipoPagamento: pag, 
                horario: pedido.createAt,
                identificador: pedido.pedidoId,
                pedidoId: pedido.pedidoId
            };

            var card = criarCard(dados);

            fetch(apiUrl + '/api/Status?pedidoId=' + dados.pedidoId, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                var status = data.status;
                console.log(data);
                if (status == 0 || status == 1) {
                    document.getElementById('pendentes').innerHTML += card; 
                }
                else if (status == 2) {
                    document.getElementById('producao').innerHTML += card;
                }
                else if (status == 4 || status == 3) {
                    document.getElementById('disponivel').innerHTML += card;
                }
            })
            .catch(error => console.error('Erro:', error));
        });
    })
    .catch(error => console.error('Erro:', error));
}




function criarCard(dado) {
    const dataISO = dado.horario;
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

    var cardHTML = `
<div class="card" style="margin-right: -5px; margin-left: -5px;">
    <div style="padding: 3px; margin: 0;">
        <div style="display: flex; justify-content: space-between; margin: 0;">
            <h5 style="text-transform: uppercase; margin-top: 3px; margin: 0;">${dado.nome}</h5>

            <div class="dropdown" style="margin: 0;">
                <button class="mainmenubtn" style="margin: 0;">
                    <i class="fas fa-bars mr-2" style="margin-top: 0px; margin-left: auto; font-size: 24px;"></i>
                </button>
                <div class="dropdown-child" style="margin: 0; background-color: whitesmoke;">
                    <a href="#" onclick="proximaEtapa(${dado.pedidoId})" style="margin: 0;">Pronto</a>
                    <a href="#" onclick="cancelarPedido(${dado.pedidoId})" style="margin: 0;">Cancelar</a>
                </div>
            </div>

        </div>
        <p style="color: lightgray; margin: 0;">${formattedDate}</p>
        <div style="display: flex; margin: 0;">
            <i class="fas fa-map-pin" style="margin-top: 3px; margin-right: 3px"></i>
            <p style="color: gray; margin-left: 8px; margin-top: -3px; margin: 0;">${dado.endereco}</p>
        </div>
        <div style="display: flex; align-items: center; margin: 0;">
            <i class="fas fa-motorcycle" style="margin-right: 3px"></i>
            <p style="color: gray; margin-left: 8px; margin: 0;">${dado.tipoEntrega}</p>
        </div>
        <div style="display: flex; align-items: center; margin: 0;">
            <i class="fas fa-money-bill-alt" style="margin-right: 3px;"></i>
            <p style="color: gray; margin-left: 8px; margin: 0;">${dado.tipoPagamento}</p>
        </div>
        <div style="display: flex; flex-direction: column; margin: 0;">
            <div style="color: gray; margin-left: 8px; text-decoration: underline; cursor: pointer; margin: 0;" onclick="toggleCard(${dado.identificador})">Ver detalhes do pedido</div>
            <div style="display:none;padding:3px; margin-top: 5px; margin: 0;" id="${dado.identificador}">
                <div class="categoria" style="margin: 0;">
                    <div class="coluna" style="margin: 0;">
                        <h6 style="color: #ffbe33; text-align:start; font-size:18px; margin-left: 20px; margin: 0;">Itens do Pedido</h6>
                        <ul class="listaPedidos" id="listaPedidos_${dado.identificador}" style="margin: 0;">

                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>


    `;  

    return cardHTML;
}

function toggleCard(pedidoId) {
    var cardBody = document.getElementById(pedidoId);
    var listaPedidosId = `listaPedidos_${pedidoId}`;

    if (cardBody.style.display === 'none') {
        fetch(apiUrl +`/api/Pedido/?IdPedido=`+pedidoId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            var produtos = data.pedido_Produtos;
            var tabela = '';

            for(var i=0; i<produtos.length; i++){
                tabela += `
                <li>
                    <div style="display:flex; margin-bottom: -15px">
                        <p style="font-size: 16px">${produtos[i].qtde}X &emsp;</p>
                        <p style="font-size: 16px">${produtos[i].descricao}</p>
                    </div>                                           
                </li>                   
                `;
            }

            document.getElementById(listaPedidosId).innerHTML = tabela;
            // <div style="display: block;"> COMPLEMENTOS SE TIVER
            //             <p style="display: inline; font-size: 12px;">1x&ensp; Bacon&ensp;</p>
            //             <p style="display: inline; font-size: 12px;">1x&ensp; Milho&ensp;</p>
            //             <p style="display: inline; font-size: 12px;">1x&ensp; Calabresa&ensp;</p>
            //             <p style="display: inline; font-size: 12px;">1x&ensp; Bacon&ensp;</p>
            //             <p style="display: inline; font-size: 12px;">1x&ensp; Milho&ensp;</p>
            //             <p style="display: inline; font-size: 12px;">1x&ensp; Calabresa&ensp;</p>
            //             <p style="display: inline; font-size: 12px;">1x&ensp; Bacon&ensp;</p>
            //             <p style="display: inline; font-size: 12px;">1x&ensp; Milho&ensp;</p>
            //             <p style="display: inline; font-size: 12px;">1x&ensp; Calabresa&ensp;</p>
            //         </div>     
        })
        .catch(error => console.error('Erro:', error));

        cardBody.style.display = 'block';
    } else {
        cardBody.style.display = 'none';
    }
}

function cancelarPedido(id){    
    localStorage.setItem('proximoPasso', id);
    const modal = document.getElementById('myModal');
    modal.style.display = 'block';

    // Adicionando uma função para fechar o modal
    const fecharModal = document.getElementById('fecharModal');
    fecharModal.addEventListener('click', function(){
        modal.style.display = 'none';
    });

    const fechar = document.getElementById('fechar');
    fechar.addEventListener('click', function(){
        modal.style.display = 'none';
    });
}

function proximaEtapa(id){
    localStorage.setItem('proximoPasso', id);
    const modal = document.getElementById('myModalEtapa');
    modal.style.display = 'block';

    const fecharModal = document.getElementById('fecharModalEtapa');
    fecharModal.addEventListener('click', function(){
        modal.style.display = 'none';
    });

    const fechar = document.getElementById('fecharEtapa');
    fechar.addEventListener('click', function(){
        modal.style.display = 'none';
    });

}


function CancelarPedido() {
    var pedido = localStorage.getItem('proximoPasso');
    fetch(apiUrl+'/api/Status/' + pedido + '/13', {
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



function confirmarProximoPasso() {
    var pedido = localStorage.getItem('proximoPasso');
    fetch(apiUrl+'/api/Status/ProximoStatus/' + pedido, {
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

function formatDate(date) {
    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0'); // Meses começam do 0
    let year = date.getFullYear();
    let hours = String(date.getHours()).padStart(2, '0');
    let minutes = String(date.getMinutes()).padStart(2, '0');
  
    return `${day}/${month}/${year}, ${hours}:${minutes}`;
}

function carregarPedidos2(){
    var id = localStorage.getItem("id");
    var token = localStorage.getItem("token");
    fetch(apiUrl + `/api/Pedido/Estabelecimento/${id}?Active=true`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    })
    .then(response => response.json())
    .then(data => {        
        var tabela = '';
        tabela += `
            <thead>
                <tr>
                    <th>ID Pedido</th>
                    <th>Data</th>
                    <th>Nome</th>
                    <th>Valor</th>
                </tr>
            </thead>`;

        data.sort((a, b) => new Date(a.createAt) - new Date(b.createAt)); // Ordem crescente

        data.forEach(pedido => {   
            let formattedDate = formatDate(new Date(pedido.createAt));  // Garantir que seja uma instância de Date
            let formattedPrice = (parseFloat(pedido.precoTotalPedido) || 0).toFixed(2); // Garantir que o preço seja um número válido
            tabela += `
            <tbody>
                <tr data-date="2024-11-10" data-time="12:30">
                    <td>${pedido.pedidoId}</td>
                    <td>${formattedDate}</td>
                    <td>${pedido.consumidorNome}</td>
                    <td>${formattedPrice}</td>
                </tr>
            `;
        });
    
        tabela += `</tbody>`;
        document.getElementById('ordersTable').innerHTML = tabela;
    })
    .catch(error => console.error('Erro:', error));
}

function exibeCancelados(){
    var id = localStorage.getItem("id");
    var token = localStorage.getItem("token");
    fetch(apiUrl + `/api/Pedido/Estabelecimento/${id}?Active=true`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    })
    .then(response => response.json())
    .then(data => {        
        var tabela = '';
        tabela += `
            <thead>
                <tr>
                    <th>ID Pedido</th>
                    <th>Data</th>
                    <th>Nome</th>
                    <th>Valor</th>
                </tr>
            </thead>`;

        data.sort((a, b) => new Date(a.createAt) - new Date(b.createAt)); // Ordem crescente

        data.forEach(pedido => {   
            let formattedDate = formatDate(new Date(pedido.createAt));  // Garantir que seja uma instância de Date
            let formattedPrice = (parseFloat(pedido.precoTotalPedido) || 0).toFixed(2); // Garantir que o preço seja um número válido
             console.log(pedido)
            tabela += `
            <tbody>
                <tr data-date="2024-11-10" data-time="12:30">
                    <td>${pedido.pedidoId}</td>
                    <td>${formattedDate}</td>
                    <td>${pedido.consumidorNome}</td>
                    <td>${formattedPrice}</td>
                </tr>
            `;
        });
    
        tabela += `</tbody>`;
        document.getElementById('ordersTable').innerHTML = tabela;
    })
    .catch(error => console.error('Erro:', error));
}

function carregarPedidosPorData() {
    var token = localStorage.getItem("token");
    // Pegar as datas e horas dos inputs
    let dataInicial = document.getElementById('dateStart').value;
    let dataFinal = document.getElementById('dateEnd').value;
    let horaInicial = document.getElementById('horaInicial').value;
    let horaFinal = document.getElementById('horaFinal').value;
    
  

    // Se o usuário não digitou hora 
    if (!horaInicial) {
        horaInicial = "00:00:00";
    }
    if (!horaFinal) {
        horaFinal = "23:59:59";
    }

    let dataInicialComHora = `${dataInicial} ${horaInicial}`;
    let dataFinalComHora = `${dataFinal} ${horaFinal}`;

    fetch(apiUrl +`/api/Pedido/PedidosPorData?De=${dataInicialComHora}&Ate=${dataFinalComHora}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,

        }
    })
    .then(response => response.json())
    .then(data => {
            var checkbox = document.getElementById("filterCancelled");
         
            if(checkbox.checked){
                var tabela = `
                <thead>
                    <tr>
                        <th>ID Pedido</th>
                        <th>Data</th>
                        <th>Nome</th>
                        <th>Valor</th>
                    </tr>
                </thead>
                <tbody>
            `;
            
            data.sort((a, b) => new Date(a.createAt) - new Date(b.createAt)); // Ordem crescente
            
            data.forEach(pedido => {
                let formattedDate = formatDate(new Date(pedido.createAt));  // Garantir que seja uma instância de Date
                let formattedPrice = (parseFloat(pedido.precoTotalPedido) || 0).toFixed(2); // Garantir que o preço seja um número válido
            
                if (pedido.descricao_Status_Atual == 'Pedido_cancelado_pelo_consumidor' ||
                    pedido.descricao_Status_Atual == 'Pedido_cancelado_pelo_estabelecimento') {
                    
                    tabela += `
                        <tr data-date="2024-11-10" data-time="12:30">
                            <td>${pedido.pedidoId}</td>
                            <td>${formattedDate}</td>
                            <td>${pedido.consumidorNome}</td>
                            <td>${formattedPrice}</td>
                        </tr>
                    `;
                }
            });
            
            // Fechar a tag <tbody> depois de ter passado por todos os pedidos
            tabela += `</tbody>`;
            
            // Inserir a tabela na página
            document.getElementById('ordersTable').innerHTML = tabela;
            }
            var tabela = '';
            tabela += `
                <thead>
                    <tr>
                        <th>ID Pedido</th>
                        <th>Data</th>
                        <th>Nome</th>
                        <th>Valor</th>
                    </tr>
                </thead>`;
    
            data.sort((a, b) => new Date(a.createAt) - new Date(b.createAt)); // Ordem crescente
    
            data.forEach(pedido => {   
                let formattedDate = formatDate(new Date(pedido.createAt));  // Garantir que seja uma instância de Date
                let formattedPrice = (parseFloat(pedido.precoTotalPedido) || 0).toFixed(2); // Garantir que o preço seja um número válido
                tabela += `
                <tbody>
                    <tr data-date="2024-11-10" data-time="12:30">
                        <td>${pedido.pedidoId}</td>
                        <td>${formattedDate}</td>
                        <td>${pedido.consumidorNome}</td>
                        <td>${formattedPrice}</td>
                    </tr>
                `;
            });
        
            tabela += `</tbody>`;
            document.getElementById('ordersTable').innerHTML = tabela;
    })
    .catch(error => console.error('Erro:', error));
}

