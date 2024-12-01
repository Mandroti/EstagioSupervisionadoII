const body = document.querySelector('body'),
    sidebar = body.querySelector('nav'),
    toggle = body.querySelector(".toggle"),
    searchBtn = body.querySelector(".search-box"),
    modeSwitch = body.querySelector(".toggle-switch"),
    modeText = body.querySelector(".mode-text");


//ANIMAÇÕES
toggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
})

searchBtn.addEventListener("click", () => {
    sidebar.classList.remove("close");
})


//LOADING 
function cadastrarEstabelecimento(){
    event.preventDefault();   
    window.location.href = "aguardandoEmail.html";
}

//FETCH LOGIN CLIENTE

function gravaDadosConsumidor(){
    event.preventDefault();
    let token = localStorage.getItem("token");

    fetch(apiUrl +'/api/Consumidor/token', { 
        method: 'GET',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`  
        },        
    })
    .then(response => response.json())
    .then(data => {

        var produtosRegistrados = JSON.parse(localStorage.getItem("produtosRegistrados"));      

        console.log(produtosRegistrados)
      
        var pag = localStorage.getItem('pag');
        var tipo = localStorage.getItem('tipo');
        var total = 0;
        produtosRegistrados.forEach(produto => {
            if (produto.preco && typeof produto.preco === 'number') {
                total += produto.preco;
            }
        });
       

        const dados = { 
            consumidorId: data.consumidorId,
            estabelecimentoId: localStorage.getItem("estabelecimentoId"),
            active: true,
            consumidorNome: data.nome,
            consumidorTelefone: data.telefone,            
            enderecoCep: data.cep,
            enderecoLogradouro: data.logradouro,
            enderecoNumero: data.numero,
            enderecoBairro: data.bairro,
            enderecoComplemento: data.uf,
            enderecoCidadeNome: data.cidadeNome, 
            formaPagamento: parseInt(pag),
            pagamentoObs: "",
            formaEntrega: parseInt(tipo),
            entregaObs: "",
            precoProdutos: 0,
            precoFrete: 0,
            precoTotalPedido: parseFloat(total),
            pedido_Produtos:[],
        };

        produtosRegistrados.forEach(produtoRegistrado =>{
            const novoProduto = {
                pedidoId: 0,
                produtoId: produtoRegistrado.produtoId,                
                descricao: produtoRegistrado.nome,
                imagem: produtoRegistrado.imagem,
                precoUnitario: produtoRegistrado.preco,
                qtde: produtoRegistrado.quantidade,             
                observacao: "string",
                tamanhoId: produtoRegistrado.tamanhoId !== 0 ? produtoRegistrado.tamanhoId : null,
                pedido_Produto_Complementos: []
            };

            if (produtoRegistrado.complementoIds && produtoRegistrado.complementoIds.length > 0) {
                produtoRegistrado.complementoIds.forEach(complemento => {
                    const novoComplemento = {
                        pedidoProdutoId: 0, 
                        complementoId: complemento.complementoId,
                        preco: complemento.precoVenda, 
                        qtde: complemento.quantidade,
                        nome: complemento.nome
                    };
                    novoProduto.pedido_Produto_Complementos.push(novoComplemento);
                });
            }
            
            dados.pedido_Produtos.push(novoProduto);
        })

        for (let i = 0; i < produtosRegistrados.length; i++) {
            const produto = produtosRegistrados[i];           
            if (produto.complementoIds) {
                for (let j = 0; j < produto.complementoIds.length; j++) {
                    console.log(produto.complementoIds[j]);
                }
            } else {
                console.log(`O produto "${produto.nome}" não possui complementos.`);
            }
        }
         
        var token = localStorage.getItem("token");
        fetch(apiUrl +'/api/Pedido', { 
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },        
            body: JSON.stringify(dados)       
        })
        .then(response => response.json())
        .then(result => {
            console.log(result.pedidoId);
            localStorage.setItem("pedidoId", result.pedidoId);
            showModal();
            setTimeout(function() {
                window.location.replace("statusPedido.html");  // Redireciona sem manter a página anterior no histórico
            }, 3000);
            
            localStorage.removeItem("cidadeNome");
            localStorage.removeItem("precoTotal");
            localStorage.removeItem("sabores");
            localStorage.removeItem("bordas");
            localStorage.removeItem('idsRegistrados')
        })
        .catch(error => console.error('Erro:', error));   

    })
    .catch(error => console.error('Erro ao buscar por ID:', error));  
    event.preventDefault();
}
function showModal() {
    var modal = document.getElementById("modal");
    modal.style.display = "block";
  
    // Desaparece após 3 segundos
    setTimeout(function() {
      modal.style.display = "none";
    }, 3000);
  }
function showModal2() {
    var modal = document.getElementById("modalVerifica");
    modal.style.display = "block";
}
function fecharModal() {

    document.getElementById("modalEndereco").style.display = "none";
    document.getElementById("modalVerificaEmail").style.display = "none";
    document.getElementById("modalEnderecoNovo").style.display = "none";

}

function reenviarCodigo(){
    var username =  localStorage.getItem('telefoneCliente');
    fetch(apiUrl +'/api/Consumidor/EnviarCodigoVerificacaoTelefone/'+username,{             
        method: 'GET',
        headers:{
            'Content-Type': 'application/json',                       
        } 
    })
    .then(response => {
    if (!response.ok) {
        throw new Error('Erro ao enviar código');
    }
    return response.text();
    })
    .then(data => {
        console.log('SMS enviado com sucesso:', data);
        window.location.href = "codigoVerificacao.html";
    })
    .catch(error => {
        console.error('Erro:', error);
    });
}

function reenviarCodigoEmail(){
    
    fetch(apiUrl + "/api/Estabelecimento/EnviarCodigoVerificacaoEmail/",{             
        method: 'GET',
        headers:{
            'Content-Type': 'application/json',                       
        } 
    })
    .then(response => {
    if (!response.ok) {
        throw new Error('Erro ao enviar código');
    }
    return response.text();
    })
    .then(data => {
        console.log('Email enviado com sucesso:', data);
        window.location.href = "codigoVerificacao.html";
    })
    .catch(error => {
        console.error('Erro:', error);
    });
}

function confirmarEndereco(){
    const entregaSelecionada = document.getElementById("entrega_endereco_cadastro").checked;
    
    if (entregaSelecionada) {
        document.getElementById("modalEndereco").style.display = "block";
    }else{
        telaLogin();
    }
}

function concluirPedido(){
    var entregaEnderecoCadastro = document.getElementById('entrega_endereco_cadastro').checked;

    if(entregaEnderecoCadastro){
        localStorage.setItem('tipo',1);
    }
    else{
        
        localStorage.setItem('tipo',0);
    }    

    var cart = document.getElementById('cartao_').checked;
    var din = document.getElementById('dinheiro_').checked;
    if(cart){
        localStorage.setItem('pag',2);
    }else if(din){
        localStorage.setItem('pag',0);
    }else{
        
        localStorage.setItem('pag',1);
    }

    //karolaine
    var opcaoSelecionada = document.querySelector('input[name="opcao_entrega"]:checked');

    if (!opcaoSelecionada){
        document.getElementById('faltaEnd').style.display = 'block';
        return;
    }

     var opcaoSelecionada = document.querySelector('input[name="opcao_pagamento"]:checked');
        
    if (!opcaoSelecionada) {
        document.getElementById('faltaPag').style.display = 'block';
        return;
    }

    var produtosRegistrados = JSON.parse(localStorage.getItem('produtosRegistrados')) || [];
    console.log(produtosRegistrados); // Depuração
    
    if (produtosRegistrados.length > 0) {
        gravaDadosConsumidor();
    } else {
        document.getElementById('faltaDados').style.display = 'block';
    }
    
}

function fecharModalF(modalId) {
    document.getElementById(modalId).style.display = "none";
}
function fecharModalP(modalId) {
    document.getElementById(modalId).style.display = "none";
}
function fecharModalE(modalId) {
    document.getElementById(modalId).style.display = "none";
}

async function Login(event) {
 
    event.preventDefault();
    const para = new URLSearchParams(window.location.search);
    const para2 = new URLSearchParams(window.location.search);
 
    
    if (para.has('redirect') && para.get('redirect') === 'finalizacaoPedido') { //para se o token for null faz o login e manda pro carrinho
    
        const password = document.getElementById('password').value;
        const userName = document.getElementById('username').value;
        const loginDados = {
            userName: userName,
            password: password
        };
    
        const authResponse = await fetch(apiUrl + '/api/Autoriza/Consumidor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginDados)
        });
    
        if (authResponse.ok) {
        
            const result = await authResponse.json();
            localStorage.setItem("token", result.token);
            localStorage.setItem("time", result.expiration);
            localStorage.setItem("idConsumidor", result.id);
            
            window.location.replace('carrinhoNovo.html');
            
        } else {
           
            document.getElementById('errorUsuario').style.display = 'block';
            console.error('Erro na autenticação:', await authResponse.text());
        }
    } else {
      
        const params = new URLSearchParams(window.location.search);
        const userName = document.getElementById('username').value;
    
        if (userName.includes("@")) {
            meuEstabelecimento();
            return;
        }
    
        localStorage.setItem('telefoneCliente', userName);    
        const dados = {           
            userName: userName
        };
    
        try {    
           
            //VERIFICA SE ESTA ENTRANDO NO LOGIN DO ESTABELECIMENTOS.HTML
              
                const password = document.getElementById('password').value;
                const loginDados = {
                    userName: userName,
                    password: password
                };
        
                const authResponse = await fetch(apiUrl + '/api/Autoriza/Consumidor', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(loginDados)
                });
        
                if (authResponse.ok) {
                  
                    const result = await authResponse.json();
                    localStorage.setItem("token", result.token);
                    localStorage.setItem("time", result.expiration);
                 
                    localStorage.setItem("idConsumidor", result.id);
                
                    const temProdutos = localStorage.getItem('produtosRegistrados');
                   
                    if (params.has('redirect')) {
                        const redirectUrl = params.get('redirect');
                        window.location.href = redirectUrl;
                    }  
                    else if(!temProdutos || temProdutos.length === 0){
                        window.location.href = 'index.html';
                    }
                    else{                        
                        window.location.href = 'carrinhoNovo.html';
                    }
                } else {
                    document.getElementById('errorUsuario').style.display = 'block';
                    console.error('Erro na autenticação:', await authResponse.text());
                }
            
           
        } catch (error) {
            console.error('Erro na solicitação:', error);
        }
        
    }
}

function AlterarDadosEntrega(){
    var id = localStorage.getItem("idConsumidor");
    const token = localStorage.getItem("token");       
       
    var nome = document.getElementById('inputNome').value; 
    var telefone = document.getElementById('inputContato').value;
    var cep = document.getElementById('inputCep').value;
    cep = cep.replace(/\D/g,'');       
    var logradouro = document.getElementById('inputLog').value;      
    var bairro = document.getElementById('inputBairro').value;      
    var numero = document.getElementById('inputNum').value;      
    var cidade_IBGE = document.getElementById('inputCit').value;  
    var uf =  document.getElementById('inputUf').value;  
   

    const dados = {
        consumidorId: id, nome: nome, telefone: telefone,
        logradouro: logradouro,
        bairro: bairro, cep: cep, numero: numero, cidadeNome: cidade_IBGE, uf: uf
    };       


    fetch(apiUrl+'/api/Consumidor/'+id, {             
        method: 'PUT',
        headers:{
            'Content-Type': 'application/json',    
            'Authorization': `Bearer ${token}`             
        },
        body: JSON.stringify(dados)  
    })
    .then(response => { return response.json();})
    .then(data => {
        location.reload();
    })
    .catch(error => console.error('Erro:', error));
    event.preventDefault();   
}

function enderecoConfirmado() {
    document.getElementById('modalEnderecoNovo').style.display = "block";
}


function meuLogin() {
    const userName = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const dados = {
        userName: userName,
        password: password
    };

    fetch(apiUrl + '/api/Autoriza/Consumidor', { 
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },        
        body: JSON.stringify(dados)   
    })
    .then(response => {
        if (!response.ok) {            
            return meuEstabelecimento();
        }

        console.log(response)
        
        return response.json();
    })
    .then(result => {
        if (data.errorMessage === "Aguardando confirmação do telefone"){
        
        }else{

            console.log(result) 
            localStorage.setItem("token", result.token);
            localStorage.setItem("time", result.expiration);
            localStorage.setItem("id", result.id); 

            gravaDadosConsumidor();   
        }    
    })
    .catch(error => {

    });     
    event.preventDefault();
}


function meuEstabelecimento() {
    const userName = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const dados = {
        userName: userName,
        password: password
    };

    fetch(apiUrl+'/api/Autoriza/Estabelecimento', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)   
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(errorText => {
                // Checa se a resposta contém a mensagem de email não verificado
                if (errorText.includes("Email não verificado")) {
                    
                    document.getElementById('modalVerificaEmail').style.display = 'block';
                }  
                
            });
        }
        return response.json();
    })
    .then(result => {
        localStorage.setItem("token", result.token);
        localStorage.setItem("time", result.expiration);
        localStorage.setItem("id", result.id);

        if (new Date(localStorage.getItem("time")) > new Date()) { 
            window.location.href = "dashboard.html";
        }
    })
    .catch(error => {
        document.getElementById('errorUsuario').style.display = 'block';
        console.error('Erro:', error);
    });     
    event.preventDefault();
}


function registraEstabelecimento()//cadastrar estabelecimento
{
       var nome = document.getElementById("inputNome").value;       
       var cnpj_Cpf = document.getElementById("inputCnpj").value;
       var cnpj_Cpf = cnpj_Cpf.replace(/\D/g,'');  
       var ie_Rg = ""; //nao tem no formulario        
       var nomeFantasia = ""; //nao tem no formulario       
       var telefone = document.getElementById("inputTelefone").value;   
       telefone = telefone.replace(/\D/g,'');
       var celular = document.getElementById("inputTelefone").value;    
       celular = celular.replace(/\D/g,'');
       var emailPrincipal = document.getElementById("inputEmail").value;      
       var logradouro = "A preencher";       
       var bairro = "A preencher";      
       var cep = "";                  
       var numero = "";      
       var cidade_IBGE = ""; //nao tem no formulario       
       var uf = "  ";      
       var senha = document.getElementById("password").value;       
       var confirmaSenha = document.getElementById("inputConfirmar").value;       
       var observacao = ""; //nao tem no formulario        
       var logo = ""; //nao tem no formulario       
       var active = true; //nao tem no formulario
   
        const dados = {
            nome: nome, cnpj_Cpf: cnpj_Cpf, ie_Rg: ie_Rg, nomeFantasia: nomeFantasia,
            telefone: telefone, celular: celular, emailPrincipal: emailPrincipal, logradouro: logradouro,
            bairro: bairro, cep: cep, numero: numero, cidade_IBGE: cidade_IBGE, uf: uf, senha:senha, 
            observacao: observacao, logo: logo, active: active
        };

        localStorage.setItem('emailEstab',emailPrincipal);

        if(senha == confirmaSenha)
        {
            fetch('http://aguiadelivery.com.br:6060/api/Estabelecimento', {             
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',               
                },
                body: JSON.stringify(dados)           
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao cadastrar usuário');
                }
                return response.text();                
            })
            .then(result => {
                console.log(result);
                var email = localStorage.getItem('emailEstab');
                fetch(apiUrl +`/api/Estabelecimento/EnviarCodigoVerificacaoEmail/${email}`, {
                    method: 'GET',
                    headers:{
                        'Content-Type': 'application/json',               
                    },
                })
                .then(data => {
                    console.log("Resposta da API:", data);
                    window.location.href = 'codigoVerificacao.html';
                })
                .catch(error => {
                    
                    console.error("Erro ao fazer a requisição:", error);
                    
                });
            })
            .catch(error => console.log('error', error));     
              
        }
        else{        
            event.preventDefault();   
            document.getElementById('senhaDiferenteAlert').style.display = 'block';            
        }   
        event.preventDefault();      
}
function buscarEstabelecimentoId(id)
{
    fetch(`http://aguiadelivery.com.br:6060/api/Estabelecimento/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Estabelecimento ID:', data);
    })
    .catch(error => console.error('Erro ao buscar por ID:', error));

    event.preventDefault();
}
function removerEstabelecimento(id)
{
    fetch(`http://aguiadelivery.com.br:6060/api/Estabelecimento/${id}`, {
        method: 'DELETE'
    })
    .then(data => {
        console.log('Estabelecimento ID:', data);
    })
    .catch(error => console.error('Erro ao deletar o ID:', error));

    event.preventDefault();
}

//ALTERARSENHA.HTML
function exibeSenha2(inputId) {
    // Seleciona o campo de senha
    var passwordInput = document.getElementById(inputId);
    
    // Seleciona o ícone do olho
    var eyeIcon = passwordInput.nextElementSibling.querySelector('i');

    // Alterna entre os tipos de input: password e text
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text'; // Exibe a senha
        eyeIcon.classList.remove('bi-eye-slash'); // Remove o ícone de olho fechado
        eyeIcon.classList.add('bi-eye'); // Adiciona o ícone de olho aberto
    } else {
        passwordInput.type = 'password'; // Oculta a senha
        eyeIcon.classList.remove('bi-eye'); // Remove o ícone de olho aberto
        eyeIcon.classList.add('bi-eye-slash'); // Adiciona o ícone de olho fechado
    }
}

function exibeSenha(inputId) {
    var eyeIcon = document.querySelector('#' + inputId + ' + .input-group-append .toggle-password');
    var passwordInput = document.getElementById(inputId);

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.querySelector('i').classList.remove('bi-eye-slash');
        eyeIcon.querySelector('i').classList.add('bi-eye');
    } else {
        passwordInput.type = 'password';
        eyeIcon.querySelector('i').classList.remove('bi-eye');
        eyeIcon.querySelector('i').classList.add('bi-eye-slash');
    }
    
}




//ALTERARSENHAESTABELECIMENTO.HTML
function recuperarSenhaEstabelecimento() {      
    const numeroTelefone = document.getElementById('numeroTelefone').value;
    localStorage.setItem('emailAlterar', numeroTelefone);

    fetch(apiUrl + "/api/Estabelecimento/EnviarCodigoVerificacaoEmail/"+numeroTelefone+"?RedefinicaoSenha=true",{             
        method: 'GET', // VAI DAR PROBLEMA PORQUE O CODIGO JA FOI CONFIRMADO
        headers:{
            'Content-Type': 'application/json',                       
        } 
    })
    .then(response => {
    if (!response.ok) {
        throw new Error('Erro ao enviar código');
    }
    return response.text();
    })
    .then(data => {
        console.log('Email enviado com sucesso:', data);
        window.location.replace("codigoVerificacao.html?RecuperarEstabelecimento");    
    })
    .catch(error => {
        document.getElementById('naoTelefone').style.display = 'block';
        console.error('Erro:', error);
    });

}


function recuperarSenha() {
    const numero = document.getElementById('numeroTelefone').value;
    const telefoneSemFormatacao = numero.replace(/\D/g, '');
    localStorage.setItem('telefoneClienteAlterar', telefoneSemFormatacao);

    fetch(apiUrl +'/api/Consumidor/EnviarCodigoVerificacaoTelefone/'+telefoneSemFormatacao+"?RedefinicaoSenha=true",{             
        method: 'GET', // VAI DAR PROBLEMA PORQUE O CODIGO JA FOI CONFIRMADO
        headers:{
            'Content-Type': 'application/json',                       
        } 
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 400) {
                document.getElementById('naoTelefone').style.display = 'block';
            }
            throw new Error('Erro ao enviar código');
        }
        return response.text();
    })
    .then(data => {
        console.log('SMS enviado com sucesso:', data);
        window.location.replace("codigoVerificacao.html?RecuperarCliente");
    })
    .catch(error => {
        document.getElementById('naoTelefone').style.display = 'block';
        console.error('Erro:', error);
    });
    event.preventDefault();
}

function novaSenha(){
    
    setTimeout(function() {
        // Redireciona para a página novaSenha.html e substitui a página no histórico
        window.location.replace("login.html");
    }, 3000);
}


//FETCH ADM
function registraAdm()//cadastrar o administrador
{
        var nome = document.getElementById('inputNome').value;
        var email = document.getElementById('inputEmail').value;  
        var cnpj = document.getElementById('inputCnpj').value;  
        cnpj = cnpj.replace(/\D/g,'');     
        var telefone = document.getElementById('inputCelular').value;
        telefone = telefone.replace(/\D/g,'');       
        var active = true;              
        var senha = document.getElementById('inputSenha').value;        
        var confirmaSenha = document.getElementById('inputConfirmar').value;

        const dados = {
            nome: nome, telefone: telefone, active: active, emailPrincipal: email,
            active: active, senha: senha, cnpj: cnpj
        };       
        
        if(senha == confirmaSenha)
        {
            fetch(apiUrl + '/api/Administrador', {             
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',               
                },
                body: JSON.stringify(dados)           
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao cadastrar usuário');
                }
                return response.text();                
            })
            .then(result => {
                console.log(result);
                
                window.location.href = 'loginAdm.html';
            })
            .catch(error => console.error('Erro:', error));        
            event.preventDefault();
     
        }
        else{          
            event.preventDefault();   
            document.getElementById('senhaDiferenteAlert').style.display = 'block';
        }        
}

function editaAdm()
{
        var nome = document.getElementById('inputNome').value;
        var email = document.getElementById('inputEmail').value;        
        var telefone = document.getElementById('inputCelular').value;
        telefone = telefone.replace(/\D/g,'');       
        var active = true;              
        var senha = document.getElementById('inputSenha').value;        
        var confirmaSenha = document.getElementById('inputConfirmar').value;

        const dados = {
            nome: nome, telefone: telefone, active: active, emailPrincipal: email,
            active: active, senha: senha
        };       
        
        if(senha == confirmaSenha)
        {
            fetch(apiUrl + '/api/Administrador', {             
                method: 'PUT',
                headers:{
                    'Content-Type': 'application/json',               
                },
                body: JSON.stringify(dados)           
            })
            .then(response => response.text())
            .then(result => {window.location.href = 'login.html';})
            .catch(error => console.error('Erro:', error));        
            event.preventDefault();
     
        }
        else{          
            event.preventDefault();   
            document.getElementById('senhaDiferenteAlert').style.display = 'block';
        }        
}

function getAdm()
{
    fetch(apiUrl + '/api/Administrador', {             
        method: 'GET',
        headers:{
            'Content-Type': 'application/json',               
        },
        body: JSON.stringify(dados)           
    })
    .then(response => response.text())
    .then(result => {console.log(result)})
    .catch(error => console.error('Erro:', error));        
    
    event.preventDefault();

}

function meuAdm()
{
    const userName = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const dados = {
        userName: userName,
        password: password
    };

    fetch(apiUrl + '/api/Autoriza/Admin', { 
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },        
        body: JSON.stringify(dados)   

    })
    .then(response => {
        if (!response.ok) {
            document.getElementById('errorUsuario').style.display = 'block';
        }
        return response.json();
    })
    .then(result => {
        localStorage.setItem("token", result.token);
        localStorage.setItem("time", result.expiration);
        

        if (new Date(localStorage.getItem("time")) > new Date()) { 
            window.location.href = "dashboardAdm.html";
        }
    })
    .catch(error => console.error('Erro:', error));     
    event.preventDefault();
}    


