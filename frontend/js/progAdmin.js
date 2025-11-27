// Cadastrar Produto
document.getElementById('formCadastrar').addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = document.getElementById('nome').value;
    const descricao = document.getElementById('descricao').value;
    const preco = parseFloat(document.getElementById('preco').value);
    const estoque = parseInt(document.getElementById('estoque').value);

    const token = sessionStorage.getItem('token');

    fetch('http://localhost:3000/produto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nome, descricao, preco, estoque })
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

// Listar Produtos
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

// Atualizar Produto
document.getElementById('formAtualizar').addEventListener('submit', (e) => {
    e.preventDefault();
    const codProduto = document.getElementById('codProdutoUpdate').value;
    const nome = document.getElementById('nomeUpdate').value;
    const descricao = document.getElementById('descricaoUpdate').value;
    const preco = parseFloat(document.getElementById('precoUpdate').value);
    const estoque = parseInt(document.getElementById('estoqueUpdate').value);

    const token = sessionStorage.getItem('token');

    fetch(`http://localhost:3000/produto/${codProduto}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nome, descricao, preco, estoque })
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

// Apagar Produto
document.getElementById('formApagar').addEventListener('submit', (e) => {
    e.preventDefault();
    const codProduto = document.getElementById('codProdutoDelete').value;

    const token = sessionStorage.getItem('token');

    fetch(`http://localhost:3000/produto/${codProduto}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(res => {
        if (res.status === 204) {
            alert('Produto apagado com sucesso!');
            document.getElementById('formApagar').reset();
        } else {
            return res.json();
        }
    })
    .then(dados => {
        if (dados && dados.message) {
            alert(dados.message);
        }
    })
    .catch(err => {
        console.error('Erro ao apagar produto', err);
        alert('Erro ao apagar produto');
    });
});