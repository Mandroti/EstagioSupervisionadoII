function trazerCidades() {
    localStorage.removeItem("cidadeNome");
    localStorage.removeItem("cidadeId");
    localStorage.removeItem("precoTotal");
    localStorage.removeItem("sabores");
    localStorage.removeItem("bordas");
    localStorage.removeItem('idsRegistrados');
    localStorage.setItem("logradouro", null);


    fetch(apiUrl + `/api/Cidade`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => {
        var selectCidades = document.getElementById("nomesCidades");
        var selectLog = document.getElementById("nomeBairro");
        selectCidades.innerHTML = '<option selected>Informe sua Cidade...</option>';
        selectLog.innerHTML = '<option selected>Informe seu Bairro...</option>';
       
        data.forEach(cidade => {
            var option = document.createElement('option');
            option.value = cidade.nome;
            option.text = cidade.nome;
            option.dataset.id = cidade.cidadeId; 
            
            selectCidades.add(option);
        });

        if (!selectCidades.dataset.eventAdded) {
            selectCidades.addEventListener('change', function() {
                var selectedOption = selectCidades.options[selectCidades.selectedIndex];
                var cidadeNome = selectedOption.value;
                var cidadeId = selectedOption.dataset.id; 

                AdicionarSelect(cidadeNome);
                localStorage.setItem("cidadeIdEscolha", cidadeId); 
                
            });
            selectCidades.dataset.eventAdded = true;
        }
    })
    .catch(error => console.error('Erro:', error));
}

function trazerLogradouros(){ 
    var id = localStorage.getItem("cidadeIdEscolha");
    var cidadeId = parseInt(id, 10);

    fetch(apiUrl+`/api/Estabelecimento/cidade/${cidadeId}`, { 
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => {
        var selectCidades = document.getElementById("nomeBairro");
        selectCidades.innerHTML = '<option>Informe seu Bairro...</option>';

        var logradourosUnicos = new Set();
        data.forEach(estabelecimento => {
            logradourosUnicos.add(estabelecimento.logradouro);
        });

        logradourosUnicos.forEach(logradouro => {
            var option = document.createElement('option');
            option.value = logradouro;
            option.text = logradouro;
            selectCidades.add(option);
        });

        selectCidades.addEventListener('change', function() {
            AdicionarSelect2(selectCidades.value);
        });
    })
    .catch(error => console.error('Erro:', error));
}

function AdicionarSelect(nomeCidade) {
    var selectBairros = document.getElementById("nomesCidades");
    var novoOption = document.createElement("option");
    novoOption.text = nomeCidade;
    novoOption.value = nomeCidade;
    
    selectBairros.innerHTML = ''; 
    selectBairros.add(novoOption);

    trazerLogradouros();
}

function AdicionarSelect2(nomeLogradouro) {

    localStorage.setItem("logradouro",nomeLogradouro)

    var selectBairros = document.getElementById("nomeBairro");
    var novoOption = document.createElement("option");
    novoOption.text = nomeLogradouro;
    novoOption.value = nomeLogradouro;

    selectBairros.innerHTML = ''; 
    selectBairros.add(novoOption);
}


function chamar() {    
    window.location.href = "estabelecimentos.html"
}

var logo;
var nomeEstab;

function visitarEstabelecimento(id) {   
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

function buscaCidadeId() {
    return new Promise((resolve, reject) => {
        fetch(apiUrl + `/api/Cidade/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(dado => {
            var cid = localStorage.getItem("cidadeNome");
            for (var k = 0; k < dado.length; k++) {
                if (dado[k].nome == cid) {
                    localStorage.setItem("idCidade", dado[k].cidadeId);
                    resolve(); 
                    return;
                }
            }
            reject(new Error('Cidade não encontrada')); 
        })
        .catch(function(error) {
            console.error('Erro:', error);
            reject(error);
        });
    });
}



