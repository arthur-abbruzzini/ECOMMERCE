const Usuario = require('../models/Usuario')
const { compareSenha } = require('../service/bcrypt.service')
const { gerarToken } = require('../service/jwt.service')

const login = async (req,res)=>{
    const valores = req.body

    try{
        const Usuario = await Usuario.findOne({where: { email: valores.email}})

        if(!Usuario){
            return res.status(404).json({error: "Usuario não encontrado!"})
        }

        const senhaValida = await compareSenha(valores.senha, Usuario.senha)

        if(!senhaValida){
            return res.status(401).json({error: "Senha inválida!"})
        }

        const token = gerarToken({
            codUsuario: Usuario.codUsuario,
            email: Usuario.email
        })

        res.status(200).json({message: "Login realizado com sucesso!", token})

    }catch(err){
        res.status(500).json({error: "Erro ao realizar o login!"})
    }
}

module.exports = { login }