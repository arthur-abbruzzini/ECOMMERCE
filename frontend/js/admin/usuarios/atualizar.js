document.getElementById('formAtualizar').addEventListener('submit', (e) => {
    e.preventDefault();
    const codUsuario = document.getElementById('codUsuario').value;
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const cpf = document.getElementById('cpf').value;
    const identidade = document.getElementById('identidade').value;
    const tipo_usuario = document.getElementById('tipo_usuario').value;

    const token = sessionStorage.getItem('token');

    fetch(`http://localhost:3000/usuario/${codUsuario}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nome, email, telefone, cpf, identidade, tipo_usuario })
    })
    .then(res => res.json())
    .then(dados => {
        alert('Usuário atualizado com sucesso!');
        document.getElementById('formAtualizar').reset();
    })
    .catch(err => {
        console.error('Erro ao atualizar usuário', err);
        alert('Erro ao atualizar usuário');
    });
});