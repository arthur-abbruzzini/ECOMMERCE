document.getElementById('formCadastrar').addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const telefone = document.getElementById('telefone').value;
    const cpf = document.getElementById('cpf').value;
    const identidade = document.getElementById('identidade').value;
    const tipo_usuario = document.getElementById('tipo_usuario').value;

    const token = sessionStorage.getItem('token');

    fetch('http://localhost:3000/usuario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nome, email, senha, telefone, cpf, identidade, tipo_usuario })
    })
    .then(res => res.json())
    .then(dados => {
        alert('Usuário cadastrado com sucesso!');
        document.getElementById('formCadastrar').reset();
    })
    .catch(err => {
        console.error('Erro ao cadastrar usuário', err);
        alert('Erro ao cadastrar usuário');
    });
});