function carregaSelectPDV(){

    fetch("http://localhost:8088/pdv/todos")   // "promessa de execução"
       .then(res => res.json())                // vou extrair o JSON do resultado que vier
       .then(lista => trataConteudoDaLista(lista));
}

function trataConteudoDaLista(lista){
    // aqui efetivamente eu quero trabalhar com os objetos que eu recebi do BackEnd
    var conteudoHTML = "";
    for (i=0; i<lista.length; i++){
        var pdv = lista[i];
        var estilo="";
        if (i%2 == 0){
            estilo = "linhaPar";
        }
        else{
            estilo = "linhaImpar";
        }

        conteudoHTML = conteudoHTML +`<option value="${pdv.id}">${pdv.nome}</option>`;
    }
    document.getElementById("listaDePDV").innerHTML = `<select id="selectPDV"> ${conteudoHTML} <select>`;

}

function cadastrarSolicitacao(){
    var nome_tecnico = document.getElementById("txtNomeTecnico").value;
    var operadora = document.getElementById("txtOperadora").value;
    var telefone = document.getElementById("txtCelular").value;
    //var rgCPF=formuser.rgCPF.value;
    var doc = document.getElementById("txtDocumento").value;
    var data= document.getElementById("txtData").value;
    var horario = document.getElementById("txtHorario").value;
    var pdv = document.getElementById("selectPDV").value;

    var solicValida = true;

    if(nome_tecnico == "" || nome_tecnico == null){
        alert("Por favor digite o nome e sobrenome do técnico");
        $("#txtNomeTecnico").focus();
        solicValida = false;
    }
    
    if(operadora == "" || operadora == null){
        alert("Por favor digite o nome e sobrenome do técnico");
        $("#txtOperadora").focus;
        solicValida = false;
    }

    if(telefone=="" || telefone == null){
        alert("Por favor digite o nome e sobrenome do técnico");
        $("#txtCelular").focus;
        solicValida = false;
    }

    if(doc=="" || doc == null){
        alert("Por favor digite o nome e sobrenome do técnico");
        $("#txtDocumento").focus;
        solicValida = false;
    }

    if(data=="" || data == null){
        alert("Por favor digite o nome e sobrenome do técnico");
        $("#txtData").focus;
        solicValida = false;
    }

    if(horario=="" || horario == null){
        alert("Por favor digite o nome e sobrenome do técnico");
        $("#txtHorario").focus;
        solicValida = false;
    }

    if(solicValida){

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        //DECLARA BODY DO REST COMO RACF
        var raw = JSON.stringify({  "nomeTecnico" : nome_tecnico,
                                    "operadora" : operadora,
                                    "telefone" : telefone,
                                    "documento" : doc,
                                    "dataSolicitacao" : data,
                                    "horaSolicitacao": horario,
                                    "situacao": 0,
                                    "pdv":{
                                        "id": pdv
                                    }
                                });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("http://localhost:8088/solicitacao/nova", requestOptions)
        .then(response => confirmaGravacao(response))
        //.then(result => console.log(result))
        .catch(error => console.log('error', error));
    }
    else{
        alert("Verifique os valores digitados!");
    }
}

function confirmaGravacao(res){
    
    if(res.status == 201){
        //$('#modalSucesso').modal('show');
        $('#modal-body').text('Solicitaçao de acesso aberta!');
        $('#modalSucesso').modal('show');
    }
    
}

function recarregaPagina(){
    window.location =  "solicitante.html";
}