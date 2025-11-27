document.getElementById('formCadastrar').addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = document.getElementById('nome').value;
    const modelo = document.getElementById('modelo').value;
    const descricao = document.getElementById('descricao').value;
    const preco = parseFloat(document.getElementById('preco').value);
    const estoque = parseInt(document.getElementById('estoque').value);
    const imagem_url = document.getElementById('imagem_url').value;

    const token = sessionStorage.getItem('token');

    fetch('http://localhost:3000/produto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nome, modelo, descricao, preco, estoque, imagem_url })
    })
    .then(res => res.json())
    .then(dados => {
        alert('Produto cadastrado com sucesso!');
        document.getElementById('formCadastrar').reset();
    })
    .catch(err => {
        console.error('Erro ao cadastrar produto', err);
        alert('Erro ao cadastrar produto');
    });
});