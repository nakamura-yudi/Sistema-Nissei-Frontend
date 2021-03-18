import React, { useEffect, useState } from 'react';
import api from '../../servicos/api';
import history from '../../history'
import '../../app.css'
import './listarFuncionario.css'
import './listaClientes.css'

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
    <div id="tela" class="background">
        <div class="list-funcionarios">
        {pessoas.map(res=>(
                <div key={res.pes_cod} class="funcionario-item">
                    <div>
                        {res.pes_nome}                           
                    </div>
                    <button onClick={()=>acessarFuncionario(res.pes_cod)} class="button-item">Editar Funcionário</button>
                </div>
            ))}
        </div>
        <button type="button" onClick={voltarHome} class="buttonBack">Voltar</button>
    </div>
    );
}

export default ListaFuncionarios;