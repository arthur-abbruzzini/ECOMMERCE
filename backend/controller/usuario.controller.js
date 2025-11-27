const Usuario = require('../models/Usuario')
const { hashSenha } = require('../service/bcrypt.service')
const { validaCPF } = require('../utils/validar_cpf')

const cadastrar = async (req,res) => {
    const valores = req.body
    console.log(valores)
    try{
        // Validar CPF
        if (!valores.cpf || !validaCPF(valores.cpf)) {
            return res.status(400).json({ error: 'CPF inválido!' })
        }

        // valores.senha é a senha digitada pelo usuário
        if(valores.senha){
            valores.senha = await hashSenha(valores.senha)
        }
        const dados = await Usuario.create(valores)
        res.status(201).json(dados)
    }catch(err){
        console.error('Erro ao receber os dados do Usuario',err)
        res.status(500).json({message: 'Erro ao receber os dados do Usuario'})
    }
}

const listar = async (req,res) => {
    try{
        const dados = await Usuario.findAll()
        res.status(200).json(dados)
    }catch(err){
        console.error('Erro ao listar os dados do Usuario',err)
        res.status(500).json({message: 'Erro ao listar os dados do Usuario'})
    }
}

const apagar = async (req,res) => {
    const id = req.params.id
    console.log(id)
    try{
        const dados = await Usuario.findByPk(id)
        if(dados){
            await Usuario.destroy({where: {codUsuario: id}})
            res.status(204).json({message: "Dados excluídos com sucesso!"})
        }else{
            res.status(404).json({message: "Usuario não encontrado!"})
        }
    }catch(err){
        console.error('Erro ao apagar os dados do Usuario',err)
        res.status(500).json({message: 'Erro ao apagar os dados do Usuario'})
    }
}

const atualizar = async (req,res) => {
    const id = req.params.id
    const valores = req.body
    console.log(id)
    console.log(valores)
    try{
        let dados = await Usuario.findByPk(id)
        if(dados){
            await Usuario.update(valores, {where: {codUsuario: id}})
            dados = await Usuario.findByPk(id)
            res.status(200).json(dados)
        }else{
            res.status(404).json({message: "Usuario não encontrado!"})
        }
    }catch(err){
        console.error('Erro ao atualizar os dados do Usuario',err)
        res.status(500).json({message: 'Erro ao atualizar os dados do Usuario'})
    }
}

module.exports = {cadastrar, listar, apagar, atualizar}