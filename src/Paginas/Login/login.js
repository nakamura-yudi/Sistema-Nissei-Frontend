import React, { useState } from 'react';
import history from '../../history'
import api from '../../servicos/api'
import "./login.css"

function Login(){
    const [user,setUser] = useState('');
    const [senha,setSenha]=useState('');
    const validarUsuario = async () => {

      const response= await api.get(`/func/${user}/${senha}`);
      return response.data;
    }

    const logar = async (e) => {
        e.preventDefault();
        let mensagem=document.querySelector("#mensagem");
        mensagem.innerHTML="";
        if(user.length>0 && senha.length>0){
        var res=await validarUsuario();
        if(res.length>0){
            localStorage.setItem('user',res[0].pes_email);
            history.push("/home");
        }
        else
            mensagem.innerHTML='Dados não cadastrados';
        }
        else
        mensagem.innerHTML='Dados vazios';
    }


    function irFormulario(){
        history.push('/cadastroFuncionario');
    }
    return (
      <div id='login' class="background">
          <main class="main">
            <h2>LOGIN</h2>
            <form onSubmit={logar} class="form">
              <input type="text" data-user placeholder="Enter Email" id="user" name="user" value={user} onChange={e=>setUser(e.target.value)} required/>
              <input type="password" data-password placeholder="Enter Password" id="password" name="password" value={senha} onChange={e=>setSenha(e.target.value)} required/>
              <div id="mensagem">

              </div>
              <button type="submit" class="button">Entrar</button>
            </form>
            <p onClick={irFormulario} class="text-pointer">Não tem um cadastro? Cadraste-se aqui</p>
          </main>
      </div>
    );
} 
export default Login;