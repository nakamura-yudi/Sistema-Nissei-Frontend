import React, { useEffect, useState } from 'react';
import api from '../../servicos/api';
import history from '../../history'
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
    <div id="tela">
        {pessoas.map(res=>(
                <li key={res.pes_cod}>
                    <header>
                        {res.pes_nome}                           
                    </header>
                    <button onClick={()=>acessarCliente(res.pes_cod)}>Visualizar Clientes</button>
                </li>
            ))}
        <button type="button" onClick={voltarHome}>Voltar</button>
    </div>
    );
}

export default ListaClientes;