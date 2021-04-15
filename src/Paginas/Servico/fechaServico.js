import React, { useEffect, useState } from 'react';
import api from '../../servicos/api';
import history from '../../history'
import './fechaServico.css'
import '../../app.css'
import Header from '../../Components/Header'
function FechaServico()
{
    const [disabledQtde,setDisabledQtde]=useState(false);
    const [qtdeParcela,setQtdeParcela]=useState(0);
    const [pgto,setPgto] = useState('vista')
    const [servico,setServico]=useState([]);
    const [pecsUti,setPecasUti] = useState([]);
    const [total,setTotal] = useState(0);
    const [valorParcela,setValorParcela]=useState(0);
    useEffect(()=>{
        listarServico();
        listarPecsUtiizadas();
        
    },[]);
    useEffect(()=>{
        if(pgto==="vista"){
            setDisabledQtde(true);
            setQtdeParcela(1);
        }
        else{
            setDisabledQtde(false);    
        }    
    },[pgto]);
    useEffect(()=>{
        var i=0;
        while(i<pecsUti.length){   
            var t=total+pecsUti[i].uti_precoUni*pecsUti[i].uti_qtde;
            setTotal(t);
            i++;
        }
        
    },[pecsUti]);
    async function listarServico(){
        await api.get(`/servico/${localStorage.getItem('cod_ser')}`).then((resp)=>{
            setServico(resp.data[0]);
            
            var t=total+resp.data[0].ser_maoObra;
            setTotal(t);
      
        });
    }
    async function listarPecsUtiizadas(){
        await api.get(`/servicopeca/${localStorage.getItem('cod_ser')}`).then((resp)=>{
            setPecasUti(resp.data);
            
        });
    }
    function voltarHome(){
        localStorage.removeItem('cod_ser');
        history.goBack();
    }

   
    return (
    <div className='background'>
        <Header/>
        <div className="div-gerarConta">
            <h1>Fechar Serviço</h1>
            <div>
                <p>Valor da mão de obra: R$ {servico.ser_maoObra}</p>
            </div>
            <div id="divTable">
                        <table id="tabelaCont">
                            <thead>
                                <tr>
                                    <td>Quant</td>
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
            <p>Total: R$ {total}</p>
            <div className="input-block">
                <label>Forma de Pagamento: </label>
                <select className="select-pgto" value={pgto} onChange={e=>setPgto(e.target.value)}>
                        <option value="vista">
                            À vista
                        </option>
                        <option value="parcelas">
                            Parcelas
                        </option>
                        
                </select>
            </div>
            <div className="input-block">
                <label>Quatidade de parcelas: </label>
                <input type="number" disabled={disabledQtde} name="quant" id="quant" value={qtdeParcela} onChange={e=>setQtdeParcela(e.target.value)} />
            </div>
            <div className="input-block">
                <label>Valor da Parcela: </label>
                <input type="number" disabled={true} value={valorParcela} onChange={e=>setValorParcela(e.target.value)} />
            </div>
            <button type="button" onClick={voltarHome} className="button-marca">Voltar</button>
        </div>
    </div>
    );
}

export default FechaServico;