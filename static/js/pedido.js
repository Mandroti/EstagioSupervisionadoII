//CARDAPIODETALHE.HTML
function aumentarQuantidade() {
    var quant = document.getElementById('quantidadeFooter');
    var newValue = parseInt(quant.value) + 1;   
    quant.value = newValue;  
    localStorage.setItem('quantidadeFooter', newValue);
    document.getElementById('quantidadeFooter').value = newValue
}    

function diminuirQuantidade() {
    var quant = document.getElementById('quantidadeFooter').value;
    var newValue = quant - 1;
    if (newValue >= 0) {
        document.getElementById('quantidadeFooter').value = newValue;
        localStorage.setItem('quantidadeFooter', newValue);
    }
}

function decrementaComplemento(complementoId, precoVenda) {
    var input = document.getElementById(complementoId);
    var valor = parseInt(input.value, 10);

    if (isNaN(valor) || valor <= 0) {
        return;
    }
    valor -= 1;

    input.value = valor;

    var idsRegistrados = JSON.parse(localStorage.getItem('idsRegistrados')) || [];
    for(var i=0; i<idsRegistrados.length; i++){
        if(idsRegistrados[i].complementoId == complementoId){
            idsRegistrados.splice(i, 1);
            var precoTotal = parseFloat(localStorage.getItem("precoTotal")) || 0; 
            precoTotal = precoTotal - precoVenda;
            localStorage.setItem("precoTotal", precoTotal);
            localStorage.setItem('idsRegistrados', JSON.stringify(idsRegistrados));
        }
        
    }
}

function incrementaComplemento(complementoId, nome, precoVenda) {//PASSAR QUANTIDADE E PRODUTO
    var produto = localStorage.getItem('produto');
    var idsRegistrados = JSON.parse(localStorage.getItem('idsRegistrados')) || [];

    if (idsRegistrados.length >= parseInt(localStorage.getItem('quantiComple'))) {
        console.log('O número máximo de complementos registrados foi atingido.');
        return;
    }
    else{
        var input = document.getElementById(complementoId);
        var valor = parseInt(input.value, 10);
    
        if (isNaN(valor)) {
            valor = 0;
        }
    
        valor += 1;
        input.value = valor;

        const _complemento = {
            complementoId: complementoId,
            nome: nome,           
            precoVenda: precoVenda,
            produtoId: produto,
            quantidade: valor
        }
    
        idsRegistrados.push(_complemento);
        var precoTotal = parseFloat(localStorage.getItem("precoTotal")) || 0; 
        precoTotal = precoTotal + precoVenda;
        localStorage.setItem("precoTotal", precoTotal);

        localStorage.setItem('idsRegistrados', JSON.stringify(idsRegistrados));
        console.log('Complemento adicionado:', complementoId);
    
    }
}


function  exibeProdutos(){
  
    var produtosRegistrados = JSON.parse(localStorage.getItem('produtosRegistrados')) || [];

    produtosRegistrados.forEach(function(produto) {
        produto.quantidade = parseInt(localStorage.getItem('quantidadeFooter')) || 0;
    });
    localStorage.setItem('quantidadeFooter', 1);

    if (produtosRegistrados.length > 0) {        
        console.log('Produtos Registrados:', produtosRegistrados);
    } else {
        console.log('Nenhum produto registrado encontrado.');
    }

}

async function adicionarCarrinho() {
    var precoTotal = parseFloat(localStorage.getItem("precoTotal")) || 0; 
    var produto = localStorage.getItem('produto');
    var quantidade = localStorage.getItem('quantidadeFooter');
    var produtosRegistrados = JSON.parse(localStorage.getItem('produtosRegistrados')) || [];  
    var idsRegistrados = JSON.parse(localStorage.getItem('idsRegistrados')) || []; 
    var sabores = JSON.parse(localStorage.getItem('sabores')) || [];
   
    
    try {
        if(produto > 0 || sabores.length > 0 ){
            const response = await fetch(apiUrl + `/api/Produto/${produto}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if(quantidade == null || quantidade == "null")
                quantidade = 1;
            data.quantidade = quantidade;
            data.complementoIds = idsRegistrados; 
            data.tamanhoId = 0;
            data.bordaIds = "";

            if(data.precos.length == 0) {
                produtosRegistrados.push(data);
                
            } else { // Se for pizza              

                var bordas = JSON.parse(localStorage.getItem('bordas')) || []; 
                data.bordaIds = bordas;
                
                var precoBorda = bordas.preco;
              
                if(localStorage.getItem('limite') > 1) {
                    // Se for pizza de mais de um sabor                       
                    let nomePizzaSabores = "";                        

                    for (const sabor of sabores) {
                        const response = await fetch(apiUrl + '/api/Produto/' + sabor, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`,
                            },
                        });
                        const saborData = await response.json();
                        nomePizzaSabores += "Meia " + saborData.nome + " / "; 
                        localStorage.setItem("nomePizzaSabores", nomePizzaSabores);
                    }
                    
                    data.nome = localStorage.getItem("nomePizzaSabores");
                    data.descricao = localStorage.getItem("nomePizzaSabores");
                } 
                   

                    var preco = localStorage.getItem('precoDaPizza');            
                    
                    var tam = localStorage.getItem('tamDaPizza');
        
                    data.preco = preco;
                    data.tamanhoId = tam;
                    produtosRegistrados.push(data);               

            }
            var valor = parseFloat(data.preco);
            if(quantidade > 0)
                precoTotal = precoTotal + (valor * quantidade);
            else 
                precoTotal = precoTotal + valor;                
                
            localStorage.setItem("precoTotal", precoTotal);
            localStorage.setItem('produtosRegistrados', JSON.stringify(produtosRegistrados));
            
            exibeProdutos();        
            
            window.location.href = "cardapioNovo.html?exibirFooter=true";
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}



//DETALHES - CARDAPIO DETALHE
//PRODUTOS COMUNS
function exibirDetalhesProduto() {
    var produto = localStorage.getItem('produto');
    var categoria;
    fetch(apiUrl + '/api/Produto/'+produto, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => {        
        tabela = '';        
        tabela += `
        <div style="margin-bottom: -30px;"> 
            <div style="text-align: center;">
                <img src="${apiStorage}/${data.imagem}" style="max-width: 95%; max-height: 100%; width: auto; height: auto; object-fit: contain; margin-top: 30px;"/>
            </div>
            <div style="margin-left: 10px; margin-right: 7px;">
                <span style="font-size: small">${data.descricao}</span>
            </div>
            <b style="margin-left: 10px;font-size: medium; margin-top: 5px; color: #65B741;">R$ ${data.preco.toFixed(2)}</b>
            
        </div>`;

        titulo = ''
        titulo += `
            <b style="font-size: 17px; margin-left: 20px;">${data.nome}</b>
        `;
        categoria = data.categoriaId;

        localStorage.setItem('precoUnitario', data.preco.toFixed(2));
        document.getElementById('fotoProduto').innerHTML = tabela;
        document.getElementById('tituloProduto').innerHTML = titulo;

        fetch(apiUrl + '/api/Categoria/'+categoria,{
            method: 'GET',
            headers: {
            'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            localStorage.setItem('quantiComple',data.max_Complementos);
            if(data.tipo != 1) //nao é pizza
            {
                
                document.getElementById('bordas').style.display = "none";               
                document.getElementById('bordas2').style.display = "none";
               
               // document.getElementById('sabor').style.display = "none";                
                //document.getElementById('sabor1').style.display = "none";                
                carregarDetalhesProduto(categoria);
            }
            else{
                document.getElementById('variacao').style.display = "none";
                document.getElementById('complementos').style.display = "none";
                cardapioDetalhes();
            }
           
        })

        .catch(error => console.error('Erro:', error));

    })
    .catch(error => console.error('Erro:', error));

}

//PARA PIZZAS
function buscaNomeCategoria(){
    var idCa = localStorage.getItem('idCa');
    fetch(apiUrl + '/api/Categoria/'+idCa, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(dado => {
        titulo = ''
        titulo += `
            <b style="font-size: 17px; margin-left: 20px;">${dado.nome}</b>
        `;
        document.getElementById('tituloProduto').innerHTML = titulo;
    })
    .catch(error => console.error('Erro:', error));
}

function buscaBordasPizza(){
    var idCa = localStorage.getItem('idCa');
    fetch(apiUrl + `/api/Borda?CategoriaId=${idCa}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(dado => {
        console.log(dado)
        var tabela = '';
        
        for (let i = 0; i < dado.length; i++) {
            tabela += `
                <li style="display:flex; margin-bottom: 10px;">
                    <div>
                        <span style="font-size: small;">
                            <b>${dado[i].descricao}</b>
                        </span>
                        <br>
                        <span class="text-secondary">
                            <b style="color: #ce352c; font-size: 14px;">+ R$ ${dado[i].preco.toFixed(2)}</b>
                        </span>
                    </div>
                    <div class="ml-auto"> 
                        <input type="checkbox" name="checkbox_basic" onclick="adicionarBorda(${dado[i].bordaId}, '${dado[i].descricao}', ${dado[i].preco})"/>
                    </div>
                </li>
                <hr>
            `;
        }

        document.getElementById('listaBordas').innerHTML = tabela;
        configurarCheckboxes();
    })
    .catch(error => console.error('Erro:', error));
}



function adicionarBorda(id, nome, preco) {
    var idsBordas = JSON.parse(localStorage.getItem('bordas')) || [];
    console.log('Antes de limpar:', idsBordas);

    idsBordas = [];

    const _bordas = {
        bordaId: id,
        descricao: nome,
        preco: preco
    };

    idsBordas.push(_bordas);

    localStorage.setItem('bordas', JSON.stringify(idsBordas));

    console.log(_bordas);
}


function configurarCheckboxes() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('click', function() {
            checkboxes.forEach(otherCheckbox => {
                if (otherCheckbox !== checkbox) {
                    otherCheckbox.checked = false;
                }
            });            
        });
    });
}

function cardapioDetalhes() {
    var idCa = localStorage.getItem('idCa');
    
    document.getElementById('complementos').style.display = 'none';
    document.getElementById('variacao').style.display = 'none';
    
    buscaNomeCategoria();    
    buscaBordasPizza();

    var id = localStorage.getItem('id');

    fetch(apiUrl + `/api/Produto/Estabelecimento/${id}?CategoriaId=${idCa}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(dado => {
        console.log(JSON.stringify(dado)) 

        var sectionPromises = [];

        localStorage.setItem("flag",0);        
        sectionPromises.push(createSection(dado));
        

        Promise.all(sectionPromises)
        .then(sections => {
            
            document.getElementById('pizzas').innerHTML = sections.join('');
        })
        .catch(error => console.error('Erro:', error));
    })
    .catch(error => console.error('Erro:', error));
}

function createSection(dado) {
    var limite = localStorage.getItem('limite');
    return new Promise((resolve, reject) => {
        let section = `
            <section style="background-color: #ebebeb; margin: 10px; margin-top: -25px;" id="sabor">
                <div class="d-flex justify-content-between bd-gray mt-5">
                    <div class="p-2">
                        <p style="margin-top: 5px; margin-bottom: 5px; font-size: small;">
                            <b>Tamanho</b>
                        </p>
                        <p class="text-secondary subText" style="font-size: 12px">Escolha ${limite} Opções</p>
                    </div>
                    <div class="p-2 fg-gray align-self-center">
                        <p>
                            <span style="background-color: #53b611; font-size: 12px; color: white; padding: 2px; border-radius: 4px;"><strong>OBRIGATÓRIO</strong></span>
                        </p>
                    </div>
                </div>
            </section>
            <div style="padding-right: 10px;" id="sabor1">
                <ul style="list-style: none; padding-left: 10px;" id="listaSabores">
        `;

        let promises = dado.map(item => {
            return new Promise((resolve, reject) => {
                fetch(apiUrl +'/api/TamanhoPreco', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                .then(response => response.json())
                .then(preco => {                    

                    for (let k = 0; k < preco.length; k++) {                        
                        if (preco[k].produtoId == item.produtoId && preco[k].tamanhoId == localStorage.getItem("tamanhoID")) { 
                            localStorage.setItem("precoVerificadoPizza", preco[k].preco);               
                        }
                    }
                    
                    resolve(`
                    <li style="display: flex; align-items: center;">
                        <div style="flex: 1;">
                            <strong style="font-size: small;">${item.nome}</strong>
                            <br>
                            <span class="text-secondary" style="font-size: small;">${item.descricao}</span>
                            <br>
                            <span class="text-secondary">
                                <b style="color: #ce352c; font-size: 14px;">+ R$${parseFloat(localStorage.getItem("precoVerificadoPizza")).toFixed(2)}</b> 
                            </span>
                        </div>
                        <div style="display: flex; flex-direction: column; align-items: center;"> 
                            <div style="display: flex; flex-direction: column; align-items: center; margin-right: -10px">
                                <img style="border-radius: 5px; width: 100px; height: 90px; margin-bottom: 5px;" src="${apiStorage}/${item.imagem}"/>
                                <ul style="display: flex; list-style: none; padding: 0;">
                                    <li>
                                    <button type="button" data-pizzas="${item.tamanhoPrecoId}"
                                     style="width: 40px; color: #ce352c; background-color: transparent; border-color: transparent;" onclick="diminuirPizza(this.parentElement.nextElementSibling.querySelector('input'), ${item.produtoId});">                           
                                    <span><strong>-</strong></span>                            
                                </button>
                                    </li>
                                    <li>
                                        
                                        <input type="text" style="width: 60px; border: none; text-align: center;" placeholder="0" readonly />
                                    </li>
                                    <li>
                                        
                                        <button type="button" data-pizza="${item.tamanhoPrecoId}" style="width: 40px; color: #ce352c; background-color: transparent; border-color: transparent;" onclick="selecionarPizza(this.parentElement.parentElement.querySelector('input'), ${item.produtoId}, ${parseFloat(localStorage.getItem("precoVerificadoPizza")).toFixed(2)}, ${localStorage.getItem("tamanhoID")});">                            
                                            <span style="cursor: pointer; color: #ce352c; font-size: 14px;"><strong>+</strong></span>                            
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </li>
                        <hr>
                    `);
                })
                .catch(error => reject(error));
            });
        });

        Promise.all(promises)
        .then(results => {
            section += results.join('');
            section += `
                    </ul>
                </div>
            `;
            resolve(section);
        })
        .catch(error => reject(error));
    });
}

function diminuirPizza(input, item) {
    var f = parseInt(localStorage.getItem("flag")); 
      if(input.value == 1){
        var produtosRegistrados = JSON.parse(localStorage.getItem('produtosRegistrados')) || [];
        var idProduto = item;
        input.value = "0";
        f = f - 1;
        localStorage.setItem("flag", f.toString()); 
        produtosRegistrados = produtosRegistrados.filter(function(produto) {
            return produto.idProduto !== idProduto;
        });
        localStorage.setItem('produtosRegistrados', JSON.stringify(produtosRegistrados));
        localStorage.setItem('produto',0);

    }
}

function selecionarPizza(input, item, preco, tam) {
    var f = parseInt(localStorage.getItem("flag")); 
    var limite = parseInt(localStorage.getItem("limite")); 
    var sabores = JSON.parse(localStorage.getItem('sabores')) || [];
    if (f < limite) {
        if (input.value == 0) {
            var idProduto = item;
            sabores.push(idProduto);
            localStorage.setItem('sabores', JSON.stringify(sabores));
            localStorage.setItem('produto', idProduto);

            // Verifica se o novo preço é maior que o preço atual armazenado
            var valorProduto = parseFloat(localStorage.getItem('precoDaPizza')); //tenho que zerar a variavel depois
            
            if (preco > valorProduto) {
                localStorage.setItem('precoDaPizza', preco);
                
            }
            
            var idTamanho = tam;
            localStorage.setItem('tamDaPizza', idTamanho);

            f = f + 1;
            localStorage.setItem("flag", f.toString()); 
            input.value = "1";

        }
    }
}

function carregarDetalhesProduto(id){
    fetch(apiUrl + `/api/Complemento?CategoriaId=${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    
    .then(data => {
        console.log(JSON.stringify(data));
        if (data.length > 0) {
            tabela = '';
            
            document.getElementById('qtdeComplem').innerText = "Escolha até " + localStorage.getItem('quantiComple') + " opções";
            for (var i = 0; i < data.length; i++) {
                var complemento = {
                    complementoId: data[i].complementoId,
                    nome: data[i].nome,
                    precoVenda: data[i].precoVenda,
                    active: true,
                    categoriaId: data[i].categoriaId
                };
    
                tabela += `
                <li style="display:flex; margin-bottom: 10px;">
                    <div>
                        <span style="font-size: small;">
                            <b>${data[i].nome}</b>
                        </span>
                        <br>
                        <span class="text-secondary">
                            <b style="color: #ce352c; font-size: 14px;">+ R$ ${data[i].precoVenda.toFixed(2)}</b>
                        </span>
                    </div>
                    <div class="ml-auto" style="margin-top: 20px"> 
                        <ul style="display: flex; list-style: none; padding: 0;">
                            <li>
                                <button type="button" style="width: 40px; color: #ce352c; background-color: transparent; border-color: transparent;" onclick="decrementaComplemento(${data[i].complementoId}, ${data[i].precoVenda})">                           
                                    <span><strong>-</strong></span>                            
                                </button>
                            </li>
                            <li>
                                <input type="text" style="width: 60px; border: none; text-align: center;" placeholder="0" readonly id="${data[i].complementoId}"/>
                            </li>
                            <li>
                            <button type="button" style="width: 40px; color: #ce352c; background-color: transparent; border-color: transparent;" onclick="incrementaComplemento(${data[i].complementoId},'${data[i].nome}',${data[i].precoVenda})">                            
                                    <span onclick="mostrarFooter();" style="cursor: pointer; color: #ce352c; font-size: 14px;"><strong>+</strong></span>                            
                                </button>
                            </li>
                        </ul>
                    </div>
                </li>
                <hr>
                `;
            }
        document.getElementById('listaComplementos').innerHTML = tabela;
       }

       else{
        document.getElementById('listaComplementos').style.display = 'none';
        document.getElementById('complementos').style.display = 'none';
       }

       fetch(apiUrl + `/api/Variacao/Grupo?CategoriaId=${id}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
       })
       .then(response => response.json())
       .then(data =>{

            if(data.length > 0)
            {
                var grupoid = data.grupoId;
            
                fetch(apiUrl + '/api/Variacao?GrupoId='+grupoid,{
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                .then(response => response.json())
                .then(data =>{
                    if(data.length > 0)
                    {
                        tabela = '';
                        tabela += `
                        <li style="display:flex; margin-bottom: 10px;">
                            <div>
                                <span style="font-size: small;">
                                    <b>${data.nome}</b>
                                </span>
                                <br>
                                <span class="text-secondary">
                                    <b style="color: #ce352c; font-size: 14px;">+ R$ ${data.valor.toFixed(2)}</b>
                                </span>
                            </div>
                            <div class="ml-auto" style="margin-top: 20px"> 
                                <ul style="display: flex; list-style: none; padding: 0;">
                                    <li>
                                        <button type="button" style="width: 40px; color: #ce352c; background-color: transparent; border-color: transparent;">                           
                                            <span><strong>-</strong></span>                            
                                        </button>
                                    </li>
                                    <li>
                                        <input type="text" style="width: 60px; border: none; text-align: center;" placeholder="0" readonly />
                                    </li>
                                    <li>
                                        <button type="button" style="width: 40px; color: #ce352c; background-color: transparent; border-color: transparent;">                            
                                            <span onclick="mostrarFooter();" style="cursor: pointer; color: #ce352c; font-size: 14px;"><strong>+</strong></span>                            
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </li>


                        <hr>
                        `;
                            document.getElementById('itensVariacao').innerHTML = tabela;
                    }
                    else{
                        document.getElementById('itensVariacao').style.display = 'none';
                        document.getElementById('variacao').style.display = 'none';
                    }
                })
                .catch(error => console.error('Erro:', error));
            }else{
                document.getElementById('itensVariacao').style.display = 'none';
                document.getElementById('variacao').style.display = 'none';
            }
           
       })
       .catch(error => console.error('Erro:', error));
        
    })
    .catch(error => console.error('Erro:', error));
}



