document.getElementById('btnListar').addEventListener('click', () => {
    const token = sessionStorage.getItem('token');

    fetch('http://localhost:3000/produto', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(res => res.json())
    .then(produtos => {
        const lista = document.getElementById('listaProdutos');
        lista.innerHTML = '<h4>Produtos:</h4>';
        produtos.forEach(p => {
            lista.innerHTML += `<p>ID: ${p.codProduto} - ${p.nome} - R$ ${p.preco} - Estoque: ${p.estoque}</p>`;
        });
    })
    .catch(err => {
        console.error('Erro ao listar produtos', err);
        alert('Erro ao listar produtos');
    });
});