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
    const [showModal,setShowModal]=useState(false);
    const [codPes,setCodPes] = useState(0);
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
            const response = await api.get(`/pessoasCliFiltro/${filtro}`).then((resp)=>{
                setPessoas(resp.data);
            })
        }
        else
            listarClientes();
      

    }
    async function btnClickExcluir(pesId){
        setCodPes(pesId);
        setShowModal(true);
    }
    async function btnFecharModal(){
        setShowModal(false);
    }
    async function excluirCliente(){
        btnFecharModal();
        const response = await api.get(`/carroPes/${codPes}`).then((resp)=>{
       
            if(resp.data.length==0){
           
                const response2 = api.delete(`/cliente/${codPes}`);
            }
            else{
                const response2 = api.put(`/cliente/${codPes}`);
            }
        });

        setPessoas(pessoas.filter(pessoas=>pessoas.pes_cod!==codPes));
        
    }
    return (
    <div id="tela" className="background">
        <Header/>
        <div className="div-pesquisa">
                <input className="input-pesquisa" value={filtro} onChange={e=>setFiltro(e.target.value)}/>
                <button className="button-pesquisa" onClick={listarClientePorFiltro} type="button" id="btnForm"></button>
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
                            <button onClick={()=>btnClickExcluir(res.pes_cod)} className="button-item">Excluir Cliente</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <button type="button" onClick={voltarHome} className="buttonBack">Voltar</button>
        {showModal &&
            <div className="modal">
                <div className="modal-content">
                    <div className="modal-content-text"> 
                        <p>Deseja excluir o cliente? O cliente pode estar sendo utilizado em outros lugares</p>
                    </div>
                    <div className="modal-content-btns">
                        <button type="button" className="btn-confirma" onClick={excluirCliente}>Confirmar</button>
                        <button type="button" className="btn-cancela" onClick={btnFecharModal}>Fechar</button>
                    </div>
                </div>
            </div>
        }
    </div>
    );
}

export default ListaClientes;