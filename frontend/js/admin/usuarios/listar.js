document.getElementById('btnListar').addEventListener('click', () => {
    const token = sessionStorage.getItem('token');

    fetch('http://localhost:3000/usuario', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(res => res.json())
    .then(usuarios => {
        const lista = document.getElementById('listaUsuarios');
        lista.innerHTML = '<h4>Usuários:</h4>';
        usuarios.forEach(u => {
            lista.innerHTML += `<p>ID: ${u.codUsuario} - ${u.nome} - ${u.email} - ${u.tipo_usuario}</p>`;
        });
    })
    .catch(err => {
        console.error('Erro ao listar usuários', err);
        alert('Erro ao listar usuários');
    });
});