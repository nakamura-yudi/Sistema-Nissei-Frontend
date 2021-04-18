import React, { useEffect, useState } from 'react';
import api from '../../servicos/api';
import history from '../../history'
import '../../app.css'
import './listarServicosCliente.css'
import Header from '../../Components/Header'

function ListaServicosCliente()
{
    const [carros,setCarros]=useState([]);
    const [servicos,setServicos]=useState([]);
    const [filtro,setFiltro]=useState('todas');
    const [filtros,setFiltros]=useState([]);

    const [showModal,setShowModal]=useState(false);
    const [showModalAviso,setShowModalAviso]=useState(false);

    const [codSer,setCodSer]=useState(0);
    const [totalSer,setTotalSer]=useState(0);
    useEffect(()=>{
        listarCarros();
    },[]);
    useEffect(()=>{
        var i=0,j=0;
       
        while(i<carros.length){
            j=0;
            while(j<filtros.length && carros[i].car_id!==filtros[j].car_id)
                j++;
            if(j===filtros.length){
       
                const data= {
                    car_id:carros[i].car_id,
                    car_placa:carros[i].car_placa,
                    car_modelo:carros[i].car_modelo
                }
                filtros.push(data);
                setFiltros(filtros);
            }
            i++;
   
        }
        i=0;
    },[carros]);
    useEffect(()=>{
        if(filtro===null || filtro==="todas")
            listarServicos();
        else
        {
           listarServicosCarro(filtro);
        }
    },[filtro]);
    function voltarHome(){
   
        history.goBack();
    }
    async function listarServicos(){
        await api.get(`/servicoCliente/${localStorage.getItem('cod_cli')}`).then((response)=>{
            setServicos(response.data);
        })

    }
    async function listarServicosCarro(cod){
        await api.get(`/servicoCarro/${cod}`).then((response)=>{
            setServicos(response.data);
        })

    }
    async function listarCarros(){
        const response2 = await api.get(`/carroPes/${localStorage.getItem('cod_cli')}`).then((resp)=>{
            setCarros(resp.data); 
        });

    }
    function getPlaca(cod){
        var i=0;
        if(cod!==null){
            if(carros.length>0){
                while(i<carros.length && carros[i].car_id!==cod)
                    i++;
                
                return carros[i].car_placa +" - "+carros[i].car_modelo;
            }
        }
        else{
            return "null";
        }
    }
    function getStatus(status){
        if(status===1)
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
    function abrirContasReceber(cod){
        localStorage.setItem('cod_ser',cod);
        history.push('/listaContasReceber');
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
        await api.delete(`/contaPorServico/${codSer}`);
        await api.put('/servicoFechar',{
            ser_cod: codSer,
            ser_total: totalSer,
            ser_fim: null,
            ser_status: true
        })
        listarServicosCarro(filtro);
        
    }
    async function btnClickCancelarFechamento(cod,total){
        setCodSer(cod);
        setTotalSer(total);
        await api.get(`/contaPaga/${cod}`).then((response)=>{
            if(response.data.length==0){
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
    <div id="tela" className="background">
        <Header/>
        <div className='filtro'>
            <select id="select-filtro" value={filtro}  onChange={e=>setFiltro(e.target.value)}>
                <option value="todas">
                    Todas
                </option>
                {filtros.map(res=>(
                    <option value={res.car_id} key={res.car_id}>
                        {res.car_placa} - {res.car_modelo}
                    </option>
                ))}
                
            </select>
        </div>
        <div className="table-servicos">   
        <table className='tableSer'>
                <thead>
                    <tr>
                        <td>Carro</td>
                        <td>Data de inicio</td>
                        <td>Total</td>
                        <td>Status</td>
                        <td>Acao</td>
                    </tr>
                </thead>
                <tbody>
                    {servicos.map(res=>(
                        <tr key={res.ser_cod}>
                            <td>{getPlaca(res.car_id)}</td>
                            <td>{mudarEstruturaData(res.ser_inicio)}</td>
                            <td>R$ {res.ser_total}</td>
                            <td>{getStatus(res.ser_status)}</td>
                            <td>
                            <button onClick={()=>acessarServico(res.ser_cod)} disabled={!res.ser_status} className="button-item">Editar</button>
                            <button onClick={()=>fecharServico(res.ser_cod)} disabled={!res.ser_status} className="button-item">Fechar serviço</button>
                            <button onClick={()=>abrirContasReceber(res.ser_cod)} disabled={res.ser_status} className="button-item">Abrir contas a receber</button>
                            <button onClick={()=>btnClickCancelarFechamento(res.ser_cod,res.ser_total)} disabled={res.ser_status} className="button-item">Cancelar fechamento</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
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
        <button type="button" onClick={voltarHome} className="buttonBack">Voltar</button>
    </div>
    );
}

export default ListaServicosCliente;
