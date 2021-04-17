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

    const [showModal,setShowModal]=useState(false);
    useEffect(()=>{
        listarServico();   
    },[]);
    useEffect(()=>{
        let i=0;
        let t=0;
        while(i<pecsUti.length){   
            t+=pecsUti[i].uti_precoUni*pecsUti[i].uti_qtde;
            i++;
        }
        setTotal(t+total);
        setValorParcela(t+total);
    },[pecsUti]);
    useEffect(()=>{
        if(pgto==="vista"){
            setDisabledQtde(true);
            setQtdeParcela(1);
            setValorParcela(total);
        }
        else{
            setDisabledQtde(false);
            setValorParcela(total/qtdeParcela);
        }    
    },[pgto,qtdeParcela]);
    
    
    async function listarServico(){
        await api.get(`/servico/${localStorage.getItem('cod_ser')}`).then((resp)=>{
            setServico(resp.data[0]);     
            setTotal(resp.data[0].ser_maoObra);
            listarPecsUtiizadas();
            
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

    async function btnClickGerarConta(){
        setShowModal(true);
    }
    async function btnFecharModal(){
        setShowModal(false);
    }
    async function gerarContaReceber(){
        btnFecharModal();
        var date = new Date();
        if(pgto==='vista'){
       
            await api.post('/conta',{
                con_cod: 1,
                ser_cod: localStorage.getItem('cod_ser'),
                con_valor: valorParcela,
                con_dtVencimento: date
            })
           
        }
        else{
            date.setDate(date.getDate() + 30);
            for(var i=1;i<=qtdeParcela;i++){
                await api.post('/conta',{
                    con_cod: i,
                    ser_cod: localStorage.getItem('cod_ser'),
                    con_valor: valorParcela,
                    con_dtVencimento: date
                })
                date.setDate(date.getDate() + 30);
            }
        }
        await api.put('/servicoFechar',{
            ser_cod: localStorage.getItem('cod_ser'),
            ser_total: total,
            ser_fim: new Date()
        })
        voltarHome();
    }
   
    return (
    <div className='background'>
        <Header/>
        <div className="div-gerarConta">
            <h1>Fechar Serviço</h1>
            <div>
                <p>Valor da mão de obra: R$ {servico.ser_maoObra}</p>
            </div>
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
            <p className="p-total">Total: R$ {total}</p>
            
            <div className="div-formaPgto">
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
            <div className="div-qtdeParcela">
                <label>Quatidade de parcelas: </label>
                <input type="number" disabled={disabledQtde} min={1} className='input-qtdeParcela' value={qtdeParcela} onChange={e=>setQtdeParcela(e.target.value)} />
            </div>
            <div className="div-valorParcela">
                <label>Valor da Parcela: </label>
                <input type="number" disabled={true} value={valorParcela} className='input-valorParcela' onChange={e=>setValorParcela(e.target.value)} />
            </div>
            <button type="button" onClick={()=>btnClickGerarConta()} className="button-marca">Gerar conta a receber</button>
            <button type="button" onClick={voltarHome} className="button-marca">Voltar</button>
        </div>
        {showModal &&
            <div className="modal">
                <div className="modal-content">
                    <div className="modal-content-text"> 
                        <p>Deseja realmente fechar o serviço?</p>
                    </div>
                    <div className="modal-content-btns">
                        <button type="button" className="btn-confirma" onClick={gerarContaReceber}>Confirmar</button>
                        <button type="button" className="btn-cancela" onClick={btnFecharModal}>Fechar</button>
                    </div>
                </div>
            </div>
        }
    </div>
    );
}

export default FechaServico;