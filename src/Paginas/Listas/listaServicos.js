import React, { useEffect, useState } from 'react';
import api from '../../servicos/api';
import history from '../../history'
import '../../app.css'
import './listarServicosCliente.css'
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
    const [funcionarios,setFuncionarios]=useState([]);
    const [marcas,setMarcas]=useState([]);
    useEffect(()=>{
        listarFuncionarios();
        listarMarcas();
    },[]);
    async function listarFuncionarios(){
        await api.get(`/func`).then((resp)=>{
            setFuncionarios(resp.data);
        });
    }
    async function listarMarcas(){
        await api.get(`/marcas`).then((resp)=>{
            setMarcas(resp.data);
        });
    }
    function voltarHome(){
   
        history.goBack();
    }
    
    function getStatus(status){
        if(status===0)
            return 'Em andamento';
        return 'Finalizado'; 
    }
    function acessarServico(cod){
        localStorage.setItem('cod_ser',cod);
        history.push('/cadastroServico');
    }
    function fecharServico(cod){
        localStorage.setItem('cod_ser',cod);
        history.push('/fechaServico');
    }
    async function filtrar(){
        const response=await api.get('/servicoFiltro',{
            cli_nome:cliente,
            fun_cod:funcionario,
            dt_inicio:dtInicio,
            dt_saida:dtSaida,
            mar_cod:marca,
            car_placa: placa,
            status:status
        }).then((resp)=>{
            console.log(resp.data);
            setServicos(resp.data);
        })
    }
    return (
    <div id="tela" className="background">
        <Header/>
        <div className='filtro'>
            <div className="input-block block-func">
                <label>Funcionário: </label>
                <select className="select-func" value={funcionario} onChange={e=>setFuncionario(e.target.value)}>
                        <option id="op-selecione" value="">
                            Selecione uma opcao
                        </option>
                        {funcionarios.map(fun=>(
                            <option key={fun.pes_cod} value={fun.pes_cod}>
                                {fun.pes_nome}
                            </option>
                        ))}
                </select>
            </div>
            <div className="input-block block-func">
                <label>Marcas Carro: </label>
                <select className="select-func" value={marca} onChange={e=>setMarca(e.target.value)}>
                        <option id="op-selecione" value="">
                            Selecione uma opcao
                        </option>
                        {marcas.map(mar=>(
                            <option key={mar.mar_cod} value={mar.mar_cod}>
                                {mar.mar_descricao}
                            </option>
                        ))}
                </select>
            </div>
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
            <button tyoe="button" onClick={()=>filtrar()}>Filtrar</button>
        </div>
        <div className="table-servicos">   
        <table className='tableSer'>
                <thead>
                    <tr>
                        <td>Cliente</td>
                        <td>Carro</td>
                        <td>Marca</td>
                        <td>Data de inicio</td>
                        <td>Total</td>
                        <td>Status</td>
                        <td>Acao</td>
                    </tr>
                </thead>
                <tbody>
                    {servicos.map(res=>(
                        <tr key={res.ser_cod}>
                            <td>{res.pes_nome}</td>
                            <td>{res.car_placa}</td>
                            <td>{res.mar_descricao}</td>
                            <td>{res.ser_inicio}</td>
                            <td>{res.ser_total}</td>
                            <td>{getStatus(res.ser_status)}</td>
                            <td>
                            <button onClick={()=>acessarServico(res.ser_cod)} className="button-item">Editar</button>
                            <button onClick={()=>fecharServico(res.ser_cod)} className="button-item">Fechar serviço</button>
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
