let res = document.getElementById('res')
let btnLogin = document.getElementById('btnLogin')

btnLogin.addEventListener('click', (e) => {
    e.preventDefault()

    let email = document.getElementById('email').value
    let senha = document.getElementById('senha').value

    const valores = {
        email: email,
        senha: senha
    }

    fetch(`http://localhost:3000/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(valores)
    })
        .then(resp => resp.json())
        .then(dados => {
            console.log(dados)

            // SE DER ERRO NO LOGIN
            if (dados.error) {
                res.innerText = dados.error
                return
            }

            // SE LOGIN DER CERTO
            sessionStorage.setItem('token', dados.token)
            res.innerText = "Login realizado com sucesso!"

            // 🔥 REDIRECIONA PARA A LOJA
            setTimeout(() => {
                location.href = "./html/loja.html"
            }, 800)
        })
        .catch((err) => {
            console.error('Erro ao realizar login', err)
        })
})
