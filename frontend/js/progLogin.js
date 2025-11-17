let res = document.getElementById('res')

let btnLogin = document.getElementById('btnLogin')

btnLogin.addEventListener('click', (e)=>{
    e.preventDefault()

    let email = document.getElementById('email').value
    let senha = document.getElementById('senha').value

    const valores = {
        email: email,
        senha: senha
    }

    fetch(`http://localhost:3000/login`,{
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(valores)
    })
    .then(resp => resp.json())
    .then(dados =>{
        console.log(dados)
        console.log(dados.token)

        sessionStorage.setItem('token',dados.token)
    })
    .catch((err)=>{
        console.error('Erro ao cadastrar os dados',err)
    })
})