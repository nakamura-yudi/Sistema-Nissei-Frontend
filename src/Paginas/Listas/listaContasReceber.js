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
    const [conCod,setConCod] = useState(0);
    useEffect(()=>{
        listarContas();
    },[]);
    async function listarContas(){
        await api.get(`/conta/${localStorage.getItem('cod_ser')}`).then((response)=>{
            setContas(response.data);
        })
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
            con_dtPgto: new Date()
            
        })
        listarContas();
    }
    function voltarHome(){
        localStorage.removeItem('cod_ser');
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
                            <td>Número da parcela</td>
                            <td>Valor</td>
                            <td>Data de Vencimento</td>
                            <td>Data de Pagamento</td>
                            <td>Acao</td>
                        </tr>
                    </thead>
                    <tbody>
                        {contas.map(res=>(
                            <tr key={res.con_cod}>
                                <td>{res.con_cod}</td>
                                <td>R$ {res.con_valor}</td>
                                <td>{mudarEstruturaData(res.con_dtVencimento)}</td>
                                <td>{getDtPgto(res.con_dtPgto)}</td>
                                <td>
                                <button onClick={()=>btnClickConfPgto(res.con_cod)} disabled={res.con_dtPgto!==null} className="button-item">Confirmar Pagamento</button>
        
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
                    </div>
                    <div className="modal-content-btns">
                        <button type="button" className="btn-confirma" onClick={confirmarPagamento}>Confirmar</button>
                        <button type="button" className="btn-cancela" onClick={btnFecharModal}>Fechar</button>
                    </div>
                </div>
            </div>
        }
    </div>

    );
}
export default ListarContasReceber;