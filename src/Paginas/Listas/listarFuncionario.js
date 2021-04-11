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
    const [filtro,setFiltro] = useState('');
    const [showModal,setShowModal]=useState(false);
    const [codPes,setCodPes] = useState(0);
    useEffect(()=>{
       
    },[]);
    function voltarHome(){

        history.goBack();
    }
    async function listarFuncionarios(){
        const response = await api.get(`/pessoasFun`).then((response)=>{
            setPessoas(response.data);
        })

    }
    async function listarFuncionarioPorFiltro(){
        
        if(filtro.length>0){
            const response = await api.get(`/pessoasFunFiltro/${filtro}`).then((response)=>{
                setPessoas(response.data);
            })
        }
        else
            listarFuncionarios();
      

    }
    async function acessarFuncionario(codigo){
        localStorage.setItem('cod_fun',codigo)
        history.push("/cadastroFuncionario");
    }
    async function btnClickExcluir(pesId){
        setCodPes(pesId);
        setShowModal(true);
    }
    async function btnFecharModal(){
        setShowModal(false);
    }
    async function excluirFuncionario(){
        btnFecharModal();
        const response = await api.get(`/servicoFuncionario/${codPes}`).then((resp)=>{
            if(resp.data.length==0){
                const response2 = api.delete(`/func/${codPes}`);
            }
            else{
                const response2 = api.put(`/funcLog/${codPes}`);
            }
        });

        setPessoas(pessoas.filter(pessoas=>pessoas.pes_cod!==codPes));
        
    }
    return (
    <div id="tela" className="background">
        <Header/>
        <div className="div-pesquisa">
                <input className="input-pesquisa" value={filtro} onChange={e=>setFiltro(e.target.value)}/>
                <button className="button-pesquisa" onClick={listarFuncionarioPorFiltro} type="button" id="btnForm">Pesquisar</button>
        </div>
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
                            <button onClick={()=>acessarFuncionario(res.pes_cod)} className="button-item">Editar Funcionário</button>
                            <button onClick={()=>btnClickExcluir(res.pes_cod)} className="button-item">Excluir Funcionário</button>
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
                        <p>Deseja excluir o funcionário? O funcionário pode estar sendo utilizado em outros lugares</p>
                    </div>
                    <div className="modal-content-btns">
                        <button type="button" className="btn-confirma" onClick={excluirFuncionario}>Confirmar</button>
                        <button type="button" className="btn-cancela" onClick={btnFecharModal}>Fechar</button>
                    </div>
                </div>
            </div>
        }
    </div>
    );
}

export default ListaFuncionarios;