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

module.exports = {cadastrar}