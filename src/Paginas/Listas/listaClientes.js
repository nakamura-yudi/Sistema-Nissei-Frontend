import React, { useEffect, useState } from 'react';
import api from '../../servicos/api';
import history from '../../history'
import '../../app.css'
import './listaClientes.css'
import Header from '../../Components/Header'
function ListaClientes()
{
    const [pessoas,setPessoas]=useState([]);
    const [filtro,setFiltro]=useState('');
    useEffect(()=>{
        
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
    async function listarClientePorFiltro(){
        
        if(filtro.length>0){
            const response = await api.get(`/pessoasCliFiltro/${filtro}`).then((response)=>{
                setPessoas(response.data);
            })
        }
        else
            listarClientes();
      

    }
    async function excluirCliente(cod){
        const response = await api.get(`/carroPes/${cod}`).then((resp)=>{
            if(resp.data.length==0){
                
                const response2 = api.delete(`/cliente/${cod}`);
            }
            else{
                const response2 = api.put(`/cliente/${cod}`);
            }
        });

        setPessoas(pessoas.filter(pessoas=>pessoas.pes_cod!==cod));
        
    }
    return (
    <div id="tela" className="background">
        <Header/>
        <div className="div-pesquisa">
                <input className="input-pesquisa" value={filtro} onChange={e=>setFiltro(e.target.value)}/>
                <button className="button-pesquisa" onClick={listarClientePorFiltro} type="button" id="btnForm">Pesquisar</button>
        </div>
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
                            <button onClick={()=>excluirCliente(res.pes_cod)} className="button-item">Excluir Cliente</button>
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