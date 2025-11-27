document.getElementById('btnCarregarEstoque').addEventListener('click', () => {
    const token = sessionStorage.getItem('token');

    // Carregar produtos para mostrar estoque atual
    fetch('http://localhost:3000/produto', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(res => res.json())
    .then(produtos => {
        const tbody = document.getElementById('estoqueBody');
        tbody.innerHTML = '';

        produtos.forEach(p => {
            const status = p.estoque > 0 ? 'Disponível' : 'Esgotado';
            const statusClass = p.estoque > 0 ? '' : 'estoque-baixo';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${p.codProduto}</td>
                <td>${p.nome}</td>
                <td>${p.descricao || ''}</td>
                <td>R$ ${p.preco}</td>
                <td>${p.estoque}</td>
                <td class="${statusClass}">${status}</td>
            `;
            tbody.appendChild(row);
        });
    })
    .catch(err => {
        console.error('Erro ao carregar estoque', err);
        alert('Erro ao carregar estoque');
    });

    // Também carregar movimentações (opcional - pode ser útil para auditoria)
    fetch('http://localhost:3000/estoque', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(res => res.json())
    .then(movimentacoes => {
        console.log('Movimentações:', movimentacoes);
        // Pode adicionar uma seção para mostrar movimentações se necessário
    })
    .catch(err => {
        console.error('Erro ao carregar movimentações', err);
    });
});