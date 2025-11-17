let res = document.getElementById('res');
let btnCadastrar = document.getElementById('btnCadastrarProduto');

btnCadastrar.addEventListener('click', (e) => {
    e.preventDefault();

    let nome = document.getElementById('nome').value;
    let descricao = document.getElementById('descricao').value;
    let modelo = document.getElementById('modelo').value;
    let preco = document.getElementById('preco').value;
    let imagem_url = document.getElementById('imagem_url').value;
    let ativo = document.getElementById('ativo').value;

    const valores = {
        nome,
        descricao,
        modelo,
        preco,
        imagem_url,
        ativo
    };

    fetch(`http://localhost:3000/produto`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(valores)
    })
    .then(resp => resp.json())
    .then(dados => {
        console.log(dados);

        if (dados.error) {
            res.innerHTML = `${dados.error}</p>`;
        } else {
            res.innerHTML = `<p style="color: green;">✔ Produto cadastrado com sucesso!</p>`;
        }
    })
    .catch((err) => {
        console.error('Erro ao cadastrar os dados', err);
        res.innerHTML = `Erro ao conectar com o servidor.</p>`;
    });
});
