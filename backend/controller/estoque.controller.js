const Estoque = require('../models/Estoque')
const Produto = require('../models/Produto')
const Usuario = require('../models/Usuario')

const registrarMovimentacao = async (req, res) =>{

    const valores = req.body
    console.log('Valores da movimentação: ', valores)

    if(!valores.idProduto || !valores.tipo || !valores.data || !valores.qtdeMovimento){

        return res.status(400).json({message: 'Todos os campos obrigatórios devem ser preenchidos.'})
    }

    try{

        // Verificação da existência do Produto
        const produto = await Produto.findByPk(valores.idProduto)
        if(!produto){

            return res.status(404).json({message: 'Produto não encontrado.'})
        }

        // Verificar usuário se fornecido
        if(valores.idUsuario){
            const usuario = await Usuario.findByPk(valores.idUsuario)
            if(!usuario){
                return res.status(404).json({message: 'Usuário não encontrado.'})
            }
        }

        let novaQuantidade = produto.estoque

        // ---------------------------------------------------------------------------
        // ENTRADA
        // ---------------------------------------------------------------------------
        if(valores.tipo === 'ENTRADA'){

            novaQuantidade += valores.qtdeMovimento
        }

        // ---------------------------------------------------------------------------
        // SAIDA
        // ---------------------------------------------------------------------------
        else if(valores.tipo === 'SAIDA'){

            if(produto.estoque < valores.qtdeMovimento){

                return res.status(400).json({message: 'Estoque insuficiente para saída.'})
            }
            novaQuantidade -= valores.qtdeMovimento
        }else{

            return res.status(400).json({message: 'Tipo de movimentação inválida.'})
        }


        // Atualiza o banco com a nova quantidade
        await Produto.update({estoque: novaQuantidade}, {where: {codProduto: valores.idProduto}})

        // Registro de movimentação
        const movimento = await Estoque.create({
            idUsuario: valores.idUsuario || null,
            idProduto: valores.idProduto,
            tipo: valores.tipo,
            data: valores.data,
            qtdeMovimento: valores.qtdeMovimento
        })

        // Retorno pro front
        res.status(201).json({
            message: 'Movimentação registrada com sucesso.',
            novaQuantidade,
            movimento
        })
    }catch(err){

        console.error('Erro ao registrar movimentação do estoque: ', err)
        res.status(500).json({error: 'Erro ao registrar movimentação do estoque: ', err})
    }
}

const listarMovimentacoes = async(req, res) =>{

    try{

        const dados = await Estoque.findAll({
            include: [
                { model: Produto, as: 'produtoEstoque' },
                { model: Usuario, as: 'usuarioEstoque' }
            ]
        })
        res.status(200).json(dados)
    }catch(err){

        console.error('Erro ao listar os dados: ', err)
        res.status(500).json({error: 'Erro ao listar os dados:', err})
    }
}

module.exports = { registrarMovimentacao, listarMovimentacoes }