function carregaInfo(){
    var infoUser = localStorage.getItem("pdvUser");
    if(!infoUser){
        window.location = "index.html";
    }
    var objUser = JSON.parse(infoUser);

    var HMTLfoto = `<img class="img-fluid img-thumbnail" src="${objUser.linkFoto}" width="100%" align="right">`
    document.getElementById("linkFoto").innerHTML = `${HMTLfoto}`;
    var linhaHTML = `<strong>Nome: </strong> ${objUser.nome}<br>
                    <strong>RACF: </strong> ${objUser.racf}<br>
                    <strong>Email: </strong> ${objUser.email}<br>
                    <strong>Telefone: </strong> ${objUser.telefone}<br>
                    <button type="button" class="btn btn-light">Sair <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-box-arrow-right" fill="currentColor" xmlns="http://www.w3.org/2000/svg" onclick="logout()">
                        <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                        <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                    </svg></button>`
    document.getElementById("dadosUser").innerHTML = `${linhaHTML}`;
    
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
        conteudoHTML = `<div>
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