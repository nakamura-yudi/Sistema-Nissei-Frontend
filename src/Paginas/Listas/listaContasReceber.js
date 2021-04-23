import React, { useEffect, useState } from 'react';
import api from '../../servicos/api';
import history from '../../history'
import '../../app.css'
import './listaContasReceber.css'
import Header from '../../Components/Header'

function ListarContasReceber()
{
    const [contas,setContas] = useState([]);
    const [showModal,setShowModal]=useState(false);
    const [showModalCancel,setShowModalCancel]=useState(false);
    const [conCod,setConCod] = useState(0);
    const [dtPgto, setDtPgto] = useState(new Date());
    useEffect(()=>{
        listarContas();
    },[]);
    async function listarContas(){
        await api.get(`/conta/${localStorage.getItem('cod_ser')}`).then((response)=>{
            setContas(response.data);
        })
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
        listarContas();
    }
    async function cancelarPagamento(){
        btnFecharModalCancel();
        await api.put('/conta',{
            con_cod: conCod,
            ser_cod: localStorage.getItem('cod_ser'),
            con_dtPgto: null
            
        })
        listarContas();
    }
    function voltarHome(){
        history.goBack();
    }
    function getDtPgto(date){

        if(date==null)
            return 'Não pago';
        return mudarEstruturaData(date);
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
            
            
            <div className="div-contasReceber">   
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
                        {contas.map(res=>(
                            <tr key={res.con_cod}>
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