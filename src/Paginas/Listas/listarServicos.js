import React, { useEffect, useState } from 'react';
import api from '../../servicos/api';
import history from '../../history'
import '../../app.css'
import './listarServicos.css'
import Header from '../../Components/Header'

function ListaServicos()
{
    const [carros,setCarros]=useState([]);
    const [servicos,setServicos]=useState([]);
    const [filtro,setFiltro]=useState('todas');
    const [filtros,setFiltros]=useState([]);
    useEffect(()=>{
        
        listarCarros();

    },[]);
    useEffect(()=>{
        var i=0,j=0;
       
        while(i<carros.length){
            j=0;
            while(j<filtros.length && carros[i].car_id!=filtros[j].car_id)
                j++;
            if(j==filtros.length){
       
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
     
        listarServicos();
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
        const response = await api.get(`/servicoCliente/${localStorage.getItem('cod_cli')}`).then((response)=>{
            setServicos(response.data);
        })

    }
    async function listarServicosCarro(cod){
        const response = await api.get(`/servicoCarro/${cod}`).then((response)=>{
            setServicos(response.data);
        })

    }
    async function listarCarros(){
        var i=0;
        const response2 = await api.get(`/carroPes/${localStorage.getItem('cod_cli')}`).then((resp)=>{
            setCarros(resp.data);
            
        });

    }
    function getPlaca(cod){
        var i=0;
        if(carros.length>0){
            while(i<carros.length && carros[i].car_id!=cod)
                i++;
            
            return carros[i].car_placa +" - "+carros[i].car_modelo;
        }
    }
    function getStatus(status){
        if(status==0)
            return 'Em andamento';
        return 'Finalizado'; 
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
                     
                    </tr>
                </thead>
                <tbody>
                    {servicos.map(res=>(
                        <tr key={res.ser_cod}>
                            <td>{getPlaca(res.car_id)}</td>
                            <td>{res.ser_inicio}</td>
                            <td>{res.ser_total}</td>
                            <td>{getStatus(res.ser_status)}</td>
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
