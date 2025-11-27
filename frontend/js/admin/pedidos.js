document.addEventListener('DOMContentLoaded', () => {
    const btnCarregarPedidos = document.getElementById('btnCarregarPedidos')
    const pedidosBody = document.getElementById('pedidosBody')

    // Modal elements
    const modalPedido = document.getElementById('modalPedido')
    const modalEntrega = document.getElementById('modalEntrega')
    const closeModal = document.getElementById('closeModal')
    const closeModalEntrega = document.getElementById('closeModalEntrega')
    const formAtualizarPedido = document.getElementById('formAtualizarPedido')
    const formAtualizarEntrega = document.getElementById('formAtualizarEntrega')

    let currentPedidoId = null
    let currentEntregaId = null

    // Carregar pedidos
    btnCarregarPedidos.addEventListener('click', carregarPedidos)

    function carregarPedidos() {
        const token = sessionStorage.getItem('token')

        fetch('http://localhost:3000/pedido', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(pedidos => {
            pedidosBody.innerHTML = ''

            pedidos.forEach(pedido => {
                const dataFormatada = new Date(pedido.dataPedido).toLocaleDateString('pt-BR')
                const statusClass = `status-${pedido.status.toLowerCase().replace('_', '')}`
                const entregaInfo = pedido.entregaPedido ?
                    `${pedido.entregaPedido.statusEntrega}${pedido.entregaPedido.codigoRastreio ? ` (${pedido.entregaPedido.codigoRastreio})` : ''}` :
                    'Não informado'

                const row = document.createElement('tr')
                row.innerHTML = `
                    <td>${pedido.codPedido}</td>
                    <td>${pedido.usuarioPedido ? pedido.usuarioPedido.email : 'N/A'}</td>
                    <td>${dataFormatada}</td>
                    <td class="${statusClass}">${formatarStatus(pedido.status)}</td>
                    <td>R$ ${pedido.valorTotal.toFixed(2)}</td>
                    <td>${entregaInfo}</td>
                    <td>
                        <button class="btn-action btn-atualizar" onclick="abrirModalPedido(${pedido.codPedido}, '${pedido.status}')">Atualizar Pedido</button>
                        ${pedido.entregaPedido ? `<button class="btn-action btn-entrega" onclick="abrirModalEntrega(${pedido.entregaPedido.codEntrega}, '${pedido.entregaPedido.statusEntrega}', '${pedido.entregaPedido.codigoRastreio || ''}', '${pedido.entregaPedido.dataEstimada || ''}')">Atualizar Entrega</button>` : ''}
                    </td>
                `
                pedidosBody.appendChild(row)
            })
        })
        .catch(err => {
            console.error('Erro ao carregar pedidos:', err)
            alert('Erro ao carregar pedidos')
        })
    }

    // Funções para modais
    window.abrirModalPedido = function(pedidoId, statusAtual) {
        currentPedidoId = pedidoId
        document.getElementById('pedidoId').value = pedidoId
        document.getElementById('statusPedido').value = statusAtual
        modalPedido.style.display = 'block'
    }

    window.abrirModalEntrega = function(entregaId, statusAtual, codigoRastreio, dataEstimada) {
        currentEntregaId = entregaId
        document.getElementById('entregaId').value = entregaId
        document.getElementById('statusEntrega').value = statusAtual
        document.getElementById('codigoRastreio').value = codigoRastreio
        document.getElementById('dataEstimada').value = dataEstimada
        modalEntrega.style.display = 'block'
    }

    // Fechar modais
    closeModal.onclick = () => modalPedido.style.display = 'none'
    closeModalEntrega.onclick = () => modalEntrega.style.display = 'none'

    window.onclick = (event) => {
        if (event.target === modalPedido) modalPedido.style.display = 'none'
        if (event.target === modalEntrega) modalEntrega.style.display = 'none'
    }

    // Atualizar pedido
    formAtualizarPedido.addEventListener('submit', (e) => {
        e.preventDefault()
        const status = document.getElementById('statusPedido').value
        const token = sessionStorage.getItem('token')

        fetch(`http://localhost:3000/pedido/${currentPedidoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        })
        .then(res => res.json())
        .then(data => {
            alert('Pedido atualizado com sucesso!')
            modalPedido.style.display = 'none'
            carregarPedidos()
        })
        .catch(err => {
            console.error('Erro ao atualizar pedido:', err)
            alert('Erro ao atualizar pedido')
        })
    })

    // Atualizar entrega
    formAtualizarEntrega.addEventListener('submit', (e) => {
        e.preventDefault()
        const statusEntrega = document.getElementById('statusEntrega').value
        const codigoRastreio = document.getElementById('codigoRastreio').value
        const dataEstimada = document.getElementById('dataEstimada').value
        const token = sessionStorage.getItem('token')

        fetch(`http://localhost:3000/entrega/${currentEntregaId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ statusEntrega, codigoRastreio, dataEstimada })
        })
        .then(res => res.json())
        .then(data => {
            alert('Entrega atualizada com sucesso!')
            modalEntrega.style.display = 'none'
            carregarPedidos()
        })
        .catch(err => {
            console.error('Erro ao atualizar entrega:', err)
            alert('Erro ao atualizar entrega')
        })
    })

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