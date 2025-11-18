let res = document.getElementById('res')

let btnCadastrar = document.getElementById('btnCadastrarProduto')

let token = sessionStorage.getItem('token')

if(!token){
    setTimeout(()=>{
        location.href = '../index.html'
    },100)
}

btnCadastrar.addEventListener('click', (e)=>{
    e.preventDefault()

    let nome = document.getElementById('nome').value
    let descricao = document.getElementById('descricao').value
    let modelo = document.getElementById('modelo').value
    let preco = document.getElementById('preco').value
    let imagem_url = document.getElementById('imagem_url').value
    let ativo = document.getElementById('ativo').value

    const valores = {
        nome: nome,
        descricao: descricao,
        modelo: modelo,
        preco: preco,
        imagem_url: imagem_url,
        ativo: ativo
    }

    fetch(`http://localhost:3000/produto`,{
        method: 'POST',
        headers: {
            'Content-Type':'application/json',
            'authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify(valores)
    })
    .then(resp => resp.json())
    .then(dados =>{
        console.log(dados)

        if (dados.error) {
            res.innerHTML = `${dados.error}`
        } else {
            res.innerHTML = `Produto cadastrado com sucesso!`
        }
    })
    .catch((err)=>{
        console.error('Erro ao cadastrar os dados', err)
        res.innerHTML = `Erro ao conectar com o servidor.`
    })
})
