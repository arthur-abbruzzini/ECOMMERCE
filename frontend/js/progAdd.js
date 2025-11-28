// Referências aos elementos
const areaCarrinho = document.getElementById('area-carrinho')
const totalTexto = document.getElementById('total')
const btnLimpar = document.getElementById('btn-limpar')
const btnFinalizar = document.getElementById('btn-finalizar')
const btnVoltar = document.getElementById('btn-voltar')

// Recupera os produtos do localStorage
let produtos = JSON.parse(localStorage.getItem('produtos')) || []

// Função para renderizar toda a tabela
function mostrarCarrinho() {
    if (!areaCarrinho || !totalTexto) return; // Só executa se os elementos existirem
    if (produtos.length === 0) {
        areaCarrinho.innerHTML = '<p>Seu carrinho está vazio.</p>'
        totalTexto.textContent = 'Total: R$ 0,00'
        return
    }

    let total = 0;
    let tabelaHTML = `
        <table>
            <thead>
                <tr>
                    <th>Carro</th>
                    <th>Preço (R$)</th>
                    <th>Qtde</th>
                    <th>Subtotal (R$)</th>
                </tr>
            </thead>
            <tbody>
    `

    produtos.forEach(p => {
        const subtotal = p.preco * p.qtde
        total += subtotal

        tabelaHTML += `
            <tr>
                <td>${p.nome}</td>
                <td>${p.preco.toFixed(2)}</td>
                <td>${p.qtde}</td>
                <td>${subtotal.toFixed(2)}</td>
            </tr>
        `
    })

    tabelaHTML += `
            </tbody>
        </table>
    `

    areaCarrinho.innerHTML = tabelaHTML
    totalTexto.textContent = `Total: R$ ${total.toFixed(2)}`
}

// Finalizar compra — redirecionar para página de entrega
if (btnFinalizar) {
    btnFinalizar.addEventListener('click', () => {
        if (produtos.length === 0) {
            alert('Seu carrinho está vazio!')
            return
        }

        // Mover carrinho para temp e redirecionar para entrega
        localStorage.setItem('carrinho_temp', JSON.stringify(produtos))
        localStorage.removeItem('produtos')
        window.location.href = 'entrega.html'
    })
}

// Botão de limpar carrinho
if (btnLimpar) {
    btnLimpar.addEventListener('click', () => {
        areaCarrinho.innerHTML = '<p>Seu carrinho está vazio.</p>'
        totalTexto.textContent = 'Total: R$ 0,00'
        localStorage.clear()
    })
}

// Voltar à loja
if (btnVoltar) {
    btnVoltar.addEventListener('click', () => {
        location.href = 'loja.html'
    })
}

// Adicionar produto ao carrinho
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

// Exibe produtos ao abrir a página
mostrarCarrinho()
