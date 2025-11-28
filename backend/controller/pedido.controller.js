const Pedido = require('../models/Pedido')
const ItemPedido = require('../models/ItemPedido')
const Produto = require('../models/Produto')
const Usuario = require('../models/Usuario')
const Estoque = require('../models/Estoque')
const Entrega = require('../models/Entrega')
const { verificarToken } = require('../service/jwt.service')

const criarPedido = async (req, res) => {
    console.log('=== CRIAR PEDIDO ===')
    console.log('Body:', JSON.stringify(req.body, null, 2))

    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
        console.log('ERRO: Token não fornecido')
        return res.status(401).json({ message: 'Token não fornecido' })
    }

    const decoded = verificarToken(token)
    if (!decoded) {
        console.log('ERRO: Token inválido')
        return res.status(401).json({ message: 'Token inválido' })
    }

    console.log('Usuário:', decoded.codUsuario)

    const idUsuario = decoded.codUsuario
    const { produtos, entrega } = req.body

    console.log('Produtos:', produtos)
    console.log('Entrega:', entrega)

    if (!produtos || !Array.isArray(produtos) || produtos.length === 0) {
        return res.status(400).json({ message: 'Carrinho vazio' })
    }

    if (!entrega) {
        console.log('ERRO: Dados de entrega obrigatórios')
        return res.status(400).json({ message: 'Dados de entrega são obrigatórios' })
    }

    try {
        // Validar estoque e calcular totais
        let subtotal = 0
        const itensValidados = []

        for (const item of produtos) {
            console.log(`Validando produto: ${item.codprod}, quantidade: ${item.qtde}`)
            const produto = await Produto.findByPk(item.codprod)
            if (!produto) {
                console.log(`ERRO: Produto ${item.codprod} não encontrado`)
                return res.status(404).json({ message: `Produto ${item.codprod} não encontrado` })
            }
            if (produto.estoque < item.qtde) {
                console.log(`ERRO: Estoque insuficiente para ${produto.nome}. Disponível: ${produto.estoque}, solicitado: ${item.qtde}`)
                return res.status(400).json({ message: `Estoque insuficiente para ${produto.nome}. Disponível: ${produto.estoque}` })
            }
            const valorTotalItem = produto.preco * item.qtde
            subtotal += valorTotalItem
            itensValidados.push({
                idProduto: item.codprod,
                quantidade: item.qtde,
                precoUnitario: produto.preco,
                valorTotalItem
            })
        }

        console.log('Criando pedido...')
        // Criar pedido
        const pedido = await Pedido.create({
            idUsuario,
            valorSubtotal: subtotal,
            valorTotal: subtotal // Sem frete por enquanto
        })
        console.log('Pedido criado:', pedido.codPedido)

        // Criar itens do pedido
        for (const item of itensValidados) {
            console.log(`Criando item do pedido: ${item.idProduto}`)
            await ItemPedido.create({
                idPedido: pedido.codPedido,
                ...item
            })

            // Registrar movimentação de saída no estoque
            await Estoque.create({
                idUsuario: idUsuario,
                idProduto: item.idProduto,
                tipo: 'SAIDA',
                data: new Date().toISOString().split('T')[0], // Data atual
                qtdeMovimento: item.quantidade
            })

            // Atualizar estoque do produto
            const produtoAtual = await Produto.findByPk(item.idProduto)
            const novaQuantidade = produtoAtual.estoque - item.quantidade
            await produtoAtual.update({ estoque: novaQuantidade })
            console.log(`Estoque atualizado para produto ${item.idProduto}: ${novaQuantidade}`)
        }

        console.log('Criando registro de entrega...')
        // Criar registro de entrega
        const entregaRecord = await Entrega.create({
            idPedido: pedido.codPedido,
            cep: entrega.cep,
            logradouro: entrega.logradouro,
            numero: entrega.numero,
            complemento: entrega.complemento || null,
            bairro: entrega.bairro,
            localidade: entrega.localidade,
            uf: entrega.uf
        })
        console.log('Entrega criada com sucesso')

        res.status(201).json({ message: 'Pedido criado com sucesso', pedido, entrega: entregaRecord })

    } catch (err) {
        console.error('Erro ao criar pedido', err)
        res.status(500).json({ message: 'Erro ao criar pedido' })
    }
}

const listarPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.findAll({
            include: [
                { model: Usuario, as: 'usuarioPedido' },
                {
                    model: Entrega,
                    as: 'entregaPedido',
                    required: false
                },
                {
                    model: ItemPedido,
                    as: 'itensPedido',
                    include: [{ model: Produto, as: 'produtoItem' }]
                }
            ],
            order: [['createdAt', 'DESC']]
        })
        res.status(200).json(pedidos)
    } catch (err) {
        console.error('Erro ao listar pedidos:', err)
        res.status(500).json({ message: 'Erro ao listar pedidos' })
    }
}

const atualizarPedido = async (req, res) => {
    const { id } = req.params
    const { status } = req.body

    try {
        const pedido = await Pedido.findByPk(id)
        if (!pedido) {
            return res.status(404).json({ message: 'Pedido não encontrado' })
        }

        await pedido.update({ status })
        res.status(200).json({ message: 'Pedido atualizado com sucesso', pedido })
    } catch (err) {
        console.error('Erro ao atualizar pedido:', err)
        res.status(500).json({ message: 'Erro ao atualizar pedido' })
    }
}

const buscarPedido = async (req, res) => {
    const { id } = req.params

    try {
        const pedido = await Pedido.findByPk(id, {
            include: [
                { model: Usuario, as: 'usuarioPedido' },
                {
                    model: Entrega,
                    as: 'entregaPedido',
                    required: false
                },
                {
                    model: ItemPedido,
                    as: 'itensPedido',
                    include: [{ model: Produto, as: 'produtoItem' }]
                }
            ]
        })

        if (!pedido) {
            return res.status(404).json({ message: 'Pedido não encontrado' })
        }

        res.status(200).json(pedido)
    } catch (err) {
        console.error('Erro ao buscar pedido:', err)
        res.status(500).json({ message: 'Erro ao buscar pedido' })
    }
}

const atualizarEntrega = async (req, res) => {
    const { id } = req.params
    const { statusEntrega, codigoRastreio, dataEstimada } = req.body

    try {
        const entrega = await Entrega.findByPk(id)
        if (!entrega) {
            return res.status(404).json({ message: 'Entrega não encontrada' })
        }

        await entrega.update({
            statusEntrega,
            codigoRastreio: codigoRastreio || null,
            dataEstimada: dataEstimada || null
        })
        res.status(200).json({ message: 'Entrega atualizada com sucesso', entrega })
    } catch (err) {
        console.error('Erro ao atualizar entrega:', err)
        res.status(500).json({ message: 'Erro ao atualizar entrega' })
    }
}

module.exports = { criarPedido, listarPedidos, buscarPedido, atualizarPedido, atualizarEntrega }