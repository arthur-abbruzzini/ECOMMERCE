document.getElementById('formAtualizar').addEventListener('submit', (e) => {
    e.preventDefault();
    const codProduto = document.getElementById('codProduto').value;
    const nome = document.getElementById('nome').value;
    const descricao = document.getElementById('descricao').value;
    const preco = parseFloat(document.getElementById('preco').value);
    const imagem_url = document.getElementById('imagem_url').value;
    const estoque = parseInt(document.getElementById('estoque').value);

    const token = sessionStorage.getItem('token');

    fetch(`http://localhost:3000/produto/${codProduto}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nome, descricao, preco, imagem_url, estoque })
    })
    .then(res => res.json())
    .then(dados => {
        alert('Produto atualizado com sucesso!');
        document.getElementById('formAtualizar').reset();
    })
    .catch(err => {
        console.error('Erro ao atualizar produto', err);
        alert('Erro ao atualizar produto');
    });
});