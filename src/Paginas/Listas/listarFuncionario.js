import React, { useEffect, useState } from 'react';
import api from '../../servicos/api';
import history from '../../history'
function ListaFuncionarios()
{
    const [pessoas,setPessoas]=useState([]);
    const [codigo,setCodigo]=useState([]);
    useEffect(()=>{
        listarFuncionarios();
    },[]);
    function voltarHome(){

        history.goBack();
    }
    async function listarFuncionarios(){
        const response = await api.get(`/pessoasFun`).then((response)=>{
            setPessoas(response.data);
        })

    }
    async function acessarFuncionario(codigo){
        localStorage.setItem('cod_fun',codigo)
        history.push("/cadastroFuncionario");
    }
    return (
    <div id="tela">
        {pessoas.map(res=>(
                <li key={res.pes_cod}>
                    <header>
                        {res.pes_nome}                           
                    </header>
                    <button onClick={()=>acessarFuncionario(res.pes_cod)}>Editar Funcionário</button>
                </li>
            ))}
        <button type="button" onClick={voltarHome}>Voltar</button>
    </div>
    );
}

export default ListaFuncionarios;