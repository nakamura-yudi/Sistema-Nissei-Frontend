import React, { useEffect, useState } from 'react';
import api from '../../servicos/api';
import history from '../../history'
import './cadastroPeca.css'
import '../../app.css'
import Header from '../../Components/Header'
function FormularioPeca()
{
    const [descricao,setDescricao] = useState('');
    const [button,setButton] = useState("Salvar");
    const [codigo,setCodigo] = useState();
    const [pecas,setPecas] = useState([]);
    const [filtro,setFiltro] = useState('');
    useEffect(()=>{
      

        
    },[]);
   
    async function listarPecaPorFiltro(){
        
        if(filtro.length>0){
            const response = await api.get(`/pecafiltro/${filtro}`).then((response)=>{
                setPecas(response.data);
            })
        }
        else
            listarPecas();
     

    }
    async function listarPecas(){
        const response = await api.get(`/peca`).then((response)=>{
            setPecas(response.data);
        })

    }
    function voltarHome(){
        history.goBack();
    }

    async function adicionarPeca(e){
        e.preventDefault();
  
        if(button==='Salvar'){
            const response=await api.post('/peca',{
                pec_descricao: descricao,
                
            })
            alert('Peca cadastrada');
       
        }
        else{
            const response=await api.put('/peca',{
                pec_cod: codigo,
                pec_descricao: descricao
            })
            setButton('Salvar');
            listarPecaPorFiltro();
        }
        setDescricao('');
    }
    async function Excluir(cod)
    {
        const response = await api.get(`/serpeca/${cod}`).then((resp)=>{
            console.log(resp.data.length)
        
            if(resp.data.length==0){
                const response2 = api.delete(`/peca/${cod}`);
            }
            else{
                const response2= api.put(`/pecaLog/${cod}`);
            }
            
        });
        setPecas(pecas.filter(pecas=>pecas.pec_cod!==cod));
     

    }
    async function Alterar(cod)
    {
  
       
        const response = await api.get(`/peca/${cod}`).then((resp)=>{
            setDescricao(resp.data[0].pec_descricao);
            setCodigo(resp.data[0].pec_cod);
        });
        setButton('Alterar');

    }
    return (
    <div className='background'>
        <Header/>
        <div className="div-peca"> 
            <h1>Peças</h1>
            <form className="form-peca" onSubmit={adicionarPeca} >
                <div className="input-block" id="block-descricao">
                    <label htmlFor="descricao">Descrição</label>
                    <input className="input-descricao" id="descricao" value={descricao} onChange={e=>setDescricao(e.target.value)} required/>
          
                </div>
                
                <div id="mensagem">

                </div>
                <button className="button-peca" type="submit" id="btnForm">{button}</button>
            </form>
            <div className="div-pesquisa">
                <input className="input-pesquisa" value={filtro} onChange={e=>setFiltro(e.target.value)}/>
                <button className="button-pesquisa" onClick={listarPecaPorFiltro} type="button" id="btnForm">Pesquisar</button>
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
                    {pecas.map(peca=>(
                        <tr key={peca.pec_cod}>
                            <td>{peca.pec_cod}</td>
                            <td>{peca.pec_descricao}</td>
                            <td>
                            <button className="button-item" onClick={()=>Alterar(peca.pec_cod)}>Editar</button>
                            <button className="button-item" onClick={()=>Excluir(peca.pec_cod)}>Excluir</button>
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

export default FormularioPeca;