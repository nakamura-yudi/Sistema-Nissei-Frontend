import React, { useEffect, useState } from 'react';
import history from '../../history'
import api from '../../servicos/api';
import Header from '../../Components/Header'
function VisualizarServiço()
{
    const [carro,setCarro]=useState('');
    const [cliente,setCliente]=useState('');
    const [funcionario,setFuncionario]=useState('');
    const [descricao,setDescricao]=useState('');
    const [dtInicio,setDtInicio]=useState('');
    const [dtFim,setDtFim]=useState('');
    const [maoObra,setMaoObra]=useState('0');
    const [total,setTotal]=useState('0');
    const [pecsUti,setPecasUti] = useState([]);
    
    useEffect(()=>{
        recuperarServico();
        listarPecsUtiizadas();
    })
    async function recuperarServico(){
        await api.get(`/servicoInfo/${localStorage.getItem('cod_ser')}`).then((resp)=>{
            setCarro(resp.data[0].car_placa);
            setCliente(resp.data[0].cli_nome);
            setFuncionario(resp.data[0].func_nome);
            setDescricao(resp.data[0].ser_descricao);
            setDtInicio(resp.data[0].ser_inicio);
            setDtFim(resp.data[0].ser_fim);
            setMaoObra(resp.data[0].ser_maoObra);
            setTotal(resp.data[0].ser_total);
        });
    }
    async function listarPecsUtiizadas(){
        await api.get(`/servicopeca/${localStorage.getItem('cod_ser')}`).then((resp)=>{
            setPecasUti(resp.data); 
        });
    }
    return (
    <div className="background">
        <Header/>
        <div className="div-visualizarServico">
            <p>Funcionário: {funcionario}</p>
            <p>Cliente: {cliente}</p>
            <p>Carro: {carro}</p>
            <p>Descricao:</p>
            <textarea value={descricao} readOnly>
            </textarea>
            <p>Data Inicio: {dtInicio}</p>
            <p>Data Fim: {dtFim}</p>
            <p>Total: {total}</p>
            <p>Mao de obra: {maoObra}</p>
            <div className="divtable-pecasuti">
                <table id="tabelaCont">
                    <thead>
                        <tr>
                            <td>Quantidade</td>
                            <td>Valor Uni.</td>
                            <td>Descrição</td>
                        
                        </tr>
                    </thead>
                    <tbody>
                        {pecsUti.map(pec=>(
                            <tr key={pec.pec_cod}>
                                <td>{pec.uti_qtde}</td>
                                <td>R$ {pec.uti_precoUni}</td>
                                <td>{pec.pec_descricao}</td>
                            
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    );
}

export default VisualizarServiço;