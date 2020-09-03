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
    document.getElementById("divInfoUser").innerHTML = `${linhaHTML}`;
    onChangeSelectStatus(0);
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
        var solic = lista[i];

        conteudoHTML = conteudoHTML +`<div class="row">
                                        <div class="col-1"> ${solic.numSeq} </div>
                                        <div class="col-2"> ${solic.dataSolicitacao} ${solic.horaSolicitacao} </div>
                                        <div class="col-4"> ${solic.nomeTecnico} <br>
                                                            ${solic.documento} / ${solic.telefone} </div>
                                        <div class="col-3"> ${solic.pdv.nome} </div>
                                        <div class="col-2"> <button type="button" class="btn btn-success" 
                                                                    onclick="atualizarStatus(${solic.numSeq},1)"> &nbsp; </button>
                                                            <button type="button" class="btn btn-danger" 
                                                                    onclick="atualizarStatus(${solic.numSeq},2)"> &nbsp; </button>
                                                            <button type="button" class="btn btn-secondary" 
                                                                    onclick="atualizarStatus(${solic.numSeq},3)"> &nbsp; </button>
                                        </div>
                                    </div>`;

    }
    document.getElementById("listaDeSolic").innerHTML = `${conteudoHTML}`;

}

function atualizarStatus(numReq, novoStatus){
    var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        //DECLARA BODY DO REST COMO RACF
        var raw = JSON.stringify({"numSeq": numReq,"situacao": novoStatus});

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        url = "http://localhost:8088/solicitacao/atualiza"

        fetch(url, requestOptions)
        .then(response => atualizaDash(response))
        .catch(error => console.log('error', error));
}

function atualizaDash(res){
    if(res.status == 200){
        onChangeSelectStatus(0);
        document.getElementById("selectStatus").selectedIndex = 0;
    }
    else{
        alert("Algo deu errado");
    }
}