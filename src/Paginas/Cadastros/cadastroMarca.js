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
    
    useEffect(()=>{
        if(localStorage.getItem('mar_cod')!=null)
        {
            alterarMarca();
        }
    
        
    },[]);
    function voltarHome(){
        history.goBack();
    }
    async function alterarMarca(){
        setTitulo("Alterar Marca");
        setButton("Alterar");

        const response = await api.get(`/marcas/${localStorage.getItem('mar_cod')}`);
        setDescricao(response.data[0].mar_descricao);
       
    }
    async function adicionarMarca(e){
        e.preventDefault();
  
        if(button==='Salvar'){
            const response=await api.post('/marcas',{
                mar_descricao: descricao,
                
            })
            alert('Marca cadastrada');
        }
        else{
         
            const response=await api.put('/marcas',{
                mar_cod: localStorage.getItem('mar_cod'),
                mar_descricao: descricao
            })
        }
        setDescricao('');
    }
    return (
    <div className='background'>
        <Header/>
        <div className="div-marca"> 
            <h1>Cadastrar Marca</h1>
            <form className="form-marca" onSubmit={adicionarMarca} >
                <div className="input-block" id="block-descricao">
                    <label htmlFor="descricao">Descrição</label>
                    <input className="input-descricao" id="descricao" value={descricao} onChange={e=>setDescricao(e.target.value)} required/>
                </div>
                
                <div id="mensagem">

                </div>
                <button className="button-marca" type="submit" id="btnForm">{button}</button>
            </form>
            <button className="button-marca" type="button" onClick={voltarHome}>Voltar</button>
        </div>
    </div>
    );
}

export default FormularioMarca;