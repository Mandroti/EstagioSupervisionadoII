//MASCARAS DE FORMATAÇÃO INPUTS
function applyPhoneMask(event) {
    let input = event.target;
    let value = input.value;
    if (!value) return "";
    value = value.replace(/\D/g,'');
    value = value.replace(/(\d{2})(\d)/,"($1) $2");
    value = value.replace(/(\d)(\d{4})$/,"$1-$2");
    input.value = value;
}

const applyZipCodeMask = (event) => {
    let input = event.target;
    let value = input.value;
    
    if (!value) return "";
    
    value = value.replace(/\D/g,'');
    value = value.replace(/(\d{5})(\d)/,'$1-$2');
    
    input.value = value;
}

function applyCNPJMask(event) {
    let input = event.target;
    let value = input.value;
    value = value.replace(/\D/g,"");                           
    value = value.replace(/^(\d{2})(\d)/,"$1.$2");              
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/,"$1.$2.$3"); 
    value = value.replace(/\.(\d{3})(\d)/,".$1/$2");          
    value = value.replace(/(\d{4})(\d)/,"$1-$2");             
    input.value = value;
}

document.addEventListener('DOMContentLoaded', function() {
    const cepInput = document.getElementById("inputCep");

    cepInput.addEventListener('blur', function() {
        const cepValue = cepInput.value.replace(/[^0-9]+/, '');
        if (cepValue.length === 8) {
            fetchCEP(cepValue);
        }
    });
});

function fetchCEP(cepValue) {
    const url = `https://viacep.com.br/ws/${cepValue}/json/`;

    fetch(url)
        .then(response => response.json())
        .then(json => {
            if (json.logradouro) {
                document.getElementById('inputLog').value = json.logradouro;
                document.getElementById('inputBairro').value = json.bairro;
                document.getElementById('inputCit').value = json.localidade;
                document.getElementById('inputUf').value = json.uf;
            }
        });
}

function checkTelefone(event)
{
    var value = event.target.value;

    var phoneRegex = /^\d{11,}$/;

    if (phoneRegex.test(value)) {
        applyPhoneMask(event);
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