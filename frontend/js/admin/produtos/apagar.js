document.getElementById('formApagar').addEventListener('submit', (e) => {
    e.preventDefault();
    const codProduto = document.getElementById('codProduto').value;

    const token = sessionStorage.getItem('token');

    fetch(`http://localhost:3000/produto/${codProduto}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(res => {
        if (res.status === 204) {
            alert('Produto apagado com sucesso!');
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
        console.error('Erro ao apagar produto', err);
        alert('Erro ao apagar produto');
    });
});