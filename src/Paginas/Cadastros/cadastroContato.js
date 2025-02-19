import api from '../../servicos/api';
import React,{useState,useEffect} from 'react';
import history from '../../history'
import './cadastroContato.css'
import '../../app.css'
import Header from '../../Components/Header'
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
        await api.delete('/contato/'+codigo);
        setContatos(contatos.filter(contatos=>contatos.cont_cod!==codigo));
    }
     function vazio(valor){
        let v=''+valor;
        if(v.length<=0)
            return true;
        return false;
     }
    function validarTelefone(valor)
    {
        var reg=/^\(\d{2}\)\d{4,5}\-\d{4}$/;
        if(valor.match(reg)!==null)
            return true;
        else
            return false;
    }
    async function voltarPerfil(){
   
        history.goBack();
    }
    async function cadastrarContato(e){
        e.preventDefault();
        let mensagem = document.querySelector("#mensagem");
        mensagem.innerHTML="";

        if(validarTelefone(numero) && !vazio(tipo)){
            
            await api.post('/contatos',{
                pes_cod: cod,
                cont_numero: numero,
                cont_tipo: tipo

            })
            carregarContatos();
            alert('Contato cadastrado');
            setNumero('');
            setTipo('');
        }
        else{
            if(!validarTelefone(numero))
                mensagem.innerHTML+="<p>Telefone inválido</p>";
            if(vazio(tipo))
                mensagem.innerHTML+="<p>Escolha o tipo</p>";
        }
        
    }

    return(
        <div id="tela" className="background">   
            <Header/> 
            <aside className="formularioCont" >
                <h1>Cadastrar Contato</h1>
                <form onSubmit={cadastrarContato} >

                    <div className="input-block" id="block-numeroContato">
                        <label htmlFor="numeroContato">Numero</label>
                        <input name="numeroContato" id="numeroContato" value={numero} onChange={e=>setNumero(e.target.value)} placeholder="(xx)xxxxx-xxxx" required/>
                    </div>

                    <div className="input-block" id="block-tpContato">
                        <label htmlFor="tipoCont">Tipo de contato</label>
                        <select id="tipoCont" onChange={e=>setTipo(e.target.value)} value={tipo}>
                            <option id="op-vazio" value=''>Selecione uma opção </option>
                            <option id="op-contA" value="Residencial">Residencial</option>
                            <option id="op-contB" value="Comercial">Comercial</option>
                            <option id="op-contC" value="Celular">Celular</option>
                        </select>
                    </div>
                
                    <div id="mensagem">

                    </div>
                    <button type="submit" id="btnForm">Cadastrar</button>
                    <button type="button" className="btnVoltarPerf" onClick={voltarPerfil}>Voltar ao perfil</button>
                </form>
                {contatos.length>0 && <div id="divTable">
                    <table id="tabelaCont">
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
                                        <button id="btexcluir" className="btnExcluirCont" onClick={()=>Excluir(contato.cont_cod)} type="button">
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>}
            </aside>
            
        </div>
    );
}
export default CadastroContatos;