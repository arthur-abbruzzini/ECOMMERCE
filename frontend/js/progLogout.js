let res = document.getElementById('res')

res.innerHTML = ''
res.innerHTML += 'Logout com sucesso!'

sessionStorage.clear()

setTimeout(()=>{
    location.href = '../index.html'
},1000)