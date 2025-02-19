import React, { useEffect, useState } from 'react';
import api from '../../servicos/api';
import history from '../../history'
import '../../app.css'
import './infoCliente.css'
import Header from '../../Components/Header'
function Home()
{
    const [codigo,setCodigo]=useState('');
    const [nome,setNome]=useState('');
    const [email,setEmail]=useState('');
    const [cpf,setCpf]=useState('');
    const [carro,setCarro]=useState('');

    const [showModal,setShowModal]=useState(false);

    const [carros,setCarros]=useState([]);
    useEffect(()=>{
        setCodigo(localStorage.getItem('cod_cli'));
        procurarInfo();
    },[]);
    async function procurarInfo(){
    
        const response = await api.get(`/pessoaCod/${localStorage.getItem('cod_cli')}`).then((resp)=>{
            setNome(resp.data[0].pes_nome);
            setCpf(resp.data[0].pes_cpf);
            setEmail(resp.data[0].pes_email);
        });
        const response2 = await api.get(`/carroPes/${localStorage.getItem('cod_cli')}`).then((resp)=>{
            setCarros(resp.data);
        });
    }
    function cadastrarCarro(){
        history.push('/cadastroCarro');
    }
    function editarCliente(){
        history.push('/cadastroCliente');
    }
    function cadastrarContato(){
        history.push('/cadastroContato');
    }
    function editarCarro(valor){
        localStorage.setItem('car_id',valor);
        history.push('/cadastroCarro');
    }
    async function btnClickExcluir(valor){
        setCarro(valor);
        setShowModal(true);
    }
    async function btnFecharModal(){
        setShowModal(false);
    }
    async function excluirCarro(){
        await api.get(`/servicoCarro/${carro}`).then((resp)=>{
            if(resp.data.length===0){
                excluirCarroFisico(carro);
            }else{
                excluirCarroLogico(carro);
            }
        });
        setShowModal(false);
    }
    async function excluirCarroFisico(){
        await api.delete('/carro/'+carro);
        setCarros(carros.filter(carros=>carros.car_id!==carro));
    }
    async function excluirCarroLogico(){
        await api.put('/carroLog/'+carro);
        await api.put(`/servicoCarro/${carro}`)
        setCarros(carros.filter(carros=>carros.car_id!==carro));
    }
    function voltar(){
        localStorage.removeItem('cod_cli');
        history.goBack();
    }
    function gerarServico(){
        history.push('/cadastroServico');
    }
    function VerificarCarros(qtde){
        if(qtde===0)
            return true;
        return false;
    }
    function exibirServicos(){
        history.push('/listarServicosCliente');
    }
    return (
    <div className="background">
        <Header/>
        <div className="card">
            <div>
                <p>Nome:{nome}</p>
                <p>Emal:{email}</p>
                <p>CPF:{cpf}</p>
            </div>
            {carros.length>0 && <div id="divTable" className="table-carro">
                <table id="tabelaCont">
                    <thead>
                        <tr>
                            <td>Placa</td>
                            <td>Desc</td>
                            <td>Ano</td>
                            <td>Ação</td>
                        </tr>
                    </thead>
                    <tbody>
                        {carros.map(carro=>(
                            <tr key={carro.car_id}>
                                <td>{carro.car_placa}</td>
                                <td>{carro.car_modelo}</td>     
                                <td>{carro.car_ano}</td>
                                <td>
                                    <button type="button" onClick={()=>editarCarro(carro.car_id)} className="table-edit-carro">Editar</button>
                                    <button type="button" onClick={()=>btnClickExcluir(carro.car_id)} className="table-delete-carro">Excluir</button>
                                </td>          
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>}

            <div>
                <button type="button" onClick={editarCliente} className="button-info-cliente">Editar Cliente</button>
                <button type="button" onClick={cadastrarCarro} className="button-info-cliente">Cadastrar Carros</button>
                <button type="button" onClick={cadastrarContato} className="button-info-cliente">Cadastrar Contatos</button>
                <button type="button" onClick={exibirServicos} className="button-info-cliente">Exibir servicos</button>
                <button type="button" onClick={gerarServico} disabled={VerificarCarros(carros.length)} className="button-info-cliente">Gerar Serviço</button>
                <button type="button" onClick={voltar} className="button-info-cliente">Voltar</button>
            </div>
        </div>
        {showModal &&
            <div className="modal">
                <div className="modal-content">
                    <div className="modal-content-text"> 
                        <p>Deseja excluir o carro? O carro pode estar sendo utilizado em outros lugares</p>
                    </div>
                    <div className="modal-content-btns">
                        <button type="button" className="btn-confirma" onClick={excluirCarro}>Confirmar</button>
                        <button type="button" className="btn-cancela" onClick={btnFecharModal}>Fechar</button>
                    </div>
                </div>
            </div>
        }
    </div>
    );
}

export default Home;