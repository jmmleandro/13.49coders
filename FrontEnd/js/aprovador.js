function carregaInfo(){
    var infoUser = localStorage.getItem("pdvUser");
    if(!infoUser){
        window.location = "index.html";
    }
    var objUser = JSON.parse(infoUser);

    var linhaHTML = `<div class="row">
                        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                            <img src="${objUser.linkFoto}" width="100%">
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8">
                            <strong>Nome: </strong> ${objUser.nome}<br>
                            <strong>RACF: </strong> ${objUser.racf}<br>
                            <strong>Email: </strong> ${objUser.email}<br>
                            <strong>Telefone: </strong> ${objUser.telefone}<br>
                        </div>
                        `
}

// VALIDA O PREENCHIMENTO DOS CAMPOS USUÁRIO E SENHA
function onChangeSelectStatus(status){
    var url = "http://localhost:8088/solicitacao/status/"+status;

    fetch(url)   // "promessa de execução"
       .then(res => res.json())                // vou extrair o JSON do resultado que vier
       .then(lista => trataConteudoDaLista(lista));
}


function trataConteudoDaLista(lista){
    // aqui efetivamente eu quero trabalhar com os objetos que eu recebi do BackEnd
    var conteudoHTML = "";
    for (i=0; i<lista.length; i++){
        var solicitacao = lista[i];

        conteudoHTML = conteudoHTML + `<div class="row">
                                           <div class="col-1">${solicitacao.numSeq}</div>
                                          <div class="col-2">${solicitacao.dataSolicitacao}</div>
                                          <div class="col-2">${solicitacao.operadora}</div>
                                          <div class="col-2">${solicitacao.nomeTecnico}</div>
                                        </div>`;

    }
    document.getElementById("listaDeSolic").innerHTML = `${conteudoHTML}`;

}