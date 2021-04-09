import React, { useEffect, useState } from 'react';
import api from '../../servicos/api';
import history from '../../history'
import './cadastroMarca.css'
import '../../app.css'
import Header from '../../Components/Header'
function FormularioMarca()
{
    const [descricao,setDescricao] = useState('');
    const [button,setButton] = useState("Salvar");
    const [titulo,setTitulo] = useState('Cadastrar Marca');
    const [codigo,setCodigo] = useState();
    const [marcas,setMarcas] = useState([]);
    const [filtro,setFiltro] = useState('');
    useEffect(()=>{
      
        listarMarca();
        
    },[]);
   
    async function listarMarcaPorFiltro(){
     
        if(filtro.length>0){
            const response = await api.get(`/marcasfiltro/${filtro}`).then((response)=>{
                setMarcas(response.data);
            })
        }
        else
            listarMarca();
        setFiltro('');

    }
    async function listarMarca(){
        const response = await api.get(`/marcas`).then((response)=>{
            setMarcas(response.data);
        })

    }
    function voltarHome(){
        history.goBack();
    }

    async function adicionarMarca(e){
        e.preventDefault();
  
        if(button==='Salvar'){
            const response=await api.post('/marcas',{
                mar_descricao: descricao,
                
            })
            alert('Marca cadastrada');
            listarMarca();
        }
        else{
            const response=await api.put('/marcas',{
                mar_cod: codigo,
                mar_descricao: descricao
            })
            setButton('Salvar');
            listarMarca();
        }
        setDescricao('');
    }
    async function Excluir(cod)
    {
        const response = await api.get(`/carroMarca/${cod}`).then((resp)=>{
            console.log(resp.data.length)
        
            if(resp.data.length==0){
                const response2 = api.delete(`/marcas/${cod}`);
            }
            else{
                const response2= api.put(`/marcasstatus/${cod}`);
            }
            
        });
        setMarcas(marcas.filter(marcas=>marcas.mar_cod!==codigo));
        listarMarca();

    }
    async function Alterar(cod)
    {
  
       
        const response = await api.get(`/marcas/${cod}`).then((resp)=>{
            setDescricao(resp.data[0].mar_descricao);
            setCodigo(resp.data[0].mar_cod);
        });
        setButton('Alterar');

    }
    return (
    <div className='background'>
        <Header/>
        <div className="div-marca"> 
            <h1>Marcas de Carro</h1>
            <form className="form-marca" onSubmit={adicionarMarca} >
                <div className="input-block" id="block-descricao">
                    <label htmlFor="descricao">Descrição</label>
                    <input className="input-descricao" id="descricao" value={descricao} onChange={e=>setDescricao(e.target.value)} required/>
          
                </div>
                
                <div id="mensagem">

                </div>
                <button className="button-marca" type="submit" id="btnForm">{button}</button>
            </form>
            <div className="div-pesquisa">
                <input className="input-pesquisa" value={filtro} onChange={e=>setFiltro(e.target.value)}/>
                <button className="button-pesquisa" onClick={listarMarcaPorFiltro} type="button" id="btnForm">Pesquisar</button>
            </div>
            <table className='table-marca'>
                <thead>
                    <tr>
                        <td>Codigo</td>
                        <td>Descricao</td>
                        <td>Ação</td>
                    </tr>
                </thead>
                <tbody>
                    {marcas.map(marca=>(
                        <tr key={marca.mar_cod}>
                            <td>{marca.mar_cod}</td>
                            <td>{marca.mar_descricao}</td>
                            <td>
                            <button className="button-item" onClick={()=>Alterar(marca.mar_cod)}>Editar</button>
                            <button className="button-item" onClick={()=>Excluir(marca.mar_cod)}>Excluir</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="button-marca" type="button" onClick={voltarHome}>Voltar</button>
        </div>
    </div>
    );
}

export default FormularioMarca;