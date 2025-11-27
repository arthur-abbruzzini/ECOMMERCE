document.getElementById('formApagar').addEventListener('submit', (e) => {
    e.preventDefault();
    const codUsuario = document.getElementById('codUsuario').value;

    const token = sessionStorage.getItem('token');

    fetch(`http://localhost:3000/usuario/${codUsuario}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(res => {
        if (res.status === 204) {
            alert('Usuário apagado com sucesso!');
            document.getElementById('formApagar').reset();
        } else {
            return res.json();
        }
    })
    .then(dados => {
        if (dados && dados.message) {
            alert(dados.message);
        }
    })
    .catch(err => {
        console.error('Erro ao apagar usuário', err);
        alert('Erro ao apagar usuário');
    });
});