const express = require('express')
const app = express()
const cors = require('cors')

const PORT = 3000
const hostname = 'localhost'

const conn = require('./db/conn')
require('./models/rel') // Importar relacionamentos

const usuarioController = require('./controller/usuario.controller')
const produtoController = require('./controller/produto.controller')
const pedidoController = require('./controller/pedido.controller')
const estoqueController = require('./controller/estoque.controller')

const authController = require('./controller/auth.controller')
const authMiddleware = require('./middleware/auth.middleware')
const adminMiddleware = require('./middleware/admin.middleware')

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
app.get('/produto', produtoController.listar)

app.post('/pedido', pedidoController.criarPedido)
app.get('/pedido', pedidoController.listarPedidos)
app.put('/pedido/:id', pedidoController.atualizarPedido)
app.put('/entrega/:id', pedidoController.atualizarEntrega)

// ---- rotas admin --------------------------
app.use(adminMiddleware)

app.delete('/produto/:id', produtoController.apagar)
app.put('/produto/:id', produtoController.atualizar)

app.get('/usuario', usuarioController.listar)
app.delete('/usuario/:id', usuarioController.apagar)
app.put('/usuario/:id', usuarioController.atualizar)

app.post('/estoque', estoqueController.registrarMovimentacao)
app.get('/estoque', estoqueController.listarMovimentacoes)

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