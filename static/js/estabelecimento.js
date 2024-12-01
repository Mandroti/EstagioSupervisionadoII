//FETCH -- ESTABELECIMENTO
var idCliente = 0;

function sair(){    
    localStorage.setItem('token', null);
    window.location.href = "index.html";
}

function buscarEstabelecimento()
{
    const token = localStorage.getItem("token");
    fetch(apiUrl+'/api/Estabelecimento', {
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
                                <th scope="col">Logo</th>
                                <th scope="col">Nome</th>
                                <th scope="col">Telefone</th>
                                <th scope="col">Situaçãao</th>
                                <th scope="col">Excluir</th>
                            </tr>
                        </thead>
                        <tbody>`;

        for (var i = 0; i < data.length; i++) {
            var card = carregarEstabelecimentos(data[i]);
            tabela += card;
        }

        tabela += `</tbody></table>`;

        document.getElementById('tabelaEstabelecimento').innerHTML = tabela;
    })
    .catch(error => console.error('Erro:', error));

    event.preventDefault();
}

function carregarEstabelecimentos(dado){
    var row = `
        <tr>
            <th scope="row">${dado.estabelecimentoId}</th>
            <td>${dado.nome}</td>
            <td>${dado.telefone}</td>
            <td>${dado.active}</td>
            <td>
                <div>
                    <a class="btn table-action" href="#">
                        <i class="action-icon fas fa-trash" onclick="excluirEstabelecimento(${dado.estabelecimentoId})"></i>
                    </a>                         
                </div>
            </td>
        </tr>
    `;

    return row;
}

function modalEditarEstabelecimento(id){
    const modal = document.getElementById('modalEditarEstabelecimento');
    modal.style.display = 'block';
    carregarDadosEstabelecimento(id);
    event.preventDefault();

}

function fecharModalEstabelecimento(){
    document.getElementById('modalEditarEstabelecimento').style.display = 'none';
    document.getElementById('modalAdicionarEstabelecimento').style.display = 'none';
}
 
function excluirEstabelecimento(id) {
   
    const modal = document.getElementById('modalExcluirEstabelecimento');
    modal.style.display = 'block';

    idCliente = id;

    const fecharModal = document.getElementById('fecharModalEstabelecimento');
    fecharModal.addEventListener('click', function(){
        modal.style.display = 'none';
    });

    const fechar = document.getElementById('fecharModalEstabelecimentoo');
    fechar.addEventListener('click', function(){
        modal.style.display = 'none';
    });
}

function removerEstabelecimento() {

    const token = localStorage.getItem("token");
    
    fetch('', {
        method: 'DELETE',
        headers:{             
            'Authorization': `Bearer ${token}`             
        },
    })
    .then(response => {
        console.log(response)
        if (!response.ok) {
          throw new Error('Erro ao excluir Estabelecimento');
        }
        else{
            window.location.href = "buscarEstabelecimento.html"
        }
        return response.text();
    })
    .then(data => {
        console.log('Estabelecimento ID:', data);
    })
    .catch(error => console.error('Erro ao deletar o ID:', error));

    event.preventDefault();
}

function adicionarEstabelecimento(){
    const modal = document.getElementById('modalAdicionarEstabelecimento');
    modal.style.display = 'block';
    event.preventDefault();
}

function buscarEstabelecimentos(){ 
    var nome = document.getElementById('nomeEstabelecimento').value;

    const token = localStorage.getItem("token");
    fetch(apiUrl+'/api/Estabelecimento/PorNome?Nome=' + nome, { 
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
      
        tabela = `<table class="table table-striped">
                        <thead>
                            <tr>
                            <th scope="col">#</th>
                            <th scope="col">Nome</th>
                            <th scope="col">Telefone</th>
                            <th scope="col">Situação</th>
                            <th scope="col">Excluir</th>
                            </tr>
                        </thead>
                        <tbody>`;

        for (var i = 0; i < data.length; i++) {
            var card = carregarEstabelecimentos(data[i]);
            tabela += card;
        }

        tabela += `</tbody></table>`;
        document.getElementById('tabelaEstabelecimento').innerHTML = tabela;
    })
    .catch(error => console.error('Erro:', error));

    event.preventDefault();
}




//FETCH -- PERFIL DO ESTABELECIMENTO
function carregarDados(){
    const id = localStorage.getItem("id");
    fetch(apiUrl+`/api/Estabelecimento/${id}`, {             
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }          
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        document.getElementById('inputEstabelecimento').value = data.nome;
        document.getElementById('inputFantasia').value = data.nomeFantasia;
        document.getElementById('inputCnpj').value = data.cnpj_Cpf;
        document.getElementById('inputEmail').value = data.emailPrincipal;
        document.getElementById('inputTelefone').value = data.telefone;
        document.getElementById('inputCelular').value = data.celular;
        

        document.getElementById('inputLog').value = data.logradouro;
        document.getElementById('inputBairro').value = data.bairro;
        document.getElementById('inputCep').value = data.cep;
        document.getElementById('inputNumero').value = data.numero;
        document.getElementById('inputUf').value = data.uf;
        document.getElementById('inputCit').value = data.cidadeId;

        localStorage.setItem('logo',data.logo);
        document.getElementById('inputDesc').value = data.observacao;    
    })
    .catch(error => console.error('Erro:', error));
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

async function gravarAlteracoes() {
    const token = localStorage.getItem("token");

    var id = localStorage.getItem("id");
    var nome = document.getElementById("inputEstabelecimento").value;
    var cnpj_Cpf = document.getElementById("inputCnpj").value;
    cnpj_Cpf = cnpj_Cpf.replace(/\D/g,'');
    var ie_Rg = ""; //nao tem no formulario
    var nomeFantasia = document.getElementById('inputFantasia').value;
    var telefone = document.getElementById("inputTelefone").value;
    telefone = telefone.replace(/\D/g,'');
    var celular = document.getElementById("inputCelular").value;
    celular = celular.replace(/\D/g,'');
    var emailPrincipal = document.getElementById("inputEmail").value;

    var logradouro = document.getElementById('inputLog').value;
    var bairro = document.getElementById('inputBairro').value;
    var cep = document.getElementById('inputCep').value;
    cep = cep.replace(/\D/g,'');
    var numero = document.getElementById('inputNumero').value;
    numero = numero.replace(/\D/g,'');
    var cidadeNome = document.getElementById('inputCit').value;
    var uf = document.getElementById('inputUf').value;

    // falta horario de funcionamento

    var cidadeId = await buscaCidade(cidadeNome);

    var observacao = document.getElementById('inputDesc').value;
    var active = true;

    var inputImagem = document.getElementById('inputImagem');

    const dados = {
        estabelecimentoId: id, nome: nome, cnpj_Cpf: cnpj_Cpf, ie_Rg: ie_Rg, nomeFantasia: nomeFantasia,
        telefone: telefone, celular: celular, emailPrincipal: emailPrincipal, logradouro: logradouro,
        bairro: bairro, cep: cep, numero: numero, cidadeId: cidadeId, uf: uf,
        observacao: observacao, active: active
    };
    
    if (inputImagem.files.length > 0) {
        dados.logo = imageBase64;
        
    } else{
        //PROBLEMA DE NAO TER IMAGEM É QUE AO MANDAR O JSON, VAI TENTAR CONVERTER PARA BASE 64
    }

    fetch(apiUrl +`/api/Estabelecimento/${id}`, {
        method: 'PUT',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dados)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Estabelecimento atualizado com sucesso:', data);
    })
    .catch(error => console.error('Erro:', error));
    event.preventDefault();
}

async function buscaCidade(cidadeNome) {
    try {
        const response = await fetch(apiUrl +'/api/Cidade', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const data = await response.json();

        for (var i = 0; i < data.length; i++) {
            if (data[i].nome == cidadeNome || data[i].cidadeId == cidadeNome) {
                return data[i].cidadeId;
            }
        }
        return null; 
    } catch (error) {
        console.error('Erro:', error);
        return null; 
    }
}


// Função para abrir a modal
function abrirModal(idModal) {
    document.getElementById(idModal).style.display = "block";
}

// Função para fechar a modal
function fecharModal(idModal) {
    document.getElementById(idModal).style.display = "none";
}

function transformarHorario(horario) {
    var partes = horario.split(':');
    var horas = parseInt(partes[0], 10);
    var minutos = parseInt(partes[1], 10);
 
    var segundos = 0;
    var novoHorario = horas.toString().padStart(2, '0') + ':' + minutos.toString().padStart(2, '0') + ':' + segundos.toString().padStart(2, '0');
    return novoHorario;
}


function validarHora(hora) {
    var regex = /^([01]?[0-9]|2[0-3]):([0-5]?[0-9]):([0-5]?[0-9])$/;
    return regex.test(hora);
}

function validarHoras() {
    var horaInicial = document.getElementById('horaInicial').value;
    var horaFinal = document.getElementById('horaFinal').value;

    if (!validarHora(horaInicial)) {
        document.getElementById('modalHora').style.display = "block";
        return;
    }

    if (!validarHora(horaFinal)) {        
        document.getElementById('modalHora').style.display = "block";
        return;
    }

    var [horaI, minutoI, segundoI] = horaInicial.split(":").map(Number);
    var [horaF, minutoF, segundoF] = horaFinal.split(":").map(Number);

    var dateHoraInicial = new Date(0, 0, 0, horaI, minutoI, segundoI);
    var dateHoraFinal = new Date(0, 0, 0, horaF, minutoF, segundoF);

    if (dateHoraInicial >= dateHoraFinal) {        
        document.getElementById('modalHora').style.display = "block";
        return;
    }
}



function adicionarHorario() {

    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    
    var horaInicial = document.getElementById('horaInicial').value;
    var horaFinal = document.getElementById('horaFinal').value;

    horaInicial = transformarHorario(horaInicial);
    horaFinal = transformarHorario(horaFinal);

    var diaSelecionado = parseInt(document.getElementById('dia').getAttribute('data-dia'), 10);
    
    const dadosProduto = {
        estabelecimentoId: id,
        dia: diaSelecionado, 
        abre: horaInicial,
        fecha: horaFinal  
    };

    fetch(apiUrl + '/api/Horario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',    
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(dadosProduto),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);  

        const horarioId = data.id; 

        var table = document.getElementById('tabelaHorarios');
        var newRow = table.insertRow(-1);

        var newCell1 = newRow.insertCell(0);
        var newCell2 = newRow.insertCell(1);
        var newCell3 = newRow.insertCell(2);


        newCell1.innerHTML = document.getElementById('dia').value; 
        newCell2.innerHTML = horaInicial;
        newCell3.innerHTML = horaFinal;

       
        document.getElementById('dia').value = "";
        document.getElementById('horaInicial').value = "";
        document.getElementById('horaFinal').value = "";
    })
    .catch(error => console.error('Erro:', error.message || error));
}

function excluirHorario(horarioId) {
    const token = localStorage.getItem('token');
    
    fetch(apiUrl + `/api/Horario/${horarioId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (response.ok) {
            console.log('Horário excluído com sucesso');
            var button = document.getElementById(horarioId);
            var row = button.parentNode.parentNode;  // A linha é o elemento pai do botão
            row.remove();  // Remover a linha da tabela
        } else {
            console.error('Erro ao excluir horário');
        }
    })
    .catch(error => console.error('Erro na requisição de exclusão:', error));
}


// function excluirHorario(row) {
//     const token = localStorage.getItem("token");
    
//     fetch(apiUrl + '/api/Horario/' + , {
//         method: 'DELETE',
//         headers: {
//             'Authorization': `Bearer ${token}` 
//         }
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Erro ao excluir horario');
//         }
        
//         table.deleteRow(row.rowIndex);  

//         return response.text();
//     })
//     .then(data => {
//         console.log('Horario ID:', data);
//     })
//     .catch(error => console.error('Erro ao deletar o ID:', error));    
// }

document.querySelectorAll('#diasSemana a').forEach(function(item) {
    item.addEventListener('click', function(event) {
        var diaId = event.target.getAttribute('data-dia');  
        var diaNome = event.target.innerText;               

        
        document.getElementById('dia').value = diaNome;
      
        document.getElementById('dia').setAttribute('data-dia', diaId);  
    });
});



var logo;
var nomeEstab;

function visitarEstabelecimento(id, estado) { 
localStorage.setItem('estado',estado)  
localStorage.setItem("estabelecimentoId", id);

fetch(apiUrl + `/api/Estabelecimento/${id}`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    },
})
.then(response => response.json())
.then(data => {
   
    console.log(data)
    logo = data.logo;
    nomeEstab = data.nome;
    localStorage.setItem('logo', logo);
    localStorage.setItem('nomeEstab', nomeEstab);
    localStorage.setItem('id', id);
    
    window.location.href = "cardapioNovo.html";
    
})
.catch(error => console.error('Erro:', error));   
}

function verificaLogado(){
    var token = localStorage.getItem("token");
 
    if (token == null || token == 'null') {
        console.log('O dado do usuário foi removido ou nunca existiu.');
        document.getElementById('login').style.display = "block";

    } else {
        console.log('O dado do usuário ainda existe:', token);
        document.getElementById('sairr').style.display = "block";
        document.getElementById('historicos').style.display = "block";
        fetch(apiUrl +"/api/Consumidor/token", { 
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`  
            },        
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('nomeCliente').textContent = `Olá ${data.nome}!`;
        })
        .catch(error => {
            console.error("Erro ao realizar a fetch:", error);
            document.getElementById('nomeCliente').textContent = 'Olá Visitante!';
        });
    }

}

function listarEstabelecimentos(){
    verificaLogado();    

    localStorage.removeItem('produtosRegistrados');
    var log = localStorage.getItem("logradouro");
    
    var idCidadePesquisa = localStorage.getItem("cidadeIdEscolha");

    fetch(apiUrl +`/api/Estabelecimento`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }) 
    .then(response => response.json())
    .then(function(data) {
        let tabela = '';        
    
        // Se houver um filtro por logradouro
        if (log.length == 4) {
            for (let j = 0; j < data.length; j++) {
                
                if (data[j].cidadeId == idCidadePesquisa) {
                    let status = data[j].aberto ? 'Aberto' : 'Fechado';
                    let statusColor = data[j].aberto ? '#37966F' : '#FF4C4C'; 
    
                    tabela += `
                    <li class="list-group-item" onclick="visitarEstabelecimento(${data[j].estabelecimentoId},'${status}')">
                        <div class="row">                
                            <div>
                                <img src="${apiStorage}/${data[j].logo}" class="img-fluid square-image" alt="Logo do Estabelecimento">
                            </div>
                            <div class="col-9">
                                <b>${data[j].nome}</b>
                                <span style="display: block; margin-top: 5px; font-size: 13px;">${data[j].observacao}</span>
                                <div class="row" style="margin-left: -2px;">
                                <i class="material-icons" style="color: #ffbe33; font-size: 20px; margin-top: 6px">credit_card</i> 
                                    <p style="font-size: 15px; margin-top: 4px; margin-right: 5px; margin-left: 5px; color: ${statusColor};">${status}</p>
                                </div>                                
                            </div>                          
                        </div>
                    </li>`;
                }                        
            }
        } else {
            // Se o logradouro não for null, traz os estabelecimentos com esse logradouro na cidade
            for (let j = 0; j < data.length; j++) {
                if (data[j].cidadeId == idCidadePesquisa && (data[j].logradouro === null || data[j].logradouro == log || log == "")) {
                    // Verificar se o estabelecimento está aberto ou fechado
                    let status = data[j].aberto ? 'Online' : 'Offline';
                    let statusColor = data[j].aberto ? '#37966F' : '#FF4C4C'; // Verde para online, vermelho para offline
    
                    tabela += `
                    <li class="list-group-item" onclick="visitarEstabelecimento(${data[j].estabelecimentoId},'${status}')">
                        <div class="row">                
                            <div>
                                <img src="${apiStorage}/${data[j].logo}" class="img-fluid square-image" alt="Logo do Estabelecimento">
                            </div>
                            <div class="col-9">
                                <b>${data[j].nome}</b>
                                <span style="display: block; margin-top: 5px; font-size: 13px;">${data[j].observacao}</span>
                                <div class="row" style="margin-left: -2px;">
                                <i class="material-icons" style="color: #ffbe33; font-size: 20px; margin-top: 6px">credit_card</i> 
                                    <p style="font-size: 15px; margin-top: 4px; margin-right: 5px; margin-left: 5px; color: ${statusColor};">${status}</p>
                                        
                                </div>                                
                            </div>                          
                        </div>
                    </li>`;
                }                        
            }
        }   
        
       
        document.getElementById('estabelecimentosCidade').innerHTML = tabela; 
    })
    .catch(function(error) {
        console.error('Erro:', error);
    });
}



function showDiv(divId) {
    if (divId === 'estabelecimento') {
        document.getElementById('estabelecimentoBar').style.display = 'block';
        document.getElementById('promocoesBar').style.display = 'none';
    } else if (divId === 'promocoes') {
        document.getElementById('estabelecimentoBar').style.display = 'none';
        document.getElementById('promocoesBar').style.display = 'block';
    }
}
document.addEventListener("DOMContentLoaded", function() {
    var btnBuscar = document.getElementById("btnBuscar");
    var estabelecimentoNome = document.getElementById("estabelecimentoNome");
    var formBusca = document.getElementById("formBusca");
    var iconeBuscar = document.getElementById("iconeBuscar");

    btnBuscar.addEventListener("click", function() {
        if (estabelecimentoNome.style.display === "none") {
            estabelecimentoNome.style.display = "inline";
            formBusca.style.display = "none";
            iconeBuscar.textContent = "search";
        } else {
            estabelecimentoNome.style.display = "none";
            formBusca.style.display = "inline";
            iconeBuscar.textContent = "close";
        }
    });
});