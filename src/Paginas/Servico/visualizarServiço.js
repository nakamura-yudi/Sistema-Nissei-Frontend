import React, { useEffect, useState } from 'react';
import history from '../../history';
import './visualizarServiço.css';
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
    const [total,setTotal]=useState(0);
    const [pecsUti,setPecasUti] = useState([]);
    const [status,setStatus] = useState(false);
    const [codFun,setCodFun] = useState(0);

    const [showModal,setShowModal]=useState(false);
    const [showModalAviso,setShowModalAviso]=useState(false);
    useEffect(()=>{
        recuperarServico();
        
    },[])
    async function recuperarServico(){
        await api.get(`/servicoInfo/${localStorage.getItem('cod_ser')}`).then((resp)=>{
           
            setCarro(resp.data[0].car_placa);
            setCliente(resp.data[0].cli_nome);
            setFuncionario(resp.data[0].func_nome);
            setDescricao(resp.data[0].ser_descricao);
            setDtInicio(resp.data[0].ser_inicio);
            setDtFim(resp.data[0].ser_fim);
            setMaoObra(resp.data[0].ser_maoObra);
            setStatus(resp.data[0].ser_status);
            setCodFun(resp.data[0].pes_cod);
            listarPecsUtiizadas(resp.data[0].ser_maoObra);
        });
        
    }
    async function listarPecsUtiizadas(valorMaoObra){
        let t=0;
        await api.get(`/servicopeca/${localStorage.getItem('cod_ser')}`).then((resp)=>{
            setPecasUti(resp.data); 
            for(let i=0;i<resp.data.length;i++){
                t+=resp.data[i].uti_precoUni*resp.data[i].uti_qtde;
                console.log(t);
            }
        });
        t=total+t;
        setTotal(t+valorMaoObra);
    }
    function abrirContasReceber(){
        history.push('/listaContasReceberServico');
    }
    function fecharServico(){
        console.log('passei');
        history.push('/fechaServico');
    }
    function voltarHome(){
        localStorage.removeItem('cod_ser');
        history.goBack();
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
    async function cancelarFechamento(){
        
        btnFecharModal();
        await api.delete(`/contaPorServico/${localStorage.getItem('cod_ser')}`);

        await api.put('/servicoFechar',{
            ser_cod: localStorage.getItem('cod_ser'),
            ser_total: total,
            ser_fim: null,
            ser_status: true
        }).then((response)=>{
            api.get(`/func/${codFun}}`).then((resp)=>{
             
                if(resp.data[0].fun_status===false){
                    api.put(`/servicoFuncNull/${codFun}`);
                }
            });
        })
      
        
    }
    async function btnClickCancelarFechamento(){
 
        await api.get(`/contaPaga/${localStorage.getItem('cod_ser')}`).then((response)=>{
            if(response.data.length===0){
                setShowModal(true);
            }
            else{
                setShowModalAviso(true);
            }
        })
        
        
    }

    async function btnFecharModal(){
        setShowModal(false);
        setShowModalAviso(false);
    }
    return (
    <div className="background">
        <Header/>
        <div className="div-infoServico">
            <h1>Informações do Serviço</h1>
            <div className="div-infoBasica">
                <p className="p-funcionario"><strong>Funcionário:</strong> {funcionario}</p>
                <p className="p-cliente"><strong>Cliente:</strong> {cliente}</p>
                <p className="p-carro"><strong>Carro:</strong> {carro}</p>
                <p className="p-dtInicio"><strong>Data Inicio:</strong> {mudarEstruturaData(dtInicio)}</p>
                <p className="p-dtFim"><strong>Data Fim:</strong> {mudarEstruturaData(dtFim)}</p>
                <p className="p-descricao"><strong>Descricao:</strong></p>
                <textarea value={descricao} readOnly>
                </textarea>
                
                
                <p className="p-maoObra"><strong>Mao de obra:</strong>R$ {maoObra}</p>
            
                    <table className="tableSerPecas">
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
                    <p className="p-valorTotal"><strong>Total:</strong>R$ {total}</p>
               
                <div className="div-buttons">
                    <button className="button-acao" onClick={()=>fecharServico()} disabled={!status}>Fechar Serviço</button>
                    <button className="button-acao" onClick={()=>btnClickCancelarFechamento()}>Cancelar fechamento de serviço</button>
                    <button className="button-acao" onClick={()=>abrirContasReceber()} disabled={status}>Abrir contas a receber</button>
                </div>
            </div>
            <button className="button-voltar" onClick={voltarHome}>Voltar</button>
        </div>
        {showModal &&
            <div className="modal">
                <div className="modal-content">
                    <div className="modal-content-text"> 
                        <p>Deseja realmente cancelar o fechamento do serviço?</p>
                    </div>
                    <div className="modal-content-btns">
                        <button type="button" className="btn-confirma" onClick={cancelarFechamento}>Confirmar</button>
                        <button type="button" className="btn-cancela" onClick={btnFecharModal}>Fechar</button>
                    </div>
                </div>
            </div>
        }
        {showModalAviso &&
            <div className="modal">
                <div className="modal-content">
                    <div className="modal-content-text"> 
                        <p>Não é possivel cancelar. Pagamento já recebido</p>
                    </div>
                    <div className="modal-content-btns">
                        <button type="button" className="btn-cancela" onClick={btnFecharModal}>Fechar</button>
                    </div>
                </div>
            </div>
        }
    </div>
    );
}

export default VisualizarServiço;