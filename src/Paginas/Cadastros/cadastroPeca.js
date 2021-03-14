import React, { useEffect, useState } from 'react';
import api from '../../servicos/api';
import history from '../../history'
function FormularioPeca()
{
    const [descricao,setDescricao] = useState('');
    const [button,setButton] = useState("Salvar");
    const [titulo,setTitulo] = useState('Cadastrar Peça');
    
    useEffect(()=>{
        if(localStorage.getItem('pec_cod')!=null)
        {
            alterarPeca();
        }
    
        
    },[]);
    function voltarHome(){
        history.goBack();
    }
    async function alterarPeca(){
        setTitulo("Alterar Peça");
        setButton("Alterar");

        const response = await api.get(`/peca/${localStorage.getItem('pec_cod')}`);
        setDescricao(response.data[0].pec_descricao);
       
    }
    async function adicionarPeca(e){
        e.preventDefault();
  
        if(button==='Salvar'){
            const response=await api.post('/peca',{
                pec_descricao: descricao,
                
            })
       
        }
        else{
            console.log('passei '+descricao);
            const response=await api.put('/peca',{
                pec_cod: localStorage.getItem('pec_cod'),
                pec_descricao: descricao
            })
        }
        setDescricao('');
    }
    return (
    <div id="tela">
        <form onSubmit={adicionarPeca} >
            <div className="input-block" id="block-descricao">
                <label htmlFor="descricao">Descricao</label>
                <input name="descricao" id="descricao" value={descricao} onChange={e=>setDescricao(e.target.value)} required/>
            </div>
            
            <div id="mensagem">

            </div>
            <button type="submit" id="btnForm">{button}</button>
        </form>
        <button type="button" onClick={voltarHome}>Voltar</button>
    </div>
    );
}

export default FormularioPeca;