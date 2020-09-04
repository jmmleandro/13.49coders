function carregaInfo(){
    var infoUser = localStorage.getItem("pdvUser");
    if(!infoUser){
        window.location = "index.html";
    }
    var objUser = JSON.parse(infoUser);

    var linhaHTML = `<div class="row">
                        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                            <img class="img-fluid img-thumbnail" src="${objUser.linkFoto}">
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
    if(lista.length == 0){
        document.getElementById("divTabelaSolic").innerHTML = `<small class="text-muted">No momento, não há solicitações pendentes com esse status</small>`;
    }
    else
    {
        conteudoHTML = `<div class="bordaFiltro">
                        <legend><b><h6>DADOS DA SOLICITAÇÃO</h6></b></legend><br>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Técnico</th>
                                    <th scope="col">Operadora</th>
                                    <th scope="col">PDV</th>
                                    <th scope="col">Data</th>
                                    <th scope="col">Aprovar</th>
                                    <th scope="col">Negar</th>
                                    <th scope="col">Cancelar</th>
                                </tr>
                            </thead>
                        <tbody id="tbodySolic">`
                        
        for (i=0; i<lista.length; i++){
            var solic = lista[i];

            conteudoHTML = conteudoHTML +`<tr>
                                            <th scope="row"> ${solic.numSeq} </th>
                                            <td> ${solic.nomeTecnico} </td>
                                            <td> ${solic.operadora} </td>
                                            <td> ${solic.pdv.nome} </td>
                                            <td> ${formataDateSQL(solic.dataSolicitacao)} ${solic.horaSolicitacao} </td>
                                            <td> <button type="button" class="btn btn-success" onclick="atualizarStatus(${solic.numSeq},1)"> A </button> </td>
                                            <td> <button type="button" class="btn btn-danger" onclick="atualizarStatus(${solic.numSeq},2)"> N </button> </td>
                                            <td> <button type="button" class="btn btn-secondary" onclick="atualizarStatus(${solic.numSeq},3)"> C </button> </td>
                                        </tr>`;

        }
        conteudoHTML += `</tbody></table></div>`
        document.getElementById("divTabelaSolic").innerHTML = `${conteudoHTML}`;
    }
    

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
        onChangeSelectStatus(document.getElementById("selectStatus").selectedIndex);
    }
    else{
        alert("Algo deu errado");
    }
}

function logout(){
    localStorage.removeItem("pdvUser");
    window.location = "index.html";
}

function formataDateSQL(isoFormatDateString){
    var dateParts = isoFormatDateString.split("-");
    var jsDate = dateParts[2]+'/'+dateParts[1]+'/'+dateParts[0];
    return jsDate;
}