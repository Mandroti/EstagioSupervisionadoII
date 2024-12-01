document.getElementById('quadrado').addEventListener('click', function() {
    document.getElementById('inputImagem').click();
  });
  
  document.getElementById('inputImagem').addEventListener('change', function() {
    var input = this;
    var imagem = document.getElementById('imagemSelecionada');
    var quadrado = document.getElementById('quadrado');
  
    var file = input.files[0];
    var reader = new FileReader();
  
    reader.onload = function() {
      imagem.src = reader.result;
      imagem.style.display = 'block';
      quadrado.style.display = 'none';
    }
  
    reader.readAsDataURL(file);
  });
  