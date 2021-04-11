import React, { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import api from '../../servicos/api';
import history from '../../history'
import './cadastroCliente.css'
import '../../app.css'
import Header from '../../Components/Header'
function Formulario()
{
    const [cpf,setCpf] = useState('');
    const [nome,setNome] = useState('');
    const [sexo,setSexo] = useState('');
    const [email,setEmail] = useState('');
    const [emailAtual,setEmailAtual] = useState('');
    const [bairro,setBairro]=useState('');
    const [rua,setRua]=useState('');
    const [cidade,setCidade]=useState('');
    const [uf,setUf]=useState('');
    const [cep,setCep]=useState('');


    const[tpCont,setTpCont]=useState('');
    const [verContatos,setContatos]=useState([]);
    const [numero,setNumero]=useState('');

    const [isOpen,setIsOpen]=useState(true);
    const [button,setButton]=useState('Salvar');
    const [titulo,setTitulo]=useState('Cadastro de cliente');
    const [loading,setLoading]=useState(false);
    useEffect(()=>{
        if(localStorage.getItem('cod_cli')!==null)
        {
            alterarPessoa();
        }
    },[]);
    function voltar(){
     
        history.goBack();
    } 
    async function alterarPessoa(){
        setTitulo("Alterar Perfil");
        setButton("Alterar");
        const cpf_input =  document.querySelector("#cpf");
        cpf_input.disabled=true;
        setIsOpen(false);
        const response = await api.get(`/pessoaCod/${localStorage.getItem('cod_cli')}`).then((resp)=>{
            setNome(resp.data[0].pes_nome);
            setCpf(resp.data[0].pes_cpf);
            setSexo(resp.data[0].pes_sexo);
            setEmail(resp.data[0].pes_email);
            setEmailAtual(resp.data[0].pes_email);
        });

        const response2 = await api.get(`/clienteCod/${localStorage.getItem('cod_cli')}`).then((resp)=>{
                setBairro(resp.data[0].cli_bairro);
                setRua(resp.data[0].cli_rua);
                setCidade(resp.data[0].cli_cidade);
                setUf(resp.data[0].cli_uf);
                setCep(resp.data[0].cli_cep);
        });
        
    }
    

    function vazio(valor)
    {
        let v=''+valor;
        if(v.length<=0)
            return true;
        return false;
    }
    function validarUF(valor){
        if(/[A-Z]{2}/.test(valor) && valor.length===2)
            return true;
        return false;
    }
    function validarCep(valor){
        var reg=/^\d{5}\-\d{3}$/;
        if(valor.match(reg)!=null)
            return true;
        return false;
    }
    function validarCPF(valor)
    {
        var reg=/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;
        if(valor.match(reg)!=null)
            return true;
        return false;
    }
    function validarEmail(valor)
    {
        var exp = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]/i;
        if(exp.test(valor))
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

    function validarTexto(valor)
    {
        if(!/[0-9]/.test(valor))
        return true;
        else
        return false;
    }

    function validarSexo(valor){
        if(valor==='M' || valor==='F')
        return true;
        return false;
    }
    async function validarCPFRepetido(valor){
        const response = await api.get('/pessoaCpf/'+valor).then((resp)=>{
        
        if(resp.data.length>0)
            return false;
        else
            return true;
        })
        return response;
    }
    async function validarEmailRepetido(valor){
        const response = await api.get('/pessoaProcurarEmail/'+valor).then((resp)=>{
        
        if(resp.data.length>0)
            return false;
        else
            return true;
        })
        return response;
    }
    async function addLista(){
        let mensagem = document.querySelector("#mensagemContato");
        mensagem.innerHTML="";
        if(validarTelefone(numero) && !vazio(tpCont))
        { 
            let tam=verContatos.length;
            const data= {
                codigo:tam,
                numero: numero,
                tipo:tpCont
                };
            setTpCont('');
            setNumero('');
            setContatos([...verContatos, data]); //contatos é um estado (do tipo vetor)    
        }
        else
        {
            if(!validarTelefone(numero))
                mensagem.innerHTML+="<p>Número não válido</p>";
            if(vazio(tpCont))
                mensagem.innerHTML+="<p>Escollha o tipo</p>";
        }
    }

    async function confirmarDados(e){
        setLoading(true);
        e.preventDefault();
        let mensagem = document.querySelector(".mensagemCli");
        
        const respCPF= await validarCPFRepetido(cpf);
        const respEmail= await validarEmailRepetido(email);
        var confere=false;

        if(validarCep(cep) && validarCPF(cpf) && validarEmail(email) && validarSexo(sexo) && validarUF(uf))
        {
            if(button==="Salvar")
            {
                mensagem.innerHTML="";
                if(respCPF && respEmail)
                {
                    
                    let codUser;
                    const response=await api.post('/pessoas',{
                        pes_nome:nome,
                        pes_cpf:cpf,
                        pes_sexo:sexo,
                        pes_email:email
                    })

                    codUser=response.data.lastId;
                    const response2=await api.post('/clientes',{
                        pes_cod:codUser,
                        cli_bairro:bairro,
                        cli_rua:rua,
                        cli_cidade:cidade,
                        cli_uf:uf,
                        cli_cep:cep
                    })

                    
                    for(let i=0;i<verContatos.length;i++)
                    {
                        const response3=await api.post('/contatos',{
                            pes_cod:codUser,
                            cont_numero:verContatos[i].numero,
                            cont_tipo:verContatos[i].tipo
                        })
                        
                    }
                    alert('Usuário cadastrado');
                    setNome('');
                    setCpf('');
                    setSexo('');
                    setEmail('');
                    setBairro('');
                    setRua('');
                    setCidade('');
                    setUf('');
                    setCep('');
                    setNumero('');
                
                    history.goBack();
                } 
                else
                {
                    if(!respCPF)
                    mensagem.innerHTML="<p>CPF já cadastrado</p>";
                    if(!respEmail)
                    mensagem.innerHTML+="<p>Email já cadastrado</p>";
                }
            }
            else{
                if(email!==emailAtual)
                {
                    if(!respEmail)
                        confere=false;
                    else
                        confere=true;
                }
                if(email===emailAtual || confere){
                    const response=await api.put('/pessoa',{
                        pes_nome:nome,
                        pes_cpf:cpf,
                        pes_sexo:sexo,
                        pes_email:email
                    })
                    const response2=await api.put('/clientes',{
                        pes_cod:localStorage.getItem('cod_cli'),
                        cli_bairro:bairro,
                        cli_rua:rua,
                        cli_cidade:cidade,
                        cli_uf:uf,
                        cli_cep:cep
                    })

                    alert('Alterado');
                    history.goBack();
                }
                else{
                    mensagem.innerHTML+="<p>Email já cadastrado</p>"
                }
            }
        }
        else
        {
            mensagem.innerHTML="";
            if(!validarCep(cep))
            mensagem.innerHTML+="<p>CEP inválido</p>";
            if(!validarCPF(cpf))
            mensagem.innerHTML+="<p>CPF inválido</p>";
            if(!validarEmail(email))
            mensagem.innerHTML+="<p>Email inválido</p>";
            if(!validarSexo(sexo))
            mensagem.innerHTML+="<p>Sexo vazio</p>";
            if(!validarUF(uf))
            mensagem.innerHTML+="<p>UF inválido</p>";
        }
        setLoading(false);
    }
    async function Excluir(codigo)
    {
    
        setContatos(verContatos.filter(verContatos=>verContatos.codigo!==codigo));
    }
    return (
        <div id="tela" >
            
            <div className="background">
                <Header/>
                <aside className="formularioCli" >
                    <h1>{titulo}</h1>
                    <form onSubmit={confirmarDados} >
                        <div className="input-block blockCli-nome">
                            <label htmlFor="nome">Nome</label>
                            <input name="nome" id="nome" value={nome} onChange={e=>setNome(e.target.value)} required/>
                        </div>

                        <div className="input-block blockCli-cpf">
                            <label htmlFor="cpf">CPF</label>
                            <input name="cpf" id="cpf" value={cpf} onChange={e=>setCpf(e.target.value)} placeholder="xxx.xxx.xxx-xx" required/>
                        </div>

                        <div className="input-block blockCli-email">
                            <label htmlFor="email">Email</label>
                            <input name="email" id="email" value={email} onChange={e=>setEmail(e.target.value)} required/>
                        </div>

                        <div className="input-block blockCli-sexo">
                            <label htmlFor="Sexo">Sexo</label>
                            <label className="input-block">Feminino
                                <input type="radio" name="Sexo" id="Sexo" value="F" checked={sexo==='F'} onClick={e=>setSexo(e.target.value)} onChange={e=>setSexo(e.target.value)}/>
                            </label>
                            <label className="input-block">Masculino
                                <input type="radio" name="Sexo" id="Sexo" value="M" checked={sexo==='M'} onClick={e=>setSexo(e.target.value)} onChange={e=>setSexo(e.target.value)}/>
                            </label>
                        </div>

                        <div className="input-block blockCli-cep">
                            <label htmlFor="cep">CEP</label>
                            <input name="cep" id="cep" value={cep} onChange={e=>setCep(e.target.value)} required/>
                        </div>

                        <div className="input-block blockCli-cidade">
                            <label htmlFor="cidade">Cidade</label>
                            <input name="cidade" id="cidade" value={cidade} onChange={e=>setCidade(e.target.value)} required/>
                        </div>

                        <div className="input-block blockCli-uf">
                            <label htmlFor="uf">UF</label>
                            <input name="uf" id="uf" value={uf} onChange={e=>setUf(e.target.value)} required/>
                        </div>

                        <div className="input-block blockCli-rua">
                            <label htmlFor="rua">Rua</label>
                            <input name="rua" id="rua" value={rua} onChange={e=>setRua(e.target.value)} required/>
                        </div>

                        <div className="input-block blockCli-bairro">
                            <label htmlFor="bairro">Bairro</label>
                            <input name="bairro" id="bairro" value={bairro} onChange={e=>setBairro(e.target.value)} required/>
                        </div>

                        <div className="mensagemCli">

                        </div>
                        {isOpen &&
                            <div className="cadastroCliContato">
                                <h1>Cadastrar Contato</h1>
                
                                <div className="input-block blockCli-foneContato">
                                    <label htmlFor="numero">Número de contato</label>
                                    <input name="numero" id="numero" value={numero} onChange={e=>setNumero(e.target.value)} placeholder="(xx)xxxxx-xxxx" />
                                </div>

                                <div className="input-block blockCli-tpContato">
                                    <label htmlFor="tipoCont">Tipo de contato</label>
                                    <select id="tipoCont" onChange={e=>setTpCont(e.target.value)} value={tpCont}>
                                        <option id="op-vazio" value=''>Selecione uma opção</option>
                                        <option id="op-contA" value="Residencial">Residencial</option>
                                        <option id="op-contB" value="Comercial">Comercial</option>
                                        <option id="op-contC" value="Celular">Celular</option>
                                    </select>
                                </div>
                                <div id="mensagemContato">

                                </div>
                                <button type="button" onClick={addLista} id="btnFormContato">Cadastrar Contato</button>
                                <div id="divTable">
                                    <table id="tabelaCont">
                                        <thead>
                                            <tr>
                                                <td>Telefones</td>
                                                <td>Tipo</td>
                                                <td>Ação</td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {verContatos.map(contato=>(
                                                <tr key={contato.codigo}>
                                                    <td>{contato.numero}</td>     
                                                    <td>{contato.tipo}</td>
                                                    <td>
                                                        <button id="btexcluir" className="btnExcluirCont" onClick={()=>Excluir(contato.codigo)} type="button">
                                                            Excluir
                                                        </button>
                                                    </td>        
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                            </div> 
                        }             
                             
                        <button type="submit" id="btnForm">{button}</button>
                    </form>
                    <button type="button" onClick={voltar}>Voltar</button>
                </aside>    
            </div>
            {loading &&
                <div className="modalCli">
                    
                    <ReactLoading type={"spinningBubbles"} color={"#ffffff"} height={'20%'} width={'20%'} />
                </div>
            }
        </div>
    );
}

export default Formulario;