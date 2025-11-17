let res = document.getElementById('res');
let btnCadastrar = document.getElementById('btnCadastrar');

btnCadastrar.addEventListener('click', (e) => {
    e.preventDefault();

    let nome = document.getElementById('nome').value;
    let telefone = document.getElementById('telefone').value;
    let email = document.getElementById('email').value;
    let senha = document.getElementById('senha').value;
    let cpf = document.getElementById('cpf').value;
    let identidade = document.getElementById('identidade').value;
    let tipo_usuario = document.getElementById('tipo_usuario').value;

    const valores = {
        nome,
        telefone,
        email,
        senha,
        cpf,
        identidade,
        tipo_usuario
    };

    fetch(`http://localhost:3000/usuario`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(valores)
    })
    .then(resp => resp.json())
    .then(dados => {
        console.log(dados);

        if (dados.error) {
            res.innerHTML = `<p style="color: red;">❌ ${dados.error}</p>`;
        } else {
            res.innerHTML = `<p style="color: green;">✔ Usuário cadastrado com sucesso!</p>`;
        }
    })
    .catch((err) => {
        console.error('Erro ao cadastrar os dados', err);
        res.innerHTML = `<p style="color: red;">❌ Erro ao conectar com o servidor.</p>`;
    });
});
