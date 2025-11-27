const Produto = require('../models/Produto')

const cadastrar = async (req,res) => {
    const valores = req.body
    console.log(valores)
    try{
        const dados = await Produto.create(valores)
        res.status(200).json(dados)
    }catch(err){
        console.error('Erro ao receber os dados do Produto',err)
        res.status(500).json({message: 'Erro ao receber os dados do Produto'})
    }
}

const listar = async (req,res) => {
    try{
        const dados = await Produto.findAll()
        res.status(200).json(dados)
    }catch(err){
        console.error('Erro ao listar os dados do Produto',err)
        res.status(500).json({message: 'Erro ao listar os dados do Produto'})
    }
}

const apagar = async (req,res) => {
    const id = req.params.id
    console.log(id)
    try{
        const dados = await Produto.findByPk(id)
        if(dados){
            await Produto.destroy({where: {codProduto: id}})
            res.status(204).json({message: "Dados excluídos com sucesso!"})
        }else{
            res.status(404).json({message: "Produto não encontrado!"})
        }
    }catch(err){
        console.error('Erro ao apagar os dados do Produto',err)
        res.status(500).json({message: 'Erro ao apagar os dados do Produto'})
    }
}

const atualizar = async (req,res) => {
    const id = req.params.id
    const valores = req.body
    console.log(id)
    console.log(valores)
    try{
        let dados = await Produto.findByPk(id)
        if(dados){
            await Produto.update(valores, {where: {codProduto: id}})
            dados = await Produto.findByPk(id)
            res.status(200).json(dados)
        }else{
            res.status(404).json({message: "Produto não encontrado!"})
        }
    }catch(err){
        console.error('Erro ao atualizar os dados do Produto',err)
        res.status(500).json({message: 'Erro ao atualizar os dados do Produto'})
    }
}

module.exports = {cadastrar, listar, apagar, atualizar}