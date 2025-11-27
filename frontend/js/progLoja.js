// Carregar produtos da loja dinamicamente
document.addEventListener('DOMContentLoaded', () => {
    const gradeProdutos = document.querySelector('.grade-produtos');

    const token = sessionStorage.getItem('token');
    const headers = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    fetch('http://localhost:3000/produto', {
        method: 'GET',
        headers: headers
    })
    .then(res => res.json())
    .then(produtosDB => {
        gradeProdutos.innerHTML = ''; // Limpar produtos estáticos

        produtosDB.forEach(produto => {
            const article = document.createElement('article');
            article.className = 'produto';

            const imagem = produto.imagem_url ? (produto.imagem_url.startsWith('http://') || produto.imagem_url.startsWith('https://') ? produto.imagem_url : `../img/${produto.imagem_url}`) : 'default.jpg';

            article.innerHTML = `
                <figure>
                    <img src="${imagem}" alt="${produto.nome}">
                    <figcaption>${produto.nome}</figcaption>
                </figure>
                <div class="controle-produto">
                    <p>Preço: R$ ${produto.preco}</p>
                    <input type="number" id="qtde${produto.codProduto}" min="1" value="1" class="input-qtde">
                    <button id="btn${produto.codProduto}"
                        data-nome="${produto.nome}"
                        data-preco="${produto.preco}"
                        data-codprod="${produto.codProduto}">
                        Adicionar ao Carrinho
                    </button>
                </div>
            `;

            gradeProdutos.appendChild(article);
        });

        // Re-inicializar os event listeners para adicionar ao carrinho
        const botoesAdd = document.querySelectorAll('button[data-nome]');
        botoesAdd.forEach(btn => {
            btn.addEventListener('click', (event) => {
                event.preventDefault();
                const nome = btn.getAttribute('data-nome');
                const preco = parseFloat(btn.getAttribute('data-preco'));
                const codprod = btn.getAttribute('data-codprod');
                const qtdeInput = btn.closest('.controle-produto').querySelector('input[type="number"]');
                const qtde = parseInt(qtdeInput.value);

                // Verifica se o produto já está no carrinho
                let produtoExistente = produtos.find(p => p.codprod === codprod);
                if (produtoExistente) {
                    produtoExistente.qtde += qtde;
                } else {
                    produtos.push({ nome, preco, qtde, codprod });
                }

                localStorage.setItem('produtos', JSON.stringify(produtos));
                alert('Produto adicionado ao carrinho!');
            });
        });
    })
    .catch(err => {
        console.error('Erro ao carregar produtos', err);
        // Fallback para produtos estáticos se erro
    });
});