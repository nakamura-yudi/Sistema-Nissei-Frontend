import React, { useEffect, useState } from 'react';
import api from '../../servicos/api';
import history from '../../history'
import '../../app.css'
import './listaServicos.css'
import Header from '../../Components/Header'

function ListaServicos()
{
    const [funcionario,setFuncionario]=useState('');
    const [cliente,setCliente]=useState('');
    const [dtInicio,setDtInicio]=useState('');
    const [dtSaida,setDtSaida]=useState('');
    const [placa,setPlaca]=useState('');
    const [marca,setMarca]=useState('');
    const [status,setStatus]=useState('');
    const [servicos,setServicos]=useState([]);

    useEffect(()=>{
        localStorage.removeItem("cod_cli");
   
    },[]);

 
    function voltarHome(){
   
        history.goBack();
    }
    
    function getStatus(status){
        if(status===0)
            return 'Em andamento';
        return 'Finalizado'; 
    }
    function acessarServico(cod_ser,cod_cli){
        localStorage.setItem('cod_ser',cod_ser);
        localStorage.setItem('cod_cli',cod_cli);
        history.push('/cadastroServico');
    }
   
    function visualizarServico(cod){
        localStorage.setItem('cod_ser',cod);
        history.push('/visualizarServico');
    }
    async function filtrar(){
        const response=await api.get(`/servicoFiltro/?cliente=${cliente}&dt_inicio=${dtInicio}&dt_saida=${dtSaida}&car_placa=${placa}&status=${status}`).then((resp)=>{
            setServicos(resp.data);
        })
    }
    function mudarEstruturaData(valor){
        var date=new Date(valor);
        let dat="";
        if(date.getDate()<10)
            dat+='0';
        dat+=date.getDate()+"/";
        if(date.getMonth()+1<10)
            dat+='0';
        dat+=(date.getMonth()+1)+"/";
        dat+=date.getFullYear();
        
        
        return dat;
    }
    return (
    <div id="tela" className="background">
        <Header/>
        <div className='filtro'>
            
            
            <div className="input-block block-cliente">
                <label htmlFor="cliente">Cliente: </label>
                <input type="text" name="cliente" id="cliente" value={cliente} onChange={e=>setCliente(e.target.value)}/>
            </div>
            <div className="input-block block-placa">
                <label htmlFor="placa">Placa: </label>
                <input type="text" name="placa" id="placa" value={placa} onChange={e=>setPlaca(e.target.value)}/>
            </div>
            <div className="input-block block-data" >
                <label htmlFor="dtInicio">Data de inicio: </label>
                <input type="date" name="dtInicio" id="dtInicio" value={dtInicio} onChange={e=>setDtInicio(e.target.value)} required/>
            </div>
            <div className="input-block block-data">
                <label htmlFor="dtInicio">Data de fim: </label>
                <input type="date" name="dtInicio" id="dtInicio" value={dtSaida} onChange={e=>setDtSaida(e.target.value)} required/>
            </div>
            <div className="input-block block-placa">
                <label>Status: </label>
                <select className="select-status" value={status} onChange={e=>setStatus(e.target.value)}>
                        <option id="op-selecione" value="">Selecione uma opcao</option>
                        <option id="op-selecione" value="1">Encerrado</option>
                        <option id="op-selecione" value="0">Em andamento</option>
                </select>
            </div>
            <p className="p-filtrar"><button type="button" className="button-filtrar" onClick={()=>filtrar()}>Filtrar</button></p>
        </div>
        <div className="table-servicos">   
        <table className='tableSer'>
                <thead>
                    <tr>
                        <td>Cliente</td>
                        <td>Funcionário</td>
                        <td>Carro</td>
                        <td>Data de inicio</td>
                        <td>Status</td>
                        <td>Acao</td>
                    </tr>
                </thead>
                <tbody>
                    {servicos.map(res=>(
                        <tr key={res.ser_cod}>
                            <td>{res.cli_nome}</td>
                            <td>{res.fun_nome}</td>
                            <td>{res.car_placa}</td>
                            <td>{mudarEstruturaData(res.ser_inicio)}</td>
                            <td>{getStatus(res.ser_status)}</td>
                            <td>
                            <button onClick={()=>acessarServico(res.ser_cod,res.cli_cod)} className="button-item">Editar</button>
                            <button onClick={()=>visualizarServico(res.ser_cod)} className="button-item">Visualizar</button>
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
export default ListaServicos;
