import React, { useEffect, useState } from 'react';
import api from '../../servicos/api';
import history from '../../history'
import '../../app.css'
import './listaClientes.css'
import Header from '../../Components/Header'
function ListaClientes()
{
    const [pessoas,setPessoas]=useState([]);
    const [codigo,setCodigo]=useState([]);
    useEffect(()=>{
        listarClientes();
    },[]);
    function voltarHome(){
   
        history.goBack();
    }
    async function listarClientes(){
        const response = await api.get(`/pessoasCli`).then((response)=>{
            setPessoas(response.data);
        })

    }
    async function acessarCliente(codigo){
        console.log(codigo);
        localStorage.setItem('cod_cli',codigo)
        history.push("/infoCliente");
    }
    return (
    <div id="tela" class="background">
        <Header/>
        <div class="list-clientes">
            {pessoas.map(res=>(
                    <div key={res.pes_cod} class="cliente-item">
                        <div >
                            {res.pes_nome}                           
                        </div>
                        <button onClick={()=>acessarCliente(res.pes_cod)} class="button-item">Visualizar Clientes</button>
                    </div>
                ))}
        </div>
        <button type="button" onClick={voltarHome} class="buttonBack">Voltar</button>
    </div>
    );
}

export default ListaClientes;