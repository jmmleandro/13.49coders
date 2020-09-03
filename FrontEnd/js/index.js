function validar(){
    var usuario=document.getElementById("txtUsuario").value;
    var senha=document.getElementById("txtSenha").value;
    
    var validado = true;
    
    if (usuario==""){
        //alert("Por favor digite o nome do usuário")
        document.getElementById("txtUsuario").focus;
        validado = false;
    }
    if(senha==""){
        //alert("Por favor digite a senha");
        document.getElementById("txtSenha").focus();
        validado = false;
    }

    if(validado=true){
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        //DECLARA BODY DO REST COMO RACF
        var raw = JSON.stringify({"email":usuario,"racf":usuario,"senha":senha});

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("http://localhost:8088/login", requestOptions)
        .then(response => redirecionaPagina(response))
        //.then(result => console.log(result))
        .catch(error => console.log('error', error));
    }
    
}

// REDIRECIONA PARA A PÁGINA CORRESPONDENTE
function redirecionaPagina(res){
    if(res.status == 200){
        res.json().then(objUser => logar(objUser));
        
    }
    else if(res.status == 403){
        document.getElementById("divResposta").innerHTML = "Senha ou usuário incorreto";
    }
    else{
        res.json().then(result => console.log(result));
        document.getElementById("divResposta").innerHTML = "Senha ou usuário incorreto";
    }
    
    
}

function logar(objUser){
    localStorage.setItem("pdvUser", JSON.stringify(objUser));
    window.location = "aprovador.html";
}