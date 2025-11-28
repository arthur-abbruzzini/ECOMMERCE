document.addEventListener('DOMContentLoaded', () => {
    const btnBuscarPedido = document.getElementById('btnBuscarPedido')
    const pedidoIdBusca = document.getElementById('pedidoIdBusca')
    const detalhesPedido = document.getElementById('detalhesPedido')

    // Buscar pedido por ID
    btnBuscarPedido.addEventListener('click', () => {
        const id = pedidoIdBusca.value.trim()
        if (!id) {
            alert('Digite um ID de pedido')
            return
        }
        buscarPedidoPorId(id)
    })

    function buscarPedidoPorId(id) {
        const token = sessionStorage.getItem('token')

        fetch(`http://localhost:3000/pedido/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => {
            if (res.status === 404) {
                throw new Error('Pedido não encontrado')
            }
            return res.json()
        })
        .then(pedido => {
            exibirDetalhesPedido(pedido)
        })
        .catch(err => {
            console.error('Erro ao buscar pedido:', err)
            alert(err.message || 'Erro ao buscar pedido')
        })
    }

    function exibirDetalhesPedido(pedido) {
        const dataFormatada = new Date(pedido.dataPedido).toLocaleDateString('pt-BR')
        const statusFormatado = formatarStatus(pedido.status)

        let html = `
            <h4>Detalhes do Pedido #${pedido.codPedido}</h4>
            <p><strong>Cliente:</strong> ${pedido.usuarioPedido ? pedido.usuarioPedido.email : 'N/A'}</p>
            <p><strong>Data:</strong> ${dataFormatada}</p>
            <p><strong>Status:</strong> ${statusFormatado}</p>
            <p><strong>Valor Subtotal:</strong> R$ ${parseFloat(pedido.valorSubtotal).toFixed(2)}</p>
            <p><strong>Valor Frete:</strong> R$ ${parseFloat(pedido.valorFrete || 0).toFixed(2)}</p>
            <p><strong>Valor Total:</strong> R$ ${parseFloat(pedido.valorTotal).toFixed(2)}</p>
        `

        if (pedido.entregaPedido) {
            const entrega = pedido.entregaPedido
            html += `
                <h5>Informações de Entrega</h5>
                <p><strong>CEP:</strong> ${entrega.cep}</p>
                <p><strong>Endereço:</strong> ${entrega.logradouro}, ${entrega.numero}${entrega.complemento ? ', ' + entrega.complemento : ''}</p>
                <p><strong>Bairro:</strong> ${entrega.bairro}</p>
                <p><strong>Cidade:</strong> ${entrega.localidade} - ${entrega.uf}</p>
                <p><strong>Status Entrega:</strong> ${entrega.statusEntrega}</p>
                ${entrega.codigoRastreio ? `<p><strong>Código Rastreio:</strong> ${entrega.codigoRastreio}</p>` : ''}
                ${entrega.dataEstimada ? `<p><strong>Data Estimada:</strong> ${new Date(entrega.dataEstimada).toLocaleDateString('pt-BR')}</p>` : ''}
            `
        }

        if (pedido.itensPedido && pedido.itensPedido.length > 0) {
            html += '<h5>Itens do Pedido</h5><ul>'
            pedido.itensPedido.forEach(item => {
                html += `<li>${item.produtoItem.nome} - ${item.quantidade}x R$ ${parseFloat(item.precoUnitario).toFixed(2)} = R$ ${parseFloat(item.valorTotalItem).toFixed(2)}</li>`
            })
            html += '</ul>'
        }

        detalhesPedido.innerHTML = html
        detalhesPedido.style.display = 'block'
    }

    function formatarStatus(status) {
        const statusMap = {
            'PENDENTE_PAGAMENTO': 'Pendente de Pagamento',
            'PAGO': 'Pago',
            'ENVIADO': 'Enviado',
            'ENTREGUE': 'Entregue',
            'CANCELADO': 'Cancelado'
        }
        return statusMap[status] || status
    }
})