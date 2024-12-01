//var apiUrl = "http://localhost:5252";
var apiUrl = "http://www.aguiadelivery.com.br:6060";

var apiStorage = "http://www.aguiadelivery.com.br:6060/api/Storage";

var token = localStorage.getItem("token");
var time = localStorage.getItem("time");
var id = localStorage.getItem("id");


//REALIZAR LOGIN -- TOKEN
function meuLogin() {
  const userName = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const dados = {
    userName: userName,
    password: password
  };

  fetch(apiUrl + '/api/Autoriza/Estabelecimento', {
      method: 'POST',
      headers: {
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
      token = result.token;
      time = result.expiration;
      id = result.id;

      localStorage.setItem("token", token);
      localStorage.setItem("time", time);
      localStorage.setItem("id", id);

      if (new Date(time) > new Date()) {
        window.location.href = "dashboard.html";
      }
    })
    .catch(error => console.error('Erro:', error));
  event.preventDefault();
}
