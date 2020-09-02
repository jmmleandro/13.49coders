fucntion preencherPDV(){

    fetch("http://localhost:8088/pdv/todos")
    .then(res => res.json())
    .then(lista => trataCOonteudo)
}