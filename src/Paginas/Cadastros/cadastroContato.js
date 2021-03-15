import api from '../../servicos/api';
import React,{useState,useEffect} from 'react';
import history from '../../history'

function CadastroContatos(){
    const [tipo,setTipo]=useState('');
    const [numero,setNumero]=useState('');
    const [cod,setCod]=useState('');
    const [contatos,setContatos]=useState([]);
  


    useEffect(()=>{
        setCod(localStorage.getItem('cod_cli'));
        carregarContatos();
    },[]);

    const carregarContatos = async () => {
        const response= await api.get('/contatos/'+localStorage.getItem('cod_cli'));
        setContatos(response.data);
    }
    async function Excluir(codigo)
    {
        const response = await api.delete('/contato/'+codigo);
        setContatos(contatos.filter(contatos=>contatos.cont_cod!==codigo));
    }

    function validarTelefone(valor)
    {
      if(/[a-zA-Z]/.test(valor))
        return false;
      else
      {
        if(/^\([1-9]{2}\) [0-9]{5}\-[0-9]{4}/.test(valor) || /^\([1-9]{2}\) [0-9]{4}\-[0-9]{4}/.test(valor))
          return true;
        else
          return false;
      }
    }
    async function voltarPerfil(){
   
        history.goBack();
    }
    async function cadastrarContato(e){
        e.preventDefault();
        let mensagem = document.querySelector("#mensagem");
        mensagem.innerHTML="";
        if(tipo.length>0 && numero.length>0)
        {
            if(validarTelefone(numero)){
               
                const response=await api.post('/contatos',{
                    pes_cod: cod,
                    cont_numero: numero,
                    cont_tipo: tipo

                })
                carregarContatos();
                alert('Contato cadastrado');
                setNumero('');
                setTipo('');
            }
            else
                mensagem.innerHTML="<p>Telefone inválido</p>";
        }
    }

    return(
        <div id="tela">    
         
            <div id="app">
                <aside id="formulario" >
                    <h1>Cadastrar Contato</h1>
                    <form onSubmit={cadastrarContato} >
                        <div className="input-block" id="block-tipo">
                            <label htmlFor="tipo">Tipo</label>
                            <input name="tipo" id="tipo" value={tipo} onChange={e=>setTipo(e.target.value)} required/>
                        </div>
                        <div className="input-block" id="block-numeroContato">
                            <label htmlFor="numeroContato">Numero</label>
                            <input name="numeroContato" id="numeroContato" value={numero} onChange={e=>setNumero(e.target.value)} placeholder="(xx) xxxxx-xxxx" required/>
                        </div>
                 
                        <div id="mensagem">

                        </div>
                        <button type="submit" id="btnForm">Cadastrar</button>
                        <button type="button" onClick={voltarPerfil}>Voltar ao perfil</button>
                    </form>
                    <div id="divTable">
                        <table id="tabela">
                            <thead>
                                <tr>
                                    <td>Tipo</td>
                                    <td>Numero</td>
                                    <td>Excluir</td>
                                </tr>
                            </thead>
                            <tbody>
                                {contatos.map(contato=>(
                                    <tr key={contato.cont_cod}>
                                        <td>{contato.cont_tipo}</td>
                                        <td>{contato.cont_numero}</td>
                                        <td>
                                            <button id="btexcluir" onClick={()=>Excluir(contato.cont_cod)} type="button">
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </aside>
            </div>
        </div>
    );
}
export default CadastroContatos;