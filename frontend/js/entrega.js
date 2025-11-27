document.addEventListener('DOMContentLoaded', () => {
    const formEntrega = document.getElementById('formEntrega')
    const btnBuscarCep = document.getElementById('btnBuscarCep')
    const btnVoltarCarrinho = document.getElementById('btnVoltarCarrinho')
    const resumoCarrinho = document.getElementById('resumoCarrinho')

    // Carregar resumo do carrinho
    const carrinhoTemp = JSON.parse(localStorage.getItem('carrinho_temp'))
    if (!carrinhoTemp || carrinhoTemp.length === 0) {
        alert('Carrinho vazio! Redirecionando...')
        window.location.href = 'carrinho.html'
        return
    }

    // Calcular total e mostrar resumo
    let total = 0
    let resumoHTML = '<h3>Resumo do Pedido</h3><ul>'
    carrinhoTemp.forEach(item => {
        const subtotal = item.preco * item.qtde
        total += subtotal
        resumoHTML += `<li>${item.nome} - ${item.qtde}x R$ ${item.preco.toFixed(2)} = R$ ${subtotal.toFixed(2)}</li>`
    })
    resumoHTML += `</ul><p><strong>Total: R$ ${total.toFixed(2)}</strong></p>`
    resumoCarrinho.innerHTML = resumoHTML

    // Buscar CEP via VIACEP
    btnBuscarCep.addEventListener('click', () => {
        const cep = document.getElementById('cep').value.replace(/\D/g, '')

        if (cep.length !== 8) {
            alert('CEP deve ter 8 dígitos')
            return
        }

        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (data.erro) {
                    alert('CEP não encontrado')
                    return
                }

                document.getElementById('logradouro').value = data.logradouro || ''
                document.getElementById('bairro').value = data.bairro || ''
                document.getElementById('localidade').value = data.localidade || ''
                document.getElementById('uf').value = data.uf || ''
                document.getElementById('numero').focus()
            })
            .catch(error => {
                console.error('Erro ao buscar CEP:', error)
                alert('Erro ao buscar CEP')
            })
    })

    // Formatar CEP enquanto digita
    document.getElementById('cep').addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '')
        if (value.length > 5) {
            value = value.slice(0, 5) + '-' + value.slice(5, 8)
        }
        e.target.value = value
    })

    // Voltar ao carrinho
    btnVoltarCarrinho.addEventListener('click', () => {
        // Restaurar carrinho normal
        localStorage.setItem('produtos', JSON.stringify(carrinhoTemp))
        localStorage.removeItem('carrinho_temp')
        window.location.href = 'carrinho.html'
    })

    // Finalizar compra com entrega
    formEntrega.addEventListener('submit', (e) => {
        e.preventDefault()

        const dadosEntrega = {
            cep: document.getElementById('cep').value,
            logradouro: document.getElementById('logradouro').value,
            numero: document.getElementById('numero').value,
            complemento: document.getElementById('complemento').value,
            bairro: document.getElementById('bairro').value,
            localidade: document.getElementById('localidade').value,
            uf: document.getElementById('uf').value
        }

        // Validar campos obrigatórios
        if (!dadosEntrega.cep || !dadosEntrega.logradouro || !dadosEntrega.numero ||
            !dadosEntrega.bairro || !dadosEntrega.localidade || !dadosEntrega.uf) {
            alert('Preencha todos os campos obrigatórios')
            return
        }

        const token = sessionStorage.getItem('token')

        // Enviar pedido com dados de entrega
        fetch('http://localhost:3000/pedido', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                produtos: carrinhoTemp,
                entrega: dadosEntrega
            })
        })
        .then(res => {
            if (res.ok) {
                return res.json()
            } else {
                throw new Error(`Erro HTTP: ${res.status}`)
            }
        })
        .then(dados => {
            console.log('Resposta do servidor:', dados)
            alert('Compra finalizada com sucesso!')
            localStorage.removeItem('produtos')
            localStorage.removeItem('carrinho_temp')
            window.location.href = 'loja.html'
        })
        .catch(err => {
            console.error('Erro ao finalizar compra:', err)
            alert('Erro ao processar a compra. Verifique se o pedido foi criado.')
        })
    })
})