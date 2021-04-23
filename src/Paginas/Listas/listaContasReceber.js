import React, { useEffect, useState } from 'react';
import api from '../../servicos/api';
import history from '../../history'
import '../../app.css'
import Header from '../../Components/Header'
import './listaContasReceber.css'

function ListarContasReceber()
{
    const [showModal,setShowModal]=useState(false);
    const [showModalCancel,setShowModalCancel]=useState(false);
    const [conCod,setConCod] = useState(0);
    const [dtPgto, setDtPgto] = useState(new Date());
    const [dtInicio,setDtInicio] = useState('');
    const [dtFim,setDtFim] = useState('');
    const [status,setStatus] = useState('');
    const [parcelas,setParcelas] = useState([]);
    function voltarHome(){
        history.goBack();
    }
    async function filtrar(){
        const response=await api.get(`/contaFiltros/?dt_inicio=${dtInicio}&dt_fim=${dtFim}&status=${status}`).then((resp)=>{
            console.log(resp.data);
            setParcelas(resp.data);
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
    function getDtPgto(date){

        if(date==null)
            return 'Não pago';
        return mudarEstruturaData(date);
    }
    async function btnClickCancelarPgto(con_cod){
        setConCod(con_cod);
        setShowModalCancel(true);
    }
    async function btnFecharModalCancel(){
        setShowModalCancel(false);
    }
    async function btnClickConfPgto(con_cod){
        
        setConCod(con_cod);
        setShowModal(true);
    }
    async function btnFecharModal(){
        setShowModal(false);
    }
    async function confirmarPagamento(){
        btnFecharModal();
        await api.put('/conta',{
            con_cod: conCod,
            ser_cod: localStorage.getItem('cod_ser'),
            con_dtPgto: dtPgto
            
        })
        filtrar();
    }
    async function cancelarPagamento(){
        btnFecharModalCancel();
        await api.put('/conta',{
            con_cod: conCod,
            ser_cod: localStorage.getItem('cod_ser'),
            con_dtPgto: null
            
        })
        filtrar();
    }
    return (
        <div id="tela" className="background">
            <Header/>
            
            
                <div className="div-contasReceber">   
                    <h1>Contas a Receber</h1>
                    <div className="div-pesquisaConta">
                        <label htmlFor="dtInicio">Data de Inicio: </label>
                        <input className="input-dtInicio" type="date" name="dtInicio" id="dtInicio" value={dtInicio} onChange={e=>setDtInicio(e.target.value)} required/>
                
                
                        <label htmlFor="dtFim">Data de fim: </label>
                        <input className="input-dtFim" type="date" name="dtFim" id="dtFim" value={dtFim} onChange={e=>setDtFim(e.target.value)} required/>
                    
                        <label htmlFor="status">Status do pagamento: </label>
                        <select value={status} onChange={e=>setStatus(e.target.value)}>
                            <option id="op-selecione" value="">
                                Selecione uma opcao
                            </option>
                            <option id="pago" value="Pagamento efetuado">
                                Pagamento efetuado
                            </option>
                            <option id="pago" value="Aguardando pagamento">
                                Aguardando pagamento
                            </option>
                        </select>
                        <button tyoe="button" onClick={()=>filtrar()}>Filtrar</button>
                    </div>
                    
                    <table className='table-contasReceber'>
                        <thead>
                            <tr>
                                <td className="td-num">Nº</td>
                                <td className="td-valor">Valor</td>
                                <td className="td-venc">Data de Vencimento</td>
                                <td className="td-pgto">Data de Pagamento</td>
                                <td>Acao</td>
                            </tr>
                        </thead>
                        <tbody className="tbodycolor">
                            {parcelas.map(res=>(
                                <tr key={[res.con_cod,res.ser_cod]}>
                                    <td>{res.con_cod}</td>
                                    <td>R$ {res.con_valor}</td>
                                    <td>{mudarEstruturaData(res.con_dtVencimento)}</td>
                                    <td>{getDtPgto(res.con_dtPgto)}</td>
                                    <td>
                                    <button onClick={()=>btnClickConfPgto(res.con_cod)} disabled={res.con_dtPgto!==null} className="button-item-confirma">Confirmar Pagamento</button>
                                    <button onClick={()=>btnClickCancelarPgto(res.con_cod)} disabled={res.con_dtPgto===null} className="button-item-cancela">Cancelar Pagamento</button>
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
                            <p>Deseja realmente confirmar pagamento?</p>
                            
                            <input type="date"  value={dtPgto} onChange={e=>setDtPgto(e.target.value)} required/>
                        </div>
                        <div className="modal-content-btns">
                            <button type="button" className="btn-confirma" onClick={confirmarPagamento}>Confirmar</button>
                            <button type="button" className="btn-cancela" onClick={btnFecharModal}>Fechar</button>
                        </div>
                    </div>
                </div>
            }
            {showModalCancel &&
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-content-text"> 
                            <p>Deseja realmente cancelar pagamento?</p>
                     
                        </div>
                        <div className="modal-content-btns">
                            <button type="button" className="btn-confirma" onClick={cancelarPagamento}>Confirmar</button>
                            <button type="button" className="btn-cancela" onClick={btnFecharModalCancel}>Fechar</button>
                        </div>
                    </div>
                </div>
            }
        </div>

    );
}
export default ListarContasReceber;