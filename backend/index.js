const express = require('express')
const app = express()
const cors = require('cors')

const PORT = 3000
const hostname = 'localhost'

const conn = require('./db/conn')

const usuarioController = require('./controller/usuario.controller')
const produtoController = require('./controller/produto.controller')

const authController = require('./controller/auth.controller')
const authMiddleware = require('./middleware/auth.middleware')

// ----------- express middleware ---------------
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())
// ----------------------------------------------

// ------ rotas públicas -------------
app.post('/usuario', usuarioController.cadastrar)
app.post('/login', authController.login)

// ---- rotas privadas --------------------------
app.use(authMiddleware)

app.post('/produto', produtoController.cadastrar)

app.get('/', (req,res)=>{
    res.status(200).json({message: "Aplicação rodando!"})
})

// ----------------------------------------------
conn.sync()
.then(()=>{
    app.listen(PORT, hostname, ()=>{
        console.log(`Servidor rodando em http://${hostname}:${PORT}`)
    })
})
.catch((err)=>{
    console.error('Erro ao sincronizar com o banco de dados!',err)
})