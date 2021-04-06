import React, { useEffect, useState } from 'react';
import api from '../../servicos/api';
import history from '../../history'
import '../../app.css'
import './listaClientes.css'
import Header from '../../Components/Header'
function ListaClientes()
{
    const [pessoas,setPessoas]=useState([]);
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
    <div id="tela" className="background">
        <Header/>
        <div className="table-clientes">
        <table className='tableCli'>
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
                            <button onClick={()=>acessarCliente(res.pes_cod)} className="button-item">Visualizar Cliente</button>
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

export default ListaClientes;