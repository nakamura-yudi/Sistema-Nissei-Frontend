import React, { useEffect, useState } from 'react';
import api from '../../servicos/api';
import history from '../../history'
import '../../app.css'
import './listarFuncionario.css'
import './listaClientes.css'
import Header from '../../Components/Header'
function ListaFuncionarios()
{
    const [pessoas,setPessoas]=useState([]);
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
    <div id="tela" className="background">
        <Header/>
        <div className="table-funcionarios">
            <table className='tableFunc'>
                <thead>
                    <tr>
                        <td>CPF</td>
                        <td>Nome</td>
                        <td>Acao</td>
                    </tr>
                </thead>
                <tbody>
                    {pessoas.map(res=>(
                        <tr key={res.pes_cpf}>
                            <td>{res.pes_cpf}</td>
                            <td>{res.pes_nome}</td>
                            <td>
                            <button onClick={()=>acessarFuncionario(res.pes_cod)} className="button-item">Visualizar Funcionario</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <button type="button" onClick={voltarHome} className="buttonBack">Voltar</button>
    </div>
    );
}

export default ListaFuncionarios;